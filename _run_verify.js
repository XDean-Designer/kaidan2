const { execFile } = require('child_process');
const path = require('path');
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const page = process.argv[2] || '_verify_r16.html';
const url = 'file:///' + path.join(__dirname, page).replace(/\\/g, '/').replace(/[^\x00-\x7F]/g, c => encodeURIComponent(c));
const sep = page.indexOf('?') >= 0 ? '&' : '?';
execFile(chrome, ['--headless=new', '--disable-gpu', '--allow-file-access-from-files',
  '--virtual-time-budget=60000', '--dump-dom', url + sep + 't=' + Date.now()],
  { maxBuffer: 128 * 1024 * 1024, windowsHide: true }, (err, stdout) => {
    if (err) { console.error('ERR', err.message); process.exit(1); }
    const m = stdout.match(/<pre[^>]*>([\s\S]*?)<\/pre>/);
    process.stdout.write((m ? m[1] : '(no <pre>)') + '\n');
    process.exit(0);
  });


