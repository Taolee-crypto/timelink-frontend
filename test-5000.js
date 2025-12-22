const http = require('http');
http.createServer((req, res) => {
  res.end(JSON.stringify({success: true, port: 5000, path: req.url}));
}).listen(5000, () => console.log('테스트 서버:5000'));
