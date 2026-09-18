const fs = require('fs');
const files = process.argv.slice(2);
files.forEach((f) => {
  const b = fs.readFileSync(f);
  if (b.slice(1, 4).toString() !== 'PNG') { console.log(f, 'NOT PNG'); return; }
  const w = b.readUInt32BE(16), h = b.readUInt32BE(20);
  console.log(f, w + 'x' + h, (b.length / 1024).toFixed(1) + 'KB');
});
