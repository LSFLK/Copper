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

echoRedBold ' !!!!!!!! -Undeploying Copper Email Server - !!!!!!!! '

# 2> /dev/null || true   // statement is used to ignore and go ahead when a error received
# 2>  true

## delete the ldap
kubectl delete service ldap-service --namespace=monitoring 2> /dev/null || true
kubectl delete deployment ldap --namespace=monitoring 2> /dev/null || true
echoRedBold 'Ldap service deleted...'
# Then if you want to delete services created by above command
kubectl delete service phpldapadmin-service --namespace=monitoring 2> /dev/null || true
kubectl delete replicationcontrollers phpldapadmin-controller --namespace=monitoring 2> /dev/null || true
echoRedBold 'phpldapadmin service deleted...'
# If you want to delete emai service use following commands.
kubectl delete service email --namespace=monitoring 2> /dev/null || true
kubectl delete deployment email --namespace=monitoring 2> /dev/null || true
echoRedBold 'Email service deleted...'


#deleting services
kubectl delete services alertmanager --namespace=monitoring 2> /dev/null || true
kubectl delete services prometheus-service --namespace=monitoring 2> /dev/null || true
echoRedBold 'Alert service deleted...'
#deleting configmaps
kubectl delete configmap alertmanager-config --namespace=monitoring 2> /dev/null || true
kubectl delete configmap alertmanager-templates --namespace=monitoring 2> /dev/null || true
kubectl delete configmap prometheus-server-conf --namespace=monitoring 2> /dev/null || true
echoRedBold 'Alert configuration deleted...'
#deleting cluster roll
kubectl delete clusterroles prometheus 2> /dev/null || true
kubectl delete clusterrolebindings prometheus 2> /dev/null || true
echoRedBold 'Prometheus Role deleted...'
#deleting deployments
kubectl delete deployment alertmanager --namespace=monitoring 2> /dev/null || true
kubectl delete deployment prometheus-deployment --namespace=monitoring 2> /dev/null || true
echoRedBold 'Prometheus deployment deleted...'


## deleting namespace
kubectl delete namespace monitoring  2> /dev/null || true
echoRedBold "k8s namespace deleted"

echoGreenBold 'Finished'