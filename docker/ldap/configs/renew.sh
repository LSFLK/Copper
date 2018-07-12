#!/bin/sh

export DOMAIN=${DOMAIN:-$(hostname --domain)}
export DEBUG=${DEBUG}
#export EMAIL=${EMAIL}
EMAIL=tharangar@opensource.lk
SITE=coppermail.dyndns.org
#SITE=${DOMAIN}
# creating certificate files for openldap server
mkdir -p /etc/letsencrypt/live/$SITE/
echo "path created /etc/letsencrypt/live/$SITE/ "
chmod -R 755 /etc/letsencrypt/
export KEY_PATH=/etc/letsencrypt/live/$SITE/
files=$(shopt -s nullglob dotglob; echo $KEY_PATH)
echo $KEY_PATH
echo "Checking for existing certificates"



if [ "$DEBUG" = true ]; then
   mkdir -p $KEY_PATH
   openssl req -nodes -x509 -newkey rsa:4096 -keyout ${KEY_PATH}.privkey.pem -out ${KEY_PATH}.fullchain.pem -days 365 -subj "/C=US/ST=Oregon/L=Portland/O=Company Name/OU=Org/CN=nextgenmed.dyndns.org"
   echo "IN DEBUG MODE!!!! - GENERATED SELF SIGNED SSL KEY"
  else
if (( ${#files} )); then
       echo "Found existing keys!!"
   else
       echo "No Certicates Found!!"
       echo "Generating SSL Certificates with LetsEncrypt"
       letsencrypt certonly --standalone -d $SITE --noninteractive --agree-tos --email $EMAIL
       if (( ${#files} )); then
         echo "Certicate generation Successfull"
       else
         echo "Certicate generation failed."
         exit 1
       fi
   fi
  fi

# move to the correct let's encrypt directory
cd /etc/letsencrypt/live/$SITE

# copy the files
cp cert.pem /etc/ssl/certs/$SITE.cert.pem
cp fullchain.pem /etc/ssl/certs/$SITE.fullchain.pem
cp privkey.pem /etc/ssl/private/$SITE.privkey.pem

# adjust permissions of the private key
chown :ssl-cert /etc/ssl/private/$SITE.privkey.pem
chmod 640 /etc/ssl/private/$SITE.privkey.pem

# restart slapd to load new certificates
systemctl restart slapd
