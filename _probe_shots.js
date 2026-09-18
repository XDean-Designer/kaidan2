const { execFile } = require('child_process');
const path = require('path');
const chrome = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const helper = 'file:///' + path.join(__dirname, '_shot_v3.html').replace(/\\/g, '/').replace(/[^\x00-\x7F]/g, c => encodeURIComponent(c));
const views = process.argv.slice(2);
if (!views.length) views.push('s1-closed');
(async () => {
  for (const v of views) {
    await new Promise((res) => {
      execFile(chrome, ['--headless=new', '--disable-gpu', '--allow-file-access-from-files',
        '--virtual-time-budget=45000', '--dump-dom', helper + '?v=' + v + '&t=' + Date.now()],
        { maxBuffer: 64 * 1024 * 1024, windowsHide: true }, (err, stdout) => {
          const m = stdout.match(/<pre id="rep"[^>]*>([\s\S]*?)<\/pre>/);
          console.log('[' + v + '] ' + (m ? m[1].trim() : '(no rep)'));
          res();
        });
    });
  }
  process.exit(0);
})();
