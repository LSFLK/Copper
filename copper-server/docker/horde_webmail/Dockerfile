##################################################################################################################

#### https://www.horde.org/apps/webmail/docs/INSTALL

##################################################################################################################

FROM ubuntu:18.04
MAINTAINER Lanka Software Foundation <support@opensource.lk>
ARG DEBIAN_FRONTEND=noninteractive
LABEL KEY=LSF-COPPER-HORDE


RUN apt-get update
RUN apt-get -y upgrade
RUN apt-get -y install nano

RUN apt-get -y install apache2 libapache2-mod-php mysql-client gnupg2 openssl php-pear

RUN apt-get -y install php-intl php-ldap php-ssh2 php-curl php-http php-xmlrpc php-geoip php-memcache php-memcached php-tidy
RUN apt-get -y install php-common libapache2-mod-php php-cli
RUN apt-get -y install php-mysql
# RUN apt-get -y install mysql-server
RUN pear channel-discover pear.horde.org
RUN pear install horde/horde_role

##################################################################################################################

#### Run below commands inside the horde container ######

##################################################################################################################

# RUN pear run-scripts horde/horde_role
# ###  (1)  this is a user input ----->  /var/www/html/horde
# ###  (2)  this is a user input ----->  /var/www/horde
#################### You need to change apache enabled sites and available sites if you chose 2nd option


# RUN pear install -a -B horde/webmail

# RUN webmail-install



# RUN chown -R www-data:www-data /var/www/
# Add "extension=php_mysql.dll" to /etc/php/7.2/apache2/php.ini file
# RUN service apache2 restart

#########################
##### MYSQL
#########################
# RUN apt-get install mysql-server
###### CAREFULL with this ####### RUN chown -R mysql:mysql /var/lib/mysql /var/run/mysqld && service mysql start && mvn -q verify site

# Run dtabase migrate query in horde /usr/bin


CMD /usr/sbin/apache2ctl -D FOREGROUND