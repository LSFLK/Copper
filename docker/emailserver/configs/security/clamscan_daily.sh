#!/bin/bash

export EMAIL


LOGFILE="/var/log/clamav/clamav-$(date +'%Y-%m-%d').log";
EMAIL_MSG="Please see the log file attached.";
EMAIL_FROM="admin@coppermail.dyndns.org";
EMAIL_TO="test@coppermail.dyndns.org";
#EMAIL_TO="$EMAIL";
DIRTOSCAN="/var/www /var/vmail";

for S in ${DIRTOSCAN}; do
 DIRSIZE=$(du -sh "$S" 2>/dev/null | cut -f1);

 echo "Starting a daily scan of "$S" directory.
 Amount of data to be scanned is "$DIRSIZE".";

 clamscan -ri "$S" >> "$LOGFILE";

 # get the value of "Infected lines"
 MALWARE=$(tail "$LOGFILE"|grep Infected|cut -d" " -f3);

 # if the value is not equal to zero, send an email with the log file attached
 if [ "$MALWARE" -ne "0" ];then
 # using heirloom-mailx below
 echo "$EMAIL_MSG"|mail -a "$LOGFILE" -s "Malware Found" -r "$EMAIL_FROM" "$EMAIL_TO";
 fi 
done

exit 0