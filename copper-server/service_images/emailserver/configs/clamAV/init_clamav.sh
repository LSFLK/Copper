#!/bin/bash
HOME="/var/log"
OUTPUT="${HOME}/copperclamav.log"
ERROR="${HOME}/copper.err"
PID="/bin/init_clamav.pid"

if [ -f "$PID" ]
then
   exit 1
fi
touch $PID
freshclam >> $OUTPUT 2>&1

rm $PID

exit 0