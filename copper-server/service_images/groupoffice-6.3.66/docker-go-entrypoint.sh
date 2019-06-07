#!/bin/sh
set -e

chown -R www-data:www-data /var/lib/groupoffice

cp /etc/groupoffice/config.php.tpl /etc/groupoffice/config.php

sed -i 's/{dbHost}/'${MYSQL_HOST}'/' /etc/groupoffice/config.php
sed -i 's/{dbName}/'${MYSQL_DATABASE}'/' /etc/groupoffice/config.php
sed -i 's/{dbUser}/'${MYSQL_USER}'/' /etc/groupoffice/config.php
sed -i 's/{dbPass}/'${MYSQL_PASSWORD}'/' /etc/groupoffice/config.php

# >>> https convertion works added by me >>>>

#mkdir /etc/apache2/ssl

#cd /etc/apache2/ssl

#openssl req -new -newkey rsa:2048 -nodes -keyout server.key -out server.csr


# >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

#call original entry point
docker-php-entrypoint "$@"
