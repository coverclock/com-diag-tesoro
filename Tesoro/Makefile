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
SOURCE	:=	src
VERSION	:=	v1.7.1
BASE	:=	${WWW}/leaflet/${VERSION}
OWNER	:=	${USER}
FILES	:=	${WWW}/base.html ${WWW}/query.html ${WWW}/draganddrop.html ${WWW}/choosefile.html ${WWW}/selectchannel.html ${WWW}/movingmap.js ${WWW}/base.json
LEAFLET	:=	${BASE}/leaflet.js
ARCHIVE	:=	leaflet.zip
LINK	:=	http://cdn.leafletjs.com/leaflet/${VERSION}/${ARCHIVE}

.PHONY:	all install leaflet show

all:
	echo "Did you mean 'make install'?" 1>&2

install:	${BASE} ${FILES}

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

${WWW}/base.html:	${SOURCE}/base.html ${BASE}
	cp $< $@ && chmod 664 $@

${WWW}/query.html:	${SOURCE}/query.html ${BASE}
	cp $< $@ && chmod 664 $@

${WWW}/draganddrop.html:	${SOURCE}/draganddrop.html ${BASE}
	cp $< $@ && chmod 664 $@

${WWW}/choosefile.html:	${SOURCE}/choosefile.html ${BASE}
	cp $< $@ && chmod 664 $@

${WWW}/selectchannel.html:	${SOURCE}/selectchannel.html ${BASE}
	cp $< $@ && chmod 664 $@

${WWW}/base.json:	${SOURCE}/base.json ${BASE}
	cp $< $@ && chmod 664 $@

${WWW}/movingmap.js:	${SOURCE}/movingmap.js ${BASE}
	T=`mktemp "${TMPDIR}/${PROJECT}.XXXXXXXXXX"` && \
	terser < $< > $$T && \
	mv $$T $@ && \
    chmod 664 $@
