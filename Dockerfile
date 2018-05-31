FROM ubuntu:16.04

MAINTAINER LSF <opensource.lk>

ENV DEBIAN_FRONTEND=noninteractive

LABEL description "Cu Mail server"

RUN apt-get update -q --fix-missing # && / apt-get -y upgrade

RUN apt-get -y install php
RUN apt-get -y install nginx
#RUN service nginx restart

#####################################################################
###   These services and softwares are used only for testing purposes
#####################################################################

RUN apt-get -y install telnet
RUN apt-get install nano


##################
###   Postfix
##################

RUN apt-get -y install postfix postfix-pcre libsasl2-modules
COPY ./config/postfix/main.cf /etc/postfix/
#RUN service postfix restart


##################
###   Dovecot
##################

RUN apt-get -y install dovecot-imapd dovecot-pop3d dovecot-lmtpd
COPY ./config/dovecot/dovecot.conf /etc/dovecot/
#RUN service dovecot restart

#RUN apt-gey -y wget spamassassin php5-imap postfixadmin roundcube
