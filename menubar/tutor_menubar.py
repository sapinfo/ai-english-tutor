#!/usr/bin/env python3
"""AI English Tutor — macOS Menu Bar App (rumps)"""

import os
import signal
import subprocess
import sys
import traceback
import rumps

PROJECT_DIR = "/Users/inseokko/Documents/AIEnglishTutor"
LOG_DIR = "/tmp"

SHELL_ENV = {
    "PATH": "/Users/inseokko/.pyenv/versions/3.12.3/bin:"
            "/Users/inseokko/.nvm/versions/node/v24.14.1/bin:"
            "/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin",
    "HOME": os.environ.get("HOME", "/Users/inseokko"),
    "USER": os.environ.get("USER", "inseokko"),
}

NODE_BIN = "/Users/inseokko/.nvm/versions/node/v24.14.1/bin/node"
NPM_BIN = "/Users/inseokko/.nvm/versions/node/v24.14.1/bin/npm"
PYTHON_BIN = "/Users/inseokko/.pyenv/versions/3.12.3/bin/python3"


def log(msg):
    """Write to menubar log."""
    with open(f"{LOG_DIR}/tutor-menubar.log", "a") as f:
        from datetime import datetime
        f.write(f"[{datetime.now().isoformat()}] {msg}\n")


def is_port_open(port):
    try:
        result = subprocess.run(
            ["lsof", "-i", f":{port}"],
            capture_output=True, timeout=3
        )
        return result.returncode == 0
    except Exception:
        return False


class TutorMenuBar(rumps.App):
    def __init__(self):
        # py2app bundles resources in .app/Contents/Resources/
        if getattr(sys, 'frozen', False):
            icon_path = os.path.join(os.path.dirname(sys.executable), '..', 'Resources', 'icon.png')
        else:
            icon_path = os.path.join(os.path.dirname(__file__), "icon.png")
        super().__init__(
            "",
            icon=icon_path,
            template=True,
            quit_button=None,
        )
        self.tts_item = rumps.MenuItem("TTS (8881): --", callback=lambda _: None)
        self.web_item = rumps.MenuItem("Web (3000): --", callback=lambda _: None)

        self.menu = [
            rumps.MenuItem("Start All", callback=self.start_all),
            rumps.MenuItem("Stop All", callback=self.stop_all),
            None,
            rumps.MenuItem("Open Browser", callback=self.open_browser),
            None,
            self.tts_item,
            self.web_item,
            None,
            rumps.MenuItem("Quit", callback=self.quit_app),
        ]
        self._prev = {"tts": False, "web": False}
        self.timer = rumps.Timer(self.update_status, 5)
        self.timer.start()
        log("Menubar app started")
        self.update_status(None)

    def update_status(self, _):
        try:
            tts = is_port_open(8881)
            web = is_port_open(3000)

            self.tts_item.title = f"TTS (8881): {'Running' if tts else 'Stopped'}"
            self.web_item.title = f"Web (3000): {'Running' if web else 'Stopped'}"

            if tts and not self._prev["tts"]:
                self._notify("Kokoro TTS Ready (port 8881)")
            if web and not self._prev["web"]:
                self._notify("SvelteKit Ready (port 3000)")

            self._prev = {"tts": tts, "web": web}
        except Exception as e:
            log(f"update_status error: {e}")

    def _notify(self, message):
        try:
            subprocess.Popen([
                "osascript", "-e",
                f'display notification "{message}" with title "AI English Tutor"'
            ])
            log(f"Notification: {message}")
        except Exception as e:
            log(f"Notification error: {e}")

    def start_all(self, _):
        try:
            log("Start All clicked")
            log("Starting services...")

            # 1. Kokoro TTS
            if not is_port_open(8881):
                log("Starting Kokoro TTS...")
                tts_log = open(f"{LOG_DIR}/tts.log", "a")
                subprocess.Popen(
                    [PYTHON_BIN, "kokoro_tts_server.py"],
                    cwd=os.path.join(PROJECT_DIR, "mlx-audio-server"),
                    env=SHELL_ENV,
                    stdout=tts_log,
                    stderr=tts_log,
                    start_new_session=True,
                )
                log("Kokoro TTS subprocess launched")

            # 2. SvelteKit (built)
            if not is_port_open(3000):
                build_index = os.path.join(PROJECT_DIR, "build", "index.js")
                if not os.path.exists(build_index):
                    log("Building SvelteKit...")
                    result = subprocess.run(
                        [NPM_BIN, "run", "build"],
                        cwd=PROJECT_DIR,
                        env=SHELL_ENV,
                        capture_output=True, text=True
                    )
                    log(f"Build result: {result.returncode}")
                    if result.stderr:
                        log(f"Build stderr: {result.stderr[:500]}")

                log("Starting SvelteKit server...")
                svelte_log = open(f"{LOG_DIR}/sveltekit.log", "a")
                node_env = {**SHELL_ENV, "PORT": "3000", "HOST": "0.0.0.0"}
                subprocess.Popen(
                    [NODE_BIN, "--require", "dotenv/config", "build/index.js"],
                    cwd=PROJECT_DIR,
                    env=node_env,
                    stdout=svelte_log,
                    stderr=svelte_log,
                    start_new_session=True,
                )
                log("SvelteKit subprocess launched")

        except Exception as e:
            log(f"start_all error: {traceback.format_exc()}")
            log(f"Error: {e}")

    def stop_all(self, _):
        try:
            log("Stop All clicked")

            # SvelteKit (port 3000)
            result = subprocess.run(
                ["lsof", "-ti", ":3000"],
                capture_output=True, text=True, timeout=3
            )
            for pid in result.stdout.strip().split("\n"):
                if pid.strip():
                    os.kill(int(pid.strip()), signal.SIGTERM)
                    log(f"Killed port 3000 pid {pid.strip()}")
        except Exception as e:
            log(f"Stop web error: {e}")

        try:
            # Kokoro TTS
            subprocess.run(["pkill", "-f", "kokoro_tts_server.py"], capture_output=True)
            result = subprocess.run(
                ["lsof", "-ti", ":8881"],
                capture_output=True, text=True, timeout=3
            )
            for pid in result.stdout.strip().split("\n"):
                if pid.strip():
                    os.kill(int(pid.strip()), signal.SIGTERM)
                    log(f"Killed port 8881 pid {pid.strip()}")
        except Exception as e:
            log(f"Stop TTS error: {e}")

        log("Services stopped.")
        self.update_status(None)

    def open_browser(self, _):
        subprocess.Popen(["open", "http://localhost:3000"])

    def quit_app(self, _):
        log("Quit")
        rumps.quit_application()


if __name__ == "__main__":
    TutorMenuBar().run()
