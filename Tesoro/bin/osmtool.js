/// @file observation.js
/// Copyright 2021 by the Digital Aggregates Corporation, Arvada Colorado USA.
/// Licensed under the terms in LICENSE.txt.
/// <https://github.com/coverclock/com-diag-tesoro>
/// <mailto: mailto:coverclock@diag.com>
/// Stand up a web server the responds to HTTP requests with the latest
/// Hazer datagram containing a Tesoro JSON message. The input UDP port
/// is "tesoro", and the output TCP port is also "tesoro", as defined in
/// the /etc/services file.
/// WORK IN PROGRESS

const http = require('http');
const dgram = require('dgram');

const hostname = 'tesoro';
const port = 'tesoro';

const consumer = dgram.createSocket('udp4');

consumer.on('error', (iregrettoinformyou) => {
  console.log('Consumer ' + iregrettoinformyou.stack);
  consumer.close();
});

consumer.on('listening', () => {
  const sink = consumer.address();
  console.log('Consumer listening at ' + sink.address + ':' + sink.port);
});

const datagram = null;

consumer.on('message', (input, source) => {
  consumer.log('Received ' + input + ' from ' + source.address + ':' + source.port);
  try {
    let validated = JSON.parse(input);
    const nam = validated.NAM.length;
    validated.NUM = validated.NUM + 0;
    validated.TIM = validated.TIM + 0;
    validated.LAT = validated.LAT + 0.0;
    validated.LON = validated.LON + 0.0;
    validated.MSL = validated.MSL + 0.0;
    const lbl = validated.LBL.length;
    datagram = validated;
  } catch (iregrettoinformyou) {
    console.log('Parse ' + input + ' ' + iregrettoinformyou);
  }
});

const producer = http.createServer((req, res) => {
  if (datagram != null) {
    const output = JSON.stringify(datagram);
    res.statusCode = 200;
    res.setHeader('Content-Type', 'application/json');
    res.end(output);
  } else {
    res.statusCode = 404;
  }
});

producer.listen(port, hostname, () => {
  console.log(`Producer listening at http://${hostname}:${port}/`);
});

consumer.bind(port);
