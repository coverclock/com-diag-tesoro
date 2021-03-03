/// @file controller.js
/// Copyright 2021 by the Digital Aggregates Corporation, Arvada Colorado USA.
/// Licensed under the terms in LICENSE.txt.
/// <https://github.com/coverclock/com-diag-tesoro>
/// <mailto: mailto:coverclock@diag.com>
///
/// Stand up a web server the responds to http requests with the latest
/// Hazer datagram containing a Tesoro JSON message whose NAM field
/// matches the page name in the URL. The default input UDP port
/// is "tesoro", and the default output TCP port is also "tesoro", as
/// defined in the /etc/services file. In the context of Tesoro, this
/// data communication path is referred to as a "channel". Since this
/// program handles multiple channels concurrently, it is called
/// "controller" to distinguish it from the original version that handled
/// a single channel (and also in the sense of the MVC design pattern).
///
/// Note that the incoming datagram socket is created using family IPv6.
/// IPv6 sockets can receive from either IPv4 or IPv6 senders.
///
/// USAGE
///
/// node controller.js [ sinkport [ sourceport ] ]
///
/// DEFAULT
///
/// node controller.js [ tesoro [ tesoro ] ]
///
/// EXAMPLES
///
/// node controller.js [ 22020 [ 22020 ] ]
///
/// TEST
///
/// while true; do wget -d -v -S -O - http://HOSTNAME:22020/NAM.json 2> /dev/null; echo; sleep 1;  done
///

//
// CONSTANTS
//

const NL = 10;

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
// CACHES
//

let senders = new Map();
let names = new Map();

//
// TCP HTTP PRODUCER
//

let producer = http.createServer((request, response) => {
  console.log('Request ' + request.socket.remoteAddress + ' ' + request.socket.remotePort + ' ' + request.url);
  try {
    const path = request.url;
    if (path.length < 7) { throw new Error('Short'); }
    if (path[0] != '/') { throw new Error('Unexpected'); }
    const relative = path.slice(1);
    const suffix = relative.slice(relative.length - 5);
    if (suffix != '.json') { throw new Error('Suffix'); }
    const name = relative.slice(0, relative.length - 5);
    if (!names.has(name)) { throw new Error('Unknown'); }
    const output = names.get(name);
    console.log('Responding ' + output);
    response.setHeader('Content-Type', 'application/json');
    response.setHeader('Access-Control-Allow-Origin', '*');
    response.setHeader('Access-Control-Allow-Headers', '*');
    response.setHeader('Access-Control-Allow-Methods', '*');
    response.writeHead(200);
    response.end(output);
  } catch (iregrettoinformyou) {
    console.log('Request ' + iregrettoinformyou);
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

consumer.on('message', (input, endpoint) => {
  console.log('Sender ' + endpoint.address + ' ' + endpoint.port);
  const sender = '[' + endpoint.address + ']:' + endpoint.port;
  // Check for end of stream.
  const length = input.length;
  if (length == 0) {
    if (senders.has(sender)) {
      const name = senders.get(sender);
      if (names.has(name)) {
        names.delete(name);
      }
      senders.delete(sender);
      console.log('Stopping ' + sender + ' ' + name);
    }
  } else {
    try {
      if (input[length - 1] != NL) { throw new Error('Newline'); }
      console.log('Received ' + input.slice(0, length - 1));
      // Parse.
      const datagram = JSON.parse(input);
      // Validate.
      if (datagram.NAM.length <= 0) { throw new Error('NAM'); }
      datagram.NUM = parseInt(datagram.NUM, 10);
      datagram.TIM = parseInt(datagram.TIM, 10);
      datagram.LAT = parseFloat(datagram.LAT);
      datagram.LON = parseFloat(datagram.LON);
      datagram.MSL = parseFloat(datagram.MSL);
      if (datagram.LBL.length <= 0) { throw new Error('LBL'); }
      // Normalize.
      const output = JSON.stringify(datagram);
      // Cache
      if (!senders.has(sender)) {
        console.log('Starting ' + sender + ' ' + datagram.NAM);
      }
      senders.set(sender, datagram.NAM);
      names.set(datagram.NAM, output);
    } catch (iregrettoinformyou) {
      console.log('Received ' + iregrettoinformyou);
    }
  }
});

//
// ACQUIRE COMMAND LINE ARGUMENTS
//

const vector = process.argv.slice(2);

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
