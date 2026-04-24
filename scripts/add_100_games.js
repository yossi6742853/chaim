const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const scriptMatch = html.match(/<script>([\s\S]*?)<\/script>/);
let js = scriptMatch[1];
const actStart = js.indexOf('const ACTIVITIES = [');
const actStartBracket = js.indexOf('[', actStart);
let depth = 0, actEnd = actStartBracket;
for (let i = actStartBracket; i < js.length; i++) {
  if (js[i] === '[') depth++;
  else if (js[i] === ']') { depth--; if (depth === 0) { actEnd = i + 1; break; } }
}
const acts = eval(js.substring(actStartBracket, actEnd));
console.log('Current:', acts.length);

const L = {
  odt:  [{name:'בסיסי',desc:'חוקים רגילים'},{name:'צוותי',desc:'שני צוותים מתחרים'},{name:'שקט',desc:'בלי לדבר!'},{name:'עיוור',desc:'שחקן מפתח בעיניים עצומות'},{name:'מטורף',desc:'כל החוקים הפוכים!'}],
  energetic: [{name:'חימום',desc:'קצב נוח'},{name:'מהיר',desc:'30 שניות!'},{name:'מראה',desc:'בזוגות סימטריים'},{name:'ענק',desc:'הכל כפול!'},{name:'מטורף',desc:'2 משחקים במקביל!'}],
  thinking: [{name:'פתוח',desc:'בלי מגבלת זמן'},{name:'לחץ',desc:'10 שניות!'},{name:'הפוך',desc:'התשובה ההפוכה'},{name:'צוותי',desc:'רק מנהיג עונה'},{name:'מטורף',desc:'בפנטומימה!'}],
  group: [{name:'היכרות',desc:'גרסה קלה'},{name:'העמקה',desc:'שאלות עמוקות'},{name:'שקט',desc:'בכתב בלבד!'},{name:'מנהיג',desc:'כל סיבוב מנהיג חדש'},{name:'מטורף',desc:'כל 3 דקות החוקים משתנים!'}],
  icebreaker: [{name:'ראשוני',desc:'מפגש ראשון'},{name:'מפתיע',desc:'עובדות מפתיעות'},{name:'תנועה',desc:'+ תנועה פיזית'},{name:'יצירתי',desc:'+ ציור או הצגה'},{name:'מטורף',desc:'מחליפים זהויות!'}],
  fathers: [{name:'חיבור',desc:'שיתוף מלא'},{name:'אתגר',desc:'אתגר פיזי/חשיבתי'},{name:'החלפה',desc:'הבן מוביל!'},{name:'שיא',desc:'תחרות בין זוגות'},{name:'מטורף',desc:'האב בעיניים עצומות!'}],
  outdoor: [{name:'סיור',desc:'הליכה והתבוננות'},{name:'אתגר',desc:'משימות פיזיות'},{name:'הישרדות',desc:'ציוד מינימלי'},{name:'לילי',desc:'בחושך!'},{name:'מטורף',desc:'בלי נעליים!'}],
  classroom: [{name:'שיעורי',desc:'5 דקות'},{name:'הפסקה',desc:'אנרגטי'},{name:'צוותי',desc:'4 קבוצות'},{name:'שקט',desc:'בכתיבה'},{name:'מטורף',desc:'המורה משתתף!'}],
};
const R = {
  odt:'מה למדתם על עצמכם? איך הצוות עזר?',group:'מה הרגשתם? מה למדנו על שיתוף?',
  energetic:'מה היה הכי כיף? מה למדנו?',thinking:'איזו אסטרטגיה עבדה? מה למדנו?',
  icebreaker:'מה גיליתם? מה הפתיע?',fathers:'מה הרגשתם ביחד? איך זה חיזק?',
  outdoor:'מה גיליתם בטבע?',classroom:'מה למדתם? איך הקבוצה עזרה?',
};
const defaultRules = '1. המנחה מסביר את החוקים.\n2. מתחילים ברמה הבסיסית.\n3. כל כמה דקות עולים רמה.\n4. בסוף — שיחת סיכום!';

