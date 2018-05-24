FROM ubuntu:16.04
#FROM alpine

MAINTAINER LSF <anushkap@opensource.lk>

ENV DEBIAN_FRONTEND=noninteractive

LABEL description "Cu Mail server"

RUN apt-get update -q --fix-missing # && / apt-get -y upgrade
#RUN apt-get -y install apache2
RUN apt-get -y install postfix postfix-pcre libsasl2-modules
#RUN service postfix restart
#RUN apt-get -y install dovecot-core dovecot-imapd dovecot-pop3d dovecot-lmtpd
#RUN service dovecot restart
#RUN apt-gey -y wget spamassassin php5-imap postfixadmin roundcube
