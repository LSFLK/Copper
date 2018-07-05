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
  - [x] openLDAP
    - openLDAP server and a phpldapadmin will be installed for ldap configuration



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

    - Direct your web browser to http://localhost:88/rspamd/
    - Login using the password mentioned in the .env file
  

3. Web Client RainLoop

    - Direct your web browser to http://localhost:88/webmail/?admin to access the admin portal of the webclient
    - Default user name passwords are :



3. openldap server and phpldapadmin web portal

    Test whether ldap server is installed properly

    docker exec openldap ldapsearch -x -H ldap://localhost -b dc=coppermail,dc=dyndns,dc=org -D "cn=admin,dc=coppermail,dc=dyndns,dc=org" -w admin

    Hear coppermail.dyndns.org is the test domain.


      // phpldapadmin configurations are done automatically by the solution. For knowledge check the bellow point for further troubleshoots
      Then:



      // --------------------------------------------------------------------------------------------------------------------------------

          User creation by ldif script files.
            First change the directory to 
            cd /etc/openldap/ldif
            you will see lot of ldif scripts hear and you can add users to the system using those scripts.

             # add a user
            #ldapadd -x -D cn=admin,dc=coppermail,dc=dyndns,dc=org -W -f add_content.ldif
            

            Ex :      root@ldap:/# cd /etc/openldap/ldif
                      root@ldap:/etc/openldap/ldif# ls
                      add_content.ldif  certs.ldif          logging.ldif  schema_convert.conf
                      certinfo.ldif     consumer_sync.ldif  postfix.ldif
                      root@ldap:/etc/openldap/ldif# ldapadd -x -D cn=admin,dc=coppermail,dc=dyndns,dc=org -W -f add_content.ldif
                      Enter LDAP Password: 
                      adding new entry "ou=People,dc=coppermail,dc=dyndns,dc=org"

                      adding new entry "ou=Groups,dc=coppermail,dc=dyndns,dc=org"

                      adding new entry "cn=miners,ou=Groups,dc=coppermail,dc=dyndns,dc=org"

                      adding new entry "uid=john,ou=People,dc=coppermail,dc=dyndns,dc=org"

                      root@ldap:/etc/openldap/ldif# 

                      // you can activate starttls or ssl/tls. But ssl/tls will be deprecated soon so dont use it
                      # enabling starttls
                        ldapmodify -H ldapi:// -Y EXTERNAL -f addcerts.ldif
                        
                      # enableing ssl/tsl  this dont want to activate if above one is completed
                      #ldapmodify -Y EXTERNAL -H ldapi:/// -f certinfo.ldif

                      # enabl loging
                      #ldapmodify -Q -Y EXTERNAL -H ldapi:/// -f logging.ldif








      // --------------------------------------------------------------------------------------------------------------------------------
    - Direct your web browser to http://localhost:88/ldap to access the admin portal of the phpldapadmin
      It's username and password what we provided in above steps

      Then time to create a organizational unit, group and then add create users under another organizational unit.
      Reffrance : https://www.youtube.com/watch?v=DM_UQVVVtoY

      According to above youtube video illustrate export the user profile :  it will be like bellow :

      # Entry 1: cn=thara thara,ou=users,dc=coppermail,dc=dyndns,dc=org
                      dn: cn=thara thara,ou=users,dc=coppermail,dc=dyndns,dc=org
                      cn: thara thara
                      facsimiletelephonenumber: 121212121
                      givenname: thara
                      l: colombo
                      mail: thara@coppermail.dyndns.org
                      mobile: 0714890075
                      o: lsf
                      objectclass: inetOrgPerson
                      objectclass: top
                      ou: hr
                      postalcode: 121
                      roomnumber: 12
                      sn: thara
                      st: 1
                      street: thara@coppermail.dyndns.org
                      telephonenumber: test
                      title: test
                      userpassword: {MD5}4DEDBWcJUvLZN8QaegRDug==


      Then check above user by quering the ldap server by command line from the ldap container

          docker exec -it ldap /bin/bash

      root@7a3326f0e69d:/# ldapsearch -H ldap:// -x -D "cn=thara thara,ou=users,dc=coppermail,dc=dyndns,dc=org" -w postfix@123 -b "cn=thara thara,ou=users,dc=coppermail,dc=dyndns,dc=org"
                      # extended LDIF
                      #
                      # LDAPv3
                      # base <cn=thara thara,ou=users,dc=coppermail,dc=dyndns,dc=org> with scope subtree
                      # filter: (objectclass=*)
                      # requesting: ALL
                      #

                      # thara thara, users, coppermail.dyndns.org
                      dn: cn=thara thara,ou=users,dc=coppermail,dc=dyndns,dc=org
                      street: thara@coppermail.dyndns.org
                      l: colombo
                      cn: thara thara
                      mail: thara@coppermail.dyndns.org
                      facsimileTelephoneNumber: 121212121
                      givenName: thara
                      sn: thara
                      mobile: 0714890075
                      objectClass: inetOrgPerson
                      objectClass: top
                      o: lsf
                      ou: hr
                      userPassword:: e01ENX00REVEQldjSlV2TFpOOFFhZWdSRHVnPT0=
                      postalCode: 121
                      roomNumber: 12
                      st: 1
                      title: test
                      telephoneNumber: test

                      # search result
                      search: 2
                      result: 0 Success

                      # numResponses: 2
                      # numEntries: 1
                      root@7a3326f0e69d:/# 