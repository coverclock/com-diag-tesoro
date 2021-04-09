com-diag-tesoro
==============

Client And Server Side JavaScript Using OpenStreetMap (OSM) To Render Maps.

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

# Disclaimer

I was not a web developer before tackling this project. I am still not
a web developer. JavaScript will not be appearing on my resume.

# Abstract

Tesoro is an application of OpenStreetMap (OSM), an open-source
alternative to Google Maps. Its purpose is to integrate my own geolocation
software with OSM for the purposes of visualizing geolocation data
streams either in real-time, or as collected and played back. Tesoro
includes both client-side and server-side JavaScript code (see disclaimer
above). The client-side code uses the Leaflet 1.7.1 JavaScript library
(see link below) and an OSM tile (map segment) server. The tile server
runs under Ubuntu on a Raspberry Pi. Tesoro processes geolocation data
represented in JavaScript Object Notation (JSON) form, and visualizes
it in a static or moving-map display using a web browser.

Here is a forty-five minute (45m) video (so feel free to skip around)
of the moving map display, The dataset being played back was generated
during a drive on 2020-09-17 in which I evaluated a u-blox UBX-NEO-M8U
device. The UBX-NEO-M8U incorporated both a Global Navigation Satellite
System (GNSS) receiver and an Inertial Measurement Unit (IMU). FOR BEST
RESULTS: switch to the High Definition version using the YouTube Settings
cogwheel in the lower right portion of the display.

<https://youtu.be/GjR7fPQRCZc>

Here is an image of a static map generated by that portion of Tesoro.
Multiple routes can be rendered on the same map, and the route colors
(here, blue and red) and other attributes can be changed from the
defaults.

<https://flic.kr/p/2kJJceN>

My geolocation datasets are generated in a simple Comma Separated Value
(CSV) format, intended to be easily imported into a spreadsheet. This
data was generated in real-time using "gpstool", an application that is
part of my Hazer project.  Hazer, and its gpstool Swiss Army Knife, is
a project to process the output of Global Navigation Satellite System
(GNSS) and Inertial Measurment Unit (IMU) devices. Hazer includes
applications that convert the data in CSV format generated by gpstool
into JSON and other useful forms.  Hazer has formed the basis of
several other projects, Tumbleweed (high accuracy Differential GNSS),
and Yodel (integrated GNSS and IMU), the software for both of which
is also part of the Hazer repository.

Hazer is built on top of another of my projects, Diminuto, a C-based
systems programming library, which is hosted in its own repository,
and which forms the basis for several other of my C-based projects.

# Platforms

My Hazer GNSS work has been hosted on Raspberry Pis running Raspbian
(including a pi-top \[3\] laptop), on an Intel Celeron palmtop running
Ubuntu MATE, or on an ancient Intel i686 netbook running Linux Mint.
See the Hazer repo's README for a long list of GPS, GNSS, and IMU
devices used with Hazer.

My OSM tile server is hosted on a Raspberry Pi, running Ubuntu Linux,
with a two terabyte (2TB) Solid State Disk (SSD) in additon to its
boot/root SD card.

The visualization portion of Tesoro has been tested with FireFox and
Chrome on a x86_64 Ubuntu system; with FireFox, Chrome, and Safari on
a x86_64 Macintosh running MacOS; on Safari on an iPad and an iPhone 7
running iOS, and on Chrome on a Google Pixel 4 running Android 11.

The server-side JavaScript portion of Tesoro has been run on any
platform I had handy that runs a recent version Node.js. Currently
it's running 24x7 on another Raspberry Pi.

# Directories

* bin - contains server-side JavaScript programs to be run under Node.js.
* fs - contains snippets of changes to the tile server file system.
* fun - contains BASH scripts for functional testing.
* src - contains client-side HTML and JavaScript programs to be installed on the tile server.
* txt - contains mostly unexplained notes about stuff I wanted to remember.

# Fields (JSON)

* NAM - a name string (typically the host name) identifying the data source.
* NUM - an monotonically increasing integer number.
* TIM - the time in UTC in integer seconds since the POSIX epoch.
* LAT - the latitude in decimal degrees.
* LON - the longitude in decimal degrees.
* MSL - the altitude above mean sea level in decimal meters.
* LBL - a label string (typically a timestamp) applied to the moving marker.

