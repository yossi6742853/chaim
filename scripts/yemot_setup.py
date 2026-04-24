"""
ימות המשיח — בניית מבנה תפריטים לקו המשחקים של חיים כץ
מספר מערכת: 0772251404
סיסמה: 85478577

מבנה התפריט:
ivr2:/          → ברוכים הבאים לקו המשחקים של חיים כץ
  /1            → משחק היום (מתעדכן)
  /2            → מאגר משחקים לפי קטגוריה
    /2/1        → משחקי ODT ושטח
    /2/2        → משחקים אנרגטיים
    /2/3        → משחקי חשיבה
    /2/4        → שוברי קרח
    /2/5        → משחקים קבוצתיים
    /2/6        → אבות ובנים
    /2/7        → משחקי כיתה
    /2/8        → פעילויות שטח
  /3            → תוכניות של חיים כץ
    /3/1        → אבות עם בנים
    /3/2        → ODT — אימון חוצות
    /3/3        → טיפול באתגר
    /3/4        → סדנאות למחנכים
  /4            → הפודקאסט "הקשר"
  /5            → יצירת קשר
  /0            → חזרה לתפריט הראשי
"""

import json
import os
import sys

# Try importing requests, fall back to urllib
try:
    import requests
    USE_REQUESTS = True
except ImportError:
    import urllib.request
    import urllib.parse
    USE_REQUESTS = False

API = "https://www.call2all.co.il/ym/api"
TOKEN = "0772251404:85478577"

def api_call(endpoint, params=None, method='GET'):
    """Call Yemot HaMashiach API"""
    url = f"{API}/{endpoint}"
    if params is None:
        params = {}
    params['token'] = TOKEN

    if USE_REQUESTS:
        if method == 'GET':
            r = requests.get(url, params=params)
        else:
            r = requests.post(url, data=params)
        return r.json() if r.headers.get('content-type','').startswith('application/json') else r.text
    else:
        query = urllib.parse.urlencode(params)
        full_url = f"{url}?{query}"
        req = urllib.request.Request(full_url)
        with urllib.request.urlopen(req) as resp:
            data = resp.read().decode()
            try:
                return json.loads(data)
            except:
                return data

def create_extension(path, ext_type='menu'):
    """Create an IVR extension"""
    print(f"  Creating extension: {path} (type={ext_type})")
    result = api_call('UpdateExtension', {'path': path, 'type': ext_type})
    print(f"    Result: {result}")
    return result

def upload_text(path, contents):
    """Upload ext.ini text file"""
    print(f"  Uploading config: {path}")
    result = api_call('UploadTextFile', {'what': path, 'contents': contents})
    print(f"    Result: {result}")
    return result

def build_menu_structure():
    """Build the full IVR menu tree"""
    print("=" * 60)
    print("בונה מבנה תפריטים לימות המשיח")
    print("מערכת: 0772251404")
    print("=" * 60)

    # Check session first
    print("\n1. בודק חיבור...")
    session = api_call('GetSession')
    print(f"   חיבור: {session}")

    # Create main menu
    print("\n2. יוצר תפריט ראשי (ivr2:/)...")
    create_extension('ivr2:/', 'menu')

    # Create sub-menus
    menus = {
        'ivr2:/1': ('playfile', 'משחק היום'),
        'ivr2:/2': ('menu', 'מאגר משחקים'),
        'ivr2:/2/1': ('playfile', 'משחקי ODT ושטח'),
        'ivr2:/2/2': ('playfile', 'משחקים אנרגטיים'),
        'ivr2:/2/3': ('playfile', 'משחקי חשיבה'),
        'ivr2:/2/4': ('playfile', 'שוברי קרח'),
        'ivr2:/2/5': ('playfile', 'משחקים קבוצתיים'),
        'ivr2:/2/6': ('playfile', 'אבות ובנים'),
        'ivr2:/2/7': ('playfile', 'משחקי כיתה'),
        'ivr2:/2/8': ('playfile', 'פעילויות שטח'),
        'ivr2:/3': ('menu', 'תוכניות'),
        'ivr2:/3/1': ('playfile', 'אבות עם בנים'),
        'ivr2:/3/2': ('playfile', 'ODT'),
        'ivr2:/3/3': ('playfile', 'טיפול באתגר'),
        'ivr2:/3/4': ('playfile', 'סדנאות למחנכים'),
        'ivr2:/4': ('playfile', 'פודקאסט הקשר'),
        'ivr2:/5': ('playfile', 'יצירת קשר'),
    }

    print(f"\n3. יוצר {len(menus)} שלוחות...")
    for path, (ext_type, name) in menus.items():
        print(f"\n   [{name}]")
        create_extension(path, ext_type)

    print("\n" + "=" * 60)
    print("סיום! מבנה התפריטים נוצר בהצלחה.")
    print("עכשיו צריך להעלות קבצי שמע (WAV) לכל שלוחה.")
    print("=" * 60)

