/// @file movingmap.js
/// Copyright 2021 by the Digital Aggregates Corporation, Arvada Colorado USA.
/// Licensed under the terms in LICENSE.txt.
/// <https://github.com/coverclock/com-diag-tesoro>
/// <mailto: mailto:coverclock@diag.com>
/// Renders a continuous moving-map display in real-time or from playback.

const TESORO_PERIOD = 500;
const TESORO_THRESHOLD = 120;
const TESORO_MODULO = 10;

let Tesoro_host = '?';
let Tesoro_sequence = 0;
let Tesoro_epoch = 0;
let Tesoro_latitude = 0.0;
let Tesoro_longitude = 0.0;
let Tesoro_meansealevel = 0.0;
let Tesoro_label = '?';

/// @function Tesoro_report
/// Report the latest valid values extracted from an observation to the console.
/// @param {name} is the string prepended to the output text.
function Tesoro_report(name) {
  console.log(name + ' ' + Tesoro_host + ' ' + Tesoro_sequence + ' ' + Tesoro_epoch + ' ' + Tesoro_latitude + ' ' + Tesoro_longitude + ' ' + Tesoro_meansealevel + ' ' + Tesoro_label);
}

let Tesoro_map = null;

let Tesoro_youarehere = null;

let Tesoro_state = null;

const TESORO_STALLED = 's';

let Tesoro_stall = 0;

