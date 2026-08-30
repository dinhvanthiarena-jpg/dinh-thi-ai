const http = require('http');
const fs = require('fs');
const path = require('path');
const root = __dirname;
const mime = { '.html':'text/html', '.js':'application/javascript', '.css':'text/css', '.webp':'image/webp', '.png':'image/png', '.jpg':'image/jpeg' };
http.createServer((req, res) => {
  let p = decodeURIComponent(req.url.split('?')[0]);
  if (p === '/') p = '/_crop_test_tmp.html';
  const fp = path.join(root, p);
  fs.readFile(fp, (err, data) => {
    if (err) { res.writeHead(404); res.end('not found'); return; }
    res.writeHead(200, { 'Content-Type': mime[path.extname(fp)] || 'application/octet-stream' });
    res.end(data);
  });
}).listen(8947, () => console.log('serving on 8947'));
