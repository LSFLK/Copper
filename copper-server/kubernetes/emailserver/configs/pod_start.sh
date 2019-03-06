#!/usr/bin/env bash

source .env

# how to get parametes from the source file.
# .env loading in the shell
dotenv () {
  set -a
  [ -f .env ] && . .env
  set +a
}

# Run dotenv on login
dotenv

# Run dotenv on every new directory
cd () {
  builtin cd $@
  dotenv
}

# end of env loading to the file

#export EMAIL=${EMAIL}
#export KEY_PATH
#export HOSTNAME=${FQDN}


 service rsyslog start
 service postfix start
 service dovecot restart
 service rspamd start
 #service clamav start # clamav unrecognized service
 #freshclam
 service rspamd reload
 #service clamav-daemon start # if there is not enough memory in the container this will omit a error and docker build will stop from hear.
 service clamav-freshclam start
 
 #tail -f /dev/null