/// @function Tesoro_render
/// Initialize a new map or update an existing map with the latest observation.
/// @param {nam} is the name of the node generating the data.
/// @param {num} is a monotonically increasing sequence number.
/// @param {tim} is GPS-generated UTC time in seconds after the POSIX epoch.
/// @param {lat} is the latitude in signed decimal degrees.
/// @param {lon} is the longitude in signed decimal degrees.
/// @param {msl} is the altitude in meters above mean sea level.
/// @param {lbl} is a label to apply to the marker on the map.
function Tesoro_render(nam, num, tim, lat, lon, msl, lbl) {

  const INITIALIZING = 'i';
  const HOSTING = 'h';
  const SEQUENCING = 'n';
  const EPOCHING = 'e';
  const WAITING = 'w';
  const MISSING = 'x';
  const MOVING = 'm';

  if (Tesoro_state == TESORO_STALLED) {

    // Do nothing.

  } else if (Tesoro_map == null) {

    const url = new URL(document.URL);
    let tileserver = url.origin + '/hot/{z}/{x}/{y}.png';
    console.log('Initializing ' + tileserver);

    // Initialize leaflet. This should be done once and only once.

    Tesoro_map = L.map('map', { center: [ lat, lon ], zoom: 18 });
    L.tileLayer(tileserver, { maxZoom: 19, attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>' }).addTo(Tesoro_map);
    L.control.scale().addTo(Tesoro_map);
    Tesoro_youarehere = L.marker([ lat, lon ]);
    Tesoro_youarehere.addTo(Tesoro_map).bindPopup(lbl);

    Tesoro_host = nam;
    Tesoro_sequence = num;
    Tesoro_epoch = tim;
    Tesoro_latitude = lat;
    Tesoro_longitude = lon;
    Tesoro_meansealevel = msl;
    Tesoro_label = lbl;

    Tesoro_report('Starting');
    Tesoro_state = INITIALIZING;

  } else if (nam != Tesoro_host) {

    // Unexpected: the host NAMe has changed.

    if ((Tesoro_state != HOSTING) || ((Tesoro_sequence % TESORO_MODULO) == 0)) {
      console.log('NAM ' + nam);
      Tesoro_report('Hosting');
      Tesoro_state = HOSTING;
    }

  } else if (num == Tesoro_sequence) {

    // Expected: the sequence NUMber has repeated due to sampling or stalling.

    if (Tesoro_stall < TESORO_THRESHOLD) {
      Tesoro_stall = Tesoro_stall + 1;
    } else if (Tesoro_stall == TESORO_THRESHOLD) {
      Tesoro_report('Stalling');
      Tesoro_state = TESORO_STALLED;
      alert('Stalled');
      Tesoro_stall = Tesoro_stall + 1;
    } else  {
      // Do nothing.
    }

  } else if (num < Tesoro_sequence) {

    // Unexpected: the sequence NUMber has run backwards.

    if ((Tesoro_state != SEQUENCING) || ((Tesoro_sequence % TESORO_MODULO) == 0)) {
      console.log('NUM ' + num);
      Tesoro_report('Repeating');
      Tesoro_state = SEQUENCING;
    }

    Tesoro_stall = 0;

  } else if (tim <= Tesoro_epoch) {

    // Unexpected: the epoch TIMe has not advanced.

    if ((Tesoro_state != EPOCHING) || ((Tesoro_sequence % TESORO_MODULO) == 0)) {
      console.log('TIM ' + tim);
      Tesoro_report('Retrograding');
      Tesoro_state = EPOCHING;
    }

    Tesoro_stall = 0;

  } else if ((lat == Tesoro_latitude) && (lon == Tesoro_longitude)) {

    // Unusual: the latitude and longitude has not changed.

    Tesoro_youarehere.setPopupContent(lbl);

    Tesoro_sequence = num;
    Tesoro_epoch = tim;
    Tesoro_meansealevel = msl;
    Tesoro_label = lbl;

    if ((Tesoro_state != WAITING) || ((Tesoro_sequence % TESORO_MODULO) == 0)) {
      Tesoro_report('Stationary');
      Tesoro_state = WAITING;
    }

    Tesoro_stall = 0;

  } else {

    // Nominal: update the map.

    Tesoro_map.panTo([ lat, lon ]);
    Tesoro_youarehere.setLatLng([ lat, lon ]).setPopupContent(lbl);

    const expected = Tesoro_sequence + 1;
    if (num > expected) {
      Tesoro_report('Missing');
      Tesoro_state = MISSING;
    }

    Tesoro_sequence = num;
    Tesoro_epoch = tim;
    Tesoro_latitude = lat;
    Tesoro_longitude = lon;
    Tesoro_meansealevel = msl;
    Tesoro_label = lbl;

    if ((Tesoro_state != MOVING) || ((Tesoro_sequence % TESORO_MODULO) == 0)) {
      Tesoro_report('Moving');
      Tesoro_state = MOVING;
    }

    Tesoro_stall = 0;

  }

}

/// @function_extract
/// Extract the fields out of the record and pass it to the renderer.
/// @param {record} is the JSON object of the datagram.
function Tesoro_extract(record) {

  let nam = null
  let num = null
  let tim = null
  let lat = null
  let lon = null
  let msl = null
  let lbl = null

  // Extract the fields from the JSON record.

  try {
    nam = record.NAM;
    num = parseInt(record.NUM, 10);
    tim = parseInt(record.TIM, 10);
    lat = parseFloat(record.LAT);
    lon = parseFloat(record.LON);
    msl = parseFloat(record.MSL);
    lbl = record.LBL;
  } catch(iregrettoinformyou) {
    console.log('Error ' + record + ' ' + iregrettoinformyou);
    Tesoro_report('Extracted');
    return;
  }

  Tesoro_render(nam, num, tim, lat, lon, msl, lbl);
}

/// @function Tesoro_parse
/// Parse the required parameters out of the datagram and pass to the renderer.
/// @param {datagram} is the JSON payload of the observation.
function Tesoro_parse(datagram) {

  let record = null;

  // Parse the record from the datagram.

  try {
    record = JSON.parse(datagram);
  } catch(iregrettoinformyou) {
    console.log('Error ' + datagram + ' ' + iregrettoinformyou);
    Tesoro_report('Parsed');
    return;
  }

  Tesoro_extract(record);

}

let Tesoro_timer = null;

/// @function Tesoro_read
/// Periodically extract the JSON datagram from the observation and process it.
/// @param {observation} is the File object that is the observation file.
function Tesoro_read(observation) {

  // Read the datagram from the observation.

  let consumer = new FileReader();

  consumer.onload = function(sothishappened) {
    let datagram = sothishappened.target.result
    Tesoro_parse(datagram);
    if (Tesoro_state != TESORO_STALLED) {
      Tesoro_timer = setTimeout(Tesoro_read, TESORO_PERIOD, observation);
    } else if (Tesoro_timer != null) {
      clearTimeout(Tesoro_timer);
    } else {
      // Do nothing.
    }
  };

  consumer.onerror = function(sothishappened) {
    console.log('Error ' + observation.name + ' ' + consumer.error);
    Tesoro_report('Read');
    alert('Reselect ' + observation.name + ' ' + consumer.error);
  }

  consumer.readAsText(observation);
}

/// @function Tesoro_file
/// Given a File object that is an observation file, start the moving map.
/// @param {observation} is the File object that is the observation file.
function Tesoro_file(observation) {

  // This doesnt' work reliably, although it can run for many minutes and
  // is easily restarted manually by the user. I think the problem is a
  // lock conflict between Firefox (the browser with which I typically test)
  // and the renameat(2) system call used by the Diminuto observation feature.

  try {
    if (Tesoro_timer != null) {
      clearTimeout(Tesoro_timer);
    }
    console.log('File ' + observation.name);
    Tesoro_report('Reading');
    Tesoro_state = null;
    Tesoro_read(observation);
  } catch (iregrettoinformyou) {
    console.log('Error ' + observation.name + ' ' + iregrettoinformyou);
    Tesoro_report('Filed');
  }

}

/// @function Tesoro_fetch
/// Given a URL to an observation file, fetch it and start the moving map.
/// @param {channel} is the URL to an observation file.
function Tesoro_fetch(channel) {

  let data = {};

  fetch(channel, {
    method: 'POST',
    mode: 'cors',
    cache: 'no-store',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
  .then(response => response.json())
  .then(data => {
    Tesoro_extract(data);
    if (Tesoro_state != TESORO_STALLED) {
      Tesoro_timer = setTimeout(Tesoro_fetch, TESORO_PERIOD, channel);
    } else if (Tesoro_timer != null) {
      clearTimeout(Tesoro_timer);
    } else {
      // Do nothing.
    }
  })
  .catch((iregrettoinformyou) => {
    console.log('Error ' + channel + ' ' + iregrettoinformyou);
    Tesoro_report('Fetched');
  });

}

/// @function Tesoro_channel
/// Start the channel fetch.
/// @param {channel} is the URL to an observation file.
function Tesoro_channel(channel) {
  console.log('Channel ' + channel);
  Tesoro_report('Fetching');
  Tesoro_state = null;
  Tesoro_fetch(channel);
}

/// @function Tesoro_query
/// Given a URL, use the query parameters to render a map.
/// @param {url} is a URL, perhaps from the current document.
function Tesoro_query(url) {

  let nam = null
  let num = null
  let tim = null
  let lat = null
  let lon = null
  let msl = null
  let lbl = null

  console.log('Query ' + [...url.searchParams]);
  Tesoro_report('Querying');
  try {
    nam = url.searchParams.get('NAM');
    num = parseInt(url.searchParams.get('NUM'), 10);
    tim = parseInt(url.searchParams.get('TIM'), 10);
    lat = parseFloat(url.searchParams.get('LAT'));
    lon = parseFloat(url.searchParams.get('LON'));
    msl = parseFloat(url.searchParams.get('MSL'));
    lbl = url.searchParams.get('LBL');
  } catch (iregrettoinformyou) {
    console.log('Error ' + [...url.searchParams] + ' ' + iregrettoinformyou);
    Tesoro_report('Queried');
    return;
  }

  Tesoro_render(nam, num, tim, lat, lon, msl, lbl);

}
