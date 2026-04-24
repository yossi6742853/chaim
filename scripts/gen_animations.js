/**
 * Generate unique SVG animation for each game
 * Each animation visually explains how the specific game works
 */

const fs = require('fs');

// SVG helpers
function P(x,y,c,s=1){return `<g transform="translate(${x},${y}) scale(${s})"><circle cx="0" cy="-18" r="7" fill="${c}" opacity=".9"/><line x1="0" y1="-11" x2="0" y2="5" stroke="${c}" stroke-width="2.5"/><line x1="0" y1="-4" x2="-9" y2="2" stroke="${c}" stroke-width="2"/><line x1="0" y1="-4" x2="9" y2="2" stroke="${c}" stroke-width="2"/><line x1="0" y1="5" x2="-5" y2="16" stroke="${c}" stroke-width="2"/><line x1="0" y1="5" x2="5" y2="16" stroke="${c}" stroke-width="2"/></g>`}

function circle(cx,cy,r,n,cc){let s='';for(let i=0;i<n;i++){const a=(i/n)*Math.PI*2-Math.PI/2;s+=P(cx+Math.cos(a)*r,cy+Math.sin(a)*r,cc[i%cc.length],0.6)}return s}

function txt(x,y,t,c,sz=11){return `<text x="${x}" y="${y}" text-anchor="middle" fill="${c}" font-size="${sz}" font-family="Heebo" opacity=".7">${t}</text>`}

function anim(attr,vals,dur,begin='0s'){return `<animate attributeName="${attr}" values="${vals}" dur="${dur}" begin="${begin}" repeatCount="indefinite"/>`}

function moveAnim(path,dur){return `<animateMotion dur="${dur}" repeatCount="indefinite" path="${path}"/>`}

const C=['#e74c3c','#3498db','#2ecc71','#f39c12','#9b59b6','#1abc9c','#e67e22','#c0392b'];

