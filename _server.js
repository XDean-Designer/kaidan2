const http = require('http');
const fs = require('fs');
const path = require('path');
http.createServer((req, res) => {
  let url = req.url.split('?')[0];
  if (url === '/') url = '/index.html';
  const fp = path.join(process.cwd(), url);
  if (!fs.existsSync(fp)) { res.writeHead(404); res.end('not found'); return; }
  res.writeHead(200, { 'Content-Type': fp.endsWith('.html') ? 'text/html' : 'application/octet-stream' });
  res.end(fs.readFileSync(fp));
}).listen(8123, () => console.log('server on 8123'));
