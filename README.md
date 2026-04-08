# AI English Tutor

AI 기반 영어 학습 플랫폼. 가상 영어 선생님(Ms. Sarah)이 음성 대화를 통해 체계적인 ESL 수업을 진행합니다.

학생이 마이크로 말하면 AI 선생님이 실시간으로 듣고, 응답하고, 자연스럽게 교정하며 구조화된 커리큘럼에 따라 수업을 이끕니다.

> [English version (README_EN.md)](./README_EN.md)

## 개발 배경

50대 후반, 미국에 온 지 꽤 되었지만 영어가 여전히 어렵습니다. ESL 수업도 다녀보고 나름 노력했지만, 먹고살기 바쁜 와중에 실력은 좀처럼 늘지 않았습니다.

그러다 최근 몇 년간 AI가 급속도로 발전하고, 특히 코딩 도구인 Claude Code의 능력이 놀라운 수준에 이르면서 한 가지 생각이 떠올랐습니다 — **AI로 나만의 영어 선생님을 만들어서 공부하면 어떨까?**

그렇게 이 프로젝트가 시작되었습니다. 지난달부터 직접 이 프로그램으로 조금씩 영어 공부를 하고 있고, 얼마나 실력이 나아질지는 솔직히 저도 모릅니다. 하지만 올해 1년은 꾸준히 해볼 생각입니다. 내년에 다시 리뷰할 기회가 되면 그 결과를 여기에 남기겠습니다.

그동안 혼자 쓰려고 private으로 개발해왔는데, 저와 비슷한 처지에 있는 분들에게도 도움이 될 수 있을 것 같아 public으로 오픈합니다. 무료로 배포하니 마음껏 사용해보세요. 영어 정복의 그날을 향하여 — 앗싸, 가자!

### **엔진 구성**

> [!TIP]
> **Web Speech API (STT) → Groq Llama 4 (LLM) → Kokoro Local (TTS)**

