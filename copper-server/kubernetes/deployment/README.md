
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

## Service start

 After successfull completion of deployment you have to start some services related to emailserver.

    '''
    // view all pods and copy the pod name for emailserver
    kubectl get pods --namespace=Copper
    // login to emailserver. You have to raplace pod_name with email pod.
    kubectl exec <pod_name> --namespace=Copper --stdin --tty -c email /bin/sh
  
    // starting main services from inside the pod
    service postfix start
    service dovecot start
    service rspamd start

    '''

## Testing the server

### Testing phpldapadmin user management

    URL :https://localhost:4433

    username : cn=admin,dc=copper,dc=opensource,dc=lk
    password : admin

    - Above details are different in your deployment configuration.( .env).

    - Once successully loged in then you have to import some test users creation file  (user_import.ldif).


### Database creation 

    Now a groupoffice database should be created preor to start groupoffice installation begins.

    first you have to check what is the pod name of dataase.

    #kubectl get pods -n  Copper

    Then exicute followng command to open a mysql client connected with the mysql pod.

    #kubectl run -it --rm --image=mysql:5.6 --restart=Never mysql-client -n Copper -- mysql -h mysql -pc0pperDB

    Then you will get access to the mysql database.
    Once you connected create a database.

    CREATE DATABASE groupoffice;

### Testing groupoffice 


     URL :http://localhost:8004

     You will see the installation page of the groupoffice package.
     First create the admin user and start installation.

     Then login from the admin user name and start the configuration.

     You have to configure accounts, Email accounts and ldap configuations according to your interest.

### Testing RSPAMD

    RSPAMD is the spam filtering service in this email solution.

    URL :http://localhost:11334/

    - Password : postfix@123
    
### Please do not forget to reset default passwords after configuring email server
