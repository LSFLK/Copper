
# https://github.com/hacklab-fi/docker-ldapserver
FROM ubuntu:xenial
#FROM ubuntu:18.04
MAINTAINER Tharanga Rajapaksha <tharanga.rajapaksha@gmail.com>

#ARG DEBIAN_FRONTEND=noninteractive
RUN export RUNLEVEL=1
RUN DEBIAN_FRONTEND=noninteractive apt-get update && apt-get install -y --no-install-recommends apt-utils
# installing netstat command
RUN DEBIAN_FRONTEND=noninteractive apt-get -y install net-tools
# installing ping command
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y iputils-ping
#RUN dpkg --configure -a

#RUN apt-get update && apt-get install -y --no-install-recommends apt-utils
#

RUN DEBIAN_FRONTEND=noninteractive apt-get -y install lsof


RUN DEBIAN_FRONTEND=noninteractive apt-get install -y slapd ldap-utils phpldapadmin ldapscripts nano curl

RUN service slapd start
RUN service apache2 start

# bellow line added to remove the error (debconf: DbDriver "config": /var/cache/debconf/config.dat is locked by another process: Resource temporarily unavailable)
#

RUN DEBIAN_FRONTEND=noninteractive apt-get -f install
RUN DEBIAN_FRONTEND=noninteractive rm -rf /var/cache/debconf/*.dat
# By default, simply start apache.
#CMD /usr/sbin/apache2ctl -D FOREGROUND