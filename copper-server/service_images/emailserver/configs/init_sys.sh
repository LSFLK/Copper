#!/usr/bin/env bash



echo "Email is ${EMAIL}"

echo "Mysql user is :${MYSQL_USER}"

if [ -z "$EMAIL" ]; then
  echo "[ERROR] Email Must be set !"
  exit 1
fi

#if [ -z "$DBPASS" ]; then
  #echo "[ERROR] MariaDB database password must be set !"
  #exit 1
#fi
#

if [ -z "$RSPAMD_PASSWORD" ]; then
  echo "[ERROR] Rspamd password must be set !"
  exit 1
fi

if [ -z "$FQDN" ]; then
  echo "[ERROR] The fully qualified domain name must be set !"
  exit 1
fi

if [ -z "$DOMAIN" ]; then
  echo "[ERROR] The domain name must be set !"
  exit 1
fi

# https://github.com/docker-library/redis/issues/53
if [[ "$REDIS_PORT" =~ [^[:digit:]] ]]
then
  REDIS_PORT=6379
fi

echo $HOSTNAME $DOMAIN $EMAIL

mkdir -p /var/mail/vhosts/$DOMAIN

chown -R vmail /var/mail
#SSL CONFIGURATION
chmod -R 755 /etc/letsencrypt/
export KEY_PATH=/etc/letsencrypt/live/"$HOSTNAME"/
files=$(shopt -s nullglob dotglob; echo $KEY_PATH)
echo $KEY_PATH
echo "Checking for existing certificates"

# Generate keys to tls folder in /cert this has been mounted as volme mount 
mkdir /tls
cd /tls
# create the root private key
openssl genrsa  -out rootCA.key 4096
#openssl genrsa  -out privkey.key 4096

# Create and Self sign the root certificate creation
openssl req -x509 -new -nodes -key rootCA.key -sha256 -days 1024 -subj "/C=LK/ST=western/O=lsf, Inc./CN=local.com" -out fullchain.pem

#Updating Root CA in the local machine
mkdir /usr/local/share/ca-certificates/extra
cp fullchain.pem /usr/local/share/ca-certificates/extra/fullchain.pem
update-ca-certificates

#Create my domain key, this is privkey.key in our example
#openssl genrsa -out example.com.key 2048
openssl genrsa -out privkey.key 2048

# Create CSR (Certificate Signing Request)
openssl req -new -sha256 -key privkey.key -subj "/C=SL/ST=western/O=lsf, Inc./CN=${DOMAIN}" -out cert.csr

# Create the certificate
openssl x509 -req -in cert.csr -CA fullchain.pem -CAkey rootCA.key -CAcreateserial -out cert.pem -days 500 -sha256

cd ..

if [ "$DEBUG" = true ]; then
   mkdir -p $KEY_PATH
   openssl req -nodes -x509 -newkey rsa:4096 -keyout ${KEY_PATH}.privkey.pem -out ${KEY_PATH}.fullchain.pem -days 365 -subj "/C=US/ST=Oregon/L=Portland/O=$ORGNIZATION/OU=Org/CN=$HOSTNAME"
   echo "IN DEBUG MODE!!!! - GENERATED SELF SIGNED SSL KEY"
  else