| 역할 | 엔진 | 설명 |
|------|------|------|
| **STT** | Web Speech API | 브라우저 내장, 별도 설정 없이 즉시 사용 |
| **LLM** | Groq API | 빠른 응답 속도, [무료 키 발급](https://console.groq.com) (가입 필수) |
| **TTS** | Kokoro MLX | Apple Silicon 로컬 서버, 자연스러운 음성 |

## 주요 기능

- **음성 기반 수업** — 실시간 음성 인식(STT)과 음성 합성(TTS)으로 자연스러운 대화 수업
- **AI 선생님 (Ms. Sarah)** — 따뜻하고 인내심 있는 페르소나, 설명 중심 교수법 (70% 설명, 30% 학생 참여)
- **체계적 커리큘럼** — 6단계 58개 레슨, 각 레슨 5개 섹션 (워밍업, 핵심, 연습, 복습)
- **진도 추적** — 섹션별 자동 저장 및 이어하기 지원
- **macOS 메뉴바 앱** — 시스템 트레이에서 빠른 실행

## 커리큘럼

| 레벨 | 이름 | CEFR | 레슨 수 |
|------|------|------|---------|
| 1 | Beginner | A1 | 18 |
| 2 | Elementary | A2 | 8 |
| 3 | Intermediate | B1 | 8 |
| 4 | Upper-Intermediate | B2 | 8 |
| 5 | Business English | B2+ | 8 |
| 6 | Real-Life English | A2-B2 | 8 |

> 커리큘럼은 학습을 진행하면서 지속적으로 추가됩니다.

## 기술 스택

- **프론트엔드**: SvelteKit (Svelte 5) + Vite 6
- **LLM**: Groq Llama 4 Scout 17B
- **STT**: Web Speech API
- **TTS**: Kokoro AI (MLX 로컬 서버)
- **데이터베이스**: SQLite (better-sqlite3)
- **언어**: JavaScript (ES Modules)

## 사전 요구사항

- Node.js 18+
- Groq API 키 ([https://console.groq.com](https://console.groq.com))
- 로컬 TTS: Python 3.12+ + MLX (macOS Apple Silicon 전용)

## 시작하기

### 1. 클론 및 설치

```bash
git clone https://github.com/sapinfo/ai-english-tutor.git
cd ai-english-tutor
npm install
```

### 2. 환경 변수 설정

```bash
cp .env.example .env
```

`.env` 파일에 API 키를 입력합니다:

```
GROQ_API_KEY=your_groq_api_key        # Groq LLM (https://console.groq.com)
```

### 3. 실행

데이터베이스(`data/tutor.db`)가 포함되어 있으므로 별도 초기화 없이 바로 실행 가능합니다.

```bash
npm run dev
```

브라우저에서 [http://localhost:5173](http://localhost:5173)을 열어주세요.

### 프로덕션 빌드

```bash
npm run build
node build/index.js
```

프로덕션 서버는 포트 3000에서 실행됩니다.

## TTS 엔진 설정

선생님(Ms. Sarah) 음성을 위한 Kokoro TTS 서버 설정입니다. 플랫폼에 따라 설치 방법이 다릅니다.

### Apple Silicon Mac (M1/M2/M3/M4) — MLX 버전 (권장)

Apple GPU를 활용하여 가장 빠른 음성 생성이 가능합니다.

```bash
pip install kokoro-mlx fastapi uvicorn numpy

cd mlx-audio-server
python3 kokoro_tts_server.py
```

- 모델: Kokoro-82M (MLX 4bit, ~50MB, 최초 실행 시 자동 다운로드)
- 음성 생성: ~0.5초 (일반 문장)

### Intel Mac / Windows / Linux — PyTorch 버전

MLX는 Apple Silicon 전용이므로, 다른 플랫폼에서는 PyTorch 기반 Kokoro를 사용합니다.

```bash
# 1. 의존성 설치
pip install kokoro soundfile fastapi uvicorn

# 2. 동일한 서버 스크립트 실행 (자동으로 PyTorch 모드로 동작)
cd mlx-audio-server
python3 kokoro_tts_server.py
```

> GPU가 없어도 CPU로 동작하지만 음성 생성이 느릴 수 있습니다 (2~5초).
> NVIDIA GPU가 있다면 `pip install torch` 시 CUDA 버전을 설치하면 빠릅니다.

### 공통 사항

- API: OpenAI TTS 호환 형식 (`POST /v1/audio/speech`)
- 포트: 8881
- 상태 확인: `curl http://localhost:8881/health`

## 원클릭 실행 (macOS)

```bash
./start.sh    # Kokoro TTS + SvelteKit + 브라우저 자동 열기
./stop.sh     # 전체 종료
```

## macOS 메뉴바 앱 (선택사항)

시스템 메뉴바에서 서비스 시작/종료 및 상태 모니터링이 가능한 앱입니다.

### 설치

```bash
cd menubar
pip install rumps py2app
python setup.py py2app
```

빌드된 앱은 `menubar/dist/AI English Tutor.app`에 생성됩니다.
`/Applications`로 복사하면 macOS 로그인 시 자동 실행 설정도 가능합니다.

### 기능

- **Start All** — Kokoro TTS, SvelteKit 서버 일괄 시작
- **Stop All** — 전체 서버 종료
- **Open Browser** — 브라우저에서 앱 열기
- **상태 표시** — TTS(8881), Web(3000) 실행 상태 실시간 모니터링

## 프로젝트 구조

```
AIEnglishTutor/
├── src/
│   ├── routes/
│   │   ├── +page.svelte            # 메인 수업 UI
│   │   └── api/                    # REST API 엔드포인트
│   └── lib/
│       ├── db.js                   # SQLite 연결
│       └── curriculum-db.js        # 커리큘럼 조회
├── scripts/                        # DB 시드 스크립트
├── data/                           # SQLite 데이터베이스
├── mlx-audio-server/               # 로컬 Kokoro TTS 서버 (macOS)
├── menubar/                        # macOS 메뉴바 앱
├── docs/                           # 기술 문서
└── .env.example                    # 환경 변수 템플릿
```

## 동작 흐름

1. **학생이 레슨을 선택**합니다
2. **Ms. Sarah가 주제를 소개**합니다 (섹션별 교안 기반)
3. **학생이 말하면** Web Speech API가 텍스트로 변환합니다
4. **AI가 레슨 맥락과 함께 처리**하고 응답합니다
5. **TTS가 응답을 음성으로 읽어**줍니다
6. **진도가 자동 저장**됩니다

## 후원

이 프로젝트가 도움이 되셨다면 커피 한 잔 사주세요!

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/inseokko)

## 라이선스

이 프로젝트는 개인/교육 목적으로 사용할 수 있습니다.
