"""
Auto-update status extension 8 on Yemot HaMashiach
Run this in background — updates every 5 minutes
"""
import asyncio, edge_tts, subprocess, os, sys, time, json
import static_ffmpeg
static_ffmpeg.add_paths()

ffmpeg = r'C:\Users\יוסף שניידר\AppData\Local\Programs\Python\Python311\Lib\site-packages\static_ffmpeg\bin\win32\ffmpeg.EXE'
TOKEN = "0772251404:85478577"
API = "https://www.call2all.co.il/ym/api"
AUDIO_DIR = os.path.join(os.path.dirname(__file__), '..', 'games', 'audio')

def get_game_count():
    try:
        with open(os.path.join(os.path.dirname(__file__), '..', 'index.html'), encoding='utf-8') as f:
            html = f.read()
        import re
        matches = re.findall(r"name:'[^']+',cat:", html)
        return len(matches)
    except:
        return 0

async def update_status(message):
    tts_file = os.path.join(AUDIO_DIR, 'status_tts.mp3')
    wav_file = os.path.join(AUDIO_DIR, 'status_update.wav')

    comm = edge_tts.Communicate(message, 'he-IL-AvriNeural', rate='+12%', pitch='+4Hz', volume='+15%')
    await comm.save(tts_file)
    subprocess.run([ffmpeg, '-y', '-i', tts_file, '-ar', '8000', '-ac', '1', '-acodec', 'pcm_s16le', wav_file],
                   capture_output=True, timeout=30)
    os.remove(tts_file)

    os.system(f'curl -s -X POST "{API}/UploadFile?token={TOKEN}&path=ivr2:/8/M0000.wav" -F "file=@{wav_file}" -o /dev/null')
    print(f'[{time.strftime("%H:%M:%S")}] Status updated: {message[:60]}...')

if __name__ == '__main__':
    if len(sys.argv) > 1:
        # One-shot update with custom message
        asyncio.run(update_status(sys.argv[1]))
    else:
        print('Usage: python update_status.py "הודעת עדכון"')
        print('  Or import and call update_status() programmatically')