if (( ${#files} )); then
       echo "Found existing keys!!"
   else
       echo "No Certicates Found!!"
       echo "Generating SSL Certificates with LetsEncrypt"
       letsencrypt certonly --standalone -d $HOSTNAME --noninteractive --agree-tos --email $EMAIL
       if (( ${#files} )); then
         echo "Certificate generation Successfull"
       else
         echo "Certificate generation failed."
         exit 1
       fi
   fi
  fi

chmod -R 755 /etc/letsencrypt/

 cp -R /etc/letsencrypt/ /cert
 #sed -i.bak -e "s;%DFQN%;"${HOSTNAME}";g" "/etc/postfix/main.cf"
 sed -i.bak -e "s;%DFQN%;"${FQDN}";g" "/etc/postfix/main.cf"
 sed -i.bak -e "s;%DOMAIN%;"${DOMAIN}";g" "/etc/postfix/main.cf"
 sed -i.bak -e "s;%DOMAIN%;"${DOMAIN}";g" "/etc/dovecot/conf.d/15-lda.conf"
 sed -i.bak -e "s;%DOMAIN%;"${DOMAIN}";g" "/etc/dovecot/conf.d/20-lmtp.conf"
 #sed -i.bak -e "s;%DFQN%;"${HOSTNAME}";g" "/etc/dovecot/conf.d/10-ssl.conf"
 sed -i.bak -e "s;%DFQN%;"${FQDN}";g" "/etc/dovecot/conf.d/10-ssl.conf"

 #sed -i -e "s;redis;"${REDIS_HOST}";g" "/etc/rspamd/local.d/redis.conf"
 #sed -i -e "s;redis;"${REDIS_HOST}";g" "/etc/rspamd/local.d/redis.conf"

 PASSWORD=$(rspamadm pw --quiet --encrypt --type pbkdf2 --password "${RSPAMD_PASSWORD}")
 sed -i "s;pwrd;"${RSPAMD_PASSWORD}";g" "/etc/rspamd/local.d/worker-controller.inc"

 #OpenLDAP with Dovecot conf
 #sed -i.bak -e "s;%CN%;"${CN}";g" "/etc/dovecot/dovecot-ldap.conf.ext"
 sed -i.bak -e "s;%CN%;"${RO}";g" "/etc/dovecot/dovecot-ldap.conf.ext"
 sed -i.bak -e "s;%DC1%;"${DC1}";g" "/etc/dovecot/dovecot-ldap.conf.ext"
 sed -i.bak -e "s;%DC2%;"${DC2}";g" "/etc/dovecot/dovecot-ldap.conf.ext"
 sed -i.bak -e "s;%DC3%;"${DC3}";g" "/etc/dovecot/dovecot-ldap.conf.ext"
 #sed -i.bak -e "s;%DNPASS%;"${DNPASS}";g" "/etc/dovecot/dovecot-ldap.conf.ext"
 sed -i.bak -e "s;%DNPASS%;"${ROPASS}";g" "/etc/dovecot/dovecot-ldap.conf.ext"
 sed -i.bak -e "s;%OU%;"${OU}";g" "/etc/dovecot/dovecot-ldap.conf.ext"
 sed -i.bak -e "s;%LDAP_HOST_IP%;"${LDAP_HOST_IP}";g" "/etc/dovecot/dovecot-ldap.conf.ext"
 sed -i.bak -e "s;%DFQN%;"${FQDN}";g" "/etc/dovecot/dovecot-ldap.conf.ext"

 #OpenLDAP with Postfix conf
 sed -i.bak -e "s;%DFQN%;"${FQDN}";g" "/etc/postfix/ldap/ldap-virtual-mailbox-alias-maps.cf"
 sed -i.bak -e "s;%CN%;"${RO}";g" "/etc/postfix/ldap/ldap-virtual-mailbox-alias-maps.cf"
 sed -i.bak -e "s;%DC1%;"${DC1}";g" "/etc/postfix/ldap/ldap-virtual-mailbox-alias-maps.cf"
 sed -i.bak -e "s;%DC2%;"${DC2}";g" "/etc/postfix/ldap/ldap-virtual-mailbox-alias-maps.cf"
 sed -i.bak -e "s;%DC3%;"${DC3}";g" "/etc/postfix/ldap/ldap-virtual-mailbox-alias-maps.cf"
 sed -i.bak -e "s;%DNPASS%;"${ROPASS}";g" "/etc/postfix/ldap/ldap-virtual-mailbox-alias-maps.cf"
 sed -i.bak -e "s;%OU%;"${OU}";g" "/etc/postfix/ldap/ldap-virtual-mailbox-alias-maps.cf"
 sed -i.bak -e "s;%LDAP_HOST_IP%;"${LDAP_HOST_IP}";g" "/etc/postfix/ldap/ldap-virtual-mailbox-alias-maps.cf"

 sed -i.bak -e "s;%DFQN%;"${FQDN}";g" "/etc/postfix/ldap/ldap-virtual-mailbox-maps.cf"
 sed -i.bak -e "s;%CN%;"${RO}";g" "/etc/postfix/ldap/ldap-virtual-mailbox-maps.cf"
 sed -i.bak -e "s;%DC1%;"${DC1}";g" "/etc/postfix/ldap/ldap-virtual-mailbox-maps.cf"
 sed -i.bak -e "s;%DC2%;"${DC2}";g" "/etc/postfix/ldap/ldap-virtual-mailbox-maps.cf"
 sed -i.bak -e "s;%DC3%;"${DC3}";g" "/etc/postfix/ldap/ldap-virtual-mailbox-maps.cf"
 sed -i.bak -e "s;%DNPASS%;"${ROPASS}";g" "/etc/postfix/ldap/ldap-virtual-mailbox-maps.cf"
 sed -i.bak -e "s;%OU%;"${OU}";g" "/etc/postfix/ldap/ldap-virtual-mailbox-maps.cf"
 sed -i.bak -e "s;%LDAP_HOST_IP%;"${LDAP_HOST_IP}";g" "/etc/postfix/ldap/ldap-virtual-mailbox-maps.cf"

 sed -i.bak -e "s;%DFQN%;"${FQDN}";g" "/etc/postfix/ldap/ldap-virtual-mailbox-domains.cf"
 sed -i.bak -e "s;%CN%;"${RO}";g" "/etc/postfix/ldap/ldap-virtual-mailbox-domains.cf"
 sed -i.bak -e "s;%DC1%;"${DC1}";g" "/etc/postfix/ldap/ldap-virtual-mailbox-domains.cf"
 sed -i.bak -e "s;%DC2%;"${DC2}";g" "/etc/postfix/ldap/ldap-virtual-mailbox-domains.cf"
 sed -i.bak -e "s;%DC3%;"${DC3}";g" "/etc/postfix/ldap/ldap-virtual-mailbox-domains.cf"
 sed -i.bak -e "s;%DNPASS%;"${ROPASS}";g" "/etc/postfix/ldap/ldap-virtual-mailbox-domains.cf"
 sed -i.bak -e "s;%OU%;"${OU}";g" "/etc/postfix/ldap/ldap-virtual-mailbox-domains.cf"
 sed -i.bak -e "s;%LDAP_HOST_IP%;"${LDAP_HOST_IP}";g" "/etc/postfix/ldap/ldap-virtual-mailbox-domains.cf"


 groupadd -g 5000 vmail && useradd -g vmail -u 5000 vmail -d /var/mail
 chown -R vmail:vmail /var/mail
 mkdir -p /var/mail/sieve/global
 cp -R /sieve/* /var/mail/sieve/global/
 sievec /var/mail/sieve/global/spam-global.sieve
 sievec /var/mail/sieve/global/report-ham.sieve
 rspamadm dkim_keygen -b 1024 -s 2018 -d ${DOMAIN} -k /var/lib/rspamd/dkim/2018.key > /var/lib/rspamd/dkim/2018.txt
 chown -R _rspamd:_rspamd /var/lib/rspamd/dkim
 chmod 440 /var/lib/rspamd/dkim/*
 chown -R vmail: /var/mail/sieve/
 cat /var/lib/rspamd/dkim/2018.txt
 touch /var/log/mail.log
 touch /var/log/mail.err
 chown root:root /etc/postfix/dynamicmaps.cf
 chown root:root /etc/postfix/main.cf
 chmod 0644 /etc/postfix/main.cf
 
 #chgrp postfix /etc/postfix/sql/mysql_virtual_*.cf
 #chmod u=rw,g=r,o= /etc/postfix/sql/mysql_virtual_*.cf

# making exicutable the agent owned shell files
 
 #chmod +x /agent/init_refresh.sh

 # give the necessary permission for /var/mail folder to create 
 chmod a+rwxt -R /var/mail
 
 chmod a+w /var/log/mail*
 chown zeyple /etc/zeyple.conf
 touch /etc/postfix/virtual
 touch /etc/postfix/access
 postmap hash:/etc/postfix/virtual
 postmap hash:/etc/postfix/access

 service rsyslog start 2> /dev/null || true
 service postfix start 2> /dev/null || true
 service dovecot restart 2> /dev/null || true
 # this take too much of time
 service rspamd start 2> /dev/null || true
 #service clamav start # clamav unrecognized service
 #freshclam
 service rspamd reload 2> /dev/null || true
 #service clamav-daemon start # if there is not enough memory in the container this will omit a error and docker build will stop from hear.
 #service clamav-freshclam start

#starting filebeat
cd filebeat-6.7.1-linux-x86_64
chown root filebeat.yml
./filebeat -e
 

 
 tail -f /dev/null