// Unique animation per game index
const animations = {
  // 0: הליכה על חבלים — person walking on rope step by step
  0: (c) => `
    <line x1="40" y1="170" x2="360" y2="170" stroke="#8B4513" stroke-width="4"/>
    <line x1="30" y1="170" x2="30" y2="110" stroke="#8B4513" stroke-width="6"/>
    <line x1="370" y1="170" x2="370" y2="110" stroke="#8B4513" stroke-width="6"/>
    <g>${anim('opacity','1;1;0.3;1','4s')}
      <animateTransform attributeName="transform" type="translate" values="50,0;180,0" dur="4s" repeatCount="indefinite"/>
      ${P(0,152,c,0.9)}
    </g>
    <g opacity="0">
      ${anim('opacity','0;0;1;1','4s')}
      <animateTransform attributeName="transform" type="translate" values="180,0;310,0" dur="4s" repeatCount="indefinite"/>
      ${P(0,152,c,0.9)}
      <rect x="-12" y="-30" width="24" height="5" rx="2" fill="#333" opacity=".7"/>
    </g>
    ${P(320,180,'#3498db',0.6)}
    <text x="335" y="175" fill="#3498db" font-size="8" font-family="Heebo">ימינה!</text>
    ${txt(200,220,'צעד אחרי צעד — ברמה 3 בעיניים עצומות!',c)}`,

  // 1: איקס-עיגול ענק — tic-tac-toe board filling up
  1: (c) => `
    <line x1="165" y1="60" x2="165" y2="190" stroke="#ddd" stroke-width="3"/>
    <line x1="235" y1="60" x2="235" y2="190" stroke="#ddd" stroke-width="3"/>
    <line x1="100" y1="105" x2="300" y2="105" stroke="#ddd" stroke-width="3"/>
    <line x1="100" y1="150" x2="300" y2="150" stroke="#ddd" stroke-width="3"/>
    <circle cx="130" cy="82" r="15" fill="none" stroke="#e74c3c" stroke-width="3" opacity="0">${anim('opacity','0;1','0.3s','0.5s')}</circle>
    <g opacity="0" transform="translate(200,82)">${anim('opacity','0;1','0.3s','1s')}<line x1="-12" y1="-12" x2="12" y2="12" stroke="#3498db" stroke-width="3"/><line x1="12" y1="-12" x2="-12" y2="12" stroke="#3498db" stroke-width="3"/></g>
    <circle cx="265" cy="82" r="15" fill="none" stroke="#e74c3c" stroke-width="3" opacity="0">${anim('opacity','0;1','0.3s','1.5s')}</circle>
    <g opacity="0" transform="translate(130,127)">${anim('opacity','0;1','0.3s','2s')}<line x1="-12" y1="-12" x2="12" y2="12" stroke="#3498db" stroke-width="3"/><line x1="12" y1="-12" x2="-12" y2="12" stroke="#3498db" stroke-width="3"/></g>
    <circle cx="200" cy="127" r="15" fill="none" stroke="#e74c3c" stroke-width="3" opacity="0">${anim('opacity','0;1','0.3s','2.5s')}</circle>
    <circle cx="200" cy="170" r="15" fill="none" stroke="#e74c3c" stroke-width="3" opacity="0">${anim('opacity','0;1','0.3s','3s')}</circle>
    <line x1="115" y1="82" x2="285" y2="82" stroke="#e74c3c" stroke-width="3" opacity="0">${anim('opacity','0;1','0.3s','3.5s')}</line>
    <text x="200" y="200" text-anchor="middle" fill="#e74c3c" font-size="14" opacity="0">🏆 ניצחון!${anim('opacity','0;1','0.5s','3.5s')}</text>
    ${txt(200,235,'שני צוותים רצים ומניחים — מי משלים שורה?',c)}`,

  // 2: כדורגל סיני — ball being kicked between teams
  2: (c) => `
    <rect x="30" y="60" width="340" height="150" rx="8" fill="#4CAF50" opacity=".15" stroke="#4CAF50" stroke-width="1.5"/>
    <line x1="200" y1="60" x2="200" y2="210" stroke="#fff" stroke-width="1.5" stroke-dasharray="5,5" opacity=".5"/>
    <rect x="30" y="110" width="8" height="50" rx="2" fill="#e74c3c" opacity=".5"/>
    <rect x="362" y="110" width="8" height="50" rx="2" fill="#3498db" opacity=".5"/>
    ${P(100,150,'#e74c3c',0.6)}${P(140,130,'#e74c3c',0.6)}${P(160,170,'#e74c3c',0.6)}
    ${P(260,150,'#3498db',0.6)}${P(300,130,'#3498db',0.6)}${P(280,170,'#3498db',0.6)}
    <circle cx="200" cy="150" r="8" fill="#fff" stroke="#333" stroke-width="1.5">
      <animateMotion dur="3s" repeatCount="indefinite" path="M0,0 L-60,-20 L-30,10 L60,-10 L30,20 L0,0"/>
    </circle>
    ${txt(200,235,'כדורגל עם חוקים מיוחדים — החלפת צדדים אחרי כל גול!',c)}`,

  // 3: טנגרם ענק — shapes assembling into figure
  3: (c) => `
    <polygon points="150,80 200,160 100,160" fill="#e74c3c" opacity=".6"><animate attributeName="opacity" values="0;.6" dur=".5s" begin="0.3s" fill="freeze"/></polygon>
    <polygon points="200,80 250,80 250,130" fill="#3498db" opacity="0"><animate attributeName="opacity" values="0;.6" dur=".5s" begin="0.8s" fill="freeze"/></polygon>
    <polygon points="250,130 300,160 200,160" fill="#2ecc71" opacity="0"><animate attributeName="opacity" values="0;.6" dur=".5s" begin="1.3s" fill="freeze"/></polygon>
    <rect x="100" y="160" width="50" height="30" fill="#f39c12" opacity="0"><animate attributeName="opacity" values="0;.6" dur=".5s" begin="1.8s" fill="freeze"/></rect>
    <polygon points="250,80 300,80 300,160 250,130" fill="#9b59b6" opacity="0"><animate attributeName="opacity" values="0;.6" dur=".5s" begin="2.3s" fill="freeze"/></polygon>
    <text x="200" y="210" text-anchor="middle" fill="${c}" font-size="16" opacity="0">✓ בית!<animate attributeName="opacity" values="0;1" dur=".5s" begin="2.8s" fill="freeze"/></text>
    ${txt(200,238,'מרכיבים צורות מחתיכות — עבודת צוות!',c)}`,

  // 4: אתגר הריבועים — dots grid with squares being drawn
  4: (c) => {
    let dots='';
    for(let r=0;r<4;r++)for(let cl=0;cl<4;cl++)
      dots+=`<circle cx="${140+cl*40}" cy="${70+r*40}" r="4" fill="#333" opacity=".4"/>`;
    return `${dots}
    <rect x="140" y="70" width="40" height="40" fill="none" stroke="#e74c3c" stroke-width="2.5" opacity="0"><animate attributeName="opacity" values="0;1" dur=".3s" begin="0.5s" fill="freeze"/></rect>
    <rect x="140" y="70" width="80" height="80" fill="none" stroke="#3498db" stroke-width="2" opacity="0"><animate attributeName="opacity" values="0;.8" dur=".3s" begin="1.2s" fill="freeze"/></rect>
    <rect x="180" y="110" width="40" height="40" fill="none" stroke="#2ecc71" stroke-width="2" opacity="0"><animate attributeName="opacity" values="0;.8" dur=".3s" begin="1.9s" fill="freeze"/></rect>
    <rect x="140" y="70" width="120" height="120" fill="none" stroke="#f39c12" stroke-width="2" opacity="0"><animate attributeName="opacity" values="0;.7" dur=".3s" begin="2.6s" fill="freeze"/></rect>
    <text x="320" y="130" fill="${c}" font-size="12" font-family="Heebo" opacity="0">4 ריבועים!<animate attributeName="opacity" values="0;1" dur=".3s" begin="3s" fill="freeze"/></text>
    ${txt(200,230,'כמה ריבועים מוסתרים? חשיבה לטרלית!',c)}`;
  },

  // 5: דגים — fish escaping from net
  5: (c) => `
    <rect x="50" y="50" width="300" height="150" rx="8" fill="#bbdefb" opacity=".2" stroke="#90caf9" stroke-width="1"/>
    ${P(100,130,'#e74c3c',0.6)}${P(130,110,'#e74c3c',0.6)}
    <text x="115" y="90" fill="#e74c3c" font-size="8" font-family="Heebo">דייגים</text>
    <g><animateTransform attributeName="transform" type="translate" values="0,0;30,-10;-20,15;10,-5;0,0" dur="3s" repeatCount="indefinite"/>
    <text x="250" y="120" font-size="18">🐟</text></g>
    <g><animateTransform attributeName="transform" type="translate" values="0,0;-15,20;25,-10;-10,15;0,0" dur="3.5s" repeatCount="indefinite"/>
    <text x="200" y="150" font-size="16">🐟</text></g>
    <g><animateTransform attributeName="transform" type="translate" values="0,0;20,10;-30,-5;15,20;0,0" dur="2.8s" repeatCount="indefinite"/>
    <text x="280" y="160" font-size="14">🐟</text></g>
    ${txt(200,230,'דייגים תופסים דגים — דגים בורחים!',c)}`,

  // 6: מעגל חישוקים — hula hoop passing through circle
  6: (c) => `
    ${circle(200,120,70,8,C)}
    <ellipse cx="200" cy="50" rx="20" ry="8" fill="none" stroke="${c}" stroke-width="3" opacity=".8">
      <animateMotion dur="4s" repeatCount="indefinite" path="M0,0 Q50,30 35,70 Q20,100 -35,70 Q-50,30 0,0"/>
    </ellipse>
    <ellipse cx="200" cy="50" rx="18" ry="7" fill="none" stroke="#e74c3c" stroke-width="2.5" opacity="0">
      <animate attributeName="opacity" values="0;0;.7;.7" dur="4s" begin="2s" repeatCount="indefinite"/>
      <animateMotion dur="4s" begin="2s" repeatCount="indefinite" path="M0,0 Q-50,30 -35,70 Q-20,100 35,70 Q50,30 0,0"/>
    </ellipse>
    ${txt(200,225,'חישוק עובר סביב המעגל — בלי לשחרר ידיים!',c)}`,

  // 7: אתגרי חבלים — rope tying and climbing
  7: (c) => `
    <line x1="80" y1="60" x2="80" y2="200" stroke="#8B4513" stroke-width="5"/>
    <line x1="320" y1="60" x2="320" y2="200" stroke="#8B4513" stroke-width="5"/>
    <path d="M80,100 Q200,80 320,100" fill="none" stroke="#c8960c" stroke-width="3"/>
    <path d="M80,140 Q200,160 320,140" fill="none" stroke="#c8960c" stroke-width="3"/>
    <g><animateTransform attributeName="transform" type="translate" values="0,0;100,0;200,0" dur="4s" repeatCount="indefinite"/>
      ${P(90,85,c,0.7)}</g>
    ${txt(200,230,'קשירה, טיפוס, איזון — אתגרי חבלים!',c)}`,
};

