#!/bin/bash

# ------------------------------------------------------------------------
#  (http://opensource.lk)
#
# 

# ------------------------------------------------------------------------

# methods

set -e

ECHO=`which echo`
KUBECTL=`which kubectl`

# method to print bold
function echoBold () {
    ${ECHO} $'\e[1m'"${1}"$'\e[0m'
}

# method to print red bold fonts 
function echoRedBold () {
    #    .---------- constant part!
    #    vvvv vvvv-- the code from above
    RED='\033[0;31m'
    NC='\033[0m' # No Color
    BD='\e[1m' # bold
    NM='\e[0m' # normal size
    RDBD='\033[0;31m\e[1m' # red and bold
    RDNM='\e[0m\033[0m' # normal color and normal size
    #printf "* ${BD}${RED}-${1} ${NC}${NM}\n"
    #${ECHO} ${RED}${1}
    printf "* ${RDBD}-${1} ${RDNM}\n"
    
}

# method to print red bold fonts 
function echoGreenBold () {
    #    .---------- constant part!
    #    vvvv vvvv-- the code from above
    RED='\033[0;32m' # green
    NC='\033[0m' # No Color
    BD='\e[1m' # bold
    NM='\e[0m' # normal size
    RDBD='\033[0;32m\e[1m' # green and bold
    RDNM='\e[0m\033[0m' # normal color and normal size
    #printf "* ${BD}${RED}-${1} ${NC}${NM}\n"
    #${ECHO} ${RED}${1}
    printf "* ${RDBD}-${1} ${RDNM}\n"
    
}

# Creating The Banner
#Colours
red="\033[00;31m"
RED="\033[01;31m"

green="\033[00;32m"
GREEN="\033[01;32m"

brown="\033[00;33m"
YELLOW="\033[01;33m"

blue="\033[00;34m"
BLUE="\033[01;34m"

purple="\033[00;35m"
PURPLE="\033[01;35m"

cyan="\033[00;36m"
CYAN="\033[01;36m"

white="\033[00;37m"
WHITE="\033[01;37m"

WHITECHAR="\033[01;39m"

NC="\033[00m"
BOLD="\e[1m"
NRM="\e[0m"

echo  "${RED}******************************************************************************"
echo  "${WHITE}**                                                                          **"
echo  "${WHITECHAR}**                    COPPER EMAIL SOLUTION                                 **"
echo  "${WHITE}**               Please share your experinace with us                       **"
echo  "${WHITE}**               Email : support@copper.opensource.lk                       **"
echo  "${RED}******************************************************************************"
echo

echoRedBold ' !!!!!!!! -Certificate Generation - !!!!!!!! '


read -r -p "Are you sure? [y/N] " response
case "$response" in
    [yY][eE][sS]|[yY])

mkdir tls 2> /dev/null || true

echoGreenBold 'tls folder created in development folder...'

cd tls

rm -rf *

# Root Certificate Authority key file generation

openssl genrsa  -out rootCA.key 4096
echoGreenBold 'rootCA.key file generated...'

# Local certificate authority (CA) certificate generation
echo Enter country Code: 
read cc
#echo "    MYSQL_DATABASE: $mysql_db" >> secret.yaml
echo Enter State / Province: 
read st
echo Enter Organization: 
read og
echo Enter your domain: 
read cn

openssl req -x509 -new -nodes -key rootCA.key -sha256 -days 1024 -subj "/C=$cc/ST=$st/O=$og, Inc./CN=local.com" -out rootCA.crt

echoGreenBold 'rootCA.crt CA certificate generated...'

#updating your local certificate store
#mkdir /usr/local/share/ca-certificates/extra
#update-ca-certificates 

# Create your domain key
openssl genrsa -out $cn.key 2048

echoGreenBold '$cn domain key created...'

# Create self signed request

openssl req -new -sha256 -key $cn.key -subj "/C=$cc/ST=$st/O=$og, Inc./CN=$cn" -out $cn.csr

echoGreenBold '$cn.csr Certificate Request created..'

# Create self signed certificate

openssl x509 -req -in $cn.csr -CA rootCA.crt -CAkey rootCA.key -CAcreateserial -out $cn.crt -days 500 -sha256

echoGreenBold 'Self signed certificate created...'

#Generate dhparam

openssl dhparam -out dhparam.pem 2048

echoGreenBold 'Diffie-Hellman group code generation completed...'

echoGreenBold 'Certification Generation Completed'

    ;;
    *)
        echoRedBold "Undeploying cancelled"
        ;;
esac