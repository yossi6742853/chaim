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

// ===== UPGRADE: 5 levels per game instead of 3, with creative variations =====
const levelTemplates = {
  odt: [
    {name:'בסיסי',desc:'חוקים רגילים, קצב נוח'},
    {name:'צוותי',desc:'מחלקים לשני צוותים מתחרים'},
    {name:'שקט',desc:'כל המשחק בלי לדבר — רק סימנים!'},
    {name:'עיוור',desc:'שחקן מפתח עם עיניים עצומות'},
    {name:'מטורף',desc:'כל החוקים הפוכים! ימין=שמאל, כן=לא'}
  ],
  energetic: [
    {name:'חימום',desc:'קצב איטי, כולם משתתפים'},
    {name:'מהיר',desc:'ספירה לאחור — 30 שניות!'},
    {name:'מראה',desc:'כל פעולה צריכה להיעשות בזוגות סימטריים'},
    {name:'ענק',desc:'כל המרחקים כפולים, כל המהירויות כפולות'},
    {name:'מטורף',desc:'2 משחקים רצים במקביל על אותו מגרש!'}
  ],
  thinking: [
    {name:'פתוח',desc:'חשיבה חופשית, בלי מגבלת זמן'},
    {name:'לחץ',desc:'10 שניות בלבד לכל תשובה!'},
    {name:'הפוך',desc:'התשובה הנכונה היא דווקא ההפוכה'},
    {name:'צוותי',desc:'כל צוות מתייעץ — רק מנהיג עונה'},
    {name:'מטורף',desc:'כל שאלה שנייה — בפנטומימה בלי מילים!'}
  ],
  group: [
    {name:'היכרות',desc:'גרסה קלה, כולם מתחילים להכיר'},
    {name:'העמקה',desc:'שאלות יותר אישיות ועמוקות'},
    {name:'שקט',desc:'כל המשחק בכתב — בלי לדבר!'},
    {name:'מנהיג',desc:'כל סיבוב מנהיג אחר מוביל'},
    {name:'מטורף',desc:'כל 3 דקות — החוקים משתנים!'}
  ],
  icebreaker: [
    {name:'ראשוני',desc:'מתאים למפגש ראשון, קל ונעים'},
    {name:'מפתיע',desc:'כל אחד מגלה עובדה מפתיעה'},
    {name:'תנועה',desc:'מוסיפים תנועה פיזית לכל שלב'},
    {name:'יצירתי',desc:'משלבים ציור או הצגה'},
    {name:'מטורף',desc:'כל אחד מחליף זהות עם מישהו אחר!'}
  ],
  fathers: [
    {name:'חיבור',desc:'אב ובן עובדים צמוד, שיתוף מלא'},
    {name:'אתגר',desc:'מוסיפים אתגר פיזי או חשיבתי'},
    {name:'החלפה',desc:'הבן מוביל, האב עוקב!'},
    {name:'שיא',desc:'תחרות בין זוגות אב-בן'},
    {name:'מטורף',desc:'האב בעיניים עצומות, הבן מנהל הכל!'}
  ],
  outdoor: [
    {name:'סיור',desc:'הליכה קלה, התבוננות'},
    {name:'אתגר',desc:'משימות פיזיות בשטח'},
    {name:'הישרדות',desc:'ציוד מינימלי, מסתדרים עם מה שיש'},
    {name:'לילי',desc:'אותו דבר — בחושך!'},
    {name:'מטורף',desc:'בלי נעליים! חיבור ישיר לאדמה'}
  ],
  classroom: [
    {name:'שיעורי',desc:'משתלב בשיעור, 5 דקות'},
    {name:'הפסקה',desc:'לפני/אחרי הפסקה, אנרגטי'},
    {name:'צוותי',desc:'מחלקים את הכיתה ל-4 קבוצות'},
    {name:'שקט',desc:'כל המשחק בכתיבה — שקט מוחלט'},
    {name:'מטורף',desc:'המורה משתתף כשחקן רגיל!'}
  ],
};

