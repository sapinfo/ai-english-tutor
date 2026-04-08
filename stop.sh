#!/bin/bash
# AI English Tutor — 전체 종료
# 사용법: ./stop.sh

echo "🎓 AI English Tutor 종료 중..."
echo ""

# 1. SvelteKit 종료
if lsof -ti:5173 >/dev/null 2>&1; then
    kill -9 $(lsof -ti:5173) 2>/dev/null
    echo "✅ SvelteKit (5173) 종료"
else
    echo "⏭️  SvelteKit 이미 꺼져있음"
fi

# 2. Kokoro TTS 종료
pkill -9 -f "kokoro_tts_server.py" 2>/dev/null
if lsof -ti:8881 >/dev/null 2>&1; then
    kill -9 $(lsof -ti:8881) 2>/dev/null
fi
echo "✅ Kokoro TTS (8881) 종료"

echo ""
echo "========================================="
echo "✅ AI English Tutor 종료 완료!"
echo "========================================="
