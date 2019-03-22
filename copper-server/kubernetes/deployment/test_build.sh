#!/bin/bash


# Creating the k8s namespace
kubectl create namespace copper 2> /dev/null || true

# Creating ldap server
kubectl create -f openldap/openldap.yaml 2> /dev/null || true

# Create the phpldapadmin service  
kubectl create -f phpldapadmin/phpldapadmin.yaml 2> /dev/null || true


# Create the emailserver service from kubernetes using docker image we have created now.
kubectl create -f emailserver/email.yaml 2> /dev/null || true

#Building docker image

# Create the persistent volume and persistent volume claim for database
kubectl create -f persistent/mysql-pv.yaml  2> /dev/null || true

# Create mysql deployment
kubectl create -f persistent/mysql-deployment.yaml  2> /dev/null || true


#Prometheus implementation
# Creating a roll has the access for clusters and bind the cluster roll.
kubectl create -f prometheus-alert/clusterRole.yaml 2> /dev/null || true


# Create the config map to keep configuration data of prometheus
kubectl create -f prometheus-alert/config-map.yaml -n copper 2> /dev/null || true


# Deploy prometheus pods 
kubectl create  -f prometheus-alert/prometheus-deployment.yaml --namespace=copper 2> /dev/null || true

# Create the service to access prometheus 
kubectl create -f prometheus-alert/prometheus-service.yaml --namespace=copper 2> /dev/null || true

# Alert manager implementation
# Creating the configuration 
kubectl create -f prometheus-alert/AlertManagerConfigmap.yaml 2> /dev/null || true
#
kubectl create -f prometheus-alert/AlertTemplateConfigMap.yaml 2> /dev/null || true

#
kubectl create -f prometheus-alert/Deployment.yaml 2> /dev/null || true
#
kubectl create -f prometheus-alert/Service.yaml 2> /dev/null || true


kubectl create -f groupware/groupoffice/groupoffice.yaml 2> /dev/null || true

