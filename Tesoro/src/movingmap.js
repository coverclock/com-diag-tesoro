// Copyright 2021 by the Digital Aggregates Corporation, Arvada Colorado USA
// Licensed under the terms in LICENSE.txt
// https://github.com/coverclock/com-diag-tesoro
// mailto: mailto:coverclock@diag.com
// Renders a continuous moving-map display in real-time or from playback.

let Tesoro_host = null;
let Tesoro_sequence = null;
let Tesoro_epoch = null;
let Tesoro_latitude = null;
let Tesoro_longitude = null;
let Tesoro_meansealevel = null;
let Tesoro_label = null;

function Tesoro_report(name) {
  console.log(name + ' ' + Tesoro_host + ' ' + Tesoro_sequence + ' ' + Tesoro_epoch + ' ' + Tesoro_latitude + ' ' + Tesoro_longitude + ' ' + Tesoro_meansealevel + ' ' + Tesoro_label);
}

let Tesoro_map = null;

let Tesoro_youarehere = null;

let Tesoro_state = null;

function Tesoro_render(datagram) {

  let nam = null
  let num = null
  let tim = null
  let lat = null
  let lon = null
  let msl = null
  let lbl = null

  let record = null;
  try {
    record = JSON.parse(datagram);
    nam = record.NAM;
    num = record.NUM;
    tim = record.TIM;
    lat = record.LAT;
    lon = record.LON;
    msl = record.MSL;
    lbl = record.LBL;
  } catch(error) {
    console.log('Parsing ' + error);
    console.log(datagram);
    return;
  }

  const MODULO = 60;

  const INITIALIZING = 'i';
  const HOSTING = 'h';
  const SEQUENCING = 'n';
  const EPOCHING = 'e';
  const STATIONARY = 's';
  const MOVING = 'm';

  if (Tesoro_map == null) {

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

    if ((Tesoro_state != HOSTING) || ((Tesoro_sequence % MODULO) == 0)) {
      Tesoro_report('Host');
      console.log('NAM ' + nam);
      Tesoro_state = HOSTING;
    }

  } else if (num <= Tesoro_sequence) {

    if ((Tesoro_state != SEQUENCING) || ((Tesoro_sequence % MODULO) == 0)) {
      Tesoro_report('Sequence');
      console.log('NUM ' + num);
      Tesoro_state = SEQUENCING;
    }

  } else if (tim <= Tesoro_epoch) {

    if ((Tesoro_state != EPOCHING) || ((Tesoro_sequence % MODULO) == 0)) {
      Tesoro_report('Epoch');
      console.log('TIM ' + tim);
      Tesoro_state = EPOCHING;
    }

  } else if ((lat == Tesoro_latitude) && (lon == Tesoro_longitude) && (msl == Tesoro_meansealevel)) {

    Tesoro_youarehere.setPopupContent(lbl);

    Tesoro_sequence = num;
    Tesoro_epoch = tim;
    Tesoro_label = lbl;

    if ((Tesoro_state != STATIONARY) || ((Tesoro_sequence % MODULO) == 0)) {
      Tesoro_report('Stationary');
      Tesoro_state = STATIONARY;
    }

  } else {

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

  }

}

let Tesoro_consumer = null;

let Tesoro_timer = null;

function Tesoro_periodic(observation) {

  const DELAY = 1000;

  const REREADING = 'R';

  Tesoro_consumer = new FileReader();

  Tesoro_consumer.onload = function(sothishappened) {
    let datagram = sothishappened.target.result;
    Tesoro_render(datagram);
    Tesoro_timer = setTimeout(Tesoro_periodic, DELAY, observation);
  };

  Tesoro_consumer.onerror = function(sothishappened) {
    console.log('Rereading ' + Tesoro_consumer.error);
    Tesoro_consumer.abort();
    Tesoro_state = REREADING;
    Tesoro_timer = setTimeout(Tesoro_periodic, DELAY, observation);
  }

  Tesoro_consumer.onabort = function(sothishappened) {
    console.log('Aborting');
  }

  Tesoro_consumer.readAsText(observation);
}

function Tesoro_movingmap(observation) {

  const READING = 'r';

  try {

    if (Tesoro_timer != null) { clearTimeout(Tesoro_timer); }
    if (Tesoro_consumer != null) { Tesoro_consumer.abort(); }

    console.log('Reading ' + observation.name);
    Tesoro_state = READING;
    Tesoro_periodic(observation);

  } catch (error) {
    console.log('MovingMap ' + error);
  }

}
