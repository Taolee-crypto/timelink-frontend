const http = require('http');
const httpProxy = require('http-proxy');
const proxy = httpProxy.createProxyServer({});
http.createServer((req, res) => {
  proxy.web(req, res, { target: 'http://localhost:5000' });
}).listen(3003, () => console.log('프록시:3003 -> 5000'));
