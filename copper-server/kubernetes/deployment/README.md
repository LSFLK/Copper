
#   Deplyment
 Deployment Files are located in the Deployment folder
 You can use deploy shell script to start server easily

## Prerequisite
    - Docker 
    - Kubernetes
    - Internet connectivity

## Start the deployment
    '''
        cd Deployment
        sh deploy.sh
    '''

## Service start

 After successfull completion of deployment you have to start some services related to emailserver.

    '''
    // view all pods and copy the pod name for emailserver
    kubectl get pods --namespace=monitoring
    // login in to emailserver. You have to change pod name email-6f46b7cfbb-l9d8w.
    kubectl exec <email-server pod name> --namespace=monitoring --stdin --tty -c email /bin/sh
  
    // starting main services from inside the pod
    service postfix start
    service dovecot start
    service rspamd start

    '''

### Testing the server

 Testing phpldapadmin user management

    URL :http://localhost:8080

    username : cn=admin,dc=copper,dc=opensource,dc=lk
    password : admin

    - Above details are may be different in your deployment configuration.( .env).

    - Once successully loged in then you have to import some test users creation file  (import_uid.ldif).


### Testing web mail client


     URL :http://localhost/?admin

     Login with credential username : admin , password : admin

     - impa and email server : email
     - security : STARTTLS

     Then login to the web client and test your email service

     URL :http://localhost

     -Username : test
     -Password : coppermail@lsf

### Testing RSPAMD

    RSPAMD is the spam filtering service in this email solution.

    URL :http://localhost:11334/

    - Password : postfix@123