const newGames = [
  // THINKING
  {name:'מכונת הזמן',cat:'thinking',desc:'כל קבוצה מתארת מה היה קורה אם היו חיים בתקופה אחרת.',ages:'10+',participants:'6-30',difficulty:2,tags:['דמיון','היסטוריה','הצגה']},
  {name:'חידת הנעליים',cat:'thinking',desc:'כל אחד מוריד נעל אחת לערימה — צריך למצוא את הזוג בעיניים עצומות!',ages:'7+',participants:'8-30',difficulty:1,tags:['מישוש','כיף','חשיבה']},
  {name:'מספר חושב',cat:'thinking',desc:'המנחה חושב על מספר 1-100. הקבוצה שואלת ״גדול/קטן?״ — כמה ניסיונות?',ages:'8+',participants:'3-30',difficulty:1,tags:['מספרים','לוגיקה','מהיר']},
  {name:'חקר מקרה',cat:'thinking',desc:'המנחה מתאר ״מקרה״ מסתורי — הקבוצה חוקרת בשאלות כן/לא.',ages:'10+',participants:'5-25',difficulty:2,tags:['חקירה','לוגיקה','מתח']},
  {name:'בנק מילים',cat:'thinking',desc:'קטגוריה + אות — כמה מילים מוצאים ב-30 שניות?',ages:'8+',participants:'3-30',difficulty:1,tags:['מילים','מהירות','תחרות']},
  {name:'חשבון בראש',cat:'thinking',desc:'שרשרת חשבונית: 2+3×4-1... מי זוכר את התוצאה?',ages:'9+',participants:'3-20',difficulty:2,tags:['מתמטיקה','זיכרון','ריכוז']},
  {name:'סדר הגיוני',cat:'thinking',desc:'5 כרטיסים מבולגנים — סדרו אותם לפי הגיון! אבל כל אחד רואה רק כרטיס אחד.',ages:'9+',participants:'5-20',difficulty:2,tags:['לוגיקה','צוותי','תקשורת']},
  {name:'מה היה אם',cat:'thinking',desc:'שאלות ״מה היה אם״ — כל אחד עונה ומסביר. התשובה הכי יצירתית מנצחת!',ages:'9+',participants:'4-25',difficulty:1,tags:['דמיון','יצירתיות','שיחה']},
  {name:'חידת הדלת',cat:'thinking',desc:'3 דלתות, מאחורי אחת פרס. בוחרים, המנחה פותח דלת ריקה — מחליפים?',ages:'10+',participants:'4-20',difficulty:3,tags:['הסתברות','לוגיקה','מפתיע']},
  {name:'מפענח צפנים',cat:'thinking',desc:'כל צוות מקבל הודעה מוצפנת בצופן אחר — ראשון שמפענח מנצח!',ages:'10+',participants:'6-30',difficulty:3,tags:['הצפנה','צוותי','אתגר']},
  {name:'שעון אנושי',cat:'thinking',desc:'12 שחקנים = שעון. המנחה אומר שעה — ה״מחוגים״ צריכים לעמוד נכון!',ages:'8+',participants:'12-30',difficulty:1,tags:['מספרים','תנועה','כיף']},
  {name:'תרגום הפוך',cat:'thinking',desc:'המנחה אומר משפט — צריך לחזור עליו מילה מילה מהסוף!',ages:'9+',participants:'3-20',difficulty:2,tags:['ריכוז','זיכרון','מילים']},

  // ENERGETIC
  {name:'רעידת אדמה',cat:'energetic',desc:'המנחה צועק ״רעידה!״ — כולם צריכים למצוא שותף ולהחזיק. מי שנשאר לבד — בחוץ!',ages:'7+',participants:'10-50',difficulty:1,tags:['תנועה','כיף','מהיר']},
  {name:'מטאור',cat:'energetic',desc:'כדור נזרק לאוויר — כל עוד הוא באוויר, רצים! ברגע שנופל — קופאים!',ages:'7+',participants:'8-40',difficulty:1,tags:['כדור','ריצה','תגובה']},
  {name:'סופר מריו',cat:'energetic',desc:'מסלול מכשולים עם ״קפיצות״ — זחילה, קפיצה, ריצה, סיבוב!',ages:'7+',participants:'5-30',difficulty:1,tags:['מסלול','כיף','אנרגטי']},
  {name:'מרוץ הסרטן',cat:'energetic',desc:'ריצה הצידה! כולם רצים כמו סרטנים — מי מגיע ראשון?',ages:'7+',participants:'5-30',difficulty:1,tags:['מרוץ','כיף','מצחיק']},
  {name:'מחסום אנושי',cat:'energetic',desc:'חצי הקבוצה יוצרת מחסומים — החצי השני צריך לעבור בלי לגעת!',ages:'8+',participants:'10-40',difficulty:1,tags:['תנועה','אתגר','כיף']},
  {name:'מקפצת',cat:'energetic',desc:'קופצים על רגל אחת — מי שנוגע ברצפה ברגל השנייה, בחוץ! אפשר לדחוף!',ages:'8+',participants:'8-30',difficulty:1,tags:['קפיצה','תחרות','איזון']},
  {name:'שרשרת ברקים',cat:'energetic',desc:'שני צוותים בשורות. ״זרם חשמלי״ עובר בלחיצת יד — האחרון תופס חפץ!',ages:'8+',participants:'10-40',difficulty:1,tags:['מהירות','צוותי','ריכוז']},
  {name:'פינגווינים',cat:'energetic',desc:'כדור בין הברכיים — מרוץ הליכה בלי להפיל! מי מגיע ראשון?',ages:'7+',participants:'5-30',difficulty:1,tags:['מרוץ','כיף','איזון']},
  {name:'סערה בים',cat:'energetic',desc:'שני צוותים מושכים שמיכה — כדור עליה. מי שהכדור נופל לצד שלו מפסיד!',ages:'8+',participants:'10-30',difficulty:1,tags:['צוותי','כדור','כיף']},
  {name:'כוח משיכה',cat:'energetic',desc:'שני שחקנים אוחזים ידיים — כל אחד מנסה למשוך את השני מעבר לקו!',ages:'8+',participants:'4-30',difficulty:1,tags:['כוח','תחרות','זוגי']},
  {name:'מרוץ התחפושות',cat:'energetic',desc:'ערימת בגדים — רצים, מתחפשים, חוזרים, מורידים — הבא רץ!',ages:'7+',participants:'8-40',difficulty:1,tags:['מרוץ','כיף','צחוק']},
  {name:'פצצה מתקתקת',cat:'energetic',desc:'כדור = ״פצצה״. מעבירים מהר — מי שמחזיק כשהמנחה צועק ״בום!״ — בחוץ!',ages:'6+',participants:'8-30',difficulty:1,tags:['כדור','מתח','מהיר']},

  // GROUP
  {name:'חבר בלתי נראה',cat:'group',desc:'כל אחד כותב מחמאה אנונימית למישהו — קוראים בקול!',ages:'9+',participants:'5-25',difficulty:1,tags:['חיזוק','אנונימי','חיובי']},
  {name:'דירוג קבוצתי',cat:'group',desc:'הקבוצה צריכה לדרג 10 ערכים מהחשוב ביותר — בלי הצבעה, רק דיון!',ages:'10+',participants:'5-20',difficulty:2,tags:['ערכים','דיון','הסכמה']},
  {name:'מעגל סיפורים',cat:'group',desc:'כל אחד מספר סיפור של דקה על רגע שהשפיע עליו.',ages:'10+',participants:'5-20',difficulty:1,tags:['סיפור','אישי','הקשבה']},
  {name:'מפת הקבוצה',cat:'group',desc:'על נייר גדול — כל אחד מסמן את עצמו ומחבר קווים למי שיש לו קשר.',ages:'9+',participants:'5-25',difficulty:1,tags:['ציור','קשרים','היכרות']},
  {name:'משפט השראה',cat:'group',desc:'כל אחד בוחר משפט שמשפיע עליו — משתף ומסביר למה.',ages:'10+',participants:'4-20',difficulty:1,tags:['השראה','שיחה','ערכים']},
  {name:'תיאטרון פורום',cat:'group',desc:'סצנה מוצגת — הקהל יכול לעצור ולהחליף שחקן כדי לשנות את התוצאה!',ages:'10+',participants:'8-30',difficulty:2,tags:['הצגה','דיון','פתרון']},
  {name:'קיר הביטויים',cat:'group',desc:'כל אחד כותב ביטוי/פתגם על פתק — תולים על הקיר ודנים.',ages:'9+',participants:'5-30',difficulty:1,tags:['כתיבה','דיון','ערכים']},
  {name:'מנהיג סמוי',cat:'group',desc:'אחד יוצא. הקבוצה בוחרת ״מנהיג״ שעושה תנועות. מי שיצא צריך לגלות מי מוביל!',ages:'8+',participants:'8-30',difficulty:1,tags:['תצפית','כיף','חשיבה']},
  {name:'שיחת רכבת',cat:'group',desc:'זוגות יושבים פנים אל פנים. כל דקה — מחליפים שותף! 5 שיחות קצרות.',ages:'9+',participants:'10-30',difficulty:1,tags:['שיחה','היכרות','מהיר']},
  {name:'פרויקט משותף',cat:'group',desc:'כל הקבוצה בונה משהו אחד ביחד — ב-10 דקות בלבד!',ages:'8+',participants:'8-30',difficulty:2,tags:['בנייה','שיתוף','יצירתיות']},
  {name:'כובע המחשבות',cat:'group',desc:'כובע עם שאלות — כל אחד שולף שאלה ועונה. שאלות מפתיעות!',ages:'9+',participants:'4-25',difficulty:1,tags:['שאלות','כיף','היכרות']},
  {name:'אני מאמין',cat:'group',desc:'כל אחד משתף אמונה/ערך שחשוב לו — ״אני מאמין ש...״',ages:'10+',participants:'4-20',difficulty:2,tags:['ערכים','עומק','שיתוף']},

  // ICEBREAKER
  {name:'מצא מישהו ש...',cat:'icebreaker',desc:'רשימת תכונות — צריך למצוא מישהו בקבוצה שמתאים לכל אחת!',ages:'7+',participants:'10-40',difficulty:1,tags:['היכרות','תנועה','כיף']},
  {name:'שם + מאכל',cat:'icebreaker',desc:'כל אחד אומר שמו + מאכל שמתחיל באותה אות. צריך לזכור את כולם!',ages:'7+',participants:'5-25',difficulty:1,tags:['היכרות','זיכרון','כיף']},
  {name:'2 מעגלים',cat:'icebreaker',desc:'מעגל פנימי + חיצוני. פנים אל פנים — שאלה, תשובה, מסתובבים!',ages:'8+',participants:'10-40',difficulty:1,tags:['היכרות','שיחה','תנועה']},
  {name:'מטבע זהב',cat:'icebreaker',desc:'כולם עוצמים עיניים. אחד מחביא ״מטבע״ — פותחים עיניים ומחפשים!',ages:'6+',participants:'5-30',difficulty:1,tags:['חיפוש','כיף','ריכוז']},
  {name:'אות ראשונה',cat:'icebreaker',desc:'כל אחד אומר 3 מילים שמתחילות באות הראשונה של שמו — שמתארות אותו!',ages:'8+',participants:'4-25',difficulty:1,tags:['היכרות','יצירתיות','מילים']},
  {name:'עולם מושלם',cat:'icebreaker',desc:'אם היית יכול לשנות דבר אחד בעולם — מה? כל אחד משתף.',ages:'9+',participants:'4-25',difficulty:1,tags:['שיחה','דמיון','היכרות']},
  {name:'חפץ מהכיס',cat:'icebreaker',desc:'כל אחד מוציא חפץ מהכיס ומספר עליו סיפור — אמיתי או בדוי!',ages:'8+',participants:'4-20',difficulty:1,tags:['סיפור','כיף','היכרות']},
  {name:'סטטוס',cat:'icebreaker',desc:'כל אחד כותב ״סטטוס״ של משפט אחד שמתאר את מצב הרוח שלו.',ages:'9+',participants:'4-30',difficulty:1,tags:['רגש','שיתוף','קצר']},

  // FATHERS
  {name:'ראיון הדדי',cat:'fathers',desc:'אב מראיין את הבן, בן מראיין את האב — 5 שאלות שמעולם לא שאלתם!',ages:'9-13',participants:'זוגות',difficulty:1,tags:['שיחה','חיבור','היכרות']},
  {name:'תמונה משותפת',cat:'fathers',desc:'אב ובן מציירים ציור אחד — כל אחד מצייר 30 שניות ומחליפים!',ages:'8-13',participants:'זוגות',difficulty:1,tags:['ציור','שיתוף','כיף']},
  {name:'זיכרונות',cat:'fathers',desc:'כל אחד משתף זיכרון מהילדות. האב — זיכרון שלו, הבן — זיכרון שלו.',ages:'9-13',participants:'זוגות',difficulty:1,tags:['סיפור','חיבור','רגש']},
  {name:'אתגר דקה אב-בן',cat:'fathers',desc:'10 אתגרים של דקה — אב ובן ביחד נגד השעון!',ages:'8-13',participants:'זוגות',difficulty:1,tags:['מהיר','כיף','תחרות']},
  {name:'בניית דחליל',cat:'fathers',desc:'אב ובן בונים דחליל מחומרים שמוצאים בטבע — מי הכי מצחיק?',ages:'8-13',participants:'זוגות',difficulty:1,tags:['בנייה','יצירתיות','טבע']},

  // OUTDOOR
  {name:'מסע עיוור בטבע',cat:'outdoor',desc:'10 דקות הליכה בעיניים עצומות בטבע — מחזיקים חבל. מה שומעים?',ages:'9+',participants:'5-25',difficulty:2,tags:['חושים','שקט','טבע']},
  {name:'בניית מלכודת מים',cat:'outdoor',desc:'בונים מערכת מים מענפים ואבנים — מי מעביר הכי הרבה מים?',ages:'9+',participants:'4-20',difficulty:2,tags:['בנייה','מים','יצירתיות']},
  {name:'חפירת אוצר',cat:'outdoor',desc:'המנחה חבא חפצים — כל צוות מקבל מפת אוצר ומחפש!',ages:'8+',participants:'6-30',difficulty:1,tags:['חיפוש','שטח','כיף']},
  {name:'סלע הקפטן',cat:'outdoor',desc:'סלע גדול = ״הספינה״. הקפטן נותן פקודות — כולם על ״הסלע״!',ages:'8+',participants:'5-25',difficulty:1,tags:['שטח','כיף','תנועה']},
  {name:'אוריינטירינג מיני',cat:'outdoor',desc:'ניווט עם מצפן ומפה — 5 תחנות בשטח קטן. מי מסיים ראשון?',ages:'10+',participants:'4-20',difficulty:2,tags:['ניווט','תחרות','שטח']},
  {name:'יער הפלאות',cat:'outdoor',desc:'כל עץ = תחנה עם משימה. 10 עצים, 10 משימות, 30 דקות!',ages:'8+',participants:'4-25',difficulty:1,tags:['שטח','משימות','הרפתקה']},
  {name:'גשר קרשים',cat:'outdoor',desc:'3 קרשים — צריך לחצות ״נהר״ בלי לגעת ברצפה!',ages:'8+',participants:'5-20',difficulty:2,tags:['אתגר','צוותי','תכנון']},

  // CLASSROOM
  {name:'כדור שאלות',cat:'classroom',desc:'זורקים כדור — מי שתופס שואל שאלה על החומר. לא יודע? זורק הלאה!',ages:'8+',participants:'10-35',difficulty:1,tags:['כדור','לימוד','כיף']},
  {name:'זוגות חושבים',cat:'classroom',desc:'שאלה על הלוח — דקה לחשוב לבד, דקה להתייעץ בזוג, תשובה לכיתה.',ages:'9+',participants:'10-35',difficulty:1,tags:['חשיבה','זוגי','לימוד']},
  {name:'מילת קסם',cat:'classroom',desc:'מילה מהשיעור — כל פעם ששומעים אותה, צריך לקום ולשבת!',ages:'7+',participants:'10-35',difficulty:1,tags:['הקשבה','תנועה','לימוד']},
  {name:'תחנות לימוד',cat:'classroom',desc:'4 תחנות בכיתה — כל תחנה עם פעילות אחרת. מחליפים כל 5 דקות!',ages:'8+',participants:'10-35',difficulty:1,tags:['לימוד','מגוון','צוותי']},
  {name:'פאזל קבוצתי',cat:'classroom',desc:'כל צוות מקבל חלק מפאזל ידע — רק ביחד יש תמונה שלמה!',ages:'9+',participants:'10-35',difficulty:2,tags:['צוותי','לימוד','שיתוף']},
  {name:'מנטור מיני',cat:'classroom',desc:'מי שהבין מלמד את מי שלא — כל אחד גם תלמיד וגם מורה!',ages:'9+',participants:'10-35',difficulty:1,tags:['לימוד','עזרה','שיתוף']},
  {name:'משחק הלוח',cat:'classroom',desc:'לוח מחולק למשבצות — כל משבצת = שאלה. זורקים קוביה ומתקדמים!',ages:'8+',participants:'10-35',difficulty:1,tags:['לוח','חידון','כיף']},
  {name:'טורניר ידע',cat:'classroom',desc:'טורניר נוקאאוט — זוגות נלחמים בשאלות. מנצח ממשיך!',ages:'9+',participants:'10-35',difficulty:2,tags:['תחרות','לימוד','מתח']},

  // ODT
  {name:'מסלול עכביש',cat:'odt',desc:'רשת חבלים — כל אחד עובר דרך חור אחר. חור שנוצל לא חוזר!',ages:'9+',participants:'6-20',difficulty:2,tags:['חבל','צוותי','תכנון']},
  {name:'גלגל המזל',cat:'odt',desc:'גלגל ענק עם אתגרים — מסובבים ועושים את מה שיוצא!',ages:'8+',participants:'5-30',difficulty:1,tags:['אתגר','כיף','הפתעה']},
  {name:'מסע עיוור קבוצתי',cat:'odt',desc:'כל הקבוצה בשורה, עיניים עצומות. רק הראשון רואה — מנווט את כולם!',ages:'10+',participants:'6-20',difficulty:3,tags:['אמון','תקשורת','אתגר']},
  {name:'מגדל אנושי',cat:'odt',desc:'הקבוצה בונה מגדל אנושי — כמה קומות תצליחו?',ages:'12+',participants:'8-20',difficulty:3,tags:['כוח','אמון','צוותי']},
  {name:'חציית הנהר',cat:'odt',desc:'״נהר״ על הרצפה — רק 3 לוחות לחצות! כל הקבוצה ביחד.',ages:'8+',participants:'6-20',difficulty:2,tags:['תכנון','צוותי','אתגר']},
];

