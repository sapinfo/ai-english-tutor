# MLX Audio Server (TTS)

Apple Silicon 네이티브 음성 합성(TTS) 서버.
MLX 프레임워크를 활용하여 Apple Silicon GPU에서 AI 모델을 실행합니다.

> AIEnglishTutor 프로젝트의 음성 백엔드로 사용됩니다.
> STT(음성 인식)는 브라우저 Web Speech API 사용 (별도 서버 불필요).

---

## 아키텍처 개요

```
┌─────────────────────────────────────────────────┐
│  AIEnglishTutor (SvelteKit, port 5173)          │
│                                                   │
│  학생 음성 ──→ Browser Web Speech API (STT)     │
│                                                   │
│  선생님 응답 ──→ /api/tts ──→ TTS Server (8881) │
│                                └── Kokoro MLX    │
└─────────────────────────────────────────────────┘
```

---

## Tech Stack

| 구분 | 기술 | 용도 |
|------|------|------|
| TTS 모델 | [Kokoro-82M-bf16](https://huggingface.co/mlx-community/Kokoro-82M-bf16) (~372MB) | 선생님 음성 생성 |
| STT | Browser Web Speech API | 학생 음성 인식 (서버 불필요) |
| TTS 라이브러리 | [kokoro-mlx](https://github.com/lucasnewman/kokoro-mlx) | Kokoro 모델 실행 |
| API 서버 | FastAPI + Uvicorn | REST API 제공 |
| 프레임워크 | MLX (Apple Silicon GPU 가속) | 모델 추론 가속 |
| Python | 3.12+ | 런타임 |

---

## 성능 벤치마크

### TTS (Kokoro MLX)

| 항목 | 수치 |
|------|------|
| 모델 로딩 | ~3초 (캐시 후) |
| 음성 생성 | **~0.5초** (일반 문장) |
| 메모리 | ~200MB |

---

## 사전 요구사항

- **Apple Silicon Mac** (M1/M2/M3/M4)
- Python 3.12+
- 패키지 설치:
  ```bash
  pip install kokoro-mlx fastapi uvicorn numpy
  ```

---

## 서버 시작/종료

### 스크립트 사용 (권장)

**시작:**
```bash
cd ~/Downloads/AIEnglishTutor/mlx-audio-server
./restart.sh
```

**종료:**
```bash
cd ~/Downloads/AIEnglishTutor/mlx-audio-server
./stop.sh
```

### 수동 실행

**시작:**
```bash
cd ~/Downloads/AIEnglishTutor/mlx-audio-server
python3 tts_server.py > /tmp/tts.log 2>&1 &
```

**종료:**
```bash
kill $(lsof -ti:8881) 2>/dev/null
```

**상태 확인:**
```bash
curl http://localhost:8881/health
# {"status": "ok", "engine": "kokoro-mlx", "device": "Apple Silicon"}
```

**로그 확인:**
```bash
cat /tmp/tts.log
```

---

## API 엔드포인트

### TTS: `POST /v1/audio/speech` (포트 8881)

텍스트를 음성(WAV)으로 변환. OpenAI TTS API 호환 형식.

**Request:**
```json
{
  "input": "Hello, I am Ms Sarah, your English teacher.",
  "voice": "af_sarah",
  "speed": 1.0,
  "response_format": "wav"
}
```

| 파라미터 | 타입 | 기본값 | 설명 |
|---------|------|-------|------|
| input | string | (필수) | 변환할 텍스트 |
| voice | string | af_sarah | 음성 이름 |
| speed | float | 1.0 | 속도 배율 (0.25~4.0) |
| response_format | string | wav | 오디오 포맷 |

**Response:** `audio/wav` 바이너리
**헤더:** `X-Generation-Time: 0.52s`

**테스트:**
```bash
curl -X POST http://localhost:8881/v1/audio/speech \
  -H 'Content-Type: application/json' \
  -d '{"input":"Hello, how are you today?","voice":"af_sarah"}' \
  -o test.wav
```

### TTS: `GET /v1/audio/voices` (포트 8881)

사용 가능한 음성 목록 반환.

```bash
curl http://localhost:8881/v1/audio/voices
```

---

## TTS 음성 목록

### 여성 (af_*)
| 음성 | 설명 |
|------|------|
| **af_sarah** | 기본 선생님 음성 (AIEnglishTutor 기본값) |
| af_bella | 부드러운 여성 음성 |
| af_heart | 따뜻한 여성 음성 |
| af_jessica | 밝은 여성 음성 |
| af_nicole | 차분한 여성 음성 |
| af_nova | 에너지 있는 여성 음성 |
| af_alloy | 중성적 여성 음성 |
| af_river | 자연스러운 여성 음성 |
| af_sky | 밝고 가벼운 여성 음성 |

### 남성 (am_*)
| 음성 | 설명 |
|------|------|
| am_adam | 기본 남성 음성 |
| am_eric | 깊은 남성 음성 |
| am_michael | 따뜻한 남성 음성 |
| am_liam | 젊은 남성 음성 |
| am_echo | 울림 있는 남성 음성 |
| am_onyx | 깊고 풍부한 남성 음성 |
| am_puck | 밝은 남성 음성 |

---

## 연동 프로젝트

**AIEnglishTutor** (`/Users/inseokko/Downloads/AIEnglishTutor`)

| AIEnglishTutor 파일 | 역할 | 연결 |
|---------------------|------|------|
| `src/routes/api/tts/+server.js` | TTS 프록시 | localhost:8881 |
| `src/routes/+page.svelte` | STT | Browser Web Speech API |

**데이터 흐름:**
```
학생 마이크 → 브라우저 Web Speech API → 텍스트
텍스트 → Ollama (LLM) → 선생님 응답 텍스트
선생님 텍스트 → /api/tts → TTS Server → WAV 오디오 → 브라우저 재생
```

---

## 파일 구조

```
mlx-audio-server/
├── tts_server.py      # TTS 서버 (Kokoro MLX, 포트 8881)
├── stt_server.py      # STT 서버 (비활성 — Whisper 모델 메모리 이슈로 중단)
├── restart.sh         # TTS 서버 재시작 스크립트
├── stop.sh            # TTS 서버 종료 스크립트
└── README.md          # 이 문서
```

---

## 문제 해결

### 서버가 시작되지 않을 때
```bash
# 포트가 이미 사용 중인지 확인
lsof -i:8881

# 기존 프로세스 종료 후 재시작
./stop.sh
./restart.sh
```

### 모델 다운로드 실패
```bash
# HuggingFace 캐시 삭제 후 재시도
rm -rf ~/.cache/huggingface/hub/models--mlx-community--Kokoro-82M*
```

### 음성 생성이 느릴 때
- Ollama 등 다른 MLX 모델이 동시에 GPU를 사용하면 느려질 수 있음
- Activity Monitor → GPU 탭에서 사용량 확인
- 불필요한 GPU 프로세스 종료 후 재시도
