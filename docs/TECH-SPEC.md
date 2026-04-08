# AI English Tutor - Technical Specification

> Last updated: 2026-04-08

---

## 1. Project Overview

AI 기반 영어 교육 플랫폼. 음성 인식(STT)으로 학생의 발화를 텍스트로 변환하고, AI LLM이 전문 영어 선생님(Ms. Sarah) 역할로 수업을 진행하며, 음성 합성(TTS)으로 선생님이 말하는 구조.

**핵심 특징:**
- Web Speech API (STT) → Groq Llama 4 (LLM) → Kokoro Local (TTS) 단일 흐름
- ESL 표준 커리큘럼 기반 체계적 수업
- 섹션별 진도 추적 및 복습 기능
- 설명 중심 교수법 (70% 설명, 30% 학생 참여)

---

## 2. Tech Stack

| 구분 | 기술 | 비고 |
|------|------|------|
| **Framework** | SvelteKit (Svelte 5) | Vite 6 기반 |
| **STT (음성→텍스트)** | Web Speech API | 브라우저 내장 |
| **LLM (AI 선생님)** | Groq Llama 4 Scout 17B | 클라우드 API |
| **TTS (텍스트→음성)** | Kokoro AI (MLX Server) | 로컬 서버 (포트 8881) |
| **Database** | SQLite (better-sqlite3) | 파일 기반, 서버리스 |
| **Language** | JavaScript (ES Modules) | TypeScript 미사용 |

---

## 3. Project Structure

```
AIEnglishTutor/
├── data/
│   └── tutor.db                          # SQLite DB (커리큘럼 + 진도)
├── mlx-audio-server/                      # MLX 기반 음성 서버
│   └── kokoro_tts_server.py              # Kokoro TTS (포트 8881)
├── scripts/
│   ├── seed.js                           # DB 초기 시드 (Level 1~5)
│   ├── seed-remaining.js                 # L1-06 ~ L2-08 시드
│   ├── seed-expand.js                    # L3-05~08, L4-05~08, L5-02~05 시드
│   ├── seed-expand2.js                   # L5-06~08, L6-01~08 시드
│   └── seed-beginner-extra.js            # L1-09~13 Beginner 확장 시드
├── src/
│   ├── app.html                          # HTML 템플릿
│   ├── app.css                           # 글로벌 CSS (다크 테마)
│   ├── hooks.server.js                   # COOP/COEP 헤더
│   ├── lib/
│   │   ├── db.js                         # SQLite 연결 싱글톤
│   │   ├── curriculum.js                 # 커리큘럼 (JS 파일, 레거시)
│   │   └── curriculum-db.js              # 커리큘럼 DB 조회 함수
│   └── routes/
│       ├── +layout.svelte                # 레이아웃
│       ├── +page.svelte                  # 메인 페이지 (수업 UI)
│       └── api/
│           ├── chat-groq/+server.js      # Groq Llama 4 API
│           ├── tts/+server.js            # Kokoro TTS 프록시 API
│           ├── lessons/+server.js        # 레슨 목록 API
│           ├── lessons/[id]/+server.js   # 레슨 상세 API
│           └── progress/+server.js       # 진도 저장/조회 API
├── menubar/
│   ├── tutor_menubar.py                 # macOS 메뉴바 앱 (rumps)
│   └── setup.py                         # py2app 빌드 설정
├── build/                                # SvelteKit 프로덕션 빌드 (adapter-node)
├── start.sh                              # 전체 시작 스크립트
├── stop.sh                               # 전체 종료 스크립트
├── package.json
├── svelte.config.js
├── vite.config.js
├── .env.example
└── .gitignore
```

---

## 4. Database Schema

**Engine:** SQLite 3 (better-sqlite3)
**Location:** `data/tutor.db`
**Mode:** WAL (Write-Ahead Logging)

### levels
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER PK | 레벨 번호 (1~6) |
| title | TEXT | 레벨명 (Beginner, Elementary...) |
| cefr | TEXT | CEFR 등급 (A1, A2, B1, B2, B2+) |
| description | TEXT | 레벨 설명 |

### lessons
| Column | Type | Description |
|--------|------|-------------|
| id | TEXT PK | 레슨 ID (L1-01, L2-03...) |
| level_id | INTEGER FK | 레벨 참조 |
| sort_order | INTEGER | 레슨 순서 |
| title | TEXT | 레슨 제목 |
| goal | TEXT | 학습 목표 |
| grammar_focus | TEXT | 문법 포커스 |

### sections
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER PK | 자동 증가 |
| lesson_id | TEXT FK | 레슨 참조 |
| sort_order | INTEGER | 섹션 순서 (1~5) |
| type | TEXT | warmup / core / practice / review |
| title | TEXT | 섹션 제목 |
| teacher_script | TEXT | 선생님 교안 (프롬프트에 주입) |
| examples | TEXT (JSON) | 예문 배열 |
| practice_prompt | TEXT | 연습 유도 문구 |
| vocabulary | TEXT (JSON) | 어휘 배열 |