# Client Side Collateral

* src/choosedataset.html - renders static map based on a dataset via menu.
* src/movingmap.js - generates moving map display.
* src/routemap.js - generates a static route map display.
* src/selectchannel.html - renders moving map based on specified channel.

# Client Side Collateral (mostly used for testing)

* src/base.html - generates map of DGNSS Base Station.
* src/base.json - JSON datagram for DGNSS Base Station.
* src/choosefile.html - renders moving map based on observation files via menu.
* src/draganddrop.html - reenders moving map based on observation files via d&d.
* src/query.html - renders static map based on query paramters.

# Server Side Collateral

* bin/channel.js - single dynamic channel.
* bin/controller.js - multiple dynamic channels indexed by host, port, and name.

# Server Side Collateral (mostly used for testing)

* bin/base.js - fixed channel for DGNSS Base Station location.
* bin/helloworld.js - hello world test server.

# Functional Tests

* fun/channel - calls channel.sh.
* fun/channel.sh - runs channel.js with node.js.
* fun/controller - calls controller.sh.
* fun/controller.sh - runs controller.js with node.js.

# Architecture

Tesoro follows the Model-View-Controller (MVC) pattern. Although all of the
components could run on the same computer, I typically run them on three
different computers to simulate how I imagine this might be used in an
actual application.

Here are diagrams of two minor variations of the architecture as described
below.

<https://flic.kr/p/2kCThPi>

<https://flic.kr/p/2kFopLb>

## Model

The Model is the OSM tile server, a software stack and database that
resides on an Apache web server.

In my environment, I use a Raspberry Pi 4B as the Model, It runs Ubuntu,
and is equipped with a two terabyte (2TB) Solid State Disk (SSD). The
SSD currently hosts the OpenStreetMap map data and database for North
America. The host name of the Model will be used in the Uniform Resource
Locator (URL) examples below.

## View

The View can be any modern web browser that can run Tesoro's "movingmap"
JavaScript program.

My typical View is the Chrome browser used on a Mac running MacOS.
I have also run Tesoro using Firefox on a x86_64 system running Ubuntu,
and Firefox and Safari on a Mac running MacOS.

## Controller

The Controller is the source of the geolocation data and hence steers the
visualization. It is implemented as Tesoro's "channel" JavaScript program
that runs under Node.js. The channel program receives geolocation data as
datagrams in JavaScript Object Notation (JSON) form over User Datagram
Protocol (UDP). The channel script stands up a trivial web server that
responds to any HyperText Transfer Protocol (HTTP) request with the latest
JSON datagram that it has received over the Transmission Control Protocol
(TCP) return path.

A typical Controller is one of my x86_64 development systems running
Ubuntu.

## Rover

In my testing, a fourth component, the Rover, stands in for an actual
geolocating device in the field by playing back geolocation data
previously collected and stored in the Comma Separated Value (CSV) form
used by Hazer's gpstool, and transmitting it as datagrams in JSON form
to the Controller.

A typical Rover is a Raspberry Pi 3B+ running Raspbian. This is the
actual mobile platform that I have used as my field unit in much
of my Hazer work, although I have also used small palmtops and
netbooks, with Intel Celeron or Intel Atom processors, running
Ubuntu Mate or Linux Mint.

Rover here is used in the same sense as in Differential GNSS, which
Hazer also supports.

# Data Formats

There are several data formats used between the Hazer and the Tesoro
projects.

## Comma Separated Values (CSV)

The Hazer gpstool utility stores data in a Comma Separated Value (CSV)
format that can be easily imported into a spreadsheet or converted into
other forms. A single line of a Hazer CSV dataset looks like this.

    "neon", 1299, 4, 0, 10, 1600356403.090779879, 1600356402.000000000, 39.7328371, -105.1543085, 0., 1766.500, 1745.000, 0., 4.948000, 127.340000000, -1.10049, 0.40705, 127.34082, 0.52130, 0.46396, 1.12472, 0, 0\n

See the README in the Hazer repository for the definitions of all the
CSV fields, only some of which will be applicable to Tesoro.

## JSON Datagrams

