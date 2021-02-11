# vi: set ts=4 shiftwidth=4:
# Copyright 2021 Digital Aggregates Corporation
# author:Chip Overclock
# mailto:coverclock@diag.com
# https://github.com/coverclock/com-diag-tesoro
# "Chip Overclock" is a registered trademark.
# "Digital Aggregates Corporation" is a registered trademark.

PROJECT	:=	tesoro
TMPDIR	:=	/tmp
WWW		:=	/var/www/html/tesoro
CLIENT	:=	web
SERVER	:=	src
VERSION	:=	v1.7.1
BASE	:=	${WWW}/leaflet/${VERSION}
OWNER	:=	${USER}
FILES	:=	${WWW}/base.html ${WWW}/query.html ${WWW}/draganddrop.html ${WWW}/choosefile.html ${WWW}/selectchannel.html ${WWW}/movingmap.js
LEAFLET	:=	${BASE}/leaflet.js
ARCHIVE	:=	leaflet.zip
LINK	:=	http://cdn.leafletjs.com/leaflet/${VERSION}/${ARCHIVE}

.PHONY:	all install push leaflet show

all:

install:

push:	${BASE} ${FILES}

leaflet:	${BASE}
	T=`mktemp "$(TMPDIR)/$(ARCHIVE)-XXXXXXXXXX"`; \
	wget -O $$T ${LINK}; \
	unzip -d ${BASE} $$T; \
	rm $$T

show:
	ls -lR ${WWW}

${BASE}:
	sudo mkdir -p ${BASE}
	sudo chown -R ${OWNER}:${OWNER} ${WWW}

${WWW}/base.html:	${CLIENT}/base.html ${BASE}
	cp $< $@

${WWW}/query.html:	${CLIENT}/query.html ${BASE}
	cp $< $@

${WWW}/draganddrop.html:	${CLIENT}/draganddrop.html ${BASE}
	cp $< $@

${WWW}/choosefile.html:	${CLIENT}/choosefile.html ${BASE}
	cp $< $@

${WWW}/selectchannel.html:	${CLIENT}/selectchannel.html ${BASE}
	cp $< $@

${WWW}/movingmap.js:	${CLIENT}/movingmap.js ${BASE}
	cp $< $@
