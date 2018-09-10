FROM phusion/baseimage:latest

LABEL KEY=LSF-COPPER-HORDE

ENV HOME /root

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

VOLUME /horde

RUN apt-get update
RUN apt-get install -y nano
RUN apt-get install -y apache2 libapache2-mod-php mysql-client gnupg2 openssl php-pear \
	php-horde php-horde-imp php-horde-groupware php-horde-ingo php-horde-lz4 aspell-en php-horde-imp \
	#php-horde-horde php-pecl-imagick aspell-en php-horde-ingo php-horde-lz4 php-horde-imp \
	php-xml php7.0-xml php-imagick php-dev php-memcache php-memcached php-net-sieve && \
	apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*
#Deployment errors
#WARNING: "pear/Auth_SASL" is deprecated in favor of "pear/Auth_SASL2"
#WARNING: "pear/DB" is deprecated in favor of "pear/MDB2"
#WARNING: "pear/XML_Parser" is deprecated in favor of "pear/XML_Parser2"
#WARNING: "pear/Net_Sieve" is deprecated in favor of "horde/Horde_ManageSieve"
# php-horde-managesieve php-pear-xml-parser2 && \ , i tried it exact names may be different

# bellow sed ocmmand doing a rectification as bellow comment : https://serverfault.com/questions/589877/pecl-command-produces-long-list-of-errors : answer 7
#RUN sed -i "$ s|\-n||g" /usr/bin/pecl
RUN pear upgrade PEAR && \
	pear install Net_DNS2
	# https://www.horde.org/apps/groupware/docs/INSTALL
#RUN pear install Date
#RUN pear install Services_Weather
# error : pear/Services_Weather is already installed and is the same as the released version 1.4.7
    #pear install File_Fstab && \
	#pear install Date_Holidays-alpha#all && \
	#pecl install extname-ver && \
	#pecl install lzf-1.6.6 && \
	#pecl install lzf && \
	#pecl install imagick && \
    #pecl install horde/horde_lz4 && \
	#pecl install memcache && \
	#pecl install http && \
RUN	rm -rf /tmp/* /var/tmp/*

#RUN pecl install lzf 

RUN echo extension=lzf.so > /etc/php/7.0/mods-available/lzf.ini && phpenmod lzf
RUN echo extension=horde_lz4.so > /etc/php/7.0/mods-available/horde_lzf.ini && phpenmod horde_lzf
RUN pear channel-discover pear.horde.org
RUN pear channel-update pear.horde.org
#RUN pear upgrade-all

#EXPOSE 80

RUN mv /etc/horde /etc/.horde
ADD ./webmail/horde/horde-init.sh /etc/my_init.d/horde-init.sh
ADD ./webmail/horde/horde-base-settings.inc /etc/horde-base-settings.inc
RUN chmod +x /etc/my_init.d/horde-init.sh

RUN mkdir -p /etc/service/apache2
ADD ./webmail/horde/run.sh /etc/service/apache2/run
RUN chmod +x /etc/service/apache2/run && \
	a2dissite 000-default && a2disconf php-horde

RUN mkdir -p /etc/apache2/scripts
ADD ./webmail/horde/proxy_client_ip.php /etc/apache2/scripts/proxy_client_ip.php

ADD ./webmail/horde/apache-horde.conf /etc/apache2/sites-available/horde.conf
RUN chown -R www-data:www-data /usr/share/horde
RUN a2ensite horde



#RUN service apache2 start

CMD ["/sbin/my_init"]
#CMD ["/etc/service/apache2/run"]