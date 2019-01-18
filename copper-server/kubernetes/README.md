# Copper email-solution with kubernetes

[![Gitter](https://img.shields.io/badge/chat-on%20gitter-blue.svg)](https://gitter.im/copper-mail)
[![Build Status](https://travis-ci.org/LSFLK/Copper.svg?branch=master)](https://travis-ci.org/LSFLK/Copper)

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

## Clone this Repository and then change to the kubernetes folder. Bellow mentioned commands should be run from kubernetes folder.

```
$ git clone 
https://github.com/LSFLK/Copper.git

cd copper/copper-server/kubernetes
```

## Edit .env file to replicate your settings in file path
      copper/copper-server/kubernetes/emailserver/configs/ 

## Create the ldap server with following command
```
  // Creating ldap server
  kubectl create -f openldap/openldap.yaml

  // view kubernetes openldap pods
  kubectl get pods --namespace=monitoring

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
  Apt-get update

  apt-get install ldap-utils
```

## Phpldapadmin setup

```
$ docker network create front
```
## Running

Run the system and start all services by :

```
$ docker-compose build
```
```
$ docker-compose up -d 
```




    - Direct your web browser to https://copper.opensource.lk/ldap to access the admin portal of the phpldapadmin
      It's username and password what we provided in above steps

      
                      
## References 
- Email solution initiated by Prabod Rathnayaka. url :   
  https://github.com/prabod/email-solution/tree/master/docker

- Email solution with rspamd
  https://github.com/tomav
  
- openLdap solutions
  https://github.com/osixia/docker-openldap#quick-start

<!-- Prometheus container pull and run: 
    sudo docker pull prom/prometheus
    docker run -p 9090:9090 prom/prometheus

Grafana pull and run
    docker pull grafana/grafana
    docker run -d --name=grafana -p 3000:3000 grafana/grafana -->
