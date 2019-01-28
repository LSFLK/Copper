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

set -e

ECHO=`which echo`
KUBECTL=`which kubectl`

# methods

# color refference
#Black        0;30     Dark Gray     1;30
#Red          0;31     Light Red     1;31
#Green        0;32     Light Green   1;32
#Brown/Orange 0;33     Yellow        1;33
#Blue         0;34     Light Blue    1;34
#Purple       0;35     Light Purple  1;35
#Cyan         0;36     Light Cyan    1;36
#Light Gray   0;37     White         1;37

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

echoGreenBold 'Deploying Copper Email Server...'




# starting kubernetes deployment

# changing to parent directory
cd ..

# Creating the k8s namespace
kubectl create namespace monitoring

# Creating ldap server
kubectl create -f openldap/openldap.yaml

# Create the phpldapadmin service  
kubectl create -f phpldapadmin/phpldapadmin.yaml 

# creating emailserver docker image
cd emailserver
docker build -t emailserver .

# wait 1 seconds 
sleep 3s
cd ..

# Create the emailserver service from kubernetes using docker image we have created now.
kubectl create -f emailserver/email.yaml

#Building docker image
cd copperclient

#Build the docker image
docker build -t webmail .

# wait 1 seconds 
sleep 1s
cd ..

#Buld the kubernetes pod
Kubectl create -f copperclient/webmail.yaml

#Prometheus implementation
# Creating a roll has the access for clusters and bind the cluster roll.
kubectl create -f prometheus-alert/clusterRole.yaml
# Create the config map to keep configuration data of prometheus
kubectl create -f prometheus-alert/config-map.yaml -n monitoring
# Deploy prometheus pods 
kubectl create  -f prometheus-alert/prometheus-deployment.yaml --namespace=monitoring
# Create the service to access prometheus 
kubectl create -f prometheus-alert/prometheus-service.yaml --namespace=monitoring

# Alert manager implementation
# Creating the configuration 
kubectl create -f prometheus-alert/AlertManagerConfigmap.yaml
#
kubectl create -f prometheus-alert/AlertTemplateConfigMap.yaml
#
kubectl create -f prometheus-alert/Deployment.yaml
#
kubectl create -f prometheus-alert/Service.yaml


# wait 1 seconds 
sleep 1s

#${KUBECTL} create -f ../ingresses/wso2apim-ingress.yaml
#${KUBECTL} create -f ../ingresses/mandatory.yaml
#${KUBECTL} create -f ../ingresses/service-nodeport.yaml

echoGreenBold 'Finished'
