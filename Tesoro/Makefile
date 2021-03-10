# vi: set ts=4 shiftwidth=4:
# Copyright 2021 Digital Aggregates Corporation
# author:Chip Overclock
# mailto:coverclock@diag.com
# https://github.com/coverclock/com-diag-tesoro
# "Chip Overclock" is a registered trademark.
# "Digital Aggregates Corporation" is a registered trademark.

PROJECT	:=	tesoro
RELEASE	:=	0.6.0

TMPDIR	:=	/tmp
WWW		:=	/var/www/html/tesoro
MODE	:=	664
SOURCE	:=	src
VERSION	:=	v1.7.1
BASE	:=	${WWW}/leaflet/${VERSION}
OWNER	:=	${USER}
FILES	:=	${WWW}/base.html ${WWW}/query.html ${WWW}/draganddrop.html ${WWW}/choosefile.html ${WWW}/selectchannel.html ${WWW}/movingmap.js ${WWW}/choosedataset.html ${WWW}/routemap.js ${WWW}/base.json ${WWW}/release.html
LEAFLET	:=	${BASE}/leaflet.js
ARCHIVE	:=	leaflet.zip
LINK	:=	http://cdn.leafletjs.com/leaflet/${VERSION}/${ARCHIVE}

.PHONY:	all release install leaflet show

all:
	@echo "Did you mean 'make install'?" 1>&2

release:
	@echo ${PROJECT} ${RELEASE} 1>&2

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

${WWW}/release.html:	Makefile ${BASE}
	T=`mktemp "${TMPDIR}/${PROJECT}.XXXXXXXXXX"` && \
	echo "<!DOCTYPE html PUBLIC \"-//W3C//DTD HTML 4.01//EN\" \"http://www.w3.org/TR/html4/strict.dtd\">" > $$T && \
	echo "<html>" >> $$T && \
	echo " <head>" >> $$T && \
	echo "  <meta http-equiv=\"Content-Type\" content=\"text/html && charset=utf-8\"><meta http-equiv=\"Content-Style-Type\" content=\"text/css\">" >> $$T; \
	echo " </head>" >> $$T && \
	echo " <body>" >> $$T && \
	echo "  <h1>PROJECT</h1><p>" ${PROJECT} "</p>" >> $$T && \
	echo "  <h1>RELEASE</h1><p>" ${RELEASE} "</p>" >> $$T && \
	echo " </body>" >> $$T && \
	echo "</html>" >> $$T && \
	mv $$T $@ && \
	chmod ${MODE} $@

${WWW}/base.html:	${SOURCE}/base.html ${BASE}
	cp $< $@ && chmod ${MODE} $@

${WWW}/query.html:	${SOURCE}/query.html ${BASE}
	cp $< $@ && chmod ${MODE} $@

${WWW}/draganddrop.html:	${SOURCE}/draganddrop.html ${BASE}
	cp $< $@ && chmod ${MODE} $@

${WWW}/choosefile.html:	${SOURCE}/choosefile.html ${BASE}
	cp $< $@ && chmod ${MODE} $@

${WWW}/selectchannel.html:	${SOURCE}/selectchannel.html ${BASE}
	cp $< $@ && chmod ${MODE} $@

${WWW}/base.json:	${SOURCE}/base.json ${BASE}
	cp $< $@ && chmod ${MODE} $@

${WWW}/movingmap.js:	${SOURCE}/movingmap.js ${BASE}
	T=`mktemp "${TMPDIR}/${PROJECT}.XXXXXXXXXX"` && \
	terser < $< > $$T && \
	mv $$T $@ && \
	chmod ${MODE} $@

${WWW}/choosedataset.html:	${SOURCE}/choosedataset.html ${BASE}
	cp $< $@ && chmod ${MODE} $@

${WWW}/routemap.js:	${SOURCE}/routemap.js ${BASE}
	T=`mktemp "${TMPDIR}/${PROJECT}.XXXXXXXXXX"` && \
	terser < $< > $$T && \
	mv $$T $@ && \
	chmod ${MODE} $@