// Tags for game mood/situation
const moodTags = ['לפתיחה','לגיבוש','לסיום','לאנרגיה','להרגעה','לחשיבה','לשבת','לחופש','למסיבה','לכיתה'];

// Upgrade each game with 5 levels and mood tags
let upgraded = 0;
for (const game of acts) {
  // Replace 3 levels with 5 creative levels
  const templates = levelTemplates[game.cat] || levelTemplates.group;

  // Keep first 3 original levels if they exist and are specific to this game
  // But add 2 more creative ones
  if (game.levels && game.levels.length === 3) {
    game.levels.push(templates[3]); // Add "special" level
    game.levels.push(templates[4]); // Add "crazy" level
    upgraded++;
  } else if (!game.levels || game.levels.length < 3) {
    game.levels = templates.slice(0, 5);
    upgraded++;
  }

  // Add mood/situation tags
  if (!game.mood) {
    const moods = [];
    if (game.difficulty <= 1) moods.push('לפתיחה','לשבת');
    if (game.difficulty >= 2) moods.push('לגיבוש');
    if (game.cat === 'energetic') moods.push('לאנרגיה');
    if (game.cat === 'thinking') moods.push('לחשיבה');
    if (game.cat === 'icebreaker') moods.push('לפתיחה','להיכרות');
    if (game.cat === 'classroom') moods.push('לכיתה');
    if (game.cat === 'outdoor') moods.push('לחופש','לטיול');
    if (game.cat === 'fathers') moods.push('לאב-בן');
    if (game.name.includes('שקט') || game.name.includes('דממה')) moods.push('להרגעה');
    game.mood = moods.slice(0, 3);
  }
}
console.log('Upgraded levels:', upgraded);

// ===== ADD 100 NEW GAMES =====
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

const defaultRules = '1. המנחה מסביר את החוקים.\n2. מתחילים ברמה הבסיסית.\n3. כל כמה דקות עולים רמה.\n4. בסוף — שיחת סיכום!';

