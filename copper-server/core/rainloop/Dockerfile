#https://medium.com/@meeramarygeorge/create-php-mysql-apache-development-environment-using-docker-in-windows-9beeba6985
#https://www.digitalocean.com/community/tutorials/how-to-secure-apache-with-let-s-encrypt-on-ubuntu-18-04
FROM ubuntu:latest
#FROM ubuntu:14.04

MAINTAINER Name<admin@opensource.lk>

ENV DEBIAN_FRONTEND noninteractive
ENV DOMAIN=${DOMAIN}

# Install basics

RUN apt-get update

RUN apt-get install -y software-properties-common && \

add-apt-repository ppa:ondrej/php && apt-get update

#RUN apt-get install -y — force-yes curl
RUN apt-get install -y curl

# installing ping command
RUN apt-get install -y iputils-ping

RUN apt-get update

# Install PHP 5.6

#RUN apt-get install -y — allow-unauthenticated php5.6 php5.6-mysql php5.6-mcrypt php5.6-cli php5.6-gd php5.6-curl
RUN apt-get install -y php5.6 php5.6-mysql php5.6-mcrypt php5.6-cli php5.6-gd php5.6-curl

# Enable apache mods.

RUN a2enmod php5.6

RUN a2enmod rewrite

# Update the PHP.ini file, enable <? ?> tags and quieten logging.

RUN sed -i "s/short_open_tag = Off/short_open_tag = On/" /etc/php/5.6/apache2/php.ini

RUN sed -i "s/error_reporting = .*$/error_reporting = E_ERROR | E_WARNING | E_PARSE/" /etc/php/5.6/apache2/php.ini



# Manually set up the apache environment variables

ENV APACHE_LOG_DIR /var/log/apache2

ENV APACHE_LOCK_DIR /var/lock/apache2

ENV APACHE_PID_FILE /var/run/apache2.pid

# Manually set up the apache environment variables
ENV APACHE_RUN_USER www-data

ENV APACHE_RUN_GROUP www-data



# Expose apache.

EXPOSE 89
EXPOSE 443
#EXPOSE 8080

EXPOSE 4343



#EXPOSE 3306

# Update the default apache site with the config we created.

#ADD ./config/apache-config.conf /etc/apache2/sites-enabled/000-default.conf
ADD ./config/hosts /etc/hosts

# Copy site into place.

ADD ./app/ /var/www/html/site/
#RUN  copy cert files
ADD ./tls/cert.pem /etc/ssl/certs/copper.opensource.lk.cert.pem
ADD ./tls/privkey.pem /etc/ssl/private/copper.opensource.lk.privkey.pem

#RUN chmod -R 777 /var/www/html/site/app

 RUN chown -R www-data:www-data /var/www/html/site/

 # Update the default apache site with the config we created.
#ADD ./config/apache-config.conf /etc/apache2/sites-enabled/example.com.conf

RUN apt-get -y install nano

# Lets encript 

# First, add the repository:
RUN add-apt-repository -y ppa:certbot/certbot

#Install Certbot's Apache package with apt:
RUN apt install -y python-certbot-apache

# reload the configuration
#RUN systemctl reload apache2

# manual lets encript key generation tool
#certbot --apache -d example.com -d www.example.com
#CMD certbot --apache -d copper.opensource.lk -d copper.opensource.lk


# with certbot-auto
#https://www.exratione.com/2016/06/a-simple-setup-and-installation-script-for-lets-encrypt-ssl-certificates/
RUN apt-get install -y wget
RUN wget https://dl.eff.org/certbot-auto
RUN chmod a+x certbot-auto
RUN mv certbot-auto /usr/local/bin
RUN certbot-auto --noninteractive --os-packages-only
# Use this command if a webserver is already running with the webroot
# at /var/www/html.
RUN certbot-auto certonly \
RUN certbot-auto \
  --non-interactive \
  --agree-tos \
  --text \
  --rsa-key-size 4096 \
  --email admin@copper.opensource.lk \
  --webroot-path /var/www/html/site/ \
  --apache \
  --help plugins \
  --domains "copper.opensource.lk"




#RUN cp /etc/letsencrypt/live/copper.opensource.lk/fullchain.pem /etc/ssl/certs/copper.opensource.lk.fullchain.pem
#RUN cp /etc/letsencrypt/live/copper.opensource.lk/privkey.pem /etc/ssl/private/copper.opensource.lk.privkey.pem
#RUN cp ./tls/cert.pem /etc/ssl/certs/copper.opensource.lk.cert.pem
#RUN cp ./tls/privkey.pem /etc/ssl/private/copper.opensource.lk.privkey.pem

# this for copper live server
ADD ./config/copper.opensource.lk.conf /etc/apache2/sites-enabled/copper.opensource.lk.conf

# adding ports.conf file to the image
ADD ./config/ports.conf  /etc/apache2/

# adding host file
ADD ./config/hosts /etc/hosts

RUN certbot renew --dry-run
# By default start up apache in the foreground, override with /bin/bash for interative.
#CMD chmod -R 777 /var/www/html/data/
CMD /usr/sbin/apache2ctl -D FOREGROUND

