
#   Deplyment
 Deployment Files are located in the Deployment folder
 You can use deploy shell script to start server easily

## Prerequisite
    - Docker 
    - Kubernetes
    - Internet connectivity



## Start the deployment
    '''
        cd deployment
        sh deploy.sh
        
    '''

## You may have to provide following informaiton while the installation process is going on.


Enter mysql database name:

Ex : copper

Enter mysql database password:

Ex : copper

Your domain must contain 3 parts. (Eg: part1.part2.part3)
Enter the first part of domain:

Ex : copper

Enter the second part of domain:

Ex : test

Enter the third part of domain:

Ex : lk

Enter LDAP admin password:

Ex : admin

Enter LDAP readonly user name:

Ex : raa

Enter LDAP readonly user password:

Ex : raa

Enter organization name

Ex : lsf

Enter password for spam filter (RspamD)

Ex : spam

## Testing the server

### Testing phpldapadmin user management

    URL :https://localhost:4433
    // Hear the read only usr name and pasword should be provided for cn.
    Ex : username : cn=readonly,dc=copper,dc=opensource,dc=lk
    password : readonlypassword

   

    - Once successully loged in then you have to import some test users creation file  (ldap.ldif).



### Testing groupoffice 


     URL :http://localhost:8004

     You will see the installation page of the groupoffice package.
     First create the admin user and start installation.

     Then login from the admin user name and start the configuration.

     You have to configure accounts, Email accounts and ldap configuations according to your interest.

### Testing RSPAMD

    RSPAMD is the spam filtering service in this email solution.

    URL :http://localhost:11334/

    - Password : <password provided at installation step>
    
### Connectiong Group Offcie with LDAP server user base.
 

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

    
### Please do not forget to reset default passwords after configuring email server