The Hazer csv2dgm utility can convert a Hazer CSV dataset into the JSON
form required by the movingmap.js script and transmit each line of as
a datagram to a Tesoro channel. The utility is invoked by the Hazer
csvplayback script (for playback of a stored CSV dataset) and the Hazer
csvfollow script (for forwarding datagrams in real-time). This datagram
format is used by the channel.js and controller.js server-side programs,
and the selectchannel.html and movingmap.js client-side programs. The
JSON datagram looks like this.

    { "NAM": "neon", "NUM": 1300, "TIM": 1600356403, "LAT": 39.7328281, "LON": -105.1542851, "MSL": 1766.500, "LBL": "2020-09-17T15:26:43Z" }\n

## JSON Datasets

The Hazer csvdataset script can convert a Hazer CSV dataset into the
JSON array form of latitude and longitude coordinates required by the
routemap.js script. Unlike the datagrams, which are consumed one at a
time, the entire CSV dataset is converted into a single (sometimes quite
large) JSON array and imported into memory. This places a limit on how
many datapoints can be imported. The csvdataset takes an optional modulo
parameter (default "1") to set the sampling rate. Regardless of the
sampling rate, the first and last data points are included. The Hazer
CSV dataset is filtered to remove duplicate entries where successive
geolocation coordinates do not change. This dataset format is used by
the choosedataset.html and routemap.js client-side programs. The JSON
array looks like this.

    {
      "PATH": [
          [ 39.7943158, -105.1533988 ]
        , [ 39.7943148, -105.1533981 ]
        , [ 39.7943140, -105.1533973 ]
        , [ 39.7943136, -105.1533960 ]
      ]
    }

Leaflet polyline options (including those in the URL; see below) can be
overridden by specifying them as additional properties in the JSON file.
These options will only apply to the route specified in the dataset.

    {
      "color": "blue",
      "weight": 6.0,
      "PATH": [
          [ 39.7943158, -105.1533988 ]
        , [ 39.7943148, -105.1533981 ]
        , [ 39.7943140, -105.1533973 ]
        , [ 39.7943136, -105.1533960 ]
      ]
    }

# Examples

Tesoro's movingmap JavaScript program can be invoked by several different
web pages. These are described below.

## Base

The base page renders a static map centered the coordinates of my
Differential GNSS base station coordinates. This is a quick way to tell
of the tile server is working from any computer on the same network.

    http://modelhost/tesoro/base.html

## Query

The query page takes a query URL containing keyword=value parameters
for each of the JSON datagrams fields defined above. The query page
renders a static map centered on the specified coordinates. Query is
an easy way to view a static map from any computer on the same network.

    http://modelhost/tesoro/query.html?NAM=hostname&NUM=1&TIM=1599145249&LAT=39.7943071&LON=-105.1533805&MSL=1710.300&&LBL=2020-09-03T15:00:49Z

## Select Channel

The selectchannel page renders a moving map from JSON dynamically
generated in real-time, provided by a server-side JavaScript-based web
server, identified via a URL entered by the user.

    http://modelhost/tesoro/selectchannel.html

A typical Select Channel test set up is as follows. 

Run the Hazer "tesoroselectchannel" script on the Rover host. (You
will need to have build Diminuto and Hazer beforehand.) This converts
a forty-five minute (45m) CSV dataset of an actual Hazer test into JSON
and meters it out at approximately its original rate as datagrams to the
UDP port defined in /etc/services as "tesoro". This simulates a mobile
GNSS device generating data in the field and forwarding the datagrams
to a remote UDP port. I could just as easily substitute an actual rover
in the field, sending data over an LTE modem (and have done so before
Tesoro existed, using Google Earth as the visualization part). Direct
the script to the appropriate host and UDP service (port), replacing
"channelhost" with the actual host name.

    out/host/fun/tesoroselectchannel channelhost:tesoro

NOTE: not all of the datasets generated from field tests stored in
the Hazer repository are compatible with this script, since the CSV
format and the number of variables have changed over time. This script
reflects the CSV format used for the dataset that is the default
specified in the script for the second (missing) parameter above.

