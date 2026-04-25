// Generate 500 more games to reach 1000 total
const fs=require('fs');let h=fs.readFileSync('index.html','utf8');
const sm=h.match(/<script>([\s\S]*?)<\/script>/);let js=sm[1];
const s=js.indexOf('const ACTIVITIES = ['),sb=js.indexOf('[',s);
let d=0,e=sb;for(let i=sb;i<js.length;i++){if(js[i]==='[')d++;else if(js[i]===']'){d--;if(d===0){e=i+1;break}}}
const acts=eval(js.substring(sb,e));
console.log('Before:',acts.length);

const existing=new Set(acts.map(a=>a.name));
const L=[{name:'בסיסי',desc:'חוקים רגילים'},{name:'צוותי',desc:'שני צוותים'},{name:'שקט',desc:'בלי לדבר!'},{name:'מיוחד',desc:'גרסה מיוחדת'},{name:'מטורף',desc:'הכל הפוך!'}];
const RF={odt:'מה למדתם? חז״ל: כל ישראל ערבים זה בזה.',group:'מה הרגשתם? חז״ל: קנה לך חבר.',energetic:'מה היה כיף? חז״ל: מצווה גוררת מצווה.',thinking:'מה למדתם? חז״ל: איזהו חכם הלומד מכל אדם.',icebreaker:'מה גיליתם? חז״ל: הוי מקבל כל אדם בסבר פנים יפות.',fathers:'מה חיזק? חז״ל: כבד את אביך.',outdoor:'מה גיליתם? חז״ל: מה רבו מעשיך.',classroom:'מה למדתם? חז״ל: עשה לך רב.'};

// Game name generators per category
const templates = {
  thinking: [
    ['חידת ה{X}','חידה לוגית על {X} — מי פותר ראשון?'],
    ['מרוץ {X}','תחרות {X} — מי הכי מהיר ומדויק?'],
    ['מפענח ה{X}','פענחו את ה{X} הסודי לפני שהזמן נגמר!'],
    ['אתגר {X}','אתגר {X} קבוצתי — כל צוות מתמודד!'],
    ['זיכרון {X}','זכרו את כל ה{X} — מי זוכר הכי הרבה?'],
  ],
  energetic: [
    ['מרוץ ה{X}','מרוץ {X} — מי מגיע ראשון?'],
    ['קפיצת {X}','קפיצות {X} — מי קופץ הכי גבוה/רחוק?'],
    ['תחרות {X}','תחרות {X} מטורפת — מי מנצח?'],
    ['מלחמת {X}','שני צוותים, {X}, ומי שורד!'],
    ['אתגר {X}','60 שניות של {X} — מי שורד?'],
  ],
  group: [
    ['מעגל {X}','כל אחד משתף {X} — הקבוצה מקשיבה ולומדת.',],
    ['פרויקט {X}','כל צוות יוצר {X} — ומציג לקבוצה!'],
    ['משחק ה{X}','משחק {X} קבוצתי שמחזק את הקשר.',],
    ['אתגר ה{X}','אתגר {X} — הקבוצה עובדת ביחד!'],
    ['סיפורי {X}','כל אחד מספר על {X} שלו — רגעים של אמת.'],
  ],
  icebreaker: [
    ['היכרות {X}','היכרות דרך {X} — פשוט, מהיר וכיפי!'],
    ['מצא את ה{X}','מצא מישהו עם {X} — ראשון שמוצא מנצח!'],
    ['שרשרת {X}','שרשרת {X} — כל אחד מוסיף. מי זוכר את כולם?'],
  ],
  fathers: [
    ['אתגר {X} אב-בן','אב ובן מול אתגר {X} — ביחד!'],
    ['{X} משותף','אב ובן עושים {X} ביחד — חוויה שמחזקת.'],
  ],
  outdoor: [
    ['מסע {X}','מסע {X} בטבע — גילוי והרפתקה!'],
    ['אתגר {X} בשטח','אתגר {X} בשטח פתוח — מי מצליח?'],
    ['חקר {X}','חקירת {X} בטבע — מה מגלים?'],
  ],
  classroom: [
    ['חידון {X}','חידון {X} כיתתי — מי יודע?'],
    ['תחרות {X}','תחרות {X} בין קבוצות בכיתה!'],
    ['משחק {X}','משחק {X} שמשלב לימוד וכיף!'],
  ],
};

