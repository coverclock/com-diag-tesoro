const http = require('http');

const hostname = 'tesoro';
const port = 3000;

const base = { "NAM": "base", "NUM": 1, "TIM": 1599145249, "LAT": 39.7943071, "LON": -105.1533805, "MSL": 1710.300, "LBL": "2020-09-03T15:00:49Z" };

const server = http.createServer((req, res) => {
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.end(JSON.stringify(base));
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});
