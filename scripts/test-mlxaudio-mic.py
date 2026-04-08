"""
mlx-audio Parakeet — 마이크 녹음 후 스트리밍 전사 테스트
========================================================
터미널에서 실행: python3 scripts/test-mlxaudio-mic.py
방식: 5초 녹음 → stream_generate로 청크 단위 전사

비교 대상: parakeet-mlx의 transcribe_stream (실시간 청크)
"""

import time
import numpy as np
import mlx.core as mx
import pyaudio

SAMPLE_RATE = 16000
RECORD_SECONDS = 5

print("Loading mlx-audio Parakeet model...")
start = time.time()

from mlx_audio.stt import load_model
model = load_model("mlx-community/parakeet-tdt-0.6b-v3")
print(f"Model loaded in {time.time()-start:.1f}s")
print(f"Model type: {type(model).__name__}")

# 마이크 녹음
pa = pyaudio.PyAudio()
stream = pa.open(
    format=pyaudio.paFloat32,
    channels=1,
    rate=SAMPLE_RATE,
    input=True,
    frames_per_buffer=1024,
)

print(f"\n🎤 {RECORD_SECONDS}초 동안 영어로 말해보세요!\n")
frames = []
for i in range(0, int(SAMPLE_RATE / 1024 * RECORD_SECONDS)):
    data = stream.read(1024, exception_on_overflow=False)
    frames.append(np.frombuffer(data, dtype=np.float32))

stream.stop_stream()
stream.close()
pa.terminate()

audio = np.concatenate(frames)
print(f"녹음 완료: {len(audio)} samples ({len(audio)/SAMPLE_RATE:.1f}s)")

# --- mlx-audio stream_generate 테스트 ---
print("\n--- mlx-audio stream_generate (chunk_duration=1.0s) ---")
audio_mx = mx.array(audio)
start = time.time()
for result in model.stream_generate(audio_mx, chunk_duration=1.0, overlap_duration=0.2):
    tag = "FINAL" if result.is_final else "partial"
    print(f"  [{tag}] ({result.progress:.0%}) {result.text}")
stream_time = time.time() - start
print(f"Total: {stream_time:.2f}s")

# --- mlx-audio 일반 generate 비교 ---
print("\n--- mlx-audio generate (일반) ---")
start = time.time()
result = model.generate(audio_mx)
gen_time = time.time() - start
print(f"  Text: {result.text}")
print(f"  Time: {gen_time:.2f}s")

# --- parakeet-mlx 비교 ---
print("\n--- parakeet-mlx transcribe_stream (0.5s 청크) ---")
from parakeet_mlx import from_pretrained
model2 = from_pretrained("mlx-community/parakeet-tdt-0.6b-v3")

chunk_size = int(SAMPLE_RATE * 0.5)
chunks = [audio[i:i+chunk_size] for i in range(0, len(audio), chunk_size)]

start = time.time()
with model2.transcribe_stream(context_size=(256, 256)) as transcriber:
    for i, chunk in enumerate(chunks):
        transcriber.add_audio(mx.array(chunk))
        r = transcriber.result
        text = r.text.strip() if r.text else ""
        if text:
            print(f"  Chunk {i+1}/{len(chunks)}: {text[-60:]}")  # 마지막 60자만
    final = transcriber.result
pk_time = time.time() - start
print(f"  Final: {final.text}")
print(f"  Time: {pk_time:.2f}s")

print(f"\n{'='*60}")
print(f"요약:")
print(f"  mlx-audio stream:   {stream_time:.2f}s")
print(f"  mlx-audio generate: {gen_time:.2f}s")
print(f"  parakeet-mlx stream: {pk_time:.2f}s")
print(f"{'='*60}")