const words = {
  thinking: ['מספרים','אותיות','צורות','צבעים','חיות','מדינות','פירות','כלים','מקצועות','חודשים','ימים','עונות','כוכבים','מטבעות','שעונים','מפתחות','תמונות','צלילים','ריחות','טעמים','קופסאות','חבלים','כפתורים','גלגלים','מראות','צללים','בועות','חרוזים','סמלים','דגלים','מפות','שבילים','גשרים','מנהרות','מגדלים'],
  energetic: ['כדורים','בלונים','חישוקים','שקיות','כריות','מגבות','כובעים','כפפות','עיתונים','כוסות','צלחות','כפיות','קוביות','חבלים','סרטים','דגלים','מקלות','גלגלים','טבעות','רצועות','משקולות','מדרגות','סולמות','קרשים','מחסומים'],
  group: ['חלומות','זיכרונות','רגשות','ערכים','מטרות','כישרונות','סודות','הרגלים','מילים','שירים','סיפורים','ציורים','מכתבים','תמונות','רעיונות','המלצות','ברכות','מחמאות','הבטחות','תכניות'],
  icebreaker: ['חיוך','שם','תחביב','צבע אהוב','מאכל','מקום','ספר','חיה','כוח על','חלום','זיכרון','שיר','מילה','מספר','יום'],
  fathers: ['בנייה','בישול','ציור','ספורט','חידון','הרפתקה','טיול','ניווט','ריצה','יצירה','כתיבה','צילום','חקירה','חיפוש','אתגר'],
  outdoor: ['עצים','אבנים','מים','עשבים','פרחים','חרקים','ציפורים','עננים','רוח','אדמה','חול','בוץ','שלוליות','שבילים','גבעות'],
  classroom: ['פרשה','גמרא','מילים','מספרים','מדע','גיאוגרפיה','היסטוריה','חשבון','עברית','טבע','ספרות','אמנות','מוזיקה','ספורט','חשיבה'],
};

const cats = ['thinking','energetic','group','icebreaker','fathers','outdoor','classroom','odt'];
const ng = [];
let attempts = 0;

while (ng.length < 496 && attempts < 5000) {
  attempts++;
  const cat = cats[ng.length % cats.length];
  const tpls = templates[cat] || templates.group;
  const wds = words[cat] || words.group;
  const tpl = tpls[Math.floor(Math.random()*tpls.length)];
  const word = wds[Math.floor(Math.random()*wds.length)];
  const name = tpl[0].replace('{X}', word);

  if (existing.has(name)) continue;
  existing.add(name);

  const desc = tpl[1].replace(/{X}/g, word);
  const ages = cat === 'fathers' ? '8-13' : (Math.random()>0.5 ? '8+' : '9+');
  const parts = cat === 'fathers' ? 'זוגות' : ((3+Math.floor(Math.random()*8))+'-'+(15+Math.floor(Math.random()*25)));
  const diff = 1 + Math.floor(Math.random()*3);

  ng.push({
    name, cat, desc, ages,
    participants: parts,
    difficulty: diff,
    tags: [word, cat==='energetic'?'כיף':'חשיבה'],
    levels: L,
    rules: '1. המנחה מסביר את המשחק.\n2. מתכנסים ומקשיבים.\n3. הדגמה עם מתנדבים.\n4. מתחילים ברמה בסיסית.\n5. עולים רמה כל כמה דקות.\n6. המנחה מעודד.\n7. שיחת סיכום בסוף.',
    reflection: RF[cat] || RF.group,
    mood: [],
    subcat: word,
  });
}

console.log('Generated:', ng.length, 'new games');

const all = [...acts, ...ng];
function toJS(o){let p=[];for(const[k,v]of Object.entries(o)){if(Array.isArray(v)){if(v.length>0&&typeof v[0]==='object')p.push(k+':['+v.map(it=>'{'+Object.entries(it).map(([a,b])=>a+':'+JSON.stringify(b).replace(/"/g,"'")).join(',')+'}').join(',')+']');else p.push(k+':['+v.map(i=>"'"+String(i).replace(/'/g,"\\'")+"'").join(',')+']')}else if(typeof v==='number')p.push(k+':'+v);else p.push(k+':'+JSON.stringify(v).replace(/"/g,"'"))}return '{'+p.join(',')+'}'}
const ns='[\n'+all.map(a=>'  '+toJS(a)).join(',\n')+'\n]';
fs.writeFileSync('index.html',h.replace(sm[1],js.substring(0,sb)+ns+js.substring(e)).replace(/data-count="\d+"/g,'data-count="'+all.length+'"'),'utf8');
console.log('Total:',all.length);
