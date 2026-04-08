"""
Parakeet TDT 0.6B v3 — 실시간 마이크 스트리밍 테스트
=====================================================
터미널에서 실행: python3 scripts/test-parakeet-mic.py
종료: Ctrl+C

마이크에서 0.5초 단위로 오디오를 받아 실시간 전사합니다.
"""

import time
import numpy as np
import mlx.core as mx

# PyAudio 확인
try:
    import pyaudio
except ImportError:
    print("pyaudio가 필요합니다: pip3 install pyaudio")
    exit(1)

from parakeet_mlx import from_pretrained

SAMPLE_RATE = 16000
CHUNK_DURATION = 0.5  # 0.5초 청크
CHUNK_SIZE = int(SAMPLE_RATE * CHUNK_DURATION)

print("Loading Parakeet TDT 0.6B v3...")
start = time.time()
model = from_pretrained("mlx-community/parakeet-tdt-0.6b-v3")
print(f"Model loaded in {time.time()-start:.1f}s")

# 마이크 열기
pa = pyaudio.PyAudio()
stream = pa.open(
    format=pyaudio.paFloat32,
    channels=1,
    rate=SAMPLE_RATE,
    input=True,
    frames_per_buffer=CHUNK_SIZE,
)

print("\n🎤 마이크 준비 완료! 영어로 말해보세요 (Ctrl+C로 종료)\n")
print("-" * 60)

try:
    with model.transcribe_stream(context_size=(256, 256)) as transcriber:
        prev_text = ""
        while True:
            # 마이크에서 오디오 읽기
            raw = stream.read(CHUNK_SIZE, exception_on_overflow=False)
            audio = np.frombuffer(raw, dtype=np.float32)

            # 스트리밍 전사
            chunk_start = time.time()
            transcriber.add_audio(mx.array(audio))
            chunk_time = time.time() - chunk_start

            result = transcriber.result
            text = result.text.strip() if result.text else ""

            # 텍스트가 변했을 때만 출력
            if text and text != prev_text:
                # 터미널 한 줄 덮어쓰기
                print(f"\r\033[K[{chunk_time:.3f}s] {text}", end="", flush=True)
                prev_text = text

except KeyboardInterrupt:
    print(f"\n\n{'='*60}")
    print(f"최종 결과: {prev_text}")
    print(f"{'='*60}")

finally:
    stream.stop_stream()
    stream.close()
    pa.terminate()
