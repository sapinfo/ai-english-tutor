#!/bin/bash
# AI English Tutor — 전체 시작
# 사용법: ./start.sh

cd "$(dirname "$0")"

echo "🎓 AI English Tutor 시작 중..."
echo ""

# 1. Kokoro TTS 서버
if curl -s http://localhost:8881/health | grep -q "ok" 2>/dev/null; then
    echo "✅ Kokoro TTS (8881) 이미 실행 중"
else
    echo "Kokoro TTS 서버 시작 (8881)..."
    cd mlx-audio-server
    pkill -9 -f "kokoro_tts_server.py" 2>/dev/null
    kill -9 $(lsof -ti:8881) 2>/dev/null
    sleep 1
    env -u PYTHONHOME -u PYTHONPATH -u SSL_CERT_FILE -u REQUESTS_CA_BUNDLE ~/.pyenv/versions/3.12.3/bin/python3 kokoro_tts_server.py >> /tmp/tts.log 2>&1 &
    cd ..

    for i in $(seq 1 20); do
        sleep 1
        if curl -s http://localhost:8881/health | grep -q "ok" 2>/dev/null; then
            break
        fi
    done

    if curl -s http://localhost:8881/health | grep -q "ok" 2>/dev/null; then
        echo "✅ Kokoro TTS (8881) OK"
    else
        echo "❌ Kokoro TTS (8881) FAIL — cat /tmp/tts.log"
    fi
fi

# 2. SvelteKit 개발 서버
if lsof -ti:5173 >/dev/null 2>&1; then
    echo "✅ SvelteKit (5173) 이미 실행 중"
else
    echo "SvelteKit 개발 서버 시작 (5173)..."
    npm run dev >> /tmp/sveltekit.log 2>&1 &
    for i in $(seq 1 10); do
        sleep 1
        if curl -s http://localhost:5173 >/dev/null 2>&1; then
            break
        fi
    done
    echo "✅ SvelteKit (5173) OK"
fi

# 3. 브라우저 열기
echo ""
echo "🌐 브라우저 열기..."
sleep 1
open http://localhost:5173

echo ""
echo "========================================="
echo "🎓 AI English Tutor 준비 완료!"
echo "========================================="
echo "  🌐 웹: http://localhost:5173"
echo "  🔊 TTS: http://localhost:8881"
echo ""
echo "  종료: ./stop.sh"
echo "========================================="
