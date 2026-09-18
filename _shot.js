const { execFile } = require('child_process');
const fs = require('fs');
const path = require('path');
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const dir = __dirname;
const view = process.argv[2] || 's1-closed';
const out = process.argv[3] || ('_shot_v3_' + view + '.png');
const helper = 'file:///' + path.join(dir, '_shot_v3.html').replace(/\\/g, '/').replace(/[^\x00-\x7F]/g, c => encodeURIComponent(c));
const url = helper + '?v=' + view + '&t=' + Date.now();
execFile(chrome, [
  '--headless=new', '--disable-gpu', '--allow-file-access-from-files', '--hide-scrollbars',
  '--force-device-scale-factor=2', '--window-size=390,844',
  '--virtual-time-budget=45000', '--screenshot=' + path.join(dir, out), url
], { maxBuffer: 64 * 1024 * 1024, windowsHide: true }, (err) => {
  if (err) { console.error('ERR', err.message); process.exit(1); }
  const p = path.join(dir, out);
  console.log('OK', out, fs.existsSync(p) ? fs.statSync(p).size + 'B' : 'MISSING');
  process.exit(0);
});
