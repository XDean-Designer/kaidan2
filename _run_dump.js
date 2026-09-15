const { execFile } = require('child_process');
const fs = require('fs');
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const url = process.argv[2];
const outFile = process.argv[3] || '_dump_out.html';
execFile(chrome, ['--headless=new', '--disable-gpu', '--allow-file-access-from-files', '--virtual-time-budget=40000', '--dump-dom', url], {
  maxBuffer: 128 * 1024 * 1024, windowsHide: true
}, (err, stdout) => {
  if (err) { console.error('ERR', err.message); process.exit(1); }
  fs.writeFileSync(outFile, stdout, 'utf8');
  const m = stdout.match(/<title>([^<]*)<\/title>/);
  const p = stdout.match(/<pre>([\s\S]*?)<\/pre>/);
  if (m) process.stdout.write('TITLE=' + m[1] + '\n');
  if (p) process.stdout.write('PRE=' + p[1].slice(0, 4000) + '\n');
  process.stdout.write('SAVED=' + outFile + ' LEN=' + stdout.length + '\n');
  process.exit(0);
});
