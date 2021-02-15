com-diag-tesoro
==============

Musings with Open Street Maps (OSM).

# Copyright

Copyright 2021 by the Digital Aggregates Corporation, Colorado, USA.

# License

Licensed under the terms in LICENSE.txt. 

# Trademarks

"Digital Aggregates Corporation" is a registered trademark of the Digital
Aggregates Corporation, Arvada, Colorado USA.

"Chip Overclock" is a registered trademark of John Sloan, Arvada, Colorado,
USA.

# Contact

Chip Overclock    
Digital Aggregates Corporation/PNT Division    
3440 Youngfield Street, Suite 209    
Wheat Ridge CO 80033 USA    
<http://www.diag.com>    
<mailto:coverclock@diag.com>    

# Abstract

Tesoro is an integration of my Hazer software with OpenStreetMaps
(OSM). Tesoro includes the client-side JavaScript portion of the effort,
using HTML5 and the Leaflet 1.7.1 JavaScript library, and the server
side consisting of an OSM tile server.

Hazer is my GPS/GNSS/IMU project. Geolocation data being visualized by
Tesoro was collected using Hazer.

Diminuto is my C-based systems programming library that provides the
infrastructure for both Hazer and Tesoro.

# Examples

In the examples below, "tesoro" is a OSM tile server on a Raspberry Pi 4B
running behind my firewall and running OpenStreetMaps, currently with
the database and map data for North America.

The base page renders a static map centered the coordinates of my
Differential GNSS base station coordinates. This is a quick way to tell
of the tile server is working from any computer on the same network.

<http://tesoro/tesoro/base.html>

The query page takes a query URL containing a latitude and longitude,
in decimal degrees, and a label, and renders a map centered at those
coordinates. This is an easy way to view a static map from any computer
on the same network.

<http://tesoro/tesoro/query.html?NAM=hostname&NUM=1&TIM=1599145249&LAT=39.7943071&LON=-105.1533805&MSL=1710.300&&LBL=2020-09-03T15:00:49Z>

The draganddrop page renders a dynamic moving map display from data
collected using Hazer and fed to it via the Diminuto observation
feature via an initial drag-and-drop of the observation file. A marker
shows the target being tracked, and the map pans to keep the marker
centered. Clicking on the marker shows the time in UTC at which the
position was determined. This can be done in real-time or by playing back
a CSV file collected in the past. (The fun/tesorodraganddrop.sh script in
the Hazer repository is an example of the latter.)

<http://tesoro/tesoro/draganddrop.html>

The choosefile page renders a map from a JSON file selected by the
user from a pop-up menu.

<http://tesoro/tesoro/choosefile.html>

The selectchannel page renders a map from JSON fetched via a URL
endered by the user.

<http://tesoro/tesoro/selectchannel.html>

# Turning the safeties off Firefox (DANGEROUS)

1. Enter "about:config" on browser URL bar.
2. Click "Accept the Risk and Continue".
3. Click "Show All".
4. Enter "dom.max_script_runtime" into search box and hit return.
5. Click pencil icon for "dom.max_script_runtime".
6. Enter "86400" (or whatever) for "dom.max_script_runtime".
7. Click checkmark icon for "dom.max_script_runtime".
8. Repeat for "dom.max_script_runtime_without_important_user_imput".
9. Repeat for "dom.max_ext_content_script_run_time".
10. Quit and restart Firefox.

# Capturing Video

I've been using kazam, a Python 3-based screen capture utility.

    $ sudo apt-get install kazam

It works from a menu on my x86_64 Ubuntu systems. But on the Raspberry
Pi, I had to start it from the command line with an option to indicate
there is no sound hardware.

    $ kazam --nosound

(More about necessary kazam options to come.)

# Dependencies

    npm install terser -g

# Videos

<https://youtu.be/SUQuxQnq9yk>

# Repositories

<https://github.com/coverclock/com-diag-tesoro>

<https://github.com/coverclock/com-diag-hazer>

<https://github.com/coverclock/com-diag-diminuto>

<http://cdn.leafletjs.com/leaflet/v1.7.1/leaflet.zip>

# Resources

<https://ubuntu.com/tutorials/how-to-install-ubuntu-on-your-raspberry-pi>

<https://linuxize.com/post/how-to-configure-static-ip-address-on-ubuntu-20-04/>

<https://switch2osm.org/serving-tiles/manually-building-a-tile-server-20-04-lts/>

<https://download.geofabrik.de>

<https://switch2osm.github.io/serving-tiles/updating-as-people-edit/>

<https://leafletjs.com>

<https://www.html5rocks.com/en/tutorials/file/dndfiles//>

<https://javascript.info/file>

<https://www.sitepoint.com/javascript-execution-browser-limits/>

<https://support.mozilla.org/en-US/kb/warning-unresponsive-script>

<https://developer.mozilla.org/en-US/docs/Web>

<https://www.w3.org/TR/FileAPI/>

<https://www.oreilly.com/library/view/learning-javascript-design/9781449334840/ch13s15.html>

<https://eng.lyft.com/how-lyft-discovered-openstreetmap-is-the-freshest-map-for-rideshare-a7a41bf92ec>

<https://www.digitalocean.com/community/questions/blocked-by-cors-policy-the-access-control-allow-origin-mean-stack>

<https://nodejs.org/api/http.html>

<https://nodejs.org/api/net.html>

<https://nodejs.org/api/dgram.html>

<https://en.wikipedia.org/wiki/Cross-origin_resource_sharing>

<https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Access-Control-Allow-Headers>

<https://stackoverflow.com/questions/49447449/how-to-get-the-port-number-from-the-service-name-using-nodejs>

# References

D. Flanagan, "JavaScript: The Definitive Guide", 7th edition, O'Reilly, 2020
