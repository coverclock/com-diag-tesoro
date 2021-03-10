/// @file routemap.js
/// Copyright 2021 by the Digital Aggregates Corporation, Arvada Colorado USA.
/// Licensed under the terms in LICENSE.txt.
/// <https://github.com/coverclock/com-diag-tesoro>
/// <mailto: mailto:coverclock@diag.com>
/// Renders a static map display from a dataset of JSON coordinates.
/// Reference: https://stackoverflow.com/questions/8648892/how-to-convert-url-parameters-to-a-javascript-object

let Tesoro_map = null;

/// @function Tesoro_manifest
/// Initialize a new map and draw the route on it.
/// @param {route} is an array of arrays of latitude and longitude pairs.
function Tesoro_manifest(route, specific) {

  // Construct the tile server URL based on our own.

  const url = new URL(document.URL);
  let tileserver = url.origin + '/hot/{z}/{x}/{y}.png';
  console.log('Initializing ' + tileserver);

  // Extract the default options (if any) from the query string.

  let options = { color: 'red', weight: 3 };
  console.log('Defaults ' + JSON.stringify(options));

  const query = location.search;
  if (query != '') {
    let parameters = query.substring(1);
    let general = JSON.parse('{"' + parameters.replace(/&/g, '","').replace(/=/g,'":"') + '"}', function(key, value) { return key === "" ? value:decodeURIComponent(value) } );
    Object.assign(options, general);
    console.log('General ' + JSON.stringify(options));
  }

  Object.assign(options, specific);
  console.log('Specific ' + JSON.stringify(options));

  // Initialize the map.

  if (Tesoro_map == null) {
    Tesoro_map = L.map('map', { zoom: 18 });
    L.tileLayer(tileserver, { maxZoom: 19, attribution: '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>' }).addTo(Tesoro_map);
    L.control.scale().addTo(Tesoro_map);
  }

  // Construct the path.

  let line = L.polyline(route, options).addTo(Tesoro_map);

  // Get the bounds of the path and fit the map to it.

  let bounds = line.getBounds();
  console.log('Bounds [ ' + bounds.getNorth() + ', ' + bounds.getWest() + ' ] [ ' + bounds.getSouth() + ', ' + bounds.getEast() + ' ]');
  Tesoro_map.fitBounds(bounds);
}

/// @function_consume
/// Extract the array out of the path and pass it to the manifester.
/// @param {path} is the JSON object of the dataset.
function Tesoro_consume(path) {

  let route = null;
  let specific = null;

  // Extract the field from the JSON path.

  try {
    route = path.PATH;
    delete path.PATH;
    specific = path;
  } catch(iregrettoinformyou) {
    console.log('Error ' + path + ' ' + iregrettoinformyou);
    return;
  }

  console.log('Waypoints ' + route.length);

  Tesoro_manifest(route, specific);
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
