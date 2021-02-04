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

In the examples below, the "maps" HTTP server is a Raspberry Pi 4B
running behind my firewall and running OpenStreetMaps, currently with
the database and map data for North America.

The base script renders a static map centered on my Differential GNSS
base station coordinates.

<http://maps/tesoro/base.html>

The query script takes a URL query containing a latitude and longitude,
in decimal degrees, and a label, and renders a map centered at those
coordinates:

<http://maps/tesoro/query.html?LAT=39.7943071&LON=-105.1533805&MSL=1710.300&LBL=2020-09-03T15:00:49Z>

The tesoro script renders a moving map display in real-time from data
collected using Hazer and fed to it via the Diminuto observation feature.

<http://maps/tesoro/tesoro.html>

# Videos

<https://youtu.be/SUQuxQnq9yk>

# Repositories

<https://github.com/coverclock/com-diag-tesoro>

<https://github.com/coverclock/com-diag-hazer>

<https://github.com/coverclock/com-diag-diminuto>

<http://cdn.leafletjs.com/leaflet/v1.7.1/leaflet.zip>

# References

<https://ubuntu.com/tutorials/how-to-install-ubuntu-on-your-raspberry-pi>

<https://linuxize.com/post/how-to-configure-static-ip-address-on-ubuntu-20-04/>

<https://switch2osm.org/serving-tiles/manually-building-a-tile-server-20-04-lts/>

<https://download.geofabrik.de>

<https://switch2osm.github.io/serving-tiles/updating-as-people-edit/>

<https://leafletjs.com>

<https://www.html5rocks.com/en/tutorials/file/dndfiles//>

<https://javascript.info/file>

# Resources

D. Flanagan, "JavaScript: The Definitive Guide", 7th edition, O'Reilly, 2020
