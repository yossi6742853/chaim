// MEGA UPDATE: Add 100 games + catalog + fix all in one shot
const fs=require('fs');let h=fs.readFileSync('index.html','utf8');
const sm=h.match(/<script>([\s\S]*?)<\/script>/);let js=sm[1];
const s=js.indexOf('const ACTIVITIES = ['),sb=js.indexOf('[',s);
let d=0,e=sb;for(let i=sb;i<js.length;i++){if(js[i]==='[')d++;else if(js[i]===']'){d--;if(d===0){e=i+1;break}}}
const acts=eval(js.substring(sb,e));
console.log('Before:',acts.length);

const L=[{name:'בסיסי',desc:'חוקים רגילים'},{name:'צוותי',desc:'שני צוותים מתחרים'},{name:'שקט',desc:'בלי לדבר!'},{name:'מיוחד',desc:'גרסה מיוחדת'},{name:'מטורף',desc:'הכל הפוך!'}];
const R='1. המנחה מסביר.\n2. מתכנסים.\n3. הדגמה.\n4. רמה בסיסית.\n5. עולים רמה.\n6. מעודדים.\n7. שיחת סיכום.';
const RF={odt:'מה למדתם? איך הצוות עזר? חז״ל: כל ישראל ערבים זה בזה.',group:'מה הרגשתם? מה למדנו על שיתוף? חז״ל: קנה לך חבר.',energetic:'מה היה הכי כיף? חז״ל: מצווה גוררת מצווה.',thinking:'איזו אסטרטגיה עבדה? חז״ל: איזהו חכם? הלומד מכל אדם.',icebreaker:'מה גיליתם? חז״ל: הוי מקבל כל אדם בסבר פנים יפות.',fathers:'מה הרגשתם ביחד? חז״ל: כבד את אביך.',outdoor:'מה גיליתם בטבע? חז״ל: מה רבו מעשיך.',classroom:'מה למדתם? חז״ל: עשה לך רב קנה לך חבר.'};

// Subcategories for better catalog
const subcats = {
  odt: ['חבלים','אמון','בנייה','ניווט','טיפוס'],
  energetic: ['מרוץ','כדור','תגובה','תחרות','ריקוד'],
  thinking: ['חידות','מספרים','מילים','זיכרון','אסטרטגיה'],
  group: ['שיחה','יצירתיות','הצגה','ערכים','שיתוף'],
  icebreaker: ['היכרות','תנועה','זיכרון','משחק שם','כיף'],
  fathers: ['שיחה','אתגר','בנייה','טבע','יצירה'],
  outdoor: ['ניווט','חושים','הישרדות','חקירה','בנייה'],
  classroom: ['חידון','כתיבה','הצגה','דיון','משחק']
};

// Add subcategory tag to all existing games
for (const a of acts) {
  if (!a.subcat) {
    const subs = subcats[a.cat] || ['כללי'];
    const all = a.name + ' ' + (a.desc||'');
    for (const sc of subs) {
      if (all.includes(sc.substring(0,3))) { a.subcat = sc; break; }
    }
    if (!a.subcat) a.subcat = subs[Math.floor(Math.random()*subs.length)];
  }
}