Run the Tesoro "channel" script, which runs the "channel" JavaScrip
program using Node.js), on the Controller host.  This serves as the
interface between the rover in the field (or the playback that pretends
to be a rover) and the client-side movingmap program running in the
visualization browser. The script takes two arguments, a UDP service
(port) on which to receive datagrams, and a TCP service (port) on which
to receive HTTP requests via TCP. Since the incoming port uses UDP and
the outgoing port uses TCP, they can have the same service name and
number. As shown above, the command line below assumes I have defined
the name "tesoro" to be both the UDP and TCP port numbers (for example,
12345).

    fun/channel tesoro tesoro

Pull up a browser on the View host, and point it to the "selectchannel"
page on the Model tile server. The URL will look like this

    http://modelhost/tesoro/selectchannel.html

replacing "modelhost" with the hostname of the tile server. When the
popup asks for the channel name, type in the URL for the Controller host
on which the channel script is running

    http://controllerhost:12345/channel.json

where 12345 is the tesoro TCP port number. The JavaScript code will start
reading the JSON geolocation data from the channel, and using Leaflet
to access tiles (map segments) from the OSM tile server, render them,
creating a moving map display. You can click on the pointer that is
kept centered on the map and see a UTC timestamp for when the data was
originally collected.

### Update (2021-03-04)

The server-side channel.js program on handles a single geolocating
source. The new server-side controller.js has the same command line
arguments as the old script, but handles multiple geolocating sources,
identifying them by the NAM field in the datagram CSV. Datagrams from
multiple sources can be cached and served concurrently. If the program
receives no updates after (currently) one minute, it clears all of the
caches. If an HTTP request is made for a geolocating source not in
the cache, a 404 error code is returned. Requests from the controller
but have the following form.

    http://HOST:PORT/NAM.json

This is an example of what you might enter into the Select Channel dialog
when using the selectchannel.html page if the controller.js program is
serving port 12345 on host "controller", and the Rover is named "tracker".

    http://controller:12345/tracker.json

This works with the same selectchannel.html web page and its client-side
movingmap.js program  as described above.

One of my Raspberry Pis that runs 24x7 serves as both an RTK router
for my DGNSS project ("Tumbleweed") and as a multi-channel controller
for this project ("Tesoro"). The /etc/rc.local file on this RPi, an
old-school script that gets run by the new-school systemd every time the
system boots, includes these two lines to start the RTK router (rtktool)
and the controller,

    runuser -l pi -c 'cd /home/pi/src/com-diag-hazer/Hazer; out/host/bin/router &'

    runuser -l pi -c 'cd /home/pi/src/com-diag-tesoro/Tesoro; fun/controller &'

## Choose Dataset

The choosedataset.html web page and its routemap.js script generates
a static route map based on a route specified by a file containing an
array of latitude and longitude coordinates in a JSON array format.
The dataset to be rendered is chosen by a pop-up menu. The URL for this
feature will look like this.

    http://modelhost/tesoro/choosedataset.html

Leaflet polyline options like the color of the line or its weight can
be specified as query paramters in the URL. These change the defaults
for all routes chosen by the Choose Dataset dialog. The defaults can
be overridden for one route by options specified in the route dataset
itself (see above).

    http://tesoro/tesoro/choosedataset.html?color=yellow&weight=3

Multiple routes can be rendered on the same map just by re-choosing
another dataset on an existing map.

This feature does not require a controller.

# Details

I used Ubuntu 20.04 rather than the Raspberry Pi OS (formerly known
as Raspbian). (Prior to this project, I didn't even know you could run
Ubuntu on an RPi; never the less, I'll likely be sticking to Raspbian for
my other projects.) The instructions to install Ubuntu on the Raspberry
Pi can be found below. In addition to these instructions, there was a
substantial about of configuration necessary to integrated the RPi into
my environment; your mileage may vary.

<https://ubuntu.com/tutorials/how-to-install-ubuntu-on-your-raspberry-pi>

The directions below detail how to install an OSM tile server on Ubuntu
20.04. They were straightforward, but due to the amount of data involved
(the North American map dataset alone is over ten gigabytes, and the
world map dataset is over a terabyte) this is a very lengthy process.

<https://switch2osm.org/serving-tiles/manually-building-a-tile-server-20-04-lts/>

The `fs` directory in the Tesoro repo contains some snippets of
configuration data that need to be added to configuration files in the
Ubuntu file system, e.g. in the `/etc/apache2/apache2.conf` configuration
file.

