# AI English Tutor

An AI-powered English learning platform with a virtual teacher (Ms. Sarah) who conducts structured ESL lessons through voice interaction.

Students speak into their microphone, and the AI teacher listens, responds, corrects mistakes naturally, and guides them through a structured curriculum — all in real-time voice conversation.

> [한국어 버전 (README.md)](./README.md)

## Background

I'm in my late 50s and have been living in the US for quite some time, but English is still a daily struggle. I tried ESL classes and put in effort over the years, but between making a living and the limits of an aging brain, progress was painfully slow.

Then, in recent years, AI advanced at an incredible pace — and coding tools like Claude Code reached a level I never imagined possible. That's when it hit me: **why not build my own AI English tutor and learn that way?**

That's how this project was born. I've been using it myself since last month, studying English little by little. Honestly, I have no idea how much my skills will improve. But I'm committed to sticking with it for the rest of this year. If I get the chance, I'll come back next year and share how it went.

I've been developing this privately for my own use, but decided to open it up publicly in case it helps others in a similar situation. This is free to use, so feel free to give it a try. Here's to the day we conquer English — let's go!

### **Engine Setup**

> [!TIP]
> **Web Speech API (STT) → Groq Llama 4 (LLM) → Kokoro Local (TTS)**

| Role | Engine | Description |
|------|--------|-------------|
| **STT** | Web Speech API | Built into browser, works instantly with no setup |
| **LLM** | Groq API | Fast response, [get a free key](https://console.groq.com) (sign-up required) |
| **TTS** | Kokoro MLX | Apple Silicon local server, natural voice |

## Features

- **Voice-based lessons** — Real-time speech recognition (STT) and text-to-speech (TTS) for natural conversation
- **AI Teacher (Ms. Sarah)** — Warm, patient persona with a lecture-first teaching style (70% explanation, 30% student participation)
- **Structured curriculum** — 58 lessons across 6 levels (A1 to B2+), each with 5 sections (warmup, core, practice, review)
- **Progress tracking** — Automatic section-by-section progress saving with resume support
- **macOS menu bar app** — Quick launch via system tray

## Curriculum

| Level | Title | CEFR | Lessons |
|-------|-------|------|---------|
| 1 | Beginner | A1 | 18 |
| 2 | Elementary | A2 | 8 |
| 3 | Intermediate | B1 | 8 |
| 4 | Upper-Intermediate | B2 | 8 |
| 5 | Business English | B2+ | 8 |
| 6 | Real-Life English | A2-B2 | 8 |

> The curriculum is continuously expanding as lessons progress.

## Tech Stack

- **Frontend**: SvelteKit (Svelte 5) + Vite 6
- **LLM**: Groq Llama 4 Scout 17B
- **STT**: Web Speech API
- **TTS**: Kokoro AI (MLX local server)
- **Database**: SQLite (better-sqlite3)
- **Language**: JavaScript (ES Modules)

## Prerequisites

- Node.js 18+
- Groq API key ([https://console.groq.com](https://console.groq.com))
- For local TTS: Python 3.12+ with MLX (macOS Apple Silicon only)

## Getting Started

### 1. Clone and install

```bash
git clone https://github.com/sapinfo/ai-english-tutor.git
cd ai-english-tutor
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Edit `.env` with your API key:

```
GROQ_API_KEY=your_groq_api_key        # Groq LLM (https://console.groq.com)
```

### 3. Run

The database (`data/tutor.db`) is included in the repository, so no initialization is needed.

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production build

```bash
npm run build
node build/index.js
```

The production server runs on port 3000.

## TTS Engine Setup (Kokoro Local)

Run the Kokoro TTS local server on Apple Silicon Mac.

```bash
# Install dependencies
pip install kokoro-mlx fastapi uvicorn numpy

# Start server (port 8881)
cd mlx-audio-server
python3 kokoro_tts_server.py

# Health check
curl http://localhost:8881/health
```

- Model: Kokoro-82M (MLX 4bit, ~50MB, auto-downloaded on first run)
- Generation speed: ~0.5s per sentence
- API: OpenAI TTS compatible (`POST /v1/audio/speech`)

## One-click Launch (macOS)

```bash
./start.sh    # Launch Kokoro TTS + SvelteKit + auto-open browser
./stop.sh     # Stop all services
```

## macOS Menu Bar App (Optional)

A menu bar app for starting/stopping services and monitoring their status.

### Installation

```bash
cd menubar
pip install rumps py2app
python setup.py py2app
```

The built app is located at `menubar/dist/AI English Tutor.app`.
Copy it to `/Applications` for easy access and optional login startup.

### Features

- **Start All** — Launch Kokoro TTS and SvelteKit server at once
- **Stop All** — Shut down all services
- **Open Browser** — Open the app in your browser
- **Status display** — Real-time monitoring of TTS (8881), Web (3000)

## Project Structure

```
AIEnglishTutor/
├── src/
│   ├── routes/
│   │   ├── +page.svelte            # Main lesson UI
│   │   └── api/                    # REST API endpoints
│   └── lib/
│       ├── db.js                   # SQLite connection
│       └── curriculum-db.js        # Curriculum queries
├── scripts/                        # Database seed scripts
├── data/                           # SQLite database
├── mlx-audio-server/               # Local Kokoro TTS server (macOS)
├── menubar/                        # macOS menu bar app
├── docs/                           # Technical documentation
└── .env.example                    # Environment template
```

## How It Works

1. **Student selects a lesson** from the curriculum browser
2. **Ms. Sarah introduces the topic** using the teacher script for each section
3. **Student speaks** — Web Speech API converts speech to text
4. **AI processes** the student's input with lesson context and responds
5. **TTS reads the response** aloud in a natural voice
6. **Progress auto-saves** at each section transition

## Support

If you find this project helpful, buy me a coffee!

[![Buy Me A Coffee](https://img.shields.io/badge/Buy%20Me%20A%20Coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black)](https://buymeacoffee.com/inseokko)

## License

This project is for personal/educational use.
