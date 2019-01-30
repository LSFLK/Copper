# Copper email-solution with kubernetes

[![Gitter](https://img.shields.io/badge/chat-on%20gitter-blue.svg)](https://gitter.im/copper-mail)
[![Build Status](https://travis-ci.org/LSFLK/Copper.svg?branch=master)](https://travis-ci.org/LSFLK/Copper)

#### This "README" contains every single commands which needs to deploy Copper-mail with kubernetes. Please refer "README" file which is inside the "deployment" directory for quick deployment.

## Functionalities
- Core
  - [x] ESMTP Server 
    - [POSTFIX](http://www.postfix.org/) : a modular mail transfer agent.
  - [x] IMAP Server and POP Server
    - [DOVECOT](https://www.dovecot.org/) : secure open-source IMAP and POP3 server.
  - [x] WEBmail client
    - [RAINLOOP](https://www.rainloop.net/) : Webmail client with basic features.
  - [x] Spam Filter
    - [RSPAMD](https://rspamd.com/) : Fast, free and open-source spam filtering system. You may find a comparison of spam filters [here](https://rspamd.com/comparison.html).
  - [x] Antivirus 
    - [ClamAV](https://www.clamav.net/) : is an open source antivirus engine for detecting trojans, viruses, malware & other malicious threats.
  - [x] Security enhancement
    - [DKIM](http://www.dkim.org/) : DomainKeys Identified Mail (DKIM) lets an organization take responsibility for a message that is in transit.


## How to Setup

### Before We Start

Make sure any other application does not use ports that we are going to listen to

```
$ netstat -tulpn | grep -E -w '25|80|110|143|443|465|587|993|995|4190|11334'

//check each port

$ sudo lsof -i :25
```

### Firewall

Unblock following ports

| Service | Software | Protocol | Port |
| ------- | -------- | -------- | ---- |
| SMTP | Postfix | TCP | 25 |
| IMAP | Dovecot | TCP | 143 |
| SMTPS | Postfix | TCP | 465 |
| Submission | Postfix | TCP | 587 |
| IMAPS | Dovecot | TCP | 993 |



# Installation

## Clone this Repository and then move to kubernetes folder. Bellow mentioned commands should be run from kubernetes folder.

```
$ git clone 
https://github.com/LSFLK/Copper.git

cd copper/copper-server/kubernetes
```

## Edit .env file to replicate your settings in file path
      copper/copper-server/kubernetes/emailserver/configs/ 

## Copy your certification and key files to the folder

  /kubernetes/tls
    - cert.pem
    - fullchain.pem
    - privkey.key
    - dhparam.pem


## Creating the namespace for the project
```
  kubectl create namespace monitoring
```

## Create the ldap server with following command
```
  // Creating ldap server
  kubectl create -f openldap/openldap.yaml

  // view kubernetes openldap pods
  kubectl get pods --namespace=monitoring

  // view service details of openldap 
  kubectl get services --namespace=monitoring

  // loging to the openldap pod
  kubectl exec <pod-name-taken> --namespace=monitoring --stdin --tty -c ldap /bin/sh

  // delete the ldap
  kubectl delete service ldap-service --namespace=monitoring
  kubectl delete deployment ldap --namespace=monitoring

  // Test the server
  ldapwhoami -H ldap:// -x   // without TLS 
  ldapwhoami -H ldap:// -x -ZZ  // with enforced TLS
  ldapwhoami -H ldap:// -x -Z   // without enforced TLS

  ldapsearch -x -H ldap://localhost -b dc=example,dc=org -D "cn=admin,dc=example,dc=org" -w admin
  ldapsearch -x -H ldap://localhost -b dc=copper,dc=opensource,dc=lk -D "cn=admin,dc=copper,dc=opensource,dc=lk" -w admin
  ldapsearch -H ldap://localhost -b dc=copper,dc=opensource,dc=lk -D "cn=admin,dc=copper,dc=opensource,dc=lk" -w admin
  ldapsearch -x -H ldap://10.110.47.212 -b dc=example,dc=org -D "cn=admin,dc=example,dc=org" -w admin

  ldapsearch -x -h server-IP -D “cn=admin,dc=copper,dc=opensource,dc=lk" -w admin  -b “dc=copper,dc=opensource,dc=lk" 'uid=*' -ZZ
```
  ### when there is no ldap-utils you have to install it.
```
  apt-get update

  apt-get install ldap-utils
```

## Phpldapadmin setup

Phpldapadmin service is created to control openldap service. We have provided import_uid.ldif file to import after the phpldapadmin service creation.
```
  // Create the phpldapadmin service  
  kubectl create -f phpldapadmin/phpldapadmin.yaml 

  // Then if you want to delete services created by above command
  kubectl delete service phpldapadmin-service --namespace=monitoring
  kubectl delete replicationcontrollers phpldapadmin-controller --namespace=monitoring

  // Login to phpldapadmin server 
  kubectl exec <pod_name> --namespace=monitoring --stdin --tty -c phpldapadmin /bin/sh
```
Now you can test openldap and phpldapadmin services by login to it.
[https://localhost:4433]

User name : cn=admin,dc=copper,dc=opensource,dc=lk
Pass Word : admin

If login was success your setup is right and then you have to import_uid.ldif file to feed user base other data which is required for email server.

## Email server setup

Our emailserver is the most complex part of this system. First we have to build docker image with our predefined details. You have to update .env file in the following path.
 copper/copper-server/kubernetes/emailserver/configs/
```
  cd emailserver
  docker build -t emailserver .
  // Email image should be built successfully. If you find any error building the image first 
  // try deleting all docker images previously created.
  // Once you done email creation then go back to kubernetes folder
  cd ..

  // Create the emailserver service from kubernetes using docker image we have created now.
  kubectl create -f emailserver/email.yaml

  // check all pods created under monitoring namespace
  kubectl get pods --namespace=monitoring

  You can get pod name from above command.

```
### Once you created the emailserver it's services has to be run manualy 
```
  // login in to emailserver. You have to change pod name email-6f46b7cfbb-l9d8w.
  kubectl exec email-6f46b7cfbb-l9d8w --namespace=monitoring --stdin --tty -c email /bin/sh
  
  // starting main services from inside the pod
  service postfix start
  service dovecot start
  service rspamd start

  // If you want to delete emai service use following commands.
  kubectl delete service email --namespace=monitoring
  kubectl delete deployment email --namespace=monitoring

```

You may Access the RSPAMD spam filter from bellow url.
[http://localhost:11334/]

password : postfix@123

## webmail client service implementation
In copper Email solution we are using rainloop web client.So we have to implement a rainloop client also. We have a image for a rainloop web client also. So we have to build docker image first.
```
  // Building docker image
  cd copperclient
  // Build the docker image
  docker build -t webmail .

  // Buld the kubernetes pod
  Kubectl create -f copperclient/webmail.yaml

  //

```
Once you deploy the webmail client then you have to configure it for accessing the emailserver.

First go to admin page.

[ http://localhost/?admin]

Then go to domain tab and configure your domain detail and test it before update.

In our test senario following details should be used.

domain : copper.opensource.lk
server : email
secure : STARTTLS
ports  : automatically set when secure is selected

Then you can test both IMAP and SMTP connections and if both are ok your connectivity is ok.
Update the configuration and then you can use your webmail client.

### Testing email server with webmail client

Go to login page and log from one of test email account.

[ http://localhost]

User Name : test
Pass Word : coppermail@lsf


## Alert Manager Deployment

Alerting is very importatn function in any live system. In this copper email solution alerts facility is available with the support of Kubernetes API and Prometheus.

"Prometheus is an open-source systems monitoring and alerting toolkit originally built at SoundCloud. Since its inception in 2012, many companies and organizations have adopted Prometheus, and the project has a very active developer and user community. It is now a standalone open source project and maintained independently of any company. To emphasize this, and to clarify the project's governance structure, Prometheus joined the Cloud Native Computing Foundation in 2016 as the second hosted project, after Kubernetes."

```
  // Creating a roll has the access for clusters and bind the cluster roll.
  kubectl create -f prometheus-alert/clusterRole.yaml
  // Create the config map to keep configuration data of prometheus
  kubectl create -f prometheus-alert/config-map.yaml -n monitoring
  // Deploy prometheus pods 
  kubectl create  -f prometheus-alert/prometheus-deployment.yaml --namespace=monitoring
  // Create the service to access prometheus 
  kubectl create -f prometheus-alert/prometheus-service.yaml --namespace=monitoring

```

Now you may access the prometheus web interface which use kubernetes API support as a UI.
Access it by the following url
[http://localhost:30000]

After successfull implementation of the prometheus then Alert manager implementaion can be started.

```
  // Creating the configuration 
  kubectl create -f prometheus-alert/AlertManagerConfigmap.yaml
  //
  kubectl create -f prometheus-alert/AlertTemplateConfigMap.yaml
  //
  kubectl create -f prometheus-alert/Deployment.yaml
  //
  kubectl create -f prometheus-alert/Service.yaml

```

Now you should be able to access Alert Manager through web interface.
[http://localhost:31000]
Further if you want further controll and deleting pods and alert manager systems you may use follwoing commands.

```
// Monitoring services and configmap etc
kubectl get services --namespace=monitoring
kubectl get configmap --namespace=monitoring


// deleting services
kubectl delete services alertmanager --namespace=monitoring
kubectl delete services prometheus-service --namespace=monitoring
//deleting configmaps
kubectl delete configmap alertmanager-config --namespace=monitoring
kubectl delete configmap alertmanager-templates --namespace=monitoring
kubectl delete configmap prometheus-server-conf --namespace=monitoring
// deleting cluster roll
kubectl delete clusterroles prometheus
kubectl delete clusterrolebindings prometheus
//deleting deployments
kubectl delete deployment alertmanager --namespace=monitoring
kubectl delete deployment prometheus-deployment --namespace=monitoring

```

#### If you have any questions or doubts about Cu, please reach us via copper@opensource.lk
