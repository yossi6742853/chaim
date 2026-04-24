"""
Voice Cloning with Voicebox (100% Free, Local, Open Source)
============================================================
Voicebox is a local desktop app - no cloud, no API keys, no limits.
Download from: https://voicebox.sh or
  https://github.com/jamiepine/voicebox/releases/download/v0.4.5/Voicebox_0.4.5_x64-setup.exe

Steps:
  1. Install Voicebox (482MB download)
  2. Open Voicebox
  3. Click "Clone Voice" -> upload chaim_sample.wav
  4. Type your text in Hebrew
  5. Click Generate -> Export as WAV

This script automates it via Voicebox's local REST API (runs on localhost after app starts).
"""

import os
import sys
import json
import time

try:
    import requests
except ImportError:
    print("pip install requests")
    sys.exit(1)

# ============ CONFIGURATION ============
VOICEBOX_URL = "http://localhost:8787"  # Default Voicebox API port
SAMPLE_FILE = os.path.join(os.path.dirname(__file__), "chaim_sample.wav")
OUTPUT_FILE = os.path.join(os.path.dirname(__file__), "chaim_cloned_test.wav")
TEXT = "\u05e9\u05dc\u05d5\u05dd \u05d7\u05d1\u05e8\u05d9\u05dd! \u05d1\u05e8\u05d5\u05db\u05d9\u05dd \u05d4\u05d1\u05d0\u05d9\u05dd \u05dc\u05e7\u05d5 \u05d4\u05de\u05e9\u05d7\u05e7\u05d9\u05dd \u05e9\u05dc \u05d7\u05d9\u05d9\u05dd \u05db\u05e5!"
# =======================================

def check_voicebox():
    try:
        r = requests.get(f"{VOICEBOX_URL}/api/health", timeout=3)
        return r.status_code == 200
    except:
        return False

if not check_voicebox():
    print("ERROR: Voicebox is not running!")
    print("  1. Download from https://voicebox.sh")
    print("  2. Install and launch the app")
    print("  3. Run this script again")
    sys.exit(1)

print(f"[1/3] Uploading voice sample: {SAMPLE_FILE}")
with open(SAMPLE_FILE, "rb") as f:
    resp = requests.post(
        f"{VOICEBOX_URL}/api/voices/clone",
        files={"audio": ("chaim_sample.wav", f, "audio/wav")},
        data={"name": "Chaim Katz"}
    )
    voice_id = resp.json().get("id")
    print(f"  Voice cloned: {voice_id}")

print(f"[2/3] Generating speech...")
resp = requests.post(
    f"{VOICEBOX_URL}/api/tts",
    json={
        "text": TEXT,
        "voice_id": voice_id,
        "language": "he",
    }
)

print(f"[3/3] Saving to: {OUTPUT_FILE}")
with open(OUTPUT_FILE, "wb") as f:
    f.write(resp.content)

print(f"Done! Output: {OUTPUT_FILE}")
print(f"File size: {os.path.getsize(OUTPUT_FILE):,} bytes")