### progress
| Column | Type | Description |
|--------|------|-------------|
| id | INTEGER PK | 자동 증가 |
| student_id | TEXT | 학생 식별자 (기본: 'default') |
| lesson_id | TEXT FK | 레슨 참조 |
| section_index | INTEGER | 현재 섹션 (0~4) |
| completed | INTEGER | 완료 여부 (0/1) |
| score | INTEGER | 점수 (미구현) |
| notes | TEXT | 메모 (미구현) |
| updated_at | TEXT | 마지막 업데이트 시각 |

---

## 5. API Endpoints

### `GET /api/lessons`
레슨 목록 (레벨별 그룹)
- Response: `[{ id, title, cefr, lessons: [{ id, title, goal, ... }] }]`

### `GET /api/lessons/:id`
특정 레슨의 섹션 포함 상세 정보
- Response: `{ id, title, goal, grammar_focus, sections: [...] }`

### `POST /api/chat-groq`
Groq LLM에 메시지 전송
- Request: `{ message, history, lessonId?, sectionIndex? }`
- Response: `{ reply }`
- Model: `meta-llama/llama-4-scout-17b-16e-instruct`
- Temperature: `0.7`
- Max tokens: `350`
- Requires: `GROQ_API_KEY`

### `POST /api/tts`
Kokoro TTS 프록시 (로컬 MLX 서버 → 음성 생성)
- Request: `{ text }`
- Response: audio blob (WAV)
- Backend: `http://localhost:8881/v1/audio/speech`

### `GET /api/progress?studentId=default`
학생 진도 조회
- Response: `[{ lesson_id, section_index, completed, score, updated_at }]`

### `POST /api/progress`
진도 저장/업데이트
- Request: `{ studentId?, lessonId, sectionIndex, completed, score? }`
- Response: `{ ok: true }`

---

## 6. AI Teacher Persona (Ms. Sarah)

### System Prompt 구조

```
BASE_PROMPT (항상 적용)
├── Personality: 따뜻함, 인내심, 유머
├── Teaching Style: 70% 설명, 30% 질문 (Lecture-First)
├── Corrective Recast: 틀린 문장 자연스럽게 교정
├── Language Rules: 영어로만 응답, 한국어 이해
└── Noise Handling: 배경 소음 무시

+ LESSON CONTEXT (레슨 선택 시 추가)
├── Level / CEFR / Lesson Title / Goal
├── Grammar Focus
├── Current Section (teacher_script, examples, vocabulary)
└── Section Rules (교안 따라 진행)
```

### 교수법 핵심
1. **설명** (teacher_script 기반) → 문법/표현 소개
2. **예문 제시** (examples 배열) → 하나씩 보여주기
3. **학생 연습** (practice_prompt) → 간단한 따라하기
4. **칭찬/교정** → 다음 내용으로 진행
5. **복습/퀴즈** → 레슨 마무리

---

## 7. Curriculum Structure

### 레벨 구성

| Level | Title | CEFR | Lessons | Sections | Status |
|-------|-------|------|---------|----------|--------|
| 1 | Beginner | A1 | 18 | 90 | 완료 |
| 2 | Elementary | A2 | 8 | 40 | 완료 |
| 3 | Intermediate | B1 | 8 | 40 | 완료 |
| 4 | Upper-Intermediate | B2 | 8 | 40 | 완료 |
| 5 | Business English | B2+ | 8 | 40 | 완료 |
| 6 | Real-Life English | A2-B2 | 8 | 40 | 완료 |
| **Total** | | | **58** | **290** | |

### 레슨당 섹션 구조 (5개, ~30분 분량)

| # | Type | Title | Duration | Purpose |
|---|------|-------|----------|---------|
| 1 | warmup | Welcome & Warm-up | ~5분 | 도입, 핵심 어휘 소개 |
| 2 | core | Core Teaching 1 | ~8분 | 문법/표현 설명 + 예문 |
| 3 | core | Core Teaching 2 | ~8분 | 심화 내용 + 예문 |
| 4 | practice | Practice / Role Play | ~5분 | 상황별 연습 |
| 5 | review | Review & Quiz | ~4분 | 복습 + 퀴즈 5문제 |

---

## 8. Frontend Features

### 메인 페이지 (`+page.svelte`)

**레슨 선택 화면:**
- 레벨별 레슨 카드 그리드
- 진도 표시: Completed (초록) / In Progress (주황) / Not Started
- Free Talk 옵션

**수업 화면:**
- 채팅 UI (선생님 / 학생 메시지 버블)
- 섹션 진도 바 (클릭으로 섹션 이동/복습 가능)
- Partial 텍스트 실시간 표시
- Thinking 애니메이션
- 마이크 뮤트 토글
- TTS 켜기/끄기 토글
- 상태 표시 (Listening... / Speaking... / Muted)
- Next Section / End Lesson 컨트롤
- 학생 발화 시 즉시 TTS 중단 (interrupt 기능)

### Speech 처리 흐름

