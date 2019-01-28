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

echoRedBold 'Undeploying Copper Email Server !!!!!!!!'

## delete the ldap
kubectl delete namespace monitoring
echoRedBold "k8s namespace deleted"

## delete the ldap
kubectl delete service ldap-service --namespace=monitoring
kubectl delete deployment ldap --namespace=monitoring

# Then if you want to delete services created by above command
kubectl delete service phpldapadmin-service --namespace=monitoring
kubectl delete replicationcontrollers phpldapadmin-controller --namespace=monitoring

# If you want to delete emai service use following commands.
kubectl delete service email --namespace=monitoring
kubectl delete deployment email --namespace=monitoring



#deleting services
kubectl delete services alertmanager --namespace=monitoring
kubectl delete services prometheus-service --namespace=monitoring
#deleting configmaps
kubectl delete configmap alertmanager-config --namespace=monitoring
kubectl delete configmap alertmanager-templates --namespace=monitoring
kubectl delete configmap prometheus-server-conf --namespace=monitoring
#deleting cluster roll
kubectl delete clusterroles prometheus
kubectl delete clusterrolebindings prometheus
#deleting deployments
kubectl delete deployment alertmanager --namespace=monitoring
kubectl delete deployment prometheus-deployment --namespace=monitoring


echoGreenBold 'Finished'