// 100 NEW GAMES
const ng = [
// THINKING x20
{name:'מבוך מספרים',cat:'thinking',desc:'מבוך שבו כל צומת עם מספר — צריך לעבור כך שהסכום יהיה בדיוק 50!',ages:'9+',participants:'3-20',difficulty:2,tags:['מספרים','לוגיקה'],subcat:'מספרים'},
{name:'חידת הגשר',cat:'thinking',desc:'4 אנשים צריכים לחצות גשר בלילה עם פנס אחד. כל אחד בקצב שונה. איך?',ages:'10+',participants:'4-20',difficulty:3,tags:['לוגיקה','חידה'],subcat:'חידות'},
{name:'הפרדת צבעים',cat:'thinking',desc:'ערימת קלפים צבעוניים — מיינו לפי צבע בלי להסתכל! רק מגע.',ages:'8+',participants:'3-15',difficulty:2,tags:['חושים','לוגיקה'],subcat:'אסטרטגיה'},
{name:'סודוקו אנושי',cat:'thinking',desc:'9 שחקנים בלוח 3×3 — כל שורה ועמודה חייבת 3 צבעים שונים!',ages:'9+',participants:'9-27',difficulty:2,tags:['לוגיקה','מרחבי'],subcat:'מספרים'},
{name:'חידת האוצר',cat:'thinking',desc:'5 רמזים מתמטיים מובילים לאוצר חבוי. כל רמז = חישוב!',ages:'9+',participants:'4-20',difficulty:2,tags:['מתמטיקה','חיפוש'],subcat:'מספרים'},
{name:'מילה מתוך מילה',cat:'thinking',desc:'מילה ארוכה על הלוח — כמה מילים קצרות אפשר ליצור מהאותיות?',ages:'8+',participants:'3-30',difficulty:1,tags:['מילים','תחרות'],subcat:'מילים'},
{name:'חידת הסוחר',cat:'thinking',desc:'סוחר קנה ב-80 מכר ב-90 קנה ב-100 מכר ב-110. כמה הרוויח?',ages:'10+',participants:'3-25',difficulty:2,tags:['מתמטיקה','חשיבה'],subcat:'מספרים'},
{name:'מה קודם?',cat:'thinking',desc:'10 אירועים היסטוריים — סדרו אותם מהקדום לחדש!',ages:'10+',participants:'4-25',difficulty:2,tags:['היסטוריה','סדר'],subcat:'זיכרון'},
{name:'שרלוק',cat:'thinking',desc:'המנחה מתאר מקום — 5 רמזים. מי מזהה ראשון?',ages:'9+',participants:'4-30',difficulty:1,tags:['ניחוש','גיאוגרפיה'],subcat:'חידות'},
{name:'מכונת חישוב',cat:'thinking',desc:'שרשרת אנושית — כל אחד מוסיף פעולה חשבונית. מה יצא בסוף?',ages:'9+',participants:'5-20',difficulty:2,tags:['מתמטיקה','שרשרת'],subcat:'מספרים'},
{name:'קוביית רוביק אנושית',cat:'thinking',desc:'9 שחקנים עם חולצות צבעוניות — צריך לסדר בלוח 3×3 לפי דפוס!',ages:'9+',participants:'9-27',difficulty:2,tags:['לוגיקה','תנועה'],subcat:'אסטרטגיה'},
{name:'מפענח הכתב',cat:'thinking',desc:'המנחה כותב בכתב מראה/הפוך — מי מפענח ראשון?',ages:'8+',participants:'3-25',difficulty:1,tags:['קריאה','חשיבה'],subcat:'מילים'},
{name:'חידת הנרות',cat:'thinking',desc:'כמה נרות דולקים אם מכבים 3 מתוך 7 ורוח מכבה עוד 1?',ages:'8+',participants:'3-25',difficulty:1,tags:['לוגיקה','חידה'],subcat:'חידות'},
{name:'מסלול הגיון',cat:'thinking',desc:'5 תחנות — בכל אחת חידה לוגית. פותרים וממשיכים!',ages:'9+',participants:'4-20',difficulty:2,tags:['לוגיקה','מסלול'],subcat:'חידות'},
{name:'זיכרון צלילים',cat:'thinking',desc:'המנחה מנגן רצף צלילים — מי חוזר עליהם בדיוק?',ages:'7+',participants:'3-25',difficulty:1,tags:['שמיעה','זיכרון'],subcat:'זיכרון'},
{name:'מה לא שייך?',cat:'thinking',desc:'4 מילים — 3 קשורות ואחת חורגת. מי מוצא ראשון?',ages:'8+',participants:'3-30',difficulty:1,tags:['לוגיקה','מילים'],subcat:'מילים'},
{name:'חשבון יצירתי',cat:'thinking',desc:'4 מספרים + 4 פעולות = המספר 24. מי מצליח?',ages:'9+',participants:'3-15',difficulty:3,tags:['מתמטיקה','יצירתיות'],subcat:'מספרים'},
{name:'חידת הדלתות',cat:'thinking',desc:'3 דלתות — מאחורי אחת פרס. בוחרים אחת. המנחה פותח ריקה. מחליפים?',ages:'10+',participants:'4-20',difficulty:3,tags:['הסתברות','לוגיקה'],subcat:'אסטרטגיה'},
{name:'מילוי תבנית',cat:'thinking',desc:'תבנית עם חסרים — כל צוות משלים. התבנית הכי יצירתית מנצחת!',ages:'8+',participants:'4-25',difficulty:1,tags:['מילים','יצירתיות'],subcat:'מילים'},
{name:'מפת מושגים',cat:'thinking',desc:'מילה במרכז — כל צוות בונה מפת מושגים. הגדולה ביותר מנצחת!',ages:'9+',participants:'4-25',difficulty:1,tags:['חשיבה','מושגים'],subcat:'אסטרטגיה'},
// ENERGETIC x15
{name:'סלום אנושי',cat:'energetic',desc:'שחקנים עומדים כמכשולים — רצים זיגזג ביניהם! מי הכי מהיר?',ages:'7+',participants:'10-40',difficulty:1,tags:['ריצה','זריזות'],subcat:'מרוץ'},
{name:'מרוץ הכפות',cat:'energetic',desc:'כדור על כפית — ריצה בלי להפיל! מי מגיע ראשון?',ages:'7+',participants:'5-30',difficulty:1,tags:['מרוץ','איזון'],subcat:'מרוץ'},
{name:'קפיצת מספרים',cat:'energetic',desc:'מספרים על הרצפה — המנחה קורא מספר, כולם קופצים אליו!',ages:'6+',participants:'8-40',difficulty:1,tags:['קפיצה','מספרים'],subcat:'תגובה'},
{name:'רוח צפונית',cat:'energetic',desc:'המנחה צועק כיוון — כולם רצים לכיוון הנכון! אחרון = בחוץ.',ages:'7+',participants:'8-40',difficulty:1,tags:['ריצה','כיוונים'],subcat:'תגובה'},
{name:'כדור שורף',cat:'energetic',desc:'2 צוותים זורקים כדורים רכים — מי שנפגע, יוצא!',ages:'8+',participants:'10-40',difficulty:1,tags:['כדור','זריקה'],subcat:'כדור'},
{name:'מרוץ הצפרדעים',cat:'energetic',desc:'קופצים בכריעה — מרוץ צפרדעים! מי מגיע ראשון?',ages:'7+',participants:'5-30',difficulty:1,tags:['קפיצה','כיף'],subcat:'מרוץ'},
{name:'מרוץ גלגולים',cat:'energetic',desc:'מתגלגלים על הרצפה מקצה לקצה — מי ראשון?',ages:'7+',participants:'5-30',difficulty:1,tags:['גלגול','כיף'],subcat:'מרוץ'},
{name:'כיבוש הטירה',cat:'energetic',desc:'טירה מיקי (חרוטים) באמצע — 2 צוותים מנסים לכבוש!',ages:'8+',participants:'10-40',difficulty:2,tags:['אסטרטגיה','ריצה'],subcat:'תחרות'},
{name:'משחק הצלחת',cat:'energetic',desc:'צלחת פלסטיק נזרקת — כולם מנסים לתפוס! פריזבי אנושי.',ages:'8+',participants:'6-30',difficulty:1,tags:['זריקה','תפיסה'],subcat:'כדור'},
{name:'סערה בכוס',cat:'energetic',desc:'כוס מים על הראש — מרוץ בלי לשפוך! מי מגיע עם הכי הרבה?',ages:'8+',participants:'5-30',difficulty:1,tags:['מרוץ','איזון'],subcat:'מרוץ'},
{name:'מלחמת הכריות',cat:'energetic',desc:'2 צוותים, שטח מחולק — זורקים כריות לצד השני! צד עם הכי פחות מנצח.',ages:'7+',participants:'10-40',difficulty:1,tags:['זריקה','כיף'],subcat:'תחרות'},
{name:'הקפאה רוקדת',cat:'energetic',desc:'כולם זזים לקצב — כשעוצר, קופאים! מי שזז, בחוץ.',ages:'6+',participants:'8-50',difficulty:1,tags:['תנועה','ריקוד'],subcat:'ריקוד'},
{name:'ממתק או תעלול',cat:'energetic',desc:'כל סיבוב — הגרלה: ממתק (מנוחה) או תעלול (10 קפיצות)?',ages:'7+',participants:'5-30',difficulty:1,tags:['הפתעה','כיף'],subcat:'תחרות'},
{name:'מרוץ העיתונים',cat:'energetic',desc:'2 דפי עיתון — מניחים אחד, עומדים, מניחים שני, עוברים. מרוץ!',ages:'7+',participants:'5-30',difficulty:1,tags:['מרוץ','פשוט'],subcat:'מרוץ'},
{name:'אימון צבאי',cat:'energetic',desc:'המנחה נותן פקודות צבאיות — שכיבות, ריצה, זחילה, קפיצה!',ages:'8+',participants:'8-50',difficulty:2,tags:['כושר','פקודות'],subcat:'תחרות'},
// GROUP x15
{name:'זמן מעגל',cat:'group',desc:'כל אחד מקבל דקה לדבר על מה שחשוב לו. כולם מקשיבים.',ages:'10+',participants:'5-20',difficulty:1,tags:['שיחה','הקשבה'],subcat:'שיחה'},
{name:'ציור קולקטיבי',cat:'group',desc:'כולם מציירים על נייר אחד גדול — בלי לדבר!',ages:'7+',participants:'5-25',difficulty:1,tags:['ציור','שיתוף'],subcat:'יצירתיות'},
{name:'פסיפס קבוצתי',cat:'group',desc:'כל אחד מצייר חלק — מחברים ליצירה אחת גדולה!',ages:'8+',participants:'5-30',difficulty:1,tags:['ציור','שיתוף'],subcat:'יצירתיות'},
{name:'הקלטת זמן',cat:'group',desc:'כל אחד מקליט הודעה של 30 שניות — מה חשוב לך היום?',ages:'9+',participants:'4-20',difficulty:1,tags:['הקלטה','שיתוף'],subcat:'שיחה'},
{name:'שופטים',cat:'group',desc:'המנחה מציג דילמות — הקבוצה דנה ופוסקת. מי צודק?',ages:'10+',participants:'6-25',difficulty:2,tags:['דילמה','דיון'],subcat:'ערכים'},
{name:'ראיון עבודה',cat:'group',desc:'כל אחד מראיין את חברו ל-3 דקות — ואז מציג אותו!',ages:'9+',participants:'6-30',difficulty:1,tags:['היכרות','הצגה'],subcat:'שיחה'},
{name:'ספינת נוח',cat:'group',desc:'העולם מוצף. 10 דברים להציל. הקבוצה מחליטה ביחד!',ages:'10+',participants:'5-25',difficulty:2,tags:['דיון','ערכים'],subcat:'ערכים'},
{name:'מושב חירום',cat:'group',desc:'בעיה דמיונית — הקבוצה צריכה למצוא פתרון ב-10 דקות!',ages:'10+',participants:'6-25',difficulty:2,tags:['פתרון','צוותי'],subcat:'שיתוף'},
{name:'תערוכה חיה',cat:'group',desc:'כל צוות יוצר ״יצירת אמנות חיה״ — פסל אנושי על נושא!',ages:'8+',participants:'8-30',difficulty:1,tags:['הצגה','יצירתיות'],subcat:'הצגה'},
{name:'מכונת הקבוצה',cat:'group',desc:'כל אחד מוסיף תנועה וצליל — יוצרים מכונה אנושית!',ages:'7+',participants:'6-30',difficulty:1,tags:['תנועה','יצירתיות'],subcat:'הצגה'},
{name:'מעגל סיום',cat:'group',desc:'כל אחד אומר מילה אחת שמסכמת את החוויה. מעגל חיובי.',ages:'8+',participants:'5-30',difficulty:1,tags:['סיכום','חיובי'],subcat:'שיחה'},
{name:'חוזה קבוצתי',cat:'group',desc:'הקבוצה כותבת ביחד 5 כללים לחיים טובים יותר.',ages:'10+',participants:'5-25',difficulty:1,tags:['ערכים','כתיבה'],subcat:'ערכים'},
{name:'מכתב הפתעה',cat:'group',desc:'כל אחד כותב מכתב אנונימי חיובי לחבר — מחלקים ומגלים!',ages:'9+',participants:'5-25',difficulty:1,tags:['חיזוק','אנונימי'],subcat:'שיחה'},
{name:'תחנת רגשות',cat:'group',desc:'4 פינות = 4 רגשות. המנחה מתאר מצב — רצים לרגש!',ages:'8+',participants:'8-30',difficulty:1,tags:['רגשות','תנועה'],subcat:'ערכים'},
{name:'המלצה חמה',cat:'group',desc:'כל אחד ממליץ על ספר/שיר/מקום — 30 שניות!',ages:'9+',participants:'5-25',difficulty:1,tags:['המלצה','שיתוף'],subcat:'שיחה'},
// ICEBREAKER x10
{name:'בינגו אנושי',cat:'icebreaker',desc:'טבלה 4×4 עם תכונות — מצא מישהו שמתאים! ראשון שממלא שורה.',ages:'8+',participants:'10-40',difficulty:1,tags:['היכרות','חיפוש'],subcat:'היכרות'},
{name:'שרשרת שמות',cat:'icebreaker',desc:'כל אחד אומר שם + מילה באותה אות. צריך לזכור את כולם!',ages:'7+',participants:'5-25',difficulty:1,tags:['שמות','זיכרון'],subcat:'משחק שם'},
{name:'3 במשותף',cat:'icebreaker',desc:'בזוגות — מצאו 3 דברים משותפים ב-2 דקות! מחליפים זוג.',ages:'8+',participants:'8-40',difficulty:1,tags:['היכרות','שיחה'],subcat:'היכרות'},
{name:'כרטיס ביקור חי',cat:'icebreaker',desc:'כל אחד מציג עצמו ב-30 שניות — שם + 3 עובדות + כישרון!',ages:'8+',participants:'5-25',difficulty:1,tags:['הצגה','היכרות'],subcat:'היכרות'},
{name:'מזל טוב!',cat:'icebreaker',desc:'כל אחד חוגג ״יום הולדת״ של תכונה — הקבוצה מברכת!',ages:'7+',participants:'5-25',difficulty:1,tags:['חיזוק','כיף'],subcat:'כיף'},
{name:'גלגל היכרות',cat:'icebreaker',desc:'2 מעגלים — פנימי וחיצוני. שאלה, תשובה, מסתובבים!',ages:'8+',participants:'10-40',difficulty:1,tags:['היכרות','שיחה'],subcat:'היכרות'},
{name:'מצביעים!',cat:'icebreaker',desc:'שאלות — מי מעדיף X? מי Y? עומדים בצד שלהם!',ages:'7+',participants:'8-50',difficulty:1,tags:['דעות','תנועה'],subcat:'תנועה'},
{name:'תיאור בלי שם',cat:'icebreaker',desc:'תאר את עצמך ב-3 משפטים בלי לומר שם — מי זה?',ages:'8+',participants:'5-25',difficulty:1,tags:['היכרות','ניחוש'],subcat:'היכרות'},
{name:'אבן נייר מספריים פלוס',cat:'icebreaker',desc:'אבן נייר מספריים + תנועות גוף! מפסיד עושה תנועה מצחיקה.',ages:'7+',participants:'4-30',difficulty:1,tags:['כיף','תנועה'],subcat:'כיף'},
{name:'שמי ושם משפחתי',cat:'icebreaker',desc:'כל אחד מספר את המשמעות/הסיפור של השם שלו.',ages:'8+',participants:'5-25',difficulty:1,tags:['שם','היכרות'],subcat:'משחק שם'},
// FATHERS x5
{name:'אתגר 5 דקות',cat:'fathers',desc:'5 אתגרים של דקה — אב ובן מול השעון!',ages:'8-13',participants:'זוגות',difficulty:1,tags:['מהיר','כיף'],subcat:'אתגר'},
{name:'ציור משותף עיוור',cat:'fathers',desc:'אב מתאר — בן מצייר בעיניים עצומות! ואז מחליפים.',ages:'8-13',participants:'זוגות',difficulty:1,tags:['ציור','תקשורת'],subcat:'יצירה'},
{name:'חפש את האב',cat:'fathers',desc:'האב מסתתר בשטח — הבן מחפש עם רמזים!',ages:'8-13',participants:'זוגות',difficulty:1,tags:['חיפוש','שטח'],subcat:'טבע'},
{name:'מתכון סודי',cat:'fathers',desc:'אב ובן ממציאים מתכון חדש מחומרים שיש — ומכינים!',ages:'8-13',participants:'זוגות',difficulty:1,tags:['בישול','יצירתיות'],subcat:'בנייה'},
{name:'ספר הזיכרונות',cat:'fathers',desc:'אב ובן כותבים 10 זיכרונות משותפים — עם ציורים!',ages:'8-13',participants:'זוגות',difficulty:1,tags:['כתיבה','זיכרון'],subcat:'שיחה'},
// OUTDOOR x10
{name:'מרוץ ניווט',cat:'outdoor',desc:'5 נקודות בשטח עם מפה — מי מוצא את כולן ראשון?',ages:'10+',participants:'4-20',difficulty:2,tags:['ניווט','תחרות'],subcat:'ניווט'},
{name:'בניית מלכודת מים',cat:'outdoor',desc:'בנו מערכת שמעבירה מים ממקום למקום — בלי צינורות!',ages:'9+',participants:'4-20',difficulty:2,tags:['בנייה','מים'],subcat:'בנייה'},
{name:'יצירה מהטבע',cat:'outdoor',desc:'אספו חומרים מהטבע ובנו יצירת אמנות — הקבוצה מצביעה!',ages:'7+',participants:'4-25',difficulty:1,tags:['יצירה','טבע'],subcat:'בנייה'},
{name:'שביל החושים',cat:'outdoor',desc:'מסלול יחף על חול, עשב, אבנים, מים — חוויה חושית!',ages:'7+',participants:'4-25',difficulty:1,tags:['חושים','טבע'],subcat:'חושים'},
{name:'מפת כוכבים',cat:'outdoor',desc:'בלילה — זיהוי 5 כוכבים ומזלות. המנחה מסביר.',ages:'9+',participants:'4-25',difficulty:1,tags:['כוכבים','לילה'],subcat:'חקירה'},
{name:'בניית סכר',cat:'outdoor',desc:'בנו סכר בנחל מאבנים — מי בונה את הגבוה ביותר?',ages:'8+',participants:'4-20',difficulty:2,tags:['בנייה','מים'],subcat:'בנייה'},
{name:'תצפית שקט',cat:'outdoor',desc:'10 דקות של שקט מוחלט בטבע — כל אחד כותב מה ראה ושמע.',ages:'8+',participants:'4-25',difficulty:1,tags:['שקט','טבע'],subcat:'חושים'},
{name:'חקר עצים',cat:'outdoor',desc:'כל צוות בוחר עץ — מודדים, מציירים, מזהים. מי יודע הכי הרבה?',ages:'8+',participants:'4-25',difficulty:1,tags:['עצים','חקירה'],subcat:'חקירה'},
{name:'מסלול ריחות',cat:'outdoor',desc:'5 תחנות עם ריחות שונים בטבע — מי מזהה הכי הרבה?',ages:'7+',participants:'4-25',difficulty:1,tags:['ריח','חושים'],subcat:'חושים'},
{name:'בניית תצפית',cat:'outdoor',desc:'בנו נקודת תצפית מענפים — גבוהה ויציבה!',ages:'10+',participants:'4-15',difficulty:2,tags:['בנייה','גובה'],subcat:'בנייה'},
// CLASSROOM x10
{name:'חידון בזק',cat:'classroom',desc:'20 שאלות ב-5 דקות — מי עונה הכי מהר ונכון?',ages:'8+',participants:'10-35',difficulty:1,tags:['חידון','מהיר'],subcat:'חידון'},
{name:'מילה בונוס',cat:'classroom',desc:'מילה סודית בשיעור — מי ששומע אותה ראשון מרוויח נקודה!',ages:'7+',participants:'10-35',difficulty:1,tags:['הקשבה','כיף'],subcat:'משחק'},
{name:'דו קרב מילים',cat:'classroom',desc:'שני תלמידים — מילה מול מילה על נושא. מי נתקע ראשון?',ages:'8+',participants:'10-35',difficulty:1,tags:['מילים','תחרות'],subcat:'משחק'},
{name:'כיתה הפוכה',cat:'classroom',desc:'התלמידים שואלים שאלות — המורה צריך לענות! מי מפיל את המורה?',ages:'9+',participants:'10-35',difficulty:1,tags:['שאלות','כיף'],subcat:'דיון'},
{name:'מילוי חסר',cat:'classroom',desc:'משפט עם מילים חסרות — כל צוות משלים בצורה הכי יצירתית!',ages:'8+',participants:'10-35',difficulty:1,tags:['מילים','יצירתיות'],subcat:'כתיבה'},
{name:'ציור על הגב',cat:'classroom',desc:'אחד מצייר על הגב של חברו — השני מנחש מה!',ages:'7+',participants:'10-35',difficulty:1,tags:['מגע','ניחוש'],subcat:'משחק'},
{name:'שמע וצייר',cat:'classroom',desc:'המנחה מתאר מילולית — כולם מציירים. משווים תוצאות!',ages:'7+',participants:'10-35',difficulty:1,tags:['ציור','הקשבה'],subcat:'כתיבה'},
{name:'חידון ויזואלי',cat:'classroom',desc:'תמונה על הלוח ל-5 שניות — מה ראיתם? מי זוכר פרטים?',ages:'8+',participants:'10-35',difficulty:1,tags:['זיכרון','ויזואלי'],subcat:'חידון'},
{name:'סיפור מסתובב',cat:'classroom',desc:'כל תלמיד כותב שורה — מקפל ומעביר. מה יצא?',ages:'8+',participants:'10-35',difficulty:1,tags:['כתיבה','הפתעה'],subcat:'כתיבה'},
{name:'מורה מפתיע',cat:'classroom',desc:'תלמיד מלמד נושא שהמורה לא מכיר — הכיתה שופטת!',ages:'10+',participants:'10-35',difficulty:2,tags:['לימוד','הצגה'],subcat:'הצגה'},
// ODT x5
{name:'אתגר הדלי',cat:'odt',desc:'הקבוצה מעבירה דלי מים דרך מסלול — בלי ידיים!',ages:'9+',participants:'6-20',difficulty:2,tags:['מים','צוותי'],subcat:'אמון'},
{name:'מסלול עיוור קבוצתי',cat:'odt',desc:'כל הקבוצה בשורה עם עיניים עצומות. רק הראשון רואה!',ages:'10+',participants:'6-20',difficulty:3,tags:['אמון','תקשורת'],subcat:'אמון'},
{name:'בניית גשר מנייר',cat:'odt',desc:'גשר שמחזיק ספר — מנייר עיתון בלבד! מי בונה הכי חזק?',ages:'9+',participants:'4-20',difficulty:2,tags:['בנייה','הנדסה'],subcat:'בנייה'},
{name:'קיר הטיפוס',cat:'odt',desc:'קיר טיפוס פשוט — כל אחד מטפס עד למעלה! הקבוצה מעודדת.',ages:'10+',participants:'5-20',difficulty:3,tags:['טיפוס','אומץ'],subcat:'טיפוס'},
{name:'מסע אמון',cat:'odt',desc:'5 תחנות אמון: נפילה, הנחיה, נשיאה, חציית מכשול, קפיצה.',ages:'10+',participants:'6-20',difficulty:3,tags:['אמון','מסע'],subcat:'אמון'},
];

for(const g of ng){g.rules=g.rules||R;g.reflection=g.reflection||RF[g.cat]||RF.group;g.levels=g.levels||L;g.mood=g.mood||[]}
const all=[...acts,...ng];

function toJS(o){let p=[];for(const[k,v]of Object.entries(o)){if(Array.isArray(v)){if(v.length>0&&typeof v[0]==='object')p.push(k+':['+v.map(it=>'{'+Object.entries(it).map(([a,b])=>a+':'+JSON.stringify(b).replace(/"/g,"'")).join(',')+'}').join(',')+']');else p.push(k+':['+v.map(i=>"'"+String(i).replace(/'/g,"\\'")+"'").join(',')+']')}else if(typeof v==='number')p.push(k+':'+v);else p.push(k+':'+JSON.stringify(v).replace(/"/g,"'"))}return '{'+p.join(',')+'}'}
const ns='[\n'+all.map(a=>'  '+toJS(a)).join(',\n')+'\n]';
const nj=js.substring(0,sb)+ns+js.substring(e);
fs.writeFileSync('index.html',h.replace(sm[1],nj).replace(/data-count="\d+"/g,'data-count="'+all.length+'"'),'utf8');
console.log('After:',all.length,'| New:',ng.length);
