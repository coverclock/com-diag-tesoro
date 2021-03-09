/// @file routemap.js
/// Copyright 2021 by the Digital Aggregates Corporation, Arvada Colorado USA.
/// Licensed under the terms in LICENSE.txt.
/// <https://github.com/coverclock/com-diag-tesoro>
/// <mailto: mailto:coverclock@diag.com>
/// Renders a static map display from a dataset of JSON coordinates.

/// @function Tesoro_manifest
/// Initialize a new map and draw the route on it.
/// @param {route} is an array of arrays of latitude and longitude pairs.
function Tesoro_manifest(route) {

  const url = new URL(document.URL);
  let tileserver = url.origin + '/hot/{z}/{x}/{y}.png';
  console.log('Initializing ' + tileserver);

  let map = L.map('map', { zoom: 18 });
  L.tileLayer(tileserver, { maxZoom: 19, attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>' }).addTo(map);
  L.control.scale().addTo(map);

  let line = L.polyline(route, { color: 'red' }).addTo(map);

  map.fitBounds(line.getBounds());
}

/// @function_consume
/// Extract the array out of the path and pass it to the manifester.
/// @param {path} is the JSON object of the dataset.
function Tesoro_consume(path) {

  let route = null;

  // Extract the field from the JSON path.

  try {
    route = path.PATH;
  } catch(iregrettoinformyou) {
    console.log('Error ' + path + ' ' + iregrettoinformyou);
    return;
  }

  Tesoro_manifest(route);
}

/// @function Tesoro_import
/// Parse the array out of the path and pass to the consumer.
/// @param {payload} is the JSON payload of the dataset.
function Tesoro_import(payload) {

  let path = null;

  // Parse the path from the payload.

  try {
    path = JSON.parse(payload);
  } catch(iregrettoinformyou) {
    console.log('Error ' + payload + ' ' + iregrettoinformyou);
    return;
  }

  Tesoro_consume(path);

}

/// @function Tesoro_dataset
/// @param {dataset} is the File object that is the waypoint dataset.
function Tesoro_dataset(dataset) {

  console.log('Dataset ' + dataset.name);

  // Import the text from the file.

  let consumer = new FileReader();

  consumer.onload = function(sothishappened) {
    let payload = sothishappened.target.result
    Tesoro_import(payload);
  };

  consumer.onerror = function(sothishappened) {
    console.log('Error ' + dataset.name + ' ' + consumer.error);
    alert('Dataset ' + dataset.name + ' ' + consumer.error);
  }

  consumer.readAsText(dataset);

}
