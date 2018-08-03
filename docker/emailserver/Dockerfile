#From debian:stretch-slim
#From debian:stretch
From ubuntu:18.04
MAINTAINER Lanka Software Foundation <opensource.lk> 
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update && apt-get -y purge exim4*
RUN apt-get -y install apt-utils
# installing netstat command
RUN apt-get -y install net-tools
# installing ping command
RUN apt-get install -y iputils-ping
# install mail until for testing functions
RUN apt-get -y install mailutils

# installing lsof command
RUN apt-get -y install lsof
RUN apt-get -y install telnet
RUN apt-get -y install nano
RUN apt-get -y install letsencrypt openssl
#postfix-mysql was used to connect with a mysql datbase
#RUN apt-get -y install postfix postfix-mysql postfix-pcre libsasl2-modules
#postfix-ldap required to connect with ldap services
RUN apt-get -y install postfix postfix-ldap postfix-pcre postfix-policyd-spf-python libsasl2-modules 

RUN apt-get install -y rsyslog fetchmail libdbi-perl libdbd-pg-perl libdbd-mysql-perl liblockfile-simple-perl
#RUN apt-get -y install dovecot-core dovecot-imapd dovecot-pop3d dovecot-lmtpd dovecot-mysql dovecot-sieve dnsutils
# changing for modifications
#RUN apt-get -y install dovecot-core dovecot-imapd dovecot-pop3d dovecot-lmtpd dovecot-mysql dovecot-sieve dnsutils dovecot-managesieved
RUN apt-get -y install dovecot-core dovecot-imapd dovecot-pop3d dovecot-lmtpd dovecot-mysql dovecot-ldap dnsutils
#RUN apt install -y mail-stack-delivery // this was used instead of dovecto one by one installation

RUN apt-get install -y dovecot-sieve dovecot-managesieved

# installing ldap utils for testing perposes
RUN apt-get install -y ldap-utils curl


#RUN apt-get -y install gnupg python-gpgme dovecot-managesieved sudo
# Following changed introduced to above installation due to python-gpgme not installed in 18.04 ubuntu 
#RUN apt-get -y install gnupg dovecot-managesieved sudo
RUN apt-get install -y gnupg software-properties-common
# Above two lines used instead of line with python-gpgme

RUN adduser --system --no-create-home --group --home /etc/zeyple --disabled-login zeyple
RUN mkdir -p /etc/zeyple/keys && chmod 700 /etc/zeyple/keys && chown zeyple: /etc/zeyple/keys
#ADD https://raw.github.com/infertux/zeyple/master/zeyple/zeyple.py /usr/local/bin/zeyple.py
ADD ./emailserver/configs/zeyple/zeyple.py /usr/local/bin/zeyple.py
RUN chmod 744 /usr/local/bin/zeyple.py && chown zeyple: /usr/local/bin/zeyple.py
ADD https://raw.github.com/infertux/zeyple/master/zeyple/zeyple.conf.example /etc/zeyple.conf
#ADD ./emailserver/config/zeyple/zeyple.conf.example /etc/zeyple.conf
RUN touch /var/log/zeyple.log && chown zeyple: /var/log/zeyple.log
RUN chown -R zeyple /etc/zeyple /usr/local/bin/zeyple.py


# COPY Changing dovecot congiguration files permission
COPY ./emailserver/configs/Dovecot /etc/dovecot/
RUN chgrp dovecot /etc/dovecot/dovecot-sql.conf.ext
RUN chmod o= /etc/dovecot/dovecot-sql.conf.ext

# changes accoring to url : https://www.linode.com/docs/email/postfix/email-with-postfix-dovecot-and-mariadb-on-centos-7/
COPY ./emailserver/configs/Postfix /etc/postfix/
#RUN chmod o= /etc/postfix/mariadb-sql/mysql-virtual_*.cf
#RUN chgrp postfix /etc/postfix/mariadb-sql/mysql-virtual_*.cf

