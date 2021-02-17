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
/// Note that this application specifies IPv6 instead of IPv4 as a default
/// address family because IPv6 sockets can also receive IPv4, but vice versa
/// is typically not the case.
///
/// usage: node channel.js [ address [ sinkport [ sourceport ] ] ]
/// default: node channel.js [ localhost [ tesoro [ tesoro ] ] ]
/// example: node channel.js [ 192.168.1.253 [ 22020 [ 22020 ] ] ]

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
  console.log('Receiver ' + request.socket.remoteAddress + ' ' + request.socket.remotePort);
  if (output != null) {
    console.log('Responding ' + output);
    response.statusCode = 200;
    response.setHeader('Content-Type', 'application/json');
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', '*');
    response.setHeader('Access-Control-Allow-Methods', '*');
    response.end(output);
  } else {
    response.statusCode = 404;
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
// STARTER
//

function starter(address, family, source, sink) {

  console.log('Start ' + address + ' IPv' + family + ' '  + source + ' ' + sink);

  producer.listen(source, address, () => {
    console.log('Producer ' + address + ' ' + source);
  });

  consumer.bind(sink);

}

//
// ACQUIRE COMMAND LINE ARGUMENTS
//

let vector = process.argv.slice(2);

if (vector.length > 0) { hostname = vector[0]; }
if (vector.length > 1) { incoming = vector[1]; outgoing = vector[2]; }
if (vector.length > 2) { outgoing = vector[2]; }

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
// RESOLVE HOST NAME AND START
//

const dnsoptions = { family: 6, hints: dns.ADDRCONFIG | dns.V4MAPPED, };

dns.lookup(hostname, dnsoptions, (error, address, family) => {
  console.log('Hostname ' + hostname + ' ' + address + ' IPv' + family);
  starter(address, family, source, sink);
});
