"""
Voice Cloning with Fish Audio (Free Tier)
==========================================
Free tier: 1 hour of generation per month.
Sign up at https://fish.audio (free account).
Get API key from: https://fish.audio/app/api-keys/

Usage:
  1. Set your API key below or as environment variable FISH_API_KEY
  2. Run: python clone_fishaudio.py

Note: Fish Audio supports Hebrew via its multilingual model.
      Uses "on-the-fly" cloning - no need to create a persistent voice model.
"""

import os
import sys

# ============ CONFIGURATION ============
API_KEY = os.environ.get("FISH_API_KEY", "YOUR_API_KEY_HERE")
SAMPLE_FILE = os.path.join(os.path.dirname(__file__), "chaim_sample.wav")
OUTPUT_FILE = os.path.join(os.path.dirname(__file__), "chaim_cloned_test.wav")
TEXT = "\u05e9\u05dc\u05d5\u05dd \u05d7\u05d1\u05e8\u05d9\u05dd! \u05d1\u05e8\u05d5\u05db\u05d9\u05dd \u05d4\u05d1\u05d0\u05d9\u05dd \u05dc\u05e7\u05d5 \u05d4\u05de\u05e9\u05d7\u05e7\u05d9\u05dd \u05e9\u05dc \u05d7\u05d9\u05d9\u05dd \u05db\u05e5!"
# Reference text - what Chaim says in the sample (approximate)
REF_TEXT = "\u05e9\u05dc\u05d5\u05dd \u05dc\u05db\u05d5\u05dc\u05dd"
# =======================================

if API_KEY == "YOUR_API_KEY_HERE":
    print("ERROR: Set your Fish Audio API key!")
    print("  1. Sign up free at https://fish.audio")
    print("  2. Go to https://fish.audio/app/api-keys/")
    print("  3. Create an API key")
    print("  4. Set: FISH_API_KEY=your_key  or edit this file")
    sys.exit(1)

try:
    from fish_audio_sdk import Session, TTSRequest, ReferenceAudio
except ImportError:
    # Try alternative import path
    from fishaudio import FishAudio
    from fishaudio.types import ReferenceAudio as RA

    client = FishAudio(api_key=API_KEY)
    print(f"[1/2] Cloning voice from: {SAMPLE_FILE}")
    with open(SAMPLE_FILE, "rb") as f:
        audio = client.tts.convert(
            text=TEXT,
            references=[RA(audio=f.read(), text=REF_TEXT)]
        )
    print(f"[2/2] Saving to: {OUTPUT_FILE}")
    with open(OUTPUT_FILE, "wb") as out:
        out.write(audio)
    print(f"Done! Output: {OUTPUT_FILE}")
    print(f"File size: {os.path.getsize(OUTPUT_FILE):,} bytes")
    sys.exit(0)

# Primary SDK path
session = Session(api_key=API_KEY)

print(f"[1/2] Cloning voice on-the-fly from: {SAMPLE_FILE}")
with open(SAMPLE_FILE, "rb") as f:
    sample_data = f.read()

# Use reference audio for on-the-fly cloning
request = TTSRequest(
    text=TEXT,
    references=[
        ReferenceAudio(
            audio=sample_data,
            text=REF_TEXT,
        )
    ],
)

print(f"[2/2] Generating and saving to: {OUTPUT_FILE}")
with open(OUTPUT_FILE, "wb") as out:
    for chunk in session.tts(request):
        out.write(chunk)

print(f"Done! Output: {OUTPUT_FILE}")
print(f"File size: {os.path.getsize(OUTPUT_FILE):,} bytes")
