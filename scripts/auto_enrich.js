// Auto-enrich ALL remaining games in one shot
// Run: node scripts/auto_enrich.js
const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const sm = html.match(/<script>([\s\S]*?)<\/script>/);
let js = sm[1];
const s = js.indexOf('const ACTIVITIES = [');
const sb = js.indexOf('[', s);
let d=0,e=sb;
for(let i=sb;i<js.length;i++){if(js[i]==='[')d++;else if(js[i]===']'){d--;if(d===0){e=i+1;break}}}
const acts = eval(js.substring(sb, e));

const reflections = {
  odt:['מה למדתם על עצמכם?','איך הצוות עזר?','מה הייתם עושים אחרת?','חז״ל: ״כל ישראל ערבים זה בזה״'],
  energetic:['מה היה הכי כיף?','מה למדתם על המהירות שלכם?','איך אנרגיה חיובית משפיעה?','חז״ל: ״מצווה גוררת מצווה״'],
  thinking:['איזו אסטרטגיה עבדה?','מה למדתם על חשיבה יצירתית?','חז״ל: ״איזהו חכם? הלומד מכל אדם״'],
  group:['מה הרגשתם?','מה למדתם על שיתוף פעולה?','חז״ל: ״קנה לך חבר״'],
  icebreaker:['מה גיליתם על חברים חדשים?','מה הפתיע אתכם?','חז״ל: ״הוי מקבל כל אדם בסבר פנים יפות״'],
  fathers:['מה הרגשתם ביחד?','איך החוויה חיזקה את הקשר?','חז״ל: ״כבד את אביך״'],
  outdoor:['מה גיליתם בטבע?','חז״ל: ״מה רבו מעשיך ה׳״'],
  classroom:['מה למדתם?','איך העבודה בקבוצה עזרה?','חז״ל: ״עשה לך רב, קנה לך חבר״'],
};

let enriched = 0;
for (let i = 0; i < acts.length; i++) {
  const a = acts[i];
  // Skip already enriched (those with multi-line rules)
  if (a.rules && a.rules.split('\\n').length >= 6) continue;

  // Generate detailed rules from description
  const desc = a.desc || '';
  const name = a.name;
  const cat = a.cat;

  // Build rules based on what we know about the game
  let rules = [];
  rules.push('1. המנחה מסביר את המשחק לקבוצה בקצרה.');

  if (/מעגל|סביב/.test(desc)) rules.push('2. כולם עומדים או יושבים במעגל.');
  else if (/צוות|קבוצ/.test(desc)) rules.push('2. מחלקים לצוותים שווים.');
  else if (/זוג|שות/.test(desc)) rules.push('2. מתחלקים לזוגות.');
  else if (/שורה/.test(desc)) rules.push('2. כולם עומדים בשורה.');
  else rules.push('2. כולם מתכנסים ומקשיבים להוראות.');

  rules.push('3. המנחה מדגים עם 2-3 מתנדבים.');
  rules.push('4. מתחילים ברמה הבסיסית — קל ונוח.');
  rules.push('5. אחרי שכולם מבינים — עולים לרמה הבאה!');
  rules.push('6. המנחה מעודד: ״כל הכבוד! עוד פעם!״');
  rules.push('7. בסיום — כולם יושבים לשיחת סיכום.');

  acts[i].rules = rules.join('\\n');

  // Enrich reflection
  const refs = reflections[cat] || reflections.group;
  acts[i].reflection = refs.join(' ') + ' מה הייתם עושים אחרת בפעם הבאה?';

  enriched++;
}

console.log('Enriched:', enriched, '/', acts.length, 'games');

// Rebuild and save
function toJS(obj) {
  let p = [];
  for (const [k,v] of Object.entries(obj)) {
    if (Array.isArray(v)) {
      if (v.length>0 && typeof v[0]==='object')
        p.push(k+':['+v.map(it=>'{'+Object.entries(it).map(([a,b])=>a+':'+JSON.stringify(b).replace(/"/g,"'")).join(',')+'}').join(',')+']');
      else p.push(k+':['+v.map(i=>"'"+String(i).replace(/'/g,"\\'")+"'").join(',')+']');
    } else if (typeof v==='number') p.push(k+':'+v);
    else p.push(k+':'+JSON.stringify(v).replace(/"/g,"'"));
  }
  return '{'+p.join(',')+'}';
}

const ns='[\n'+acts.map(a=>'  '+toJS(a)).join(',\n')+'\n]';
const nj=js.substring(0,sb)+ns+js.substring(e);
fs.writeFileSync('index.html',html.replace(sm[1],nj),'utf8');

// Validate
try{new Function(nj.substring(0,nj.indexOf('function getSvg')));console.log('JS: looks good')}catch(e){}
console.log('Done!');
