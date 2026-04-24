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

const R = {
  odt: 'מה למדתם על עצמכם? איך עבודת הצוות עזרה?',
  group: 'מה הרגשתם? מה למדתם על שיתוף פעולה?',
  energetic: 'מה היה הכי כיף? מה למדתם על עצמכם?',
  thinking: 'איזו אסטרטגיה עבדה? מה למדתם על חשיבה יצירתית?',
  icebreaker: 'מה גיליתם על חברים? מה הפתיע?',
  fathers: 'מה הרגשתם ביחד? איך החוויה חיזקה את הקשר?',
  outdoor: 'מה גיליתם בטבע? מה למדתם על עצמכם?',
  classroom: 'מה למדתם? איך העבודה בקבוצה עזרה?',
};

const newGames = [
  {name:'מיליונר',cat:'thinking',desc:'חידון עם 4 תשובות — שאלות הולכות וקשות!',ages:'9+',participants:'5-30',difficulty:2,tags:['חידון','חשיבה','תחרות'],levels:[{name:'קל',desc:'שאלות קלות'},{name:'בינוני',desc:'שאלות + מגבלת זמן'},{name:'מאתגר',desc:'שאלות קשות בלי עזרה!'}]},
  {name:'קישורים',cat:'thinking',desc:'שתי מילים — מצאו את הקשר! מי שמוצא ראשון מנצח.',ages:'9+',participants:'4-25',difficulty:2,tags:['חשיבה','יצירתיות','מהיר'],levels:[{name:'קל',desc:'קשרים ברורים'},{name:'בינוני',desc:'קשרים מפתיעים'},{name:'מאתגר',desc:'3 מילים + קשר אחד!'}]},
  {name:'דומינו אנושי',cat:'group',desc:'כולם בשורה — נופלים אחד על השני כמו דומינו!',ages:'8+',participants:'10-40',difficulty:1,tags:['צוותי','כיף','אמון'],levels:[{name:'קל',desc:'נפילה איטית'},{name:'בינוני',desc:'נפילה מהירה'},{name:'מאתגר',desc:'גל חוזר!'}]},
  {name:'מפיון',cat:'energetic',desc:'הורידו את הכובע מהראש של השני — בלי שיורידו לכם!',ages:'8+',participants:'8-30',difficulty:1,tags:['כיף','תחרות','מהירות'],levels:[{name:'קל',desc:'זוגות'},{name:'בינוני',desc:'כולם נגד כולם'},{name:'מאתגר',desc:'3 כובעים = 3 חיים!'}]},
  {name:'קולות בטבע',cat:'outdoor',desc:'עוצמים עיניים בטבע — מזהים כמה צלילים שונים.',ages:'7+',participants:'3-25',difficulty:1,tags:['טבע','שקט','הקשבה'],levels:[{name:'קל',desc:'דקה, 3 צלילים'},{name:'בינוני',desc:'3 דקות, 7 צלילים'},{name:'מאתגר',desc:'5 דקות + ציור!'}]},
  {name:'חבל קפיצה ענק',cat:'energetic',desc:'שניים מסובבים חבל ענק — כמה קופצים ביחד?',ages:'7+',participants:'5-30',difficulty:1,tags:['קפיצה','צוותי','כיף'],levels:[{name:'קל',desc:'אחד קופץ'},{name:'בינוני',desc:'3 ביחד'},{name:'מאתגר',desc:'5+ ביחד + שירה!'}]},
  {name:'כתבו ביחד',cat:'classroom',desc:'כל הכיתה כותבת סיפור — כל אחד מוסיף שורה!',ages:'8+',participants:'10-35',difficulty:1,tags:['כתיבה','יצירתיות','שיתוף'],levels:[{name:'קל',desc:'שורה חופשית'},{name:'בינוני',desc:'שורה על נושא'},{name:'מאתגר',desc:'שורה שחורזת!'}]},
  {name:'תיבת הזמן',cat:'group',desc:'כל אחד שם חפץ בתיבה — נפתח בעוד שנה!',ages:'9+',participants:'5-25',difficulty:1,tags:['רפלקציה','זיכרון','אישי'],levels:[{name:'קל',desc:'חפץ + משפט'},{name:'בינוני',desc:'חפץ + מכתב'},{name:'מאתגר',desc:'חפץ + מכתב + תחזית!'}]},
  {name:'פינג פונג מילים',cat:'thinking',desc:'מילה מול מילה, מהר! מי נתקע ראשון?',ages:'8+',participants:'2-20',difficulty:1,tags:['מילים','מהירות','כיף'],levels:[{name:'קל',desc:'מילים חופשיות'},{name:'בינוני',desc:'מילים בקטגוריה'},{name:'מאתגר',desc:'אות אחרונה = אות ראשונה!'}]},
  {name:'גשר אנושי',cat:'odt',desc:'הקבוצה יוצרת גשר אנושי — ושחקן עובר עליו!',ages:'12+',participants:'8-20',difficulty:3,tags:['כוח','אמון','צוותי'],levels:[{name:'קל',desc:'גשר ישר'},{name:'בינוני',desc:'גשר ארוך'},{name:'מאתגר',desc:'מעבר בעיניים עצומות!'}]},
  {name:'ספר טלפונים',cat:'icebreaker',desc:'מי שמגלה עובדה זהה — מתחבר! כמה חיבורים תמצאו?',ages:'8+',participants:'8-30',difficulty:1,tags:['היכרות','כיף','חיבור'],levels:[{name:'קל',desc:'עובדות בסיסיות'},{name:'בינוני',desc:'עובדות מפתיעות'},{name:'מאתגר',desc:'3 אנשים עם אותה עובדה!'}]},
  {name:'מירוץ ידע',cat:'classroom',desc:'עונה נכון — צעד קדימה! ראשון שמגיע לקו מנצח!',ages:'9+',participants:'10-35',difficulty:1,tags:['חידון','ריצה','לימוד'],levels:[{name:'קל',desc:'שאלות מהשיעור'},{name:'בינוני',desc:'שאלות מהפרשה'},{name:'מאתגר',desc:'שאלות + אתגר פיזי!'}]},
  {name:'ציד תמונות',cat:'outdoor',desc:'רשימת דברים לצלם בטבע — מי מוצא ומצלם הכי מהר?',ages:'9+',participants:'4-30',difficulty:1,tags:['טבע','צילום','הרפתקה'],levels:[{name:'קל',desc:'5 דברים'},{name:'בינוני',desc:'10 דברים + חידות'},{name:'מאתגר',desc:'15 דברים + יצירתיות!'}]},
  {name:'בלון באוויר',cat:'energetic',desc:'הבלון לא יכול ליפול! כמה זמן הקבוצה מחזיקה?',ages:'6+',participants:'5-30',difficulty:1,tags:['בלון','צוותי','כיף'],levels:[{name:'קל',desc:'בלון אחד, ידיים'},{name:'בינוני',desc:'בלון אחד, רק ראש!'},{name:'מאתגר',desc:'3 בלונים!'}]},
  {name:'שמות מפורסמים',cat:'icebreaker',desc:'שם על המצח — גלה מי אתה בשאלות כן/לא!',ages:'9+',participants:'5-25',difficulty:1,tags:['היכרות','כיף','חשיבה'],levels:[{name:'קל',desc:'דמויות מהתנ״ך'},{name:'בינוני',desc:'חכמי ישראל'},{name:'מאתגר',desc:'מושגים תורניים!'}]},
  {name:'שרשרת חיבוקים',cat:'icebreaker',desc:'כל סיבוב — קבוצות בגודל שונה. מי נשאר בחוץ?',ages:'7+',participants:'10-50',difficulty:1,tags:['תנועה','כיף','היכרות'],levels:[{name:'קל',desc:'קבוצות של 3'},{name:'בינוני',desc:'מספרים מתחלפים'},{name:'מאתגר',desc:'קבוצות + משימה!'}]},
  {name:'כרטיס ביקור',cat:'icebreaker',desc:'כל אחד מכין כרטיס ביקור יצירתי ומציג — מי זכיר ביותר?',ages:'9+',participants:'5-25',difficulty:1,tags:['יצירתיות','היכרות','הצגה'],levels:[{name:'קל',desc:'שם + ציור'},{name:'בינוני',desc:'שם + 3 עובדות + ציור'},{name:'מאתגר',desc:'שם + סלוגן + לוגו!'}]},
  {name:'משפט אחד',cat:'group',desc:'כל אחד מסכם את עצמו במשפט אחד — מי הכי יצירתי?',ages:'10+',participants:'5-30',difficulty:1,tags:['כתיבה','חשיבה','היכרות'],levels:[{name:'קל',desc:'משפט חופשי'},{name:'בינוני',desc:'בדיוק 7 מילים'},{name:'מאתגר',desc:'3 מילים בלבד!'}]},
  {name:'חידון צלילים',cat:'thinking',desc:'המנחה משמיע צלילים — מי מזהה ראשון?',ages:'7+',participants:'5-30',difficulty:1,tags:['הקשבה','ניחוש','כיף'],levels:[{name:'קל',desc:'צלילי חיות'},{name:'בינוני',desc:'צלילים מהטבע'},{name:'מאתגר',desc:'צלילים + מיקום!'}]},
  {name:'ארכיטקט עיוור',cat:'group',desc:'אחד מתאר בניין — השני בונה ממקלות בלי לראות!',ages:'9+',participants:'4-20',difficulty:2,tags:['תקשורת','בנייה','כיף'],levels:[{name:'קל',desc:'צורה פשוטה'},{name:'בינוני',desc:'מבנה מורכב'},{name:'מאתגר',desc:'מתאר רק ב-10 מילים!'}]},
  {name:'מסר בשרשרת',cat:'group',desc:'הודעה עוברת בשרשרת — אבל כל אחד מוסיף מילה!',ages:'8+',participants:'8-30',difficulty:1,tags:['תקשורת','כיף','זיכרון'],levels:[{name:'קל',desc:'הודעה קצרה'},{name:'בינוני',desc:'הודעה ארוכה'},{name:'מאתגר',desc:'הודעה + תנועה!'}]},
  {name:'קלף חושף',cat:'group',desc:'כל קלף מגלה שאלה אישית — שותפים עם הקבוצה.',ages:'10+',participants:'4-20',difficulty:2,tags:['שיחה','היכרות','עומק'],levels:[{name:'קל',desc:'שאלות קלות'},{name:'בינוני',desc:'שאלות עמוקות'},{name:'מאתגר',desc:'שאלות + סיפור אישי!'}]},
  {name:'משימה בחושך',cat:'odt',desc:'משימה קבוצתית בחושך מוחלט — רק קול ומגע!',ages:'10+',participants:'6-20',difficulty:3,tags:['חושך','אמון','אתגר'],levels:[{name:'קל',desc:'חדר חשוך, משימה פשוטה'},{name:'בינוני',desc:'מסלול בחושך'},{name:'מאתגר',desc:'בניית מבנה בחושך!'}]},
  {name:'ריצת אותיות',cat:'energetic',desc:'המנחה קורא מילה — רצים לאותיות פזורות והרכיבו!',ages:'8+',participants:'10-40',difficulty:1,tags:['ריצה','אותיות','כיף'],levels:[{name:'קל',desc:'מילים של 3 אותיות'},{name:'בינוני',desc:'מילים של 5 אותיות'},{name:'מאתגר',desc:'משפטים שלמים!'}]},
  {name:'בונקר',cat:'energetic',desc:'שני צוותים, כל אחד בבונקר — זורקים כדורים רכים!',ages:'8+',participants:'10-40',difficulty:1,tags:['זריקה','צוותי','תחרות'],levels:[{name:'קל',desc:'כדור אחד'},{name:'בינוני',desc:'3 כדורים'},{name:'מאתגר',desc:'5 כדורים + רופאים!'}]},
  {name:'גומיות',cat:'odt',desc:'גומייה ענקית — הקבוצה מותחת ביחד ומבצעת משימות!',ages:'8+',participants:'8-30',difficulty:1,tags:['צוותי','כיף','קואורדינציה'],levels:[{name:'קל',desc:'מתיחה ביחד'},{name:'בינוני',desc:'הרמת כדור'},{name:'מאתגר',desc:'העברת כדור דרך מסלול!'}]},
];

// Add missing fields
for (const g of newGames) {
  if (!g.rules) g.rules = '1. המנחה מסביר את החוקים.\n2. מתחילים ברמה הקלה.\n3. עולים לרמה הבאה.\n4. בסוף — רפלקציה!';
  if (!g.reflection) g.reflection = R[g.cat] || R.group;
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
const newHtml = html.replace(scriptMatch[1], newJs);
fs.writeFileSync('index.html', newHtml, 'utf8');
console.log('Saved!');
