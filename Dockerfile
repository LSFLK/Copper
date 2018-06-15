FROM ubuntu:16.04

MAINTAINER LSF <opensource.lk>

ENV DEBIAN_FRONTEND=noninteractive

LABEL description "Cu Mail server"

RUN apt-get update -q --fix-missing # && / apt-get -y upgrade

RUN apt-get -y install php
#RUN apt-get -y install nginx
#RUN service nginx restart

######################################################################
###   These services and softwares are used only for testing purposes
######################################################################

RUN apt-get -y install telnet
RUN apt-get install nano


##################
###   Postfix
##################

RUN apt-get -y install postfix postfix-pcre libsasl2-modules postfix-mysql
COPY ./config/postfix /etc/postfix/
#RUN /etc/init.d/postfix start
#RUN service postfix restart


##################
###   Dovecot
##################

RUN apt-get -y install dovecot-imapd dovecot-pop3d dovecot-lmtpd dovecot-mysql
COPY ./config/dovecot /etc/dovecot/
#RUN service dovecot restart

#RUN apt-gey -y wget spamassassin php5-imap postfixadmin roundcube


###################
###   Postfixadmin
###################

RUN apt-get -y install mysql-server
RUN apt-get install php php7.0-mysql apache2 php-pear php7.0-dev php7.0-zip php7.0-curl -y
RUN apt-get install php7.0-gd php7.0-mysql php7.0-mcrypt php7.0-xml libapache2-mod-php7.0 php7.0-imap php7.0-mbstring -y
RUN mkdir -p /srv/postfixadmin
COPY ./config/postfixadmin /srv/postfixadmin
RUN ln -s /srv/postfixadmin /var/www/html/postfixadmin
RUN chown -R www-data /srv/postfixadmin/templates_c

##############
#####Rainloop
##############
RUN mkdir -p /var/www/html/rainloop
COPY ./config/rainloop /var/www/html/rainloop
RUN find /var/www/html/rainloop/. -type d -exec chmod 755 {} \;
RUN find /var/www/html/rainloop/. -type f -exec chmod 644 {} \;
RUN chown -R www-data:www-data /var/www/html/rainloop/.
