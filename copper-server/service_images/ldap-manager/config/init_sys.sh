#!/usr/bin/env bash



echo "Email is ${DOMAIN}"



#if [ -z "$DBPASS" ]; then
  #echo "[ERROR] MariaDB database password must be set !"
  #exit 1
#fi
#



if [ -z "$RO" ]; then
  echo "[ERROR] LDAP READ ONLY USER SHOULD BE SET !"
  exit 1
fi

if [ -z "$ROPASS" ]; then
  echo "[ERROR] LDAP USER PASSWORD SHOULD BE SET !"
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
         echo "Certicate generation Successfull"
       else
         echo "Certicate generation failed."
         exit 1
       fi
   fi
  fi

chmod -R 755 /etc/letsencrypt/

 cp -R /etc/letsencrypt/ /cert
 #sed -i.bak -e "s;%DFQN%;"${HOSTNAME}";g" "/etc/postfix/main.cf"
 #sed -i.bak -e "s;%DFQN%;"${FQDN}";g" "/etc/postfix/main.cf"
 #sed -i.bak -e "s;%DOMAIN%;"${DOMAIN}";g" "/etc/postfix/main.cf"


# password change config file changes
 sed -i.bak -e "s;%CN%;"${RO}";g" "/var/www/html/site/service/conf/config.inc.php"
 sed -i.bak -e "s;%DC1%;"${DC1}";g" "/var/www/html/site/service/conf/config.inc.php"
 sed -i.bak -e "s;%DC2%;"${DC2}";g" "/var/www/html/site/service/conf/config.inc.php"
 sed -i.bak -e "s;%DC3%;"${DC3}";g" "/var/www/html/site/service/conf/config.inc.php"
 sed -i.bak -e "s;%DNPASS%;"${ROPASS}";g" "/var/www/html/site/service/conf/config.inc.php"

 service rsyslog start 2> /dev/null || true
 
 
 
 # make something up to keep the container running
 #tail -f /dev/null
 /usr/sbin/apache2ctl -D FOREGROUND