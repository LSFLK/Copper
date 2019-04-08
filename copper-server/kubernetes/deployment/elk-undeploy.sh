
#!/bin/bash


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

echo "${RED}******************************************************************************"
echo "${WHITE}**                                                                          **"
echo "${WHITECHAR}**          POWERED BY LANKA SOFTWARE FOUNDATION  (LSF)                     **"
echo "${WHITE}**                                                                          **"
echo "${RED}******************************************************************************"

#   Add follwing tag after command for ignoring stdout, errors etc
#   > /dev/null throw away stdout
#   1> /dev/null throw away stdout
#   2> /dev/null throw away stderr
#   &> /dev/null throw away both stdout and stderr


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

echoGreenBold 'Deploying ELK Agent ...'

read -r -p "ELK stack going to be installed. Are you ready? [y/N] " response
case "$response" in
    [yY][eE][sS]|[yY])

cd ..


# Creating the k8s namespace
#kubectl delete namespace copper 2> /dev/null || true
#echoGreenBold 'Copper namespace deleted...'

############## START OF DELETION #############################
# Deleting



Kubectl delete serviceaccount elasticsearch -n copper 2> /dev/null || true
kubectl delete clusterrole.rbac.authorization.k8s.io elasticsearch -n copper 2> /dev/null || true
kubectl delete clusterrolebinding.rbac.authorization.k8s.io elasticsearch -n copper 2> /dev/null || true
Kubectl delete service elasticsearch -n copper 2> /dev/null || true
kubectl delete StatefulSet elasticsearch -n copper 2> /dev/null || true

echoGreenBold 'ELK Agent elasticsearch deleted...'


# Deleting the service logstash
kubectl delete service logstash -n copper 2> /dev/null || true
kubectl delete deployment logstash -n copper 2> /dev/null || true
kubectl delete configmap logstash-configmap -n copper 2> /dev/null || true
echoGreenBold 'ELK Agent logstash deleted...'

# Deleting the filebeat
kubectl delete configmap filebeat-config created -n copper 2> /dev/null || true
kubectl delete configmap filebeat-prospectors created -n copper 2> /dev/null || true
kubectl delete daemonset filebeat created -n copper 2> /dev/null || true
kubectl delete clusterrolebinding.rbac.authorization.k8s.io filebeat created -n copper 2> /dev/null || true
kubectl delete clusterrole.rbac.authorization.k8s.io filebeat created -n copper 2> /dev/null || true
kubectl delete serviceaccount filebeat created -n copper 2> /dev/null || true
echoGreenBold 'ELK Agent file beat deleted...'

# Deleting the metricbeat
kubectl delete configmap metricbeat-config created -n copper 2> /dev/null || true
kubectl delete configmap metricbeat-daemonset-modules created -n copper 2> /dev/null || true
kubectl delete daemonset metricbeat created -n copper 2> /dev/null || true
kubectl delete configmap metricbeat-deployment-modules created -n copper 2> /dev/null || true
kubectl delete deployment metricbeat created -n copper 2> /dev/null || true
kubectl delete clusterrolebinding.rbac.authorization.k8s.io metricbeat created -n copper 2> /dev/null || true
kubectl delete clusterrole.rbac.authorization.k8s.io metricbeat created -n copper 2> /dev/null || true
kubectl delete serviceaccount metricbeat created -n copper 2> /dev/null || true
echoGreenBold 'ELK Agent file metricbeat deleted...'

# Deleting kibana interface
kubectl delete deployment kibana-logging -n copper 2> /dev/null || true
kubectl delete service kibana-logging -n copper 2> /dev/null || true
kubectl delete ingress logs-ingress -n copper 2> /dev/null || true
echoGreenBold 'ELK Agent kibana interface deleted...'


# Creating the web server
#kubectl create -f Apps/ldap-pw/ldap-pw.yaml 2> /dev/null || true
#echoGreenBold 'ldap-pw created...'

#use for service starting in all email pods
# https://stackoverflow.com/questions/51026174/running-a-command-on-all-kubernetes-pods-of-a-service

echoGreenBold ' ########################################## ELK Installation completed #######################################'
echo ""
echoGreenBold ' ELK Installation completed '
echo ""
echoGreenBold ' Contact copper@opensource.lk for further assistance. ############################################'
#sleep 5s

#kubectl run -it --rm --image=mysql:5.6 --restart=Never mysql-client -n copper -- mysql -h mysql -pc0pperDB


     ;;
    *)
        echoRedBold "ELK Deployment cancelled"
        ;;
esac