```
[학생 마이크]
    ↓
Web Speech API (브라우저 내장 STT)
    ↓ (interimResults → isFinal)
    ↓
노이즈 필터 (3글자 미만, 괄호 소리, hallucination 필터)
    ↓
학생 발화 감지 시 즉시 TTS 중단 (stopAllTTS)
    ↓
1.5초 디바운스 버퍼 (isFinal 누적, 추가 발화 없으면 전송)
    ↓
POST /api/chat-groq
    ↓
Groq Llama 4 Scout 17B + System Prompt (페르소나 + 섹션 교안)
    ↓
{ reply } → 채팅에 표시 + Kokoro TTS 재생
```

---

## 9. Environment Variables

```env
GROQ_API_KEY=            # Groq API (LLM)
```

---

## 10. Dependencies

```json
{
  "devDependencies": {
    "@sveltejs/adapter-auto": "^6.0.0",
    "@sveltejs/adapter-node": "^5.5.4",
    "@sveltejs/kit": "^2.21.0",
    "@sveltejs/vite-plugin-svelte": "^5.0.0",
    "svelte": "^5.0.0",
    "vite": "^6.0.0"
  },
  "dependencies": {
    "better-sqlite3": "^12.8.0",
    "dotenv": "^17.4.0"
  }
}
```

---

## 11. How to Run

### Prerequisites
- Node.js 18+
- Chrome 브라우저 (Web Speech API)
- Groq API 키 (https://console.groq.com)
- 로컬 TTS: Python 3.12+ + MLX (macOS Apple Silicon)

### 최초 설치
```bash
# 1. 패키지 설치
npm install

# 2. 환경 변수 설정
cp .env.example .env
# .env에 GROQ_API_KEY 입력
```

데이터베이스(`data/tutor.db`)가 포함되어 있으므로 별도 시드 실행 불필요.

### 실행 (원클릭)
```bash
./start.sh    # Kokoro TTS + SvelteKit + 브라우저 자동 열기
./stop.sh     # 전체 종료
```

### 실행 (메뉴바 앱) — 권장
- `/Applications/AI English Tutor.app` 실행 (또는 Launchpad)
- macOS 상단 메뉴바에서 졸업모 아이콘 클릭
- Start All / Stop All / Open Browser / 실시간 상태 표시
- rumps(Python) 기반, 프로덕션 빌드 실행 (포트 3000)

### 빌드
```bash
npm run build    # SvelteKit 프로덕션 빌드 (build/ 폴더)
```
- 소스 수정 후 빌드 필요 (메뉴바 앱이 build/index.js 실행)
- 메뉴바 앱 수정 시: `cd menubar && python3 setup.py py2app && cp -R dist/"AI English Tutor.app" /Applications/`

### Access
- 메뉴바 앱: `http://localhost:3000` (프로덕션 빌드)
- 개발 모드: `http://localhost:5173` (`npm run dev`)
- Browser: Chrome 권장

---

## 12. Change Log

### 2026-04-08
- **README 크로스플랫폼 TTS 가이드 추가**: Intel Mac/Windows/Linux PyTorch 설치 안내
- **코드베이스 대규모 정리**: 단일 엔진 흐름으로 단순화
  - 유지: Web Speech API (STT) → Groq Llama 4 (LLM) → Kokoro Local (TTS)
  - 삭제 API: chat-claude, chat-ollama, chat (Gemini), stt, stt-groq, tts-hf, scribe-token
  - 삭제 서버: parakeet_stt_server.py, whisper_stt_server.py, mlx-audio-server/restart.sh, stop.sh
  - 삭제 패키지: @anthropic-ai/sdk, @elevenlabs/client, @google/generative-ai, kokoro-js
  - +page.svelte: 1815줄 → ~550줄 (ElevenLabs, Parakeet, Whisper, WebGPU, HF Cloud 코드 전부 제거)
  - menubar: Ollama 참조 제거
  - start.sh/stop.sh: Ollama, Parakeet 참조 제거
  - 엔진 선택 UI 제거 (고정 흐름)
- **GitHub Public 전환**: private → public 오픈
- **Release v0.1.0**: 첫 공개 릴리즈

### 2026-04-07
- **수업 흐름 개선**: AI 선생님 조기 마무리 방지, 예문 순차 교습 강화
- **음성 입력 디바운스**: Web Speech API isFinal 1.5초 디바운스 버퍼
- **메뉴바 앱 UI 개선**: 다크모드 가시성 수정, template 아이콘

### 2026-04-06
- **엔진 설정 localStorage 저장**: 세션 간 유지
- **STT 엔진 정리**: Web Speech API 단독 사용 결정

### 2026-04-03
- **macOS 메뉴바 앱 추가**: rumps 기반, 서비스 제어 + 상태 모니터링
- **프로덕션 빌드 전환**: adapter-node (포트 3000)
- **HuggingFace Kokoro TTS Cloud 연동**

### 2026-04-02
- **Groq 클라우드 통합**: STT (Whisper) + LLM (Llama 4)
- **Kokoro Browser TTS 추가**: kokoro-js + WASM
- **LLM 모델 변경**: gemma3:4b → gemma4:e2b

### 2026-03-28 ~ 04-01
- 초기 개발: SvelteKit + Ollama + Web Speech API
- SQLite 커리큘럼 DB 설계 및 시드
- Kokoro MLX TTS 서버 연동
