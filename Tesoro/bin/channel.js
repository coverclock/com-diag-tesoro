/// @file channel.js
/// Copyright 2021 by the Digital Aggregates Corporation, Arvada Colorado USA.
/// Licensed under the terms in LICENSE.txt.
/// <https://github.com/coverclock/com-diag-tesoro>
/// <mailto: mailto:coverclock@diag.com>
///
/// Stand up a web server the responds to http requests with the latest
/// Hazer datagram containing a Tesoro JSON message. The default input UDP port
/// is "tesoro", and the default output TCP port is also "tesoro", as defined
/// in the /etc/services file. In the context of Tesoro, this data communication
/// path is referred to as a "channel".
///
/// Note that the incoming datagram socket is created using family IPv6.
/// IPv6 sockets can receive from either IPv4 or IPv6 senders.
///
/// usage: node channel.js [ sinkport [ sourceport ] ]
/// default: node channel.js [ tesoro [ tesoro ] ]
/// example: node channel.js [ 22020 [ 22020 ] ]

//
// DEFAULTS
//

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

let producer = http.createServer((request, response) => {
  console.log('Receiver ' + request.socket.remoteAddress + ' ' + request.socket.remotePort);
  if (output != null) {
    console.log('Responding ' + output);
    response.setHeader('Content-Type', 'application/json');
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', '*');
    response.setHeader('Access-Control-Allow-Methods', '*');
    response.writeHead(200);
    response.end(output);
  } else {
    response.writeHead(404);
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
  const length = input.length;
  console.log('Sender ' + endpoint.address + ' ' + endpoint.port + ' ' + length);
  // Hazer tools like csv2dgm send a zero length datagram when they exit.
  if (length > 0) {
    try {
      // Validate.
      let datagram = JSON.parse(input);
      const nam = datagram.NAM.length;
      datagram.NUM = parseInt(datagram.NUM, 10);
      datagram.TIM = parseInt(datagram.TIM, 10);
      datagram.LAT = parseFloat(datagram.LAT);
      datagram.LON = parseFloat(datagram.LON);
      datagram.MSL = parseFloat(datagram.MSL);
      const lbl = datagram.LBL.length;
      // Normalize.
      output = JSON.stringify(datagram);
      console.log('Received ' + output);
    } catch (iregrettoinformyou) {
      console.log('Parse ' + input + ' ' + iregrettoinformyou);
    }
  }
});

//
// ACQUIRE COMMAND LINE ARGUMENTS
//

let vector = process.argv.slice(2);

if (vector.length > 0) { incoming = vector[0]; outgoing = incoming; }
if (vector.length > 1) { outgoing = vector[1]; }

//
// RESOLVE SERVICE NAME
//

const services = fs.readFileSync('/etc/services').toString();

let sinktemp = parseInt(incoming, 10);
if (!isNaN(sinktemp)) {
  sink = sinktemp;
} else if (services != null) {
  const sinkline = services.match(incoming + ".*udp");
  if (sinkline != null) {
    const sinkport = sinkline[0].match("[0-9]+")
    if (sinkport != null) {
      sinktemp = parseInt(sinkport, 10);
      if (!isNaN(sinktemp)) {
        sink = sinktemp;
      }
    }
  }
}
console.log('Sink ' + incoming + ' ' + sink);

let sourcetemp = parseInt(outgoing);
if (!isNaN(sourcetemp)) {
  source = sourcetemp;
} else if (services != null) {
  const sourceline = services.match(outgoing + ".*tcp");
  if (sourceline != null) {
    sourceport = sourceline[0].match("[0-9]+")
    if (sourceport != null) {
      sourcetemp = parseInt(sourceport, 10);
      if (!isNaN(sourcetemp)) {
        source = sourcetemp;
      }
    }
  }
}
console.log('Source ' + outgoing + ' ' + source);

//
// LISTEN
//

console.log('Start ' + source + ' ' + sink);

producer.listen(source, () => {
  console.log('Producer ' + source);
});

consumer.bind(sink);
