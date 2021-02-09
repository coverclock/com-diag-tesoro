/// @file movingmap.js
/// Copyright 2021 by the Digital Aggregates Corporation, Arvada Colorado USA.
/// Licensed under the terms in LICENSE.txt.
/// <https://github.com/coverclock/com-diag-tesoro>
/// <mailto: mailto:coverclock@diag.com>
/// Renders a continuous moving-map display in real-time or from playback.

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

  const MODULO = 60;
  const THRESHOLD = 2;

  const INITIALIZING = 'i';
  const HOSTING = 'h';
  const SEQUENCING = 'n';
  const EPOCHING = 'e';
  const WAITING = 'w';
  const MOVING = 'm';

  if (Tesoro_map == null) {

    // Initialize leaflet. This should be done once and only once.

    Tesoro_map = L.map('map', { center: [ lat, lon ], zoom: 18 });
    L.tileLayer('http://maps/hot/{z}/{x}/{y}.png', { maxZoom: 19, attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>' }).addTo(Tesoro_map);
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

    if ((Tesoro_state != HOSTING) || ((Tesoro_sequence % MODULO) == 0)) {
      console.log('NAM ' + nam);
      Tesoro_report('Hosting');
      Tesoro_state = HOSTING;
    }

  } else if (num == Tesoro_sequence) {

    // Expected: the sequence NUMber has repeated due to sampling.

    if (Tesoro_stall < THRESHOLD) {
      Tesoro_stall = Tesoro_stall + 1;
    } else if (Tesoro_stall == THRESHOLD) {
      Tesoro_report('Stalling');
      Tesoro_stall = Tesoro_stall + 1;
    } else  {
      // Do nothing.
    }

  } else if (num < Tesoro_sequence) {

    // Unexpected: the sequence NUMber has run backwards.

    if ((Tesoro_state != SEQUENCING) || ((Tesoro_sequence % MODULO) == 0)) {
      console.log('NUM ' + num);
      Tesoro_report('Sequencing');
      Tesoro_state = SEQUENCING;
    }

    Tesoro_stall = 0;

  } else if (tim <= Tesoro_epoch) {

    // Unexpected: the epoch TIMe has run backwards.

    if ((Tesoro_state != EPOCHING) || ((Tesoro_sequence % MODULO) == 0)) {
      console.log('TIM ' + tim);
      Tesoro_report('Epoching');
      Tesoro_state = EPOCHING;
    }

    Tesoro_stall = 0;

  } else if ((lat == Tesoro_latitude) && (lon == Tesoro_longitude) && (msl == Tesoro_meansealevel)) {

    // Unusual: the latitude, longitude, and altitude has not changed.

    Tesoro_youarehere.setPopupContent(lbl);

    Tesoro_sequence = num;
    Tesoro_epoch = tim;
    Tesoro_label = lbl;

    if ((Tesoro_state != WAITING) || ((Tesoro_sequence % MODULO) == 0)) {
      Tesoro_report('Waiting');
      Tesoro_state = WAITING;
    }

    Tesoro_stall = 0;

  } else {

    // Nominal: update the map.

    Tesoro_map.panTo([ lat, lon ]);
    Tesoro_youarehere.setLatLng([ lat, lon ]).setPopupContent(lbl);

    Tesoro_sequence = num;
    Tesoro_epoch = tim;
    Tesoro_latitude = lat;
    Tesoro_longitude = lon;
    Tesoro_meansealevel = msl;
    Tesoro_label = lbl;

    if ((Tesoro_state != MOVING) || ((Tesoro_sequence % MODULO) == 0)) {
      Tesoro_report('Moving');
      Tesoro_state = MOVING;
    }

    Tesoro_stall = 0;

  }

}

/// @function Tesoro_parse
/// Parse the required parameters out of the datagram and pass to the renderer.
/// @param {datagram} is the JSON payload of the observation.
function Tesoro_parse(datagram) {

  let nam = null
  let num = null
  let tim = null
  let lat = null
  let lon = null
  let msl = null
  let lbl = null

  // Extract the fields from the JSON datagram in the observation.

  try {
    let record = JSON.parse(datagram);
    nam = record.NAM;
    num = record.NUM + 0;
    tim = record.TIM + 0;
    lat = record.LAT + 0.0;
    lon = record.LON + 0.0;
    msl = record.MSL + 0.0;
    lbl = record.LBL;
  } catch(iregrettoinformyou) {
    console.log('Error ' + datagram + ' ' + iregrettoinformyou);
    Tesoro_report('Parsing ');
    return;
  }

  Tesoro_render(nam, num, tim, lat, lon, msl, lbl);

}

let Tesoro_timer = null;

/// @function Tesoro_periodic
/// Periodically extract the JSON datagram from the observation and process it.
/// @param {observation} is the File object that is the observation file.
function Tesoro_periodic(observation) {

  const PERIOD = 500;

  const RESTART = 'R';

  let consumer = new FileReader();

  consumer.onload = function(sothishappened) {
    Tesoro_parse(sothishappened.target.result);
    Tesoro_timer = setTimeout(Tesoro_periodic, PERIOD, observation);
  };

  consumer.onerror = function(sothishappened) {
    console.log('Error ' + observation.name + ' ' + consumer.error);
    Tesoro_report('Restarting');
    Tesoro_state = RESTART;
    // The automatic restart doesn't work. My guess is that the File
    // object that observable points to is (perhaps deliberately)
    // contaminated by the handling of the NotReadableError in the
    // FileReader. This is why restarting the moving map by reselecting
    // works: it generates a new File object. This leaves open the question
    // of why the NotReadableError occurs in the first place, and
    // almost always near the beginning of observation stream, and a
    // subsequent manual restart sometimes runs to completion over the
    // span of many minutes.
    // Tesoro_timer = setTimeout(Tesoro_periodic, PERIOD, observation);
    alert('Reselect ' + observation.name + ' ' + consumer.error);
  }

  consumer.readAsText(observation);
}

/// @function Tesoro_movingmap
/// Given a File object that is an observation file, start the moving map.
/// @param {observation} is the File object that is the observation file.
function Tesoro_movingmap(observation) {

  const READING = 'r';

  try {
    if (Tesoro_timer != null) { clearTimeout(Tesoro_timer); }
    console.log('Observing ' + observation.name);
    Tesoro_report('Reading');
    Tesoro_state = READING;
    Tesoro_periodic(observation);
  } catch (iregrettoinformyou) {
    console.log('Error ' + observation.name + ' ' + iregrettoinformyou);
  }

}
