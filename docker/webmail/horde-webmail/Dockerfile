FROM ubuntu:18.04
ARG DEBIAN_FRONTEND=noninteractive
LABEL KEY=LSF-COPPER-HORDE

#ENV HOME /root

# root account
ENV MYSQL_ENV_MYSQL_ROOT_USERNAME horde
ENV MYSQL_ENV_MYSQL_ROOT_PASSWORD horde

ENV DB_NAME horde
ENV DB_USER horde
ENV DB_PASS horde
#ENV DB_PROTOCOL unix
#ENV DB_PROTOCOL tcp
ENV DB_PROTOCOL TCP
ENV DB_HOST 172.19.0.19
ENV MYSQL_PORT_3306_TCP_ADDR 172.19.0.19
ENV MYSQL_PORT_3306_TCP_PORT 3306
ENV DB_PORT 3306
ENV DB_DRIVER mysqli
ENV HORDE_TEST_DISABLE true

RUN apt-get update
RUN apt-get -y install nano
RUN apt-get -y install apache2 libapache2-mod-php mysql-client gnupg2 openssl php-pear 

# https://www.ctrl.blog/entry/how-to-debian-horde-webmail
# https://community.nethserver.org/t/installing-horde-groupware/7292
#RUN apt-get install -y php-horde-webmail mysql-client

#RUN apt-get -y  install php-horde
RUN apt-get -y install php-horde-webmail


RUN mkdir /var/lib/horde/
RUN chown www-data:www-data /var/lib/horde/
RUN cp /etc/horde/horde/conf.php.dist /etc/horde/horde/conf.php
RUN chown www-data:www-data /etc/horde/horde/conf.php
RUN touch /etc/horde/imp/conf.php /etc/horde/turba/conf.php
RUN chown www-data:www-data /etc/horde/imp/conf.php /etc/horde/turba/conf.php
RUN cp /etc/horde/imp/backends.php /etc/horde/imp/backends.local.php


RUN mkdir -p /etc/service/apache2
ADD ./webmail/horde-webmail/run.sh /etc/service/apache2/run
RUN chmod +x /etc/service/apache2/run

#CMD service apache2 start
CMD ["/etc/service/apache2/run"]
#CMD ["/sbin/my_init"]

# horde config files
COPY ./webmail/horde-webmail/backends.local.php /etc/horde/imp/
COPY ./webmail/horde-webmail/conf.php /usr/share/horde/config/
# RUN /usr/bin/horde-db-migrate