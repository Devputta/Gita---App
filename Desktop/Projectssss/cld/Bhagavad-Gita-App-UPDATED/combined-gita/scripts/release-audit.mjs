import fs from 'node:fs'; import path from 'node:path';
const root=process.cwd(); const verses=JSON.parse(fs.readFileSync(path.join(root,'data/sanskrit/verses.json'),'utf8'));
const errors=[]; if(verses.length!==700) errors.push(`Expected 700 verses, found ${verses.length}`);
const chapters=new Map(); for(const v of verses){ if(!v.sanskrit?.trim()) errors.push(`Missing Sanskrit ${v.chapterNumber}.${v.verseNumber}`); const k=`${v.chapterNumber}.${v.verseNumber}`; if(chapters.has(k)) errors.push(`Duplicate ${k}`); chapters.set(k,true); }
for(let c=1;c<=18;c++){const n=verses.filter(v=>v.chapterNumber===c); if(!n.length) errors.push(`Missing chapter ${c}`);}
const forbidden=['test password','fake translation','placeholder scripture','fake audio']; const files=['README.md','app','lib','components'];
function walk(p){if(!fs.existsSync(p))return; const st=fs.statSync(p); if(st.isFile()&&/\.(ts|tsx|js|mjs|md|json)$/.test(p)){const t=fs.readFileSync(p,'utf8').toLowerCase(); for(const x of forbidden) if(t.includes(x)) errors.push(`Forbidden placeholder phrase in ${path.relative(root,p)}: ${x}`);} else if(st.isDirectory()) for(const f of fs.readdirSync(p)) walk(path.join(p,f));}
for(const f of files) walk(path.join(root,f)); if(errors.length){console.error('RELEASE AUDIT FAILED'); errors.forEach(e=>console.error(' - '+e)); process.exit(1);} console.log('RELEASE AUDIT PASSED: 18 chapters / 700 Sanskrit verses, no duplicate keys or detected placeholder phrases.');
