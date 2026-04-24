"""
Voice Cloning with ElevenLabs (Free Tier)
==========================================
Free tier: 10,000 chars/month, up to 3 instant voice clones.
Sign up at https://elevenlabs.io (no credit card needed for free tier).
Get API key from: https://elevenlabs.io/app/api

Usage:
  1. Set your API key below or as environment variable ELEVEN_API_KEY
  2. Run: python clone_elevenlabs.py
"""

import os
import sys

# ============ CONFIGURATION ============
API_KEY = os.environ.get("ELEVEN_API_KEY", "YOUR_API_KEY_HERE")
SAMPLE_FILE = os.path.join(os.path.dirname(__file__), "chaim_sample.wav")
OUTPUT_FILE = os.path.join(os.path.dirname(__file__), "chaim_cloned_test.wav")
TEXT = "\u05e9\u05dc\u05d5\u05dd \u05d7\u05d1\u05e8\u05d9\u05dd! \u05d1\u05e8\u05d5\u05db\u05d9\u05dd \u05d4\u05d1\u05d0\u05d9\u05dd \u05dc\u05e7\u05d5 \u05d4\u05de\u05e9\u05d7\u05e7\u05d9\u05dd \u05e9\u05dc \u05d7\u05d9\u05d9\u05dd \u05db\u05e5!"
# =======================================

if API_KEY == "YOUR_API_KEY_HERE":
    print("ERROR: Set your ElevenLabs API key!")
    print("  1. Sign up free at https://elevenlabs.io")
    print("  2. Go to https://elevenlabs.io/app/api")
    print("  3. Create an API key")
    print("  4. Set: ELEVEN_API_KEY=your_key  or edit this file")
    sys.exit(1)

from elevenlabs.client import ElevenLabs

client = ElevenLabs(api_key=API_KEY)

print(f"[1/3] Creating voice clone from: {SAMPLE_FILE}")
voice = client.voices.ivc.create(
    name="Chaim Katz",
    description="Israeli male voice, energetic, podcast host style",
    files=[SAMPLE_FILE],
)
print(f"  Voice created: {voice.voice_id}")

print(f"[2/3] Generating speech: {TEXT}")
audio = client.text_to_speech.convert(
    text=TEXT,
    voice_id=voice.voice_id,
    model_id="eleven_multilingual_v2",  # supports Hebrew
)

print(f"[3/3] Saving to: {OUTPUT_FILE}")
with open(OUTPUT_FILE, "wb") as f:
    for chunk in audio:
        f.write(chunk)

print(f"Done! Output: {OUTPUT_FILE}")
print(f"File size: {os.path.getsize(OUTPUT_FILE):,} bytes")
