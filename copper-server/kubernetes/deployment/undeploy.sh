#!/bin/bash

# ------------------------------------------------------------------------
# Copyright 2017 WSO2, Inc. (http://wso2.com)
#
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
# http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License
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

echoRedBold 'Uneploying Copper Email Server !!!!!!!!'

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