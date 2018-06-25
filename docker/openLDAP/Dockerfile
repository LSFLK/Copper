
# https://github.com/hacklab-fi/docker-ldapserver
#FROM ubuntu:xenial
FROM ubuntu:16.04
MAINTAINER Tharanga Rajapaksha <tharanga.rajapaksha@gmail.com>

#ARG DEBIAN_FRONTEND=noninteractive

RUN DEBIAN_FRONTEND=noninteractive apt-get update && apt-get install -y --no-install-recommends apt-utils
# installing netstat command
RUN DEBIAN_FRONTEND=noninteractive apt-get -y install net-tools
# installing ping command
RUN DEBIAN_FRONTEND=noninteractive apt-get install -y iputils-ping

RUN apt-get -y install wget
#RUN dpkg --configure -a

#RUN apt-get update && apt-get install -y --no-install-recommends apt-utils
#

RUN DEBIAN_FRONTEND=noninteractive apt-get -y install lsof

# installing letsincript
RUN DEBIAN_FRONTEND=noninteractive apt-get -y install letsencrypt openssl

RUN DEBIAN_FRONTEND=noninteractive apt-get install -y slapd ldap-utils phpldapadmin ldapscripts nano curl

# Adding postfix plugin
#RUN wget -O postfix.ldif https://raw.githubusercontent.com/68b32/postfix-ldap-schema/master/postfix.ldif
#RUN ldapadd -ZZ -x -W -D cn=admin,cn=config -H ldap://172.19.0.21 -f postfix.ldif

RUN DEBIAN_FRONTEND=noninteractive apt-get -f install
RUN DEBIAN_FRONTEND=noninteractive rm -rf /var/cache/debconf/*.dat

#RUN chmod u+x /etc/ldap/renew.sh
#RUN /etc/ldap/renew.sh

COPY ./openLDAP/configs/renew.sh /etc/ldap/renew.sh
#RUN ./rspamd.sh  // Error : /bin/sh: 1: ./rspamd.sh: Permission denied , bellow line introduced
RUN chmod +x /etc/ldap/renew.sh
RUN /etc/ldap/renew.sh

RUN service slapd start
RUN service apache2 start

# bellow line added to remove the error (debconf: DbDriver "config": /var/cache/debconf/config.dat is locked by another process: Resource temporarily unavailable)
#

# By default, simply start apache.
#CMD /usr/sbin/apache2ctl -D FOREGROUND
CMD service apache2 restart

