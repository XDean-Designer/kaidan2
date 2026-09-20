/* 截图：node _shot.js <页面> <输出 png> [宽 高]
   例：node _shot.js "_shot_v3.html?v=staff" _r18_staff.png */
const { execFile } = require('child_process');
const path = require('path');
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const page = process.argv[2] || '_shot_v3.html';
const out = process.argv[3] || '_shot.png';
const W = process.argv[4] || '390', H = process.argv[5] || '844';
const [file, query] = page.split('?');
const url = 'file:///' + path.join(__dirname, file).replace(/\\/g, '/').replace(/[^\x00-\x7F]/g, c => encodeURIComponent(c))
  + '?' + (query || '') + (query ? '&' : '') + 't=' + Date.now();
execFile(chrome, ['--headless=new', '--disable-gpu', '--allow-file-access-from-files', '--hide-scrollbars',
  '--window-size=' + W + ',' + H, '--virtual-time-budget=28000',
  '--screenshot=' + path.join(__dirname, out), url],
  { maxBuffer: 64 * 1024 * 1024, windowsHide: true }, (err, stdout, stderr) => {
    if (err) { console.error('ERR', err.message); process.exit(1); }
    console.log((stderr || stdout || '').split('\n').filter(l => /written to file/.test(l)).join('\n') || 'done');
  });
