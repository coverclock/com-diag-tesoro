#!/bin/bash
# Copyright 2021 Digital Aggregates Corporation, Colorado, USA
# Licensed under the terms in LICENSE.txt
# Chip Overclock <coverclock@diag.com>
# https://github.com/coverclock/com-diag-tesoro
# usage: channel HOST UDPPORT TCPPORT
# default: channel localhost tesoro tesoro

PROGRAM=$(basename ${0})
HOSTNAME=${1:-"localhost"}
INCOMING=${2:-"tesoro"}
OUTGOING=${3:-$2}

SCRIPT=$(readlink -e $(dirname ${0})/../bin)/channel.js

exec node ${SCRIPT} ${HOSTNAME} ${INCOMING} ${OUTGOING}