for (const g of newGames) {
  if (!g.rules) g.rules = defaultRules;
  if (!g.reflection) g.reflection = R[g.cat] || R.group;
  if (!g.levels) g.levels = (L[g.cat] || L.group).slice(0, 5);
  if (!g.mood) g.mood = [];
}

const allGames = [...acts, ...newGames];
console.log('New total:', allGames.length);

function toJS(obj) {
  let parts = [];
  for (const [k, v] of Object.entries(obj)) {
    if (Array.isArray(v)) {
      if (v.length > 0 && typeof v[0] === 'object') {
        parts.push(k + ':[' + v.map(item => '{' + Object.entries(item).map(([ik,iv]) => ik + ':' + JSON.stringify(iv).replace(/"/g, "'")).join(',') + '}').join(',') + ']');
      } else {
        parts.push(k + ':[' + v.map(i => "'" + String(i).replace(/'/g, "\\'") + "'").join(',') + ']');
      }
    } else if (typeof v === 'number') {
      parts.push(k + ':' + v);
    } else {
      parts.push(k + ':' + JSON.stringify(v).replace(/"/g, "'"));
    }
  }
  return '{' + parts.join(',') + '}';
}

const newSection = '[\n' + allGames.map(a => '  ' + toJS(a)).join(',\n') + '\n]';
const newJs = js.substring(0, actStartBracket) + newSection + js.substring(actEnd);
const newHtml = html.replace(scriptMatch[1], newJs).replace(/data-count="\d+"/g, 'data-count="' + allGames.length + '"');
fs.writeFileSync('index.html', newHtml, 'utf8');
console.log('Saved!');