const newGames = [
  // === THINKING GAMES ===
  {name:'תיבת הסודות',cat:'thinking',desc:'כל שחקן כותב סוד על פתק — הקבוצה מנחשת למי שייך כל סוד.',ages:'10+',participants:'5-25',difficulty:2,tags:['חשיבה','היכרות','כיף'],mood:['לגיבוש','להיכרות']},
  {name:'מילה מסתורית',cat:'thinking',desc:'המנחה חושב על מילה — נותן רמזים עד שמישהו מנחש.',ages:'8+',participants:'4-30',difficulty:1,tags:['ניחוש','חשיבה','מהיר'],mood:['לפתיחה','לכיתה']},
  {name:'חשבון מטורף',cat:'thinking',desc:'המנחה אומר מספר — הקבוצה צריכה להגיע אליו עם חיבור, חיסור, כפל.',ages:'9+',participants:'3-20',difficulty:2,tags:['מתמטיקה','חשיבה','תחרות'],mood:['לכיתה','לחשיבה']},
  {name:'הבלש',cat:'thinking',desc:'אחד ״עשה פשע״ — הקבוצה חוקרת ב-10 שאלות בלבד!',ages:'10+',participants:'5-20',difficulty:2,tags:['חקירה','חשיבה','מתח'],mood:['לגיבוש']},
  {name:'מילים מבולבלות',cat:'thinking',desc:'אותיות מעורבבות — מי מפענח את המילה ראשון?',ages:'8+',participants:'3-30',difficulty:1,tags:['מילים','מהירות','חשיבה'],mood:['לכיתה','לפתיחה']},
  {name:'סיפור מספרים',cat:'thinking',desc:'כל מספר מייצג אות — פענחו את ההודעה הסודית!',ages:'9+',participants:'4-20',difficulty:3,tags:['הצפנה','חשיבה','צוותי'],mood:['לגיבוש','לחשיבה']},
  {name:'חידת הדקה',cat:'thinking',desc:'חידה חדשה כל דקה — מי פותר הכי הרבה?',ages:'9+',participants:'3-30',difficulty:2,tags:['חידות','מהירות','תחרות'],mood:['לכיתה']},
  {name:'טלפון שבור ציורי',cat:'thinking',desc:'אחד מצייר, הבא כותב מה הוא רואה, הבא מצייר את מה שכתוב — מה יצא בסוף?',ages:'8+',participants:'6-20',difficulty:1,tags:['ציור','כיף','תקשורת'],mood:['לפתיחה','לכיתה']},
  {name:'3 רמזים',cat:'thinking',desc:'3 רמזים לכל מילה — מי מנחש עם הכי פחות רמזים מנצח!',ages:'8+',participants:'4-25',difficulty:1,tags:['ניחוש','חשיבה','תחרות'],mood:['לכיתה','לפתיחה']},
  {name:'מה ההבדל?',cat:'thinking',desc:'שתי תמונות/תיאורים כמעט זהים — מצאו 5 הבדלים!',ages:'7+',participants:'3-30',difficulty:1,tags:['תצפית','חשיבה','ריכוז'],mood:['לכיתה','להרגעה']},

  // === ENERGETIC GAMES ===
  {name:'סופת רעמים',cat:'energetic',desc:'כולם רוקעים ברגליים, מוחאים כפיים, שורקים — יוצרים סופה!',ages:'6+',participants:'10-50',difficulty:1,tags:['אנרגיה','כיף','קבוצתי'],mood:['לפתיחה','לאנרגיה']},
  {name:'רובוט מרוצה',cat:'energetic',desc:'שני שחקנים ״רובוטים״ — הולכים ישר עד שנוגעים בקיר, אז מסתובבים!',ages:'7+',participants:'8-30',difficulty:1,tags:['ריצה','כיף','אנרגטי'],mood:['לאנרגיה']},
  {name:'מלך ההר',cat:'energetic',desc:'גבעה קטנה — מי שנשאר למעלה הוא המלך!',ages:'8+',participants:'8-30',difficulty:2,tags:['כוח','תחרות','שטח'],mood:['לאנרגיה','לגיבוש']},
  {name:'משלוח מנות',cat:'energetic',desc:'שליחויות עם חפצים — כל שליח רץ ומעביר לשליח הבא!',ages:'7+',participants:'10-40',difficulty:1,tags:['ריצה','צוותי','כיף'],mood:['לאנרגיה']},
  {name:'קפוץ או שכב',cat:'energetic',desc:'המנחה צועק ״קפוץ!״ או ״שכב!״ — מי שטועה, בחוץ!',ages:'6+',participants:'8-50',difficulty:1,tags:['תגובה','כיף','מהיר'],mood:['לפתיחה','לאנרגיה']},
  {name:'גלגל ענק',cat:'energetic',desc:'כולם מחזיקים ידיים במעגל — הגלגל צריך להסתובב בלי להיפרד!',ages:'8+',participants:'10-40',difficulty:1,tags:['צוותי','תנועה','כיף'],mood:['לאנרגיה','לגיבוש']},
  {name:'מרוץ אחורה',cat:'energetic',desc:'מרוץ — אבל כולם רצים אחורה! מי שמסתובב מפסיד.',ages:'7+',participants:'5-30',difficulty:1,tags:['מרוץ','כיף','אתגר'],mood:['לאנרגיה','לכיף']},
  {name:'כדור רעל',cat:'energetic',desc:'כדור נזרק — מי שנפגע ״מורעל״ ועומד במקום. חבר יכול ״לרפא״ בנגיעה!',ages:'7+',participants:'10-40',difficulty:1,tags:['כדור','ריצה','צוותי'],mood:['לאנרגיה']},
  {name:'אי קטן',cat:'energetic',desc:'עיתון על הרצפה = אי. כל סיבוב האי מתכווץ — מי נשאר?',ages:'7+',participants:'8-40',difficulty:1,tags:['שיתוף','כיף','אתגר'],mood:['לגיבוש','לכיף']},
  {name:'זומבים',cat:'energetic',desc:'3 ״זומבים״ הולכים לאט — אם נוגעים בך אתה הופך לזומבי!',ages:'7+',participants:'10-50',difficulty:1,tags:['ריצה','כיף','מתח'],mood:['לאנרגיה','לכיף']},

  // === GROUP GAMES ===
  {name:'דילמה',cat:'group',desc:'המנחה מציג דילמה — הקבוצה מצביעה ומסבירה.',ages:'10+',participants:'5-30',difficulty:2,tags:['דיון','ערכים','חשיבה'],mood:['לגיבוש','לחשיבה']},
  {name:'פסל אנושי',cat:'group',desc:'צוות מפסל אחד מהם לפי נושא — ״שמחה״, ״אומץ״, ״אחדות״.',ages:'9+',participants:'8-30',difficulty:1,tags:['יצירתיות','הצגה','כיף'],mood:['לגיבוש']},
  {name:'רדיו קבוצתי',cat:'group',desc:'כל צוות מכין תוכנית רדיו של 3 דקות — חדשות, מזג אוויר, ראיון!',ages:'10+',participants:'8-30',difficulty:2,tags:['יצירתיות','הצגה','צוותי'],mood:['לגיבוש','לכיף']},
  {name:'חפץ אחד',cat:'group',desc:'כל אחד מביא חפץ — מספר למה הוא חשוב לו. היכרות עמוקה.',ages:'9+',participants:'4-20',difficulty:1,tags:['היכרות','שיחה','אישי'],mood:['להיכרות','לגיבוש']},
  {name:'מפת חלומות',cat:'group',desc:'כל אחד מצייר מפת חלומות — מה רוצה להיות, לעשות, לראות.',ages:'9+',participants:'5-25',difficulty:1,tags:['ציור','חלומות','אישי'],mood:['להיכרות','לגיבוש']},
  {name:'כן/לא/אולי',cat:'group',desc:'המנחה אומר טענה — רצים לפינת ״כן״, ״לא״, או ״אולי״ ומסבירים!',ages:'8+',participants:'8-40',difficulty:1,tags:['דעות','תנועה','דיון'],mood:['לפתיחה','לדיון']},
  {name:'סרט תעודי',cat:'group',desc:'כל צוות מכין ״סרט תעודי״ קצר על נושא — ומציג!',ages:'10+',participants:'8-30',difficulty:2,tags:['יצירתיות','הצגה','צוותי'],mood:['לגיבוש']},
  {name:'זמן איכות',cat:'group',desc:'כל זוג מקבל 5 דקות לשיחה עמוקה על שאלה שהמנחה נותן.',ages:'10+',participants:'4-30',difficulty:1,tags:['שיחה','עומק','זוגי'],mood:['להיכרות','להרגעה']},
  {name:'גלגל רגשות',cat:'group',desc:'גלגל עם רגשות — מסובבים ומספרים על פעם שהרגישו ככה.',ages:'9+',participants:'4-20',difficulty:2,tags:['רגשות','שיחה','אישי'],mood:['לגיבוש','להרגעה']},
  {name:'תמונה מדברת',cat:'group',desc:'המנחה מראה תמונה — כל אחד אומר מה הוא רואה. מפתיע כמה שונה!',ages:'8+',participants:'5-30',difficulty:1,tags:['חשיבה','דיון','תפיסה'],mood:['לפתיחה','לחשיבה']},

  // === ICEBREAKER ===
  {name:'10 אצבעות',cat:'icebreaker',desc:'כולם מרימים 10 אצבעות. ״מי שאף פעם לא...״ — מי שכן, מוריד אצבע!',ages:'8+',participants:'5-30',difficulty:1,tags:['היכרות','כיף','פשוט'],mood:['לפתיחה','להיכרות']},
  {name:'אבן נייר ומספריים אנושי',cat:'icebreaker',desc:'שני צוותים — כל צוות בוחר תנוחה. אבן>מספריים>נייר>אבן!',ages:'7+',participants:'10-50',difficulty:1,tags:['כיף','תנועה','צוותי'],mood:['לפתיחה','לאנרגיה']},
  {name:'שם + תנועה',cat:'icebreaker',desc:'כל אחד אומר שמו עם תנועה ייחודית — כולם חוזרים!',ages:'6+',participants:'5-30',difficulty:1,tags:['היכרות','תנועה','זיכרון'],mood:['לפתיחה']},
  {name:'4 פינות מהירות',cat:'icebreaker',desc:'4 פינות = 4 תשובות. המנחה שואל — רצים!',ages:'7+',participants:'8-40',difficulty:1,tags:['תנועה','דעות','כיף'],mood:['לפתיחה','לאנרגיה']},
  {name:'נינג׳ה',cat:'icebreaker',desc:'כולם במעגל — כל אחד בתורו עושה תנועה. מי שנפגע בידו, בחוץ!',ages:'8+',participants:'5-20',difficulty:1,tags:['תנועה','כיף','תגובה'],mood:['לפתיחה','לכיף']},

  // === FATHERS ===
  {name:'שיחת מדורה',cat:'fathers',desc:'אב ובן יושבים ליד מדורה — 3 שאלות עמוקות שהמנחה נותן.',ages:'9-13',participants:'זוגות',difficulty:1,tags:['שיחה','חיבור','עומק'],mood:['לאב-בן','להרגעה']},
  {name:'מסלול אתגרים זוגי',cat:'fathers',desc:'אב ובן עוברים מסלול מכשולים ביחד — חייבים לשתף פעולה!',ages:'9-13',participants:'זוגות',difficulty:2,tags:['אתגר','שיתוף','שטח'],mood:['לאב-בן','לגיבוש']},
  {name:'יום הפוך',cat:'fathers',desc:'הבן הוא האבא והאבא הוא הבן — ליום שלם! מי מצליח?',ages:'9-13',participants:'זוגות',difficulty:1,tags:['כיף','חיבור','הומור'],mood:['לאב-בן','לכיף']},
  {name:'בניית רפסודה',cat:'fathers',desc:'אב ובן בונים רפסודה מענפים וחבלים — ושטים עליה!',ages:'10-13',participants:'זוגות',difficulty:3,tags:['בנייה','מים','הרפתקה'],mood:['לאב-בן','לשטח']},
  {name:'שעון חול',cat:'fathers',desc:'אב ובן מקבלים 60 שניות לכל אתגר — סדרת אתגרים מהירים!',ages:'8-13',participants:'זוגות',difficulty:1,tags:['מהיר','כיף','תחרות'],mood:['לאב-בן','לכיף']},

  // === OUTDOOR ===
  {name:'מסע חושים',cat:'outdoor',desc:'5 תחנות בטבע — כל תחנה מפעילה חוש אחר. ריח, מגע, שמיעה, טעם, ראייה.',ages:'8+',participants:'5-25',difficulty:1,tags:['חושים','טבע','חוויה'],mood:['לטיול','להרגעה']},
  {name:'בניית מלכודת',cat:'outdoor',desc:'בונים מלכודת לעכבר מחומרים בטבע — מי בונה הכי יצירתי?',ages:'9+',participants:'4-20',difficulty:2,tags:['בנייה','טבע','יצירתיות'],mood:['לשטח','לחופש']},
  {name:'מיפוי שטח',cat:'outdoor',desc:'כל צוות מציר מפה של האזור — עם סימנים, מקרא ופרטים.',ages:'10+',participants:'4-20',difficulty:2,tags:['מפה','טבע','חשיבה'],mood:['לשטח','לחשיבה']},
  {name:'חבל על גשר',cat:'outdoor',desc:'חבל מתוח מעל נחל — חציה על החבל! מי לא נופל?',ages:'10+',participants:'5-20',difficulty:3,tags:['חבל','אתגר','אומץ'],mood:['לשטח','לאתגר']},
  {name:'מחנה שבט',cat:'outdoor',desc:'כל צוות מקים ״מחנה שבט״ — עם דגל, שם, מנהיג וחוקים!',ages:'9+',participants:'10-40',difficulty:2,tags:['בנייה','צוותי','יצירתיות'],mood:['לשטח','לגיבוש']},

  // === CLASSROOM ===
  {name:'מילת היום',cat:'classroom',desc:'מילה על הלוח — כל שיעור צריך להשתמש בה. מי שמצליח מקבל נקודה!',ages:'8+',participants:'10-35',difficulty:1,tags:['מילים','לימוד','כיף'],mood:['לכיתה']},
  {name:'30 שניות',cat:'classroom',desc:'כל תלמיד מקבל 30 שניות לדבר על נושא — בלי לעצור!',ages:'9+',participants:'10-35',difficulty:1,tags:['דיבור','אומץ','לימוד'],mood:['לכיתה','לפתיחה']},
  {name:'משפט מסתורי',cat:'classroom',desc:'משפט על הלוח עם מילים חסרות — מי ממלא נכון ראשון?',ages:'8+',participants:'10-35',difficulty:1,tags:['מילים','לימוד','מהיר'],mood:['לכיתה']},
  {name:'שיעור הפוך',cat:'classroom',desc:'תלמידים מלמדים את המורה! כל אחד מכין חידה על החומר.',ages:'10+',participants:'10-35',difficulty:2,tags:['לימוד','יצירתיות','כיף'],mood:['לכיתה']},
  {name:'דו-קרב ידע',cat:'classroom',desc:'שני תלמידים עומדים — שאלה על החומר. מי שעונה ראשון מנצח!',ages:'9+',participants:'10-35',difficulty:1,tags:['חידון','תחרות','לימוד'],mood:['לכיתה']},

  // === ODT ===
  {name:'קורת איזון',cat:'odt',desc:'קורה על הרצפה — כל הקבוצה צריכה לעמוד עליה ולהתמיין לפי גובה!',ages:'8+',participants:'6-20',difficulty:2,tags:['איזון','שיתוף','אתגר'],mood:['לגיבוש']},
  {name:'חומה סינית',cat:'odt',desc:'הקבוצה צריכה להעביר את כולם מעבר ל״חומה״ גבוהה!',ages:'10+',participants:'8-20',difficulty:3,tags:['כוח','צוותי','אתגר'],mood:['לגיבוש','לאתגר']},
  {name:'צינור מים',cat:'odt',desc:'מעבירים מים דרך צינורות חצויים — בלי לשפוך!',ages:'8+',participants:'6-20',difficulty:2,tags:['מים','צוותי','תיאום'],mood:['לגיבוש','לכיף']},
  {name:'ביצת נחיתה',cat:'odt',desc:'בנו מכשיר שיגן על ביצה שנופלת מ-3 מטר!',ages:'9+',participants:'4-20',difficulty:2,tags:['בנייה','חשיבה','יצירתיות'],mood:['לגיבוש','לחשיבה']},
  {name:'רשת חשמלית',cat:'odt',desc:'רשת חבלים עם ״חשמל״ — צריך לעבור בלי לגעת!',ages:'9+',participants:'6-20',difficulty:2,tags:['חבל','זהירות','צוותי'],mood:['לגיבוש','לאתגר']},
];

// Fill in defaults for new games
for (const g of newGames) {
  if (!g.rules) g.rules = defaultRules;
  if (!g.reflection) g.reflection = R[g.cat] || R.group;
  if (!g.levels) g.levels = (levelTemplates[g.cat] || levelTemplates.group).slice(0, 5);
}

const allGames = [...acts, ...newGames];
console.log('New total:', allGames.length);

// Rebuild
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

// Update counter
const finalHtml = newHtml.replace(/data-count="200"/g, 'data-count="' + allGames.length + '"');
fs.writeFileSync('index.html', finalHtml, 'utf8');
console.log('Saved! Total games:', allGames.length);
