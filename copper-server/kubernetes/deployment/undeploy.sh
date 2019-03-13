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

echoRedBold ' !!!!!!!! -Undeploying Copper Email Server - !!!!!!!! '



read -r -p "Are you sure? [y/N] " response
case "$response" in
    [yY][eE][sS]|[yY])

# 2> /dev/null || true   // statement is used to ignore and go ahead when a error received
# 2>  true

## delete the ldap
kubectl delete service ldap -n copper 2> /dev/null || true
kubectl delete deployment ldap --namespace=copper 2> /dev/null || true
echoRedBold 'Ldap service deleted...'

# Then if you want to delete services created by above command
kubectl delete service phpldapadmin-service --namespace=copper 2> /dev/null || true
kubectl delete replicationcontrollers phpldapadmin-controller --namespace=copper 2> /dev/null || true
echoRedBold 'phpldapadmin service deleted...'

# If you want to delete emai service use following commands.
kubectl delete service email --namespace=copper 2> /dev/null || true
kubectl delete deployment email --namespace=copper 2> /dev/null || true
echoRedBold 'Email service deleted...'

# If you want to delete webmail service use following commands.
#kubectl delete service webmail --namespace=copper 2> /dev/null || true
#kubectl delete deployment webmail --namespace=copper 2> /dev/null || true
#docker rmi webmail 2> /dev/null || true
#echoRedBold 'Webmail service deleted...'


#deleting services
kubectl delete services alertmanager --namespace=copper 2> /dev/null || true
kubectl delete services prometheus-service --namespace=copper 2> /dev/null || true
echoRedBold 'Alert service deleted...'

#deleting configmaps
kubectl delete configmap alertmanager-config --namespace=copper 2> /dev/null || true
kubectl delete configmap alertmanager-templates --namespace=copper 2> /dev/null || true
kubectl delete configmap prometheus-server-conf --namespace=copper 2> /dev/null || true
echoRedBold 'Alert configuration deleted...'

#deleting cluster roll
kubectl delete clusterroles prometheus 2> /dev/null || true
kubectl delete clusterrolebindings prometheus 2> /dev/null || true
echoRedBold 'Prometheus Role deleted...'

#deleting deployments
kubectl delete deployment alertmanager --namespace=copper 2> /dev/null || true
kubectl delete deployment prometheus-deployment --namespace=copper 2> /dev/null || true
echoRedBold 'Prometheus deployment deleted...'

# deleting horde
# kubectl delete service horde -n copper 2> /dev/null || true
# kubectl delete deployment horde -n copper 2> /dev/null || true
# docker rmi horde 2> /dev/null || true

# deleting groupoffice
kubectl delete service groupoffice -n copper 2> /dev/null || true
kubectl delete deployment groupoffice -n copper 2> /dev/null || true
# docker rmi groupoffice 2> /dev/null || true

#deleting the secret
echoRedBold 'secret configurations goint to be deleted...'
kubectl delete secret email-secret -n copper 2> /dev/null || true
echoRedBold 'Secret configuration files deleted..'

## deleting namespace
kubectl delete namespace copper  2> /dev/null || true
echoRedBold "k8s namespace deleted"

echoGreenBold 'Finished'

    ;;
    *)
        echoRedBold "Undeploying cancelled"
        ;;
esac