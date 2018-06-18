# email-solution

Initial version of copper email solution
Copper mail base is ivolving on the Email solution initiated by Prabod Rathnayaka.
His project can be found in bellow url :
https://github.com/prabod/email-solution/tree/master/docker

## Functionalities
- Core
  - [x] ESMTP Server 
    - [POSTFIX](http://www.postfix.org/) : a modular mail transfer agent.
  - [x] IMAP Server and POP Server
    - [DOVECOT](https://www.dovecot.org/) : secure open-source IMAP and POP3 server.
  - [x] Mail Server Administration and Mailing List Capability 
    - [POSTFIXADMIN](http://postfixadmin.sourceforge.net/)Supported by Postfix alias. Can be managed through  web interface
  - [x] WEBmail client
    - [RAINLOOP](https://www.rainloop.net/) : web client to access mail for users.


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

| POP3 | Dovecot | TCP | 110 |
| IMAP | Dovecot | TCP | 143 |

| SMTPS | Postfix | TCP | 465 |
| Submission | Postfix | TCP | 587 |
| IMAPS | Dovecot | TCP | 993 |
| POP3S | Dovecot | TCP | 995 |





## Installation

1. Clone this Repository

```
$ git clone https://github.com/tharangar/copper-base.git
```

2. Edit .env file to replicate your settings

3. Create external Docker Network

```
$ docker network create front
```
## Running

Run the system and start all services by :

```
$ docker-compose up -d 
```

## Domain and User Creation : sample domain :lsf.cu.lk sample users: info@lsf.cu.lk, support@lsf.cu.lk, admin@lsf.cu.lk  

Run the system and start all services by :

```
// get the all running containers and use following command for sample user creations by command line for testing perposes
docker ps 
// 5d02241a1739 is the sample docker container id for database named mariadb
docker exec -it 5d02241a1739 chmod +r /var/lib/init-user-db.sh
docker exec -it 5d02241a1739 chmod +x /var/lib/init-user-db.sh
docker exec -it 5d02241a1739 chmod +r /var/lib/init-user-db.sql
docker exec -it 5d02241a1739 sh /var/lib/init-user-db.sh
```

## Access Services

1. PostfixAdmin to manage Domains and Mailboxes

    - Direct your web browser to localhost:8080/setup.php
    - Enter a Setup Password with 2 digits (Ex postfix@123)
    - Append the generated hash to the config file after bellow command
    - $ docker exec -it postfixadmin /bin/setup_password.sh
     (Ex: docker exec -it postfixadmin /bin/setup_password.sh   then when prompt b2205ff4380926b3dce72bed4360c5b9:187ce5f3d3fa085b57f867949380354305c24484  
      Success message should come as "setup done")
    - Add Admin account
     (Ex : admin@lsf.cu.tld  and password with 2 digits OR root@lsf.cu.tld , root@123);
    - Add Domains and Mailboxes

     Add a domain
        nextgenmed.dyndns.org

     Add 2 mail box for testing
        admin@nextgenmed.dyndns.org
        tharanga@nextgenmed.dyndns.org  
  

    - Test the mailserver by telent by sending a mail between above 2 users
    $ telnet localhost 25
          - Trying 127.0.0.1...

          - Connected to localhost.

          -Escape character is '^]'.
          
          220 mail.nextgenmed.dyndns.org ESMTP Postfix (Ubuntu)
          MAIL FROM:admin@nextgenmed.dyndns.org
          250 2.1.0 Ok
          RCPT TO:tharanga@nextgenmed.dyndns.org
          250 2.1.5 Ok
          data
          354 End data with <CR><LF>.<CR><LF>
          subject :hello
          body : good bye
          .
          250 2.0.0 Ok: queued as C129F38258F 
  
2. Access Rspamd WebUI

    - Direct your web browser to http://localhost:11334/
    - Login using the password mentioned in the .env file
  

3. Web Client RainLoop

    - Direct your web browser to http://localhost:8989/?admin to access the admin portal of the webclient
    - Default user name passwords are :