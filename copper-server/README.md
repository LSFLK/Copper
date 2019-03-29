# email-solution

[![Gitter](https://img.shields.io/badge/chat-on%20gitter-blue.svg)](https://gitter.im/copper-mail)
[![Build Status](https://travis-ci.org/LSFLK/Copper.svg?branch=master)](https://travis-ci.org/LSFLK/Copper)

At the moment, Cu-email is compatible with both docker-compose and k8s. Please refer this documnet for docker-compose setup and refer [kubernetes setup](https://github.com/LSFLK/Copper/tree/master/copper-server/kubernetes) for kubernetes setup.

## Functionalities
- Core
  - [x] ESMTP Server 
    - [POSTFIX](http://www.postfix.org/) : a modular mail transfer agent.
  - [x] IMAP Server and POP Server
    - [DOVECOT](https://www.dovecot.org/) : secure open-source IMAP and POP3 server.
  - [x] WEBmail client
    - [Group-Office](https://www.group-office.com)
  - [x] Spam Filter
    - [RSPAMD](https://rspamd.com/) : Fast, free and open-source spam filtering system. You may find a comparison of spam  filters [here](https://rspamd.com/comparison.html).
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





## Installation

README.md file in the Deployment folder describe the installation process in detailed. It is the most updated one and please reffer it for more details. 

1. Clone this Repository

```
$ git clone https://github.com/LSFLK/Copper.git
```

2. Deploy the copper email solution.
```
$ cd Copper/copper-server/kubernetes/deployment/
$ sh deploy.sh

```
It will ask some questions related to your system and you have to provide following informations.

- Mysql db name
- Mysql db password
- Admin password for ldap service
- Readonly ldap username and passeord
- Domain name 
- Organization
- Rspamd system password.

3. Now kubernetes will take some time to pull and create requied images. Check whether all images are created properly.

```
$ kubectl get pods -n copper

```
Wait untill all pods are up and running

## Test Openldap

Insert previously created users to your openldap server.

https://localhost:4433/

Login DN :cn=admin,dc=<domain_p1>,dc=<domain_p2>,dc=<domain_p3>

Password : <provided admin password for ldap >

Then import the "Copper/copper-server/kubernetes/deployment/ldap.ldif" file.


## Test groupoffice

Open the groupoffice browser.

http://localhost:8004/

1. Accept the agreement and continue
2. Check Test page is ok. If there is a databae isseu it should be checked.
3. Create the admin account
4. After success completion the installation then you can login to system.
5. Go to Email Tab and click on Accounts
6. Add account with following details


### IMAP Configuration

IMAP Host : email

Port      : 143

Username  : test@<domain_p1>.<domain_p2>.<domain_p3>

Password  : coppermail@lsf

Encription: TLS

### SMTP Configuraiton

HOST      : email

Port      : 25

Encription: No encription

But if you want to use LDAP server as you identity management then it should be configured instead of email server details.

### LDAP server configuration

1. Login as admin

2. Then go to Admin menu - > Modules  and add checked on community -> LDAP Authenticator

3. Then go to System setting and Authentication . If it has not LDAP section then refresh the page.

4. Clikc on "+" mark to add ldap connection provide following parameters.

Domains : Domain name configured for ldap server

Hostname : LDAP server host name

Protocol : LDAP protocol

ENCRIPTION : TLS

Checked on Use Authentication

Provide Username and password for ldap readonly user.

Ex : usrname : cn=raa,dc=copper,dc=test,dc=lk

Ex : password : XXXX

Userbase details of LDAP server

username attribute  : uid

peopleDN : Ex : ou=Users,dc=copper,dc=test,dc=lk

groupDN : Ex : ou=groups,dc=copper,dc=test,dc=lk

Check on create email server for users

#### Email server configuration

IMAP Host : email

Port      : 143

Encription: TLS

Ubcheck validate certificate



HOST      : email

Port      : 587

Check on use user credentials.

Encription : TLS

Uncheck validate certificate


Finaly add the user to the Internal group


Now groupoffice configuration is complete. Then you can can log using your email account to group office for your domain.

### Password change for users.

By default test users password is set to "coppermail@lsf" or when system admin set a password for specific users it will be known to administrator. So once a new user log in to the system after admin
provided the credential user has to change the password. There is a seperate interface for this perpose.

https://localhost:4343/service/


Juse provide the usernmae , current password, new password and confirme new password.


Thats it . Usre's account is users now.


        
## References 
- Email solution initiated by Prabod Rathnayaka. url :   
  https://github.com/prabod/email-solution/tree/master/docker

- Email solution with rspamd
  https://github.com/tomav
  
- openLdap solutions
  https://github.com/osixia/docker-openldap#quick-start

- Group office
  https://www.group-office.com/

<!-- Prometheus container pull and run: 
    sudo docker pull prom/prometheus
    docker run -p 9090:9090 prom/prometheus

Grafana pull and run
    docker pull grafana/grafana
    docker run -d --name=grafana -p 3000:3000 grafana/grafana -->
    
#### If you have any questions or doubts about Cu, please reach us via copper@opensource.lk
