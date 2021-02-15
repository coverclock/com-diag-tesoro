/// @file observation.js
/// Copyright 2021 by the Digital Aggregates Corporation, Arvada Colorado USA.
/// Licensed under the terms in LICENSE.txt.
/// <https://github.com/coverclock/com-diag-tesoro>
/// <mailto: mailto:coverclock@diag.com>
/// Stand up a web server the responds to http requests with the latest
/// Hazer datagram containing a Tesoro JSON message. The input UDP port
/// is "tesoro", and the output TCP port is also "tesoro", as defined in
/// the /etc/services file.
/// usage: node server.js [ serveraddress [ sinkport [ sourceport ] ] ]
/// default: node server.js [ localhost [ tesoro [ tesoro ] ] ]
/// WORK IN PROGRESS

// DEFAULTS

let hostname = 'localhost';
let incoming = 'tesoro';
let outgoing = 'tesoro';

// PREREQUISITES

const http = require('http');
const dgram = require('dgram');
const dns = require('dns');

// UDP DATAGRAM CONSUMER

let consumer = dgram.createSocket('udp4');

consumer.on('error', (iregrettoinformyou) => {
  console.log('Consumer ${iregrettoinformyou.stack}');
  consumer.close();
});

consumer.on('listening', () => {
  const sink = consumer.address();
  console.log('Consumer ${sink.address}:${sink.port}');
});

let output = null;

consumer.on('message', (input, source) => {
  console.log('Received ${input} ${source.address}:${source.port}');
  try {
    let datagram = JSON.parse(input);
    const nam = datagram.NAM.length;
    datagram.NUM = datagram.NUM + 0;
    datagram.TIM = datagram.TIM + 0;
    datagram.LAT = datagram.LAT + 0.0;
    datagram.LON = datagram.LON + 0.0;
    datagram.MSL = datagram.MSL + 0.0;
    const lbl = datagram.LBL.length;
    output = JSON.stringify(datagram);
  } catch (iregrettoinformyou) {
    console.log('Parse ' + input + ' ' + iregrettoinformyou);
  }
});

// TCP HTTP PRODUCER

let producer = http.createServer((request, response) => {
  if (output != null) {
    console.log('Requested ${request}');
    console.log('Responding ${output}');
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.end(output);
  } else {
    res.statusCode = 404;
  }
});

// PARSE COMMAND LINE OPTIONS

let vector = process.argv.slice(2);

if (vector.length > 0) { hostname = vector[0]; }
if (vector.length > 1) { incoming = vector[1]; outgoing = vector[2]; }
if (vector.length > 2) { outgoing = vector[2]; }

// RESOLVE HOST NAME

let address = null;

const options = { family: 6, hints: dns.ADDRCONFIG | dns.V4MAPPED, };

dns.lookup(hostname, options, (error, resolution, family) => {
  console.log('Hostname ${hostname} ${resolution} ${family}');
  address = resolution;
});

// RESOLVE SERVICE NAME

let sink = null;
let source = null;

// START UP

if (address == null) {
  // Do nothing.
} else if (sink == null) {
  // Do nothing.
} else if (source == null) {
  // Do nothing.
} else {

  producer.listen(source, address, () => {
    console.log('Producer http://${address}:${port}');
  });

  consumer.bind(sink);

}
