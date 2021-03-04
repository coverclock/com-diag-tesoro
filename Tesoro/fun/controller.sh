#!/bin/bash
# Copyright 2021 Digital Aggregates Corporation, Colorado, USA
# Licensed under the terms in LICENSE.txt
# Chip Overclock <coverclock@diag.com>
# https://github.com/coverclock/com-diag-tesoro
# usage: controller UDPPORT TCPPORT
# default: controller tesoro tesoro

PROGRAM=$(basename ${0})
INCOMING=${1:-"tesoro"}
OUTGOING=${2:-$2}

SCRIPT=$(readlink -e $(dirname ${0})/../bin)/controller.js

exec node ${SCRIPT} ${INCOMING} ${OUTGOING}

