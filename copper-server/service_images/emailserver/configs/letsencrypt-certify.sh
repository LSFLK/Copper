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

 
 tail -f /dev/null