You will need to define some services in the /etc/services file. The
port numbers are your choices to make. Note that the TCP and UDP port
numbers for the same service (e.g.  tesoro) can be (and typically are)
the same number. Port number values may range from 0 to 65353 and must
be unique. Linux also assigns "ephemeral" or temporary port numbers
which will not appear in the /etc/services file.

    tesoro     12345/tcp  # Tesoro JSON source
    tesoro     12345/udp  # Tesoro JSON sink

These web sites explain how to download map data, initially build the
map database, and update it when necessary. I was careful to place the
map data files and the Postgres database files on the ginormous SSD
instead of on the Raspberry Pi's microSDcard where its root file
system resides.

<https://download.geofabrik.de>

<https://switch2osm.github.io/serving-tiles/updating-as-people-edit/>

The install target in the Tesoro Makefile uses the Node.js terser program
to minimize the client-side JavaScript code.

    npm install terser -g

My client-side JavaScript code uses the version 1.7.1 of the Leaflet
library. The Tesoro Makefile can automatically fetch this distro,
unzip it, and install it on the web server (providing it has the right
permissions).

<http://cdn.leafletjs.com/leaflet/v1.7.1/leaflet.zip>

Install the client-side Tesoro HTML and JavaScript programs on the Model
tile server, which runs Apache. If this weren't all behind my firewall, I
could modify the client-side movingmap JavaScript to use any tile server.
But right now it assumes the tile server is on the same computer as the
script itself. All of the Tesoro files are installed in the directory

    /var/www/html/tesoro

which is simplified if you create this directory as root and make
yourself the owner of it.

    sudo mkdir -p /var/www/html/tesoro
    sudo chown ${USER}:${USER} /var/www/html/tesoro

Then you can, for example,

    cd
    mkdir -p src
    git clone https://github.com/coverclock/com-diag-tesoro
    cd com-diag-tesoro/Tesoro
    make install

to install both Leaflet and the Tesoro files.

You will also need to build Hazer and Diminuto if you intend to use
the Hazer test scripts and datasets to duplicate my results. See those
repositories for more information on how to do that.

# Repositories

<https://github.com/coverclock/com-diag-tesoro>

<https://github.com/coverclock/com-diag-hazer>

<https://github.com/coverclock/com-diag-diminuto>

<http://cdn.leafletjs.com/leaflet/v1.7.1/leaflet.zip>

# Articles

Chip Overclock, "A Moving Map Display Using OpenStreetMap", 2021-02,
<https://coverclock.blogspot.com/2021/02/a-moving-map-display-using.html>

Chip Overclock, "The OpenStreetMap Moving Map In Real-Time", 2021-02,
<https://coverclock.blogspot.com/2021/02/the-openstreetmap-moving-map-in-real.html>

Chip Overclock, "The OpenStreetMap Moving Map On Mobile Devices", 2021-03,
<https://coverclock.blogspot.com/2021/03/the-openstreetmap-moving-map-on-mobile.html>

Chip Overclock, "A Static Route Map Display Using OpenStreetMap", 2021-03,
<https://coverclock.blogspot.com/2021/03/a-static-route-map-display-using.html>

Chip Overclock, "Advanced Static Route Maps With OpenStreetMap", 2021-03,
<https://coverclock.blogspot.com/2021/03/advanced-static-route-maps-with.html>

(The Hazer repository README has a wealth of other articles I've written about
my experiments with GPS, GNSS, DGNSS, and IMUs. Similarly, the Diminuto
repository README has a bunch of articles I've written about systems programming
in C on various LINUX/GNU platforms.)

# Albums

<https://flic.kr/s/aHsmTB3tme>

# Playlists

<https://youtube.com/playlist?list=PLd7Yo1333iA9X3D6v1ZAcagGreDCFDB9d>

# Resources

<https://linuxize.com/post/how-to-configure-static-ip-address-on-ubuntu-20-04/>

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

<https://enable-cors.org/server_apache.html>

<https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API/Using_Fetch>

<https://jsonlines.org>

# References

D. Flanagan, "JavaScript: The Definitive Guide", 7th edition, O'Reilly, 2020
