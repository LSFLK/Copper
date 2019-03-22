
#   Deplyment
 Deployment Files are located in the Deployment folder
 You can use deploy shell script to start server easily

## Prerequisite
    - Docker 
    - Kubernetes
    - Internet connectivity

## Copy your certification and key files to the folder "/kubernetes/tls" replacing follwing sample files.

  /kubernetes/tls
    - cert.pem
    - fullchain.pem
    - privkey.key
    - dhparam.pem

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
 [Group Office LDAP configuration.]
 
    
### Please do not forget to reset default passwords after configuring email server