// Generate the function code
let code = `function getGameAnimation(game, color) {
  const idx = ACTIVITIES.indexOf(game);
  const w=400, h=250;
  const C=['#e74c3c','#3498db','#2ecc71','#f39c12','#9b59b6','#1abc9c','#e67e22','#c0392b'];

  function P(x,y,c,s){s=s||1;return '<g transform="translate('+x+','+y+') scale('+s+')"><circle cx=0 cy=-18 r=7 fill='+c+' opacity=.9/><line x1=0 y1=-11 x2=0 y2=5 stroke='+c+' stroke-width=2.5/><line x1=0 y1=-4 x2=-9 y2=2 stroke='+c+' stroke-width=2/><line x1=0 y1=-4 x2=9 y2=2 stroke='+c+' stroke-width=2/><line x1=0 y1=5 x2=-5 y2=16 stroke='+c+' stroke-width=2/><line x1=0 y1=5 x2=5 y2=16 stroke='+c+' stroke-width=2/></g>'}

`;

// For now, output the first 8 animation functions
for (let i = 0; i <= 7; i++) {
  if (animations[i]) {
    const fn = animations[i].toString();
    code += `  // Game ${i}\n`;
  }
}

console.log(`Generated ${Object.keys(animations).length} unique animations`);
console.log('This approach needs to be embedded directly in index.html');
