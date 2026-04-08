# Groq 무료 플랜 Rate Limits

> Last updated: 2026-04-02
> Source: https://console.groq.com/docs/rate-limits

---

## 현재 사용 중인 모델

| 용도 | 모델 | 비고 |
|------|------|------|
| **STT** | `whisper-large-v3-turbo` | 빠른 음성 인식 |
| **LLM** | `meta-llama/llama-4-scout-17b-16e-instruct` | Llama 4, 17B |

---

## Audio / STT 모델

| 모델 | RPM | RPD | ASH | ASD |
|------|-----|-----|-----|-----|
| whisper-large-v3 | 20 | 2,000 | 7,200초 (120분) | 28,800초 (480분) |
| **whisper-large-v3-turbo** ⭐ | 20 | 2,000 | 7,200초 (120분) | 28,800초 (480분) |

- **RPM**: 분당 요청 수
- **RPD**: 일일 요청 수
- **ASH**: 시간당 오디오 초
- **ASD**: 일일 오디오 초

> 30분 수업 기준: ~100 요청, ~1,800초 오디오 → RPD 5%, ASD 6% 사용

---

## Text / Chat LLM 모델

| 모델 | 크기 | RPM | RPD | TPM | TPD | 비고 |
|------|------|-----|-----|-----|-----|------|
| **llama-4-scout-17b** ⭐ | 17B | 30 | 1,000 | 30,000 | 500,000 | 현재 사용 중 |
| qwen/qwen3-32b | 32B | 60 | 1,000 | 6,000 | 500,000 | 대안 (큰 모델) |
| llama-3.3-70b-versatile | 70B | 30 | 1,000 | 12,000 | 100,000 | TPD 작음 주의 |
| llama-3.1-8b-instant | 8B | 30 | 14,400 | 6,000 | 500,000 | 빠르지만 품질↓ |
| moonshotai/kimi-k2-instruct | — | 60 | 1,000 | 10,000 | 300,000 | |
| openai/gpt-oss-120b | 120B | 30 | 1,000 | 8,000 | 200,000 | TPD 작음 주의 |
| openai/gpt-oss-20b | 20B | 30 | 1,000 | 8,000 | 200,000 | |
| allam-2-7b | 7B | 30 | 7,000 | 6,000 | 500,000 | 아랍어 특화 |

- **RPM**: 분당 요청 수
- **RPD**: 일일 요청 수
- **TPM**: 분당 토큰 수
- **TPD**: 일일 토큰 수

> 30분 수업 기준: ~100 요청, ~200K 토큰 → RPD 10%, TPD 40% 사용

---

## 유틸리티 모델 (참고)

| 모델 | RPM | RPD | TPM | TPD | 용도 |
|------|-----|-----|-----|-----|------|
| llama-prompt-guard-2-22m | 30 | 14,400 | 15,000 | 500,000 | 프롬프트 안전 검사 |
| llama-prompt-guard-2-86m | 30 | 14,400 | 15,000 | 500,000 | 프롬프트 안전 검사 |
| openai/gpt-oss-safeguard-20b | 30 | 1,000 | 8,000 | 200,000 | 안전 가드 |
| groq/compound | 30 | 250 | 70,000 | — | Compound AI |
| groq/compound-mini | 30 | 250 | 70,000 | — | Compound AI |

---

## 참고 사항

- 캐시된 토큰은 rate limit에 포함되지 않음
- 한도는 조직(Organization) 단위로 적용 (사용자별 아님)
- 더 높은 한도가 필요하면 Developer 플랜 업그레이드 가능
- API 키 발급: https://console.groq.com/keys
