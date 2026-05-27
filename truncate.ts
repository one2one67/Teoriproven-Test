import fs from 'fs';
const file = '/app/applet/src/data/questions.ts';
const content = fs.readFileSync(file, 'utf8');
const lines = content.split('\n');
const newContent = lines.slice(0, 257).join('\n');
fs.writeFileSync(file, newContent);
