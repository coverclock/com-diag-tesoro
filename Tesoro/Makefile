# vi: set ts=4 shiftwidth=4:
# Copyright 2021 Digital Aggregates Corporation
# author:Chip Overclock
# mailto:coverclock@diag.com
# https://github.com/coverclock/com-diag-tesoro
# "Chip Overclock" is a registered trademark.
# "Digital Aggregates Corporation" is a registered trademark.

PROJECT	:=	tesoro
TMPDIR	:=	/tmp
ROOT	:=	/var/www/html/tesoro
SOURCE	:=	src
VERSION	:=	v1.7.1
BASE	:=	${ROOT}/leaflet/${VERSION}
OWNER	:=	${USER}
FILES	:=	${ROOT}/base.html ${ROOT}/query.html ${ROOT}/draganddrop.html
LEAFLET	:=	${BASE}/leaflet.js
ARCHIVE	:=	leaflet.zip
LINK	:=	http://cdn.leafletjs.com/leaflet/${VERSION}/${ARCHIVE}

.PHONY:	install leaflet

install:	${BASE} ${FILES}
	ls -lR ${ROOT}

leaflet:	${BASE}
	T=`mktemp "$(TMPDIR)/$(ARCHIVE)-XXXXXXXXXX"`; \
	wget -O $$T ${LINK}; \
	unzip -d ${BASE} $$T; \
	rm $$T

${BASE}:
	sudo mkdir -p ${BASE}
	sudo chown -R ${OWNER}:${OWNER} ${ROOT}

${ROOT}/base.html:	${SOURCE}/base.html ${BASE}
	cp -i $< $@

${ROOT}/query.html:	${SOURCE}/query.html ${BASE}
	cp -i $< $@

${ROOT}/draganddrop.html:	${SOURCE}/draganddrop.html ${BASE}
	cp -i $< $@
