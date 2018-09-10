#!/bin/sh

set -e
/usr/bin/horde-db-migrate
exec /usr/sbin/apache2ctl -D FOREGROUND
