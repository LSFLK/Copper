#https://medium.com/@meeramarygeorge/create-php-mysql-apache-development-environment-using-docker-in-windows-9beeba6985
#https://www.digitalocean.com/community/tutorials/how-to-secure-apache-with-let-s-encrypt-on-ubuntu-18-04
FROM ubuntu:latest

MAINTAINER Name<tharangar@opensource.lk>

ENV DEBIAN_FRONTEND noninteractive
ENV DOMAIN=${DOMAIN}

# Install basics

RUN apt-get update

RUN apt-get install -y software-properties-common && \

add-apt-repository ppa:ondrej/php && apt-get update

#RUN apt-get install -y — force-yes curl
RUN apt-get install -y curl

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



# Expose apache.

EXPOSE 80

#EXPOSE 8080

EXPOSE 443

EXPOSE 3306

# Update the default apache site with the config we created.

#ADD apache-config.conf /etc/apache2/sites-enabled/000-default.conf

# Copy site into place.
ADD ./webmail/rainloop/app/ /var/www/html/
#RUN chown -R www-data:www-data /var/www/site/app .

# Update the default apache site with the config we created.
#ADD ./webmail/rainloop/config/apache-config.conf /etc/apache2/sites-enabled/000-default.conf
ADD ./webmail/rainloop/config/copper.opensource.lk.conf /etc/apache2/sites-enabled/copper.opensource.lk.conf



# Lets encript 

# First, add the repository:
RUN add-apt-repository -y ppa:certbot/certbot

#Install Certbot's Apache package with apt:
RUN apt install -y python-certbot-apache

# reload the configuration
CMD systemctl reload apache2

#certbot --apache -d example.com -d www.example.com
CMD certbot --apache -d copper.opensource.lk -d www.copper.opensource.lk
CMD certbot renew --dry-run
# By default start up apache in the foreground, override with /bin/bash for interative.

CMD /usr/sbin/apache2ctl -D FOREGROUND