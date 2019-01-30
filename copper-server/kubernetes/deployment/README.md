
#   Deplyment

Please update emailserver/configs/.env file before the deployment.

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
    kubectl get pods --namespace=monitoring
    
    // login to emailserver. You have to raplace pod_name with email pod.
    kubectl exec <pod_name> --namespace=monitoring --stdin --tty -c email /bin/sh
  
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


### Testing web mail client


     URL :http://localhost/?admin

     Login with credential username : admin , password : 12345 and add your own domain here. Below you can see relevant settings which you needs to set and set other neccesary settings as your wish.

     - IMAP and SMTP server : email
     - security : STARTTLS

     Then login to the web client and test your email service

     URL :http://localhost

     -Username : test
     -Password : coppermail@lsf

### Testing RSPAMD

    RSPAMD is the spam filtering service in this email solution.

    URL :http://localhost:11334/

    - Password : postfix@123
    
### Please do not forget to reset default passwords after configuring email server