def generate_tts_scripts():
    """Generate TTS scripts for each menu"""
    scripts = {
        'root': 'ברוכים הבאים לקו המשחקים של חיים כץ! '
                'לשמוע את המשחק של היום — הקישו 1. '
                'למאגר המשחקים לפי קטגוריה — הקישו 2. '
                'לשמוע על התוכניות של חיים — הקישו 3. '
                'לפודקאסט הקשר — הקישו 4. '
                'ליצירת קשר — הקישו 5.',

        'daily': 'המשחק של היום! כל יום משחק חדש, עם הוראות מפורטות ושלבים.',

        'categories': 'מאגר המשחקים של חיים כץ — מעל 200 משחקים! '
                      'למשחקי שטח ו-ODT — הקישו 1. '
                      'למשחקים אנרגטיים — הקישו 2. '
                      'למשחקי חשיבה — הקישו 3. '
                      'לשוברי קרח — הקישו 4. '
                      'למשחקים קבוצתיים — הקישו 5. '
                      'לאבות ובנים — הקישו 6. '
                      'למשחקי כיתה — הקישו 7. '
                      'לפעילויות שטח — הקישו 8. '
                      'לחזרה — הקישו כוכבית.',

        'programs': 'התוכניות של חיים כץ. '
                    'לאבות עם בנים בשטח — הקישו 1. '
                    'ל-ODT אימון חוצות — הקישו 2. '
                    'לטיפול באתגר — הקישו 3. '
                    'לסדנאות למחנכים — הקישו 4.',

        'contact': 'ליצירת קשר עם חיים כץ, '
                   'התקשרו לנייד: 054-853-1641. '
                   'או למשרד: 077-230-3658. '
                   'אימייל: office@gisha-center.com. '
                   'אתר: chaim-katz.com.',
    }

    # Save scripts as JSON for TTS processing
    scripts_path = os.path.join(os.path.dirname(__file__), '..', 'games', 'tts_scripts.json')
    with open(scripts_path, 'w', encoding='utf-8') as f:
        json.dump(scripts, f, ensure_ascii=False, indent=2)
    print(f"\nTTS scripts saved to: {scripts_path}")
    return scripts

def generate_game_scripts():
    """Generate TTS scripts for individual games from library JSONs"""
    library_path = os.path.join(os.path.dirname(__file__), '..', 'games', 'library')
    scripts = {}

    if not os.path.exists(library_path):
        print("No library directory found")
        return scripts

    for fn in sorted(os.listdir(library_path)):
        if not fn.endswith('.json'):
            continue
        with open(os.path.join(library_path, fn), encoding='utf-8') as f:
            game = json.load(f)

        script = f"{game['title']}. {game.get('description_short','')} "
        if game.get('instructions'):
            script += f"הוראות המשחק: {game['instructions']} "
        if game.get('reflection'):
            script += f"שאלות לסיכום: {game['reflection']} "
        if game.get('variations'):
            script += f"וריאציות: {game['variations']}"

        scripts[game['id']] = script

    scripts_path = os.path.join(os.path.dirname(__file__), '..', 'games', 'tts_game_scripts.json')
    with open(scripts_path, 'w', encoding='utf-8') as f:
        json.dump(scripts, f, ensure_ascii=False, indent=2)
    print(f"\n{len(scripts)} game scripts saved to: {scripts_path}")
    return scripts


if __name__ == '__main__':
    if len(sys.argv) > 1 and sys.argv[1] == '--build':
        build_menu_structure()
    elif len(sys.argv) > 1 and sys.argv[1] == '--scripts':
        generate_tts_scripts()
        generate_game_scripts()
    else:
        print("Usage:")
        print("  python yemot_setup.py --build    # Build IVR menu structure")
        print("  python yemot_setup.py --scripts  # Generate TTS scripts")
        print()
        print("Menu structure:")
        print("  0772251404")
        print("  ├── 1: משחק היום")
        print("  ├── 2: מאגר משחקים")
        print("  │   ├── 1: ODT ושטח")
        print("  │   ├── 2: אנרגטי")
        print("  │   ├── 3: חשיבה")
        print("  │   ├── 4: שוברי קרח")
        print("  │   ├── 5: קבוצתי")
        print("  │   ├── 6: אבות ובנים")
        print("  │   ├── 7: כיתה")
        print("  │   └── 8: שטח")
        print("  ├── 3: תוכניות")
        print("  │   ├── 1: אבות עם בנים")
        print("  │   ├── 2: ODT")
        print("  │   ├── 3: טיפול באתגר")
        print("  │   └── 4: סדנאות")
        print("  ├── 4: פודקאסט")
        print("  └── 5: יצירת קשר")
