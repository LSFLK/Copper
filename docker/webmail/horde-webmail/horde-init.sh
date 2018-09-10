#!/bin/bash

#if [ ! -f "/etc/horde/horde/conf.php" ]; then
#    cp -rp /etc/.horde/* /etc/horde/
#    cp /etc/horde/horde/conf.php.dist /etc/horde/horde/conf.php
#    cat /etc/horde-base-settings.inc >> /etc/horde/horde/conf.php
#    chown -R www-data:www-data /etc/horde
#fi

#if [ $MYSQL_PORT_3306_TCP_ADDR ]; then
#    sed -i "s/^\(.*sql.*hostspec.*=\)\(.*\);/\1 '$MYSQL_PORT_3306_TCP_ADDR';/g" /etc/horde/horde/conf.php
#    sed -i "s/^\(.*sql.*port.*=\)\(.*\);/\1 '$MYSQL_PORT_3306_TCP_PORT';/g" /etc/horde/horde/conf.php
#else
#	sed -i "s/^\(.*sql.*hostspec.*=\)\(.*\);/\1 '$DB_HOST';/g" /etc/horde/horde/conf.php
#	sed -i "s/^\(.*sql.*port.*=\)\(.*\);/\1 '$DB_PORT';/g" /etc/horde/horde/conf.php
#	sed -i "s/^\(.*sql.*protocol.*=\)\(.*\);/\1 '$DB_PROTOCOL';/g" /etc/horde/horde/conf.php
#fi

#if [ $MYSQL_ENV_MYSQL_ROOT_PASSWORD ]; then
#	#sed -i "s/^\(.*sql.*username.*=\)\(.*\);/\1 'root';/g" /etc/horde/horde/conf.php
#	sed -i "s/^\(.*sql.*username.*=\)\(.*\);/\1 '$MYSQL_ENV_MYSQL_ROOT_USERNAME';/g" /etc/horde/horde/conf.php
#	sed -i "s/^\(.*sql.*password.*=\)\(.*\);/\1 '$MYSQL_ENV_MYSQL_ROOT_PASSWORD';/g" /etc/horde/horde/conf.php
#	sed -i "s/^\(.*sql.*database.*=\)\(.*\);/\1 '$DB_NAME';/g" /etc/horde/horde/conf.php
#	sed -i "s/^\(.*sql.*phptype.*=\)\(.*\);/\1 '$DB_DRIVER';/g" /etc/horde/horde/conf.php
#else
#	sed -i "s/^\(.*sql.*username.*=\)\(.*\);/\1 '$DB_USER';/g" /etc/horde/horde/conf.php
#	sed -i "s/^\(.*sql.*password.*=\)\(.*\);/\1 '$DB_PASS';/g" /etc/horde/horde/conf.php
#	sed -i "s/^\(.*sql.*database.*=\)\(.*\);/\1 '$DB_NAME';/g" /etc/horde/horde/conf.php
#	sed -i "s/^\(.*sql.*phptype.*=\)\(.*\);/\1 '$DB_DRIVER';/g" /etc/horde/horde/conf.php
#fi


sed -i "s/^\(.*sql.*username.*=\)\(.*\);/\1 '$DB_USER';/g" /etc/horde/horde/conf.php
sed -i "s/^\(.*sql.*password.*=\)\(.*\);/\1 '$DB_PASS';/g" /etc/horde/horde/conf.php
sed -i "s/^\(.*sql.*database.*=\)\(.*\);/\1 '$DB_NAME';/g" /etc/horde/horde/conf.php
sed -i "s/^\(.*sql.*phptype.*=\)\(.*\);/\1 '$DB_DRIVER';/g" /etc/horde/horde/conf.php


# this is where horde_db_migrate fiel is placed
cd /usr/sbin


if [ $MYSQL_PORT_3306_TCP_ADDR ]; then

        RESULT=`mysql -u $MYSQL_ENV_MYSQL_ROOT_USERNAME  --password=$MYSQL_ENV_MYSQL_ROOT_PASSWORD --port=$MYSQL_PORT_3306_TCP_PORT --host=$MYSQL_PORT_3306_TCP_ADDR --protocol=$DB_PROTOCOL --skip-column-names -e "SHOW DATABASES LIKE '$DB_NAME'"`
	if [ "$RESULT" == "$DB_NAME" ]; then
    	echo "Database exist"
	else
		echo "Database does not exist"
    	mysql -u $MYSQL_ENV_MYSQL_ROOT_USERNAME  --password=$MYSQL_ENV_MYSQL_ROOT_PASSWORD --port=$MYSQL_PORT_3306_TCP_PORT --host=$MYSQL_PORT_3306_TCP_ADDR --protocol=$DB_PROTOCOL -e "CREATE DATABASE $DB_NAME"
    	horde-db-migrate
    	echo "Database created"
	fi
else

	RESULT=`mysql -u $MYSQL_ENV_MYSQL_ROOT_USERNAME  --password=$DB_PASS --port=$DB_PORT --host=$DB_HOST --protocol=$DB_PROTOCOL --skip-column-names -e "SHOW DATABASES LIKE '$DB_NAME'"`
	if [ "$RESULT" == "$DB_NAME" ]; then
    	echo "Database exist"
	else
    	echo "Database does not exist"
    	mysql -u $MYSQL_ENV_MYSQL_ROOT_USERNAME  --password=$DB_PASS --port=$DB_PORT --host=$DB_HOST --protocol=$DB_PROTOCOL --skip-column-names -e "CREATE DATABASE $DB_NAME"
    	horde-db-migrate
    	echo "Database created"
	fi
fi

#sed -i "$ s|\-n||g" /usr/bin/pecl
#pecl install lzf 
#pear upgrade-all

#sed -i "s/^\(.*use_ssl.*=\)\(.*\);/\1 0;/g" /etc/horde/horde/conf.php
#sed -i "s/^\(.*testdisable.*=\)\(.*\);/\1 $HORDE_TEST_DISABLE;/g" /etc/horde/horde/conf.php

cd /usr/sbin
horde-db-migrate

service apache2 start