# Changing sql configuration files permissions 
#RUN chmod o= /etc/postfix/sql/mysql_virtual_*.cf
#RUN chgrp postfix /etc/postfix/sql/mysql_virtual_*.cf
# Changing ldap configuration files permissions 
RUN chmod o= /etc/postfix/ldap/*.cf
RUN chgrp postfix /etc/postfix/ldap/*.cf

# Adding sieve file to /var/mail
COPY ./emailserver/configs/sieve /var/mail/sieve


RUN groupadd -g 5000 vmail && useradd -g vmail -u 5000 vmail -d /var/mail
RUN chown -R vmail:vmail /var/mail
RUN chown -R postfix /etc/postfix
RUN chmod -R o-rwx /etc/postfix
RUN chmod -R 755 /etc/postfix
RUN chown -R vmail:dovecot /etc/dovecot
RUN chmod -R o-rwx /etc/dovecot

COPY ./emailserver/configs/Rspamd/rspamd.sh /
#RUN ./rspamd.sh  // Error : /bin/sh: 1: ./rspamd.sh: Permission denied , bellow line introduced
RUN chmod +x ./rspamd.sh
RUN ./rspamd.sh
COPY ./emailserver/configs/Rspamd /etc/rspamd/
#RUN mkdir /var/lib/rspamd/dkim/	//error :/rspamd/...dkim/': No such file or directory
RUN mkdir -p /var/lib/rspamd/dkim

RUN rspamadm dkim_keygen -b 1024 -s 2018 -d $DOMAIN -k /var/lib/rspamd/dkim/2018.key > /var/lib/rspamd/dkim/2018.txt
RUN chown -R _rspamd:_rspamd /var/lib/rspamd/dkim
RUN chmod 440 /var/lib/rspamd/dkim/*

RUN cp -R /etc/rspamd/local.d/dkim_signing.conf /etc/rspamd/local.d/arc.conf
COPY ./emailserver/configs/sieve /sieve

COPY ./emailserver/configs/init_sys.sh /bin/
COPY ./emailserver/configs/security/clamscan_daily.sh /bin/
COPY ./emailserver/configs/security/spamassassin_conf.sh /bin/
RUN mkdir -p /amavis
COPY ./emailserver/configs/security/amavis/15-content_filter_mode /amavis/
COPY ./emailserver/configs/security/amavis/50-user /amavis/
RUN mkdir -p /rspamd
COPY ./emailserver/configs/security/rspamd/antivirus.conf /rspamd/

# install security related components clamAV antivirus
RUN apt-get -y install amavisd-new spamassassin clamav clamav-daemon clamav-freshclam
RUN apt-get -y install opendkim postfix-policyd-spf-python
# Some optional packages that integrate with Spamassassin for better spam detection:
RUN apt-get -y install pyzor razor
# main filtering applications compression utilities are needed to process some email attachments:
#RUN apt-get -y install arj cabextract cpio lha nomarch pax rar unrar unzip zip # Removed due to lha package having a issue
RUN apt-get -y install arj cabextract cpio nomarch pax rar unrar unzip zip

#The default behaviour of ClamAV will fit our needs. For more ClamAV configuration options, check the configuration files in /etc/clamav.
# Add the clamav user to the amavis group in order for Amavisd-new to have the appropriate access to scan files:
RUN adduser clamav amavis
RUN adduser amavis clamav

# change the permission as follows:
RUN chmod +x /bin/clamscan_daily.sh
# RUN chmod +x /bin/clamscan_daily.sh
# update the virus definition database or virus signature
RUN freshclam

# Now enable the daily execution of the script by creating a symlink in the /etc/cron.daily/ directory:
RUN ln /bin/clamscan_daily.sh /etc/cron.daily/clamscan_daily

# run security script
RUN chmod +x /bin/spamassassin_conf.sh


RUN chmod +x /bin/init_sys.sh
