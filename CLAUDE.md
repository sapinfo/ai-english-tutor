# Project Rules

## 대화 시작 시
- 반드시 `docs/TECH-SPEC.md`를 읽고 프로젝트 맥락을 파악한 후 작업을 시작할 것

## 아키텍처
- 단일 엔진 흐름: Web Speech API (STT) → Groq Llama 4 (LLM) → Kokoro Local (TTS)
- 다른 STT/LLM/TTS 엔진 추가 금지

## 작업 규칙
- 커리큘럼 레슨 추가 시 `curriculum.js` 직접 수정 금지 — 별도 seed 스크립트(`scripts/seed-*.js`) 생성 후 DB에 삽입
- 작업 완료 후 `docs/TECH-SPEC.md`의 Change Log에 기록
