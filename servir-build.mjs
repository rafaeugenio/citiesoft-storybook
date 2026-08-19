import http from 'node:http'; import fs from 'node:fs'; import path from 'node:path';
const root = path.resolve('storybook-static');
const t = {'.html':'text/html','.js':'text/javascript','.css':'text/css','.json':'application/json','.svg':'image/svg+xml','.png':'image/png','.woff2':'font/woff2'};
http.createServer((req,res)=>{const u=decodeURIComponent(req.url.split('?')[0]);
let f=path.join(root,u==='/'?'index.html':u);
if(!fs.existsSync(f)||fs.statSync(f).isDirectory())f=path.join(root,'index.html');
res.writeHead(200,{'content-type':t[path.extname(f)]??'application/octet-stream'});fs.createReadStream(f).pipe(res);
}).listen(6100,()=>console.log('build estático em http://localhost:6100'));
