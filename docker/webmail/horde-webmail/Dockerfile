FROM ubuntu
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
#RUN cp /etc/horde/imp/backends.php /etc/horde/imp/backends.local.php

# Add other configurations also
ADD ./webmail/horde-webmail/config/conf.php /usr/share/horde/config/conf.php
RUN chown www-data:www-data /usr/share/horde/config/conf.php
# coppying ingo mail Filter application
ADD ./webmail/horde-webmail/config/ingo/conf.php /usr/share/horde/ingo/config/conf.php
RUN chown www-data:www-data /usr/share/horde/ingo/config/conf.php
# configuration file hosting solution
ADD ./webmail/horde-webmail/config/gollem/conf.php /usr/share/horde/gollem/config/conf.php
RUN chown www-data:www-data /usr/share/horde/gollem/config/conf.php
# Configuring turba contact mangement
ADD ./webmail/horde-webmail/config/turba/conf.php /usr/share/horde/turba/config/conf.php
RUN chown www-data:www-data /usr/share/horde/turba/config/conf.php
# Configuring Todo/Reminder plugin
ADD ./webmail/horde-webmail/config/nag/conf.php /usr/share/horde/nag/config/conf.php
RUN chown www-data:www-data /usr/share/horde/nag/config/conf.php
# Configure Kronolith calender
ADD ./webmail/horde-webmail/config/kronolith/conf.php /usr/share/horde/kronolith/config/conf.php
RUN chown www-data:www-data /usr/share/horde/kronolith/config/conf.php
# Configure mnemo Notebook
ADD ./webmail/horde-webmail/config/mnemo/conf.php /usr/share/horde/mnemo/config/conf.php
RUN chown www-data:www-data /usr/share/horde/mnemo/config/conf.php
# Configure imp webmail
ADD ./webmail/horde-webmail/config/imp/conf.php /usr/share/horde/imp/config/conf.php
RUN chown www-data:www-data /usr/share/horde/imp/config/conf.php
# Configure trean web book mark
ADD ./webmail/horde-webmail/config/trean/conf.php /usr/share/horde/trean/config/conf.php
RUN chown www-data:www-data /usr/share/horde/trean/config/conf.php



RUN chown www-data:www-data /etc/horde/imp/conf.php /etc/horde/turba/conf.php
RUN chown www-data:www-data /etc/horde/imp/conf.php /etc/horde/turba/conf.php
RUN chown www-data:www-data /etc/horde/imp/conf.php /etc/horde/turba/conf.php

# coppying conf.php for horde active directory

ADD ./webmail/horde-webmail/config/conf.php /etc/horde/horde/conf.php
ADD ./webmail/horde-webmail/config/backends.local.php /etc/horde/imp/backends.local.php

#ADD ./webmail/horde-webmail/config/conf.php /usr/share/horde/config/conf.php
#RUN chown www-data:www-data /usr/share/horde/config/conf.php

ADD ./webmail/horde-webmail/horde-init.sh /etc/my_init.d/horde-init.sh
RUN chmod +x /etc/my_init.d/horde-init.sh

RUN mkdir -p /etc/service/apache2
ADD ./webmail/horde-webmail/run.sh /etc/service/apache2/run


#


RUN chmod +x /etc/service/apache2/run

#CMD service apache2 start
CMD ["/etc/service/apache2/run"]
#CMD ["/sbin/my_init"]