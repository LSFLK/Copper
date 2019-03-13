#!/bin/bash
# Ask the user for their name
# echo Hello, who am I talking to?
# read varname
# echo "It's nice to meet you $varname" >> anu.txt
# echo What is your age?
# read age
# echo "Your age: $age" >> anu.txt

echo "apiVersion: v1" >> secret.yaml
echo "kind: Secret" >> secret.yaml
echo "metadata:" >> secret.yaml
echo "    name: email-secret" >> secret.yaml
echo "    namespace: monitoring" >> secret.yaml
echo "type: Opaque" >> secret.yaml
echo "stringData:" >> secret.yaml
echo "    TELEGRAF_VERSION: 1.8.1-1" >> secret.yaml

echo Enter mysql database name: 
read mysql_db
echo "    MYSQL_DATABASE: $mysql_db" >> secret.yaml

echo Enter mysql database password: 
read mysql_db_pwd
echo "    MYSQL_DATABASE: $mysql_db_pwd" >> secret.yaml

echo Enter admin username \(without domain\):
read CN
echo "    CN : $CN" >> secret.yaml

echo Your domain must contain 3 parts. \(Eg: part1.part2.part3\)
echo Enter the first part of domain:
read DC1
echo "    DC1 : $DC1" >> secret.yaml
echo Enter the second part of domain:
read DC2
echo "    DC2 : $DC2" >> secret.yaml
echo Enter the third part of domain:
read DC3
echo "    DC3 : $DC3" >> secret.yaml
echo Enter admin password:
read DNPASS
echo "    DNPASS : $DNPASS" >> secret.yaml


echo "    OU : Users" >> secret.yaml
echo "    LDAP_HOST_IP : ldap-service" >> secret.yaml
echo "    KEY_PATH : KEYPATH" >> secret.yaml

echo "    EMAIL : $CN@$DC1.$DC2.$DC3" >> secret.yaml
echo "    HOSTNAME : mail.$DC1.$DC2.$DC3" >> secret.yaml
echo "    FQDN : mail.$DC1.$DC2.$DC3" >> secret.yaml
echo "    DOMAIN : $DC1.$DC2.$DC3" >> secret.yaml

echo "    REDIS_HOST : REDIS_HOST" >> secret.yaml
echo "    REDIS_PORT : REDIS_PORT" >> secret.yaml
echo "    DEBUG : \"true\"" >> secret.yaml

echo Enter password for spam filter \(RspamD\)
read rspamd_pwd
echo "    RSPAMD_PASSWORD : $rspamd_pwd" >> secret.yaml