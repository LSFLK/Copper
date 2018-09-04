#!/bin/sh

set -e

#service apache2 start
exec /usr/sbin/apache2ctl -D FOREGROUND
