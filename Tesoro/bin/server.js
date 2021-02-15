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

//
// DEFAULTS
//

let hostname = 'localhost';
let incoming = 'tesoro';
let outgoing = 'tesoro';
let sink = 22020;
let source = 22020;

//
// PREREQUISITES
//

const http = require('http');
const dgram = require('dgram');
const dns = require('dns');
const fs = require('fs');

//
// TCP HTTP PRODUCER
//

const httpoptions = { };

let producer = http.createServer(httpoptions, (request, response) => {
  if (output != null) {
    console.log('Requested ' + request);
    console.log('Responding ' + output);
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.end(output);
  } else {
    res.statusCode = 404;
  }
});

//
// UDP DATAGRAM CONSUMER
//

let consumer = dgram.createSocket('udp6');

consumer.on('error', (iregrettoinformyou) => {
  console.log('Consumer ' + iregrettoinformyou.stack);
  consumer.close();
});

consumer.on('listening', () => {
  const endpoint = consumer.address();
  console.log('Consumer ' + endpoint.address + ':' + endpoint.port);
});

let output = null;

consumer.on('message', (input, endpoint) => {
  console.log('Received ' + input + ' ' + endpoint.address + ':' + endpoint.port);
  try {
    let datagram = JSON.parse(input);
    const nam = datagram.NAM.length;
    datagram.NUM = parseInt(datagram.NUM, 10);
    datagram.TIM = parseInt(datagram.TIM, 10);
    datagram.LAT = parseFloat(datagram.LAT);
    datagram.LON = parseFLoat(datagram.LON);
    datagram.MSL = parseFLoat(datagram.MSL);
    const lbl = datagram.LBL.length;
    output = JSON.stringify(datagram);
  } catch (iregrettoinformyou) {
    console.log('Parse ' + input + ' ' + iregrettoinformyou);
  }
});

//
// STARTER
//

function starter(address, source, sink) {

  console.log('Start ' + address + ' ' + source + ' ' + sink);

  producer.listen(source, address, () => {
    console.log('Producer http://' + address + ':' + source);
  });

  consumer.bind(sink);

}

//
// PARSE COMMAND LINE OPTIONS
//

let vector = process.argv.slice(2);

if (vector.length > 0) { hostname = vector[0]; }
if (vector.length > 1) { incoming = vector[1]; outgoing = vector[2]; }
if (vector.length > 2) { outgoing = vector[2]; }

//
// RESOLVE SERVICE NAME (seriously?)
//

const services = fs.readFileSync('/etc/services').toString();

const sinkline = services.match(incoming + ".*udp");
const sinkport = sinkline[0].match("[0-9]+")
if (sinkport != null) {
  sink = parseInt(sinkport, 10);
  console.log('Sink ' + incoming + ' ' + sink);
}

const sourceline = services.match(outgoing + ".*tcp");
const sourceport = sourceline[0].match("[0-9]+")
if (sourceport != null) {
  source = parseInt(sourceport, 10);
  console.log('Source ' + outgoing + ' ' + source);
}

//
// RESOLVE HOST NAME
//

let address = null;

const dnsoptions = { family: 6, hints: dns.ADDRCONFIG | dns.V4MAPPED, };

dns.lookup(hostname, dnsoptions, (error, resolution, family) => {
  console.log('Hostname ' + hostname + ' ' + resolution + ' IPv' + family);
  if (resolution != null) {
    address = resolution;
    starter(address, source, sink);
  }
});
