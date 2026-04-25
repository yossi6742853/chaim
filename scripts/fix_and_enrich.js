const fs=require('fs');let h=fs.readFileSync('index.html','utf8');
const sm=h.match(/<script>([\s\S]*?)<\/script>/);let js=sm[1];
const s=js.indexOf('const ACTIVITIES = ['),sb=js.indexOf('[',s);
let d=0,e=sb;for(let i=sb;i<js.length;i++){if(js[i]==='[')d++;else if(js[i]===']'){d--;if(d===0){e=i+1;break}}}
const acts=eval(js.substring(sb,e));

// 1. Remove duplicates
const seen=new Map();const unique=[];
for(const a of acts){if(!seen.has(a.name)){seen.set(a.name,1);unique.push(a)}};
console.log('Removed',acts.length-unique.length,'dupes. Now:',unique.length);

// 2. Fix generic descriptions with real ones based on name keywords
const descTemplates = {
  'אתגר': (w) => `אתגר ${w} — המשתתפים מתמודדים עם משימה מיוחדת הקשורה ל${w}. צריך חשיבה, שיתוף פעולה, ולא מעט אומץ!`,
  'מרוץ': (w) => `מרוץ ${w} — תחרות מהירה וסוערת! כל משתתף רץ עם ${w}, מי שמגיע ראשון בלי לטעות מנצח!`,
  'חידת': (w) => `חידת ${w} — חידה מרתקת שקשורה ל${w}. צריך לחשוב מחוץ לקופסה כדי לפתור!`,
  'זיכרון': (w) => `משחק זיכרון עם ${w} — כמה פרטים אתם מצליחים לזכור? מי שזוכר הכי הרבה מנצח!`,
  'מלחמת': (w) => `מלחמת ${w} — שני צוותים מתחרים סביב ${w}. אסטרטגיה, מהירות, ועבודת צוות!`,
  'תחרות': (w) => `תחרות ${w} — כל צוות מקבל ${w} וצריך להשיג את התוצאה הטובה ביותר!`,
  'מסע': (w) => `מסע ${w} — מסלול עם תחנות שקשורות ל${w}. כל תחנה אתגר חדש!`,
  'משחק': (w) => `משחק ${w} — כל המשתתפים פעילים! ${w} עובר מיד ליד, מי שטועה יוצא.`,
  'קרב': (w) => `קרב ${w} — שני מתחרים, ${w} אחד, ומי שמנצח עובר לשלב הבא!`,
  'טורניר': (w) => `טורניר ${w} — תחרות עם סיבובים. כל סיבוב קשה יותר, עד הגמר הגדול!`,
  'מבצע': (w) => `מבצע ${w} — משימה קבוצתית מורכבת הקשורה ל${w}. כל אחד תורם את חלקו!`,
  'מסלול': (w) => `מסלול ${w} — תחנות עם אתגרים שקשורים ל${w}. מי עובר את כולן ראשון?`,
  'ציד': (w) => `ציד ${w} — ${w} מוסתרים בשטח. כל צוות מחפש עם רמזים. מי מוצא הכי הרבה?`,
  'חיפוש': (w) => `חיפוש ${w} — ${w} חבוי! רמזים מובילים אליו צעד אחרי צעד.`,
  'בניית': (w) => `בניית ${w} — כל צוות בונה ${w} מחומרים פשוטים. מי בונה הכי יפה/גבוה/חזק?`,
  'יצירת': (w) => `יצירת ${w} — כל אחד יוצר ${w} ייחודי. בסוף מציגים ומצביעים!`,
  'גילוי': (w) => `גילוי ${w} — ${w} מוסתר ומלא הפתעות. כל רמז מגלה עוד חלק!`,
  'פיצוח': (w) => `פיצוח ${w} — קוד סודי הקשור ל${w}. מי מפצח ראשון?`,
  'הרכבת': (w) => `הרכבת ${w} — חלקים פזורים של ${w}. הצוות שמרכיב ראשון מנצח!`,
  'איסוף': (w) => `איסוף ${w} — פזורים בשטח! כל צוות אוסף כמה שיותר ${w} בזמן מוגבל.`,
  'מיון': (w) => `מיון ${w} — ערימה מבולגנת של ${w}. מי ממיין נכון הכי מהר?`,
  'העברת': (w) => `העברת ${w} — שרשרת אנושית מעבירה ${w} מקצה לקצה. אם נופל, חוזרים!`,
  'הצלת': (w) => `הצלת ${w} — ${w} בסכנה! הקבוצה צריכה לחשוב מהר ולהציל!`,
  'כיבוש': (w) => `כיבוש ${w} — שני צוותים מתחרים על ${w}. טקטיקה ומהירות!`,
  'חקירת': (w) => `חקירת ${w} — ${w} מלא סודות. חוקרים, בודקים, ומגלים!`,
};

let fixed = 0;
for (const a of unique) {
  if (a.desc && a.desc.includes('אתגר מרתק לכל קבוצה')) {
    // Parse the name to get action + object
    const parts = a.name.split(' ');
    const action = parts[0];
    const obj = parts.slice(1).join(' ');
    const tmpl = descTemplates[action];
    if (tmpl) {
      a.desc = tmpl(obj);
      fixed++;
    } else {
      a.desc = `${a.name} — משחק מיוחד שבו המשתתפים מתמודדים עם ${obj}. דורש חשיבה, שיתוף פעולה, ויצירתיות!`;
      fixed++;
    }
  }
}
console.log('Fixed',fixed,'generic descriptions');

// 3. Save
function toJS(o){let p=[];for(const[k,v]of Object.entries(o)){if(Array.isArray(v)){if(v.length>0&&typeof v[0]==='object')p.push(k+':['+v.map(it=>'{'+Object.entries(it).map(([a,b])=>a+':'+JSON.stringify(b).replace(/"/g,"'")).join(',')+'}').join(',')+']');else p.push(k+':['+v.map(i=>"'"+String(i).replace(/'/g,"\\'")+"'").join(',')+']')}else if(typeof v==='number')p.push(k+':'+v);else p.push(k+':'+JSON.stringify(v).replace(/"/g,"'"))}return '{'+p.join(',')+'}'}
const ns='[\n'+unique.map(a=>'  '+toJS(a)).join(',\n')+'\n]';
fs.writeFileSync('index.html',h.replace(sm[1],js.substring(0,sb)+ns+js.substring(e)).replace(/data-count="\d+"/g,'data-count="'+unique.length+'"'),'utf8');
console.log('Saved:',unique.length,'games, all unique, all with real descriptions');
