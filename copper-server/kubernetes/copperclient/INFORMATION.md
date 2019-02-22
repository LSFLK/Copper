
## Creating frontend https server with ingress

  '''kubectl create -f frontend.yaml'''

### TLS secreet creation ######
'''kubectl create secret generic tls-certs --from-file=tls/''''


// kubernetes with postfix
https://www.tauceti.blog/post/run-postfix-in-kubernetes/

# Apache web server with https with docker and kubernetes
https://manual.seafile.com/deploy/https_with_apache.html
https://www.digicert.com/csr-ssl-installation/apache-openssl.htm
https://www.tecmint.com/install-rainloop-webmail-in-arch-linux/

// building new docker for 
docker build -t homail .
docker build -t webmail .

// run the homail image as homail container
docker run --name homail -d homail

//login to server for further modifications.
docker exec -it homail /bin/bash

## Port congiguration
// if you want to change to port use
nano /etc/apache2/ports.conf
By default, Apache web server is instructed to listen for incoming connection and bind on port 80. If you opt for the TLS configuration, the server will listen for secure connections on port 443.

In order to instruct Apache web server to bind and listen for web traffic on other ports than the standard web ports, you need to add a new statement containing the newly port for future bindings.

'''
 nano /etc/apache2/ports.conf     [On Debian/Ubuntu]
 nano /etc/httpd/conf/httpd.conf  [On RHEL/CentOS]
'''
 
 add 89 for listning port

 After you’ve added the above line, you need to create or alter an Apache virtual host in Debian/Ubuntu based distribution in order to start the binding process, specific to your own vhost requirements.

In CentOS/RHEL distributions, the change is applied directly into default virtual host. In the below sample, we’ll modify the default virtual host of the web server and instruct Apache to listen for web traffic from 80 port to 8081 port.

'''nano /etc/apache2/sites-enabled/000-default.conf '''

*** After correct configuration in ports.conf and vertual hosts you may access these sites from curl command

// get ports.conf
docker cp homail:/etc/apache2/ports.conf ~/Documents/copper/copper/copper-server/core/rainloop/config



// coppy files from docer container to machine. (like host file)
docker cp homail:/etc/hosts ~/Documents/copper/copper/copper-server/core/rainloop



// docker file you should have expose the port


// And when you run the container use bellow command you have to bind docker EXPOSED port to host port ( EXPOSE 89).

Ex :

'''docker run -p 89:89 --name homail -d homail'''


## Now converting the site to https


// open the 443 port in docker file
'''EXPOSE 443'''

// Create the vertual host file


// run the docker image opening the https port 443
'''docker run -p 80:80 -p 89:89 -p 443:443 -p 433:433 --name homail -d homail'''

// then login to the homail container and test the apache congiguration
'''apachectl configtest
AH00558: apache2: Could not reliably determine the server's fully qualified domain name, using 172.17.0.2. Set the 'ServerName' directive globally to suppress this message
Syntax OK
'''

This is a warning message to remove this warning following line added.

/etc/apache2# nano apache2.conf

''' ServerName copper.opensource.lk '''

Then the error was removed.
'''# apachectl configtest
Syntax OK
'''


On many systems (Ubuntu, Suse, Debian, ...) run the following command to enable Apache's SSL mod:

'''sudo a2enmod ssl
// but in docker container
   a2enmod ssl '''



On CentOS 7 installing the package "mod_ssl" and restarting the apache server worked for me:

'''yum install mod_ssl
systemctl restart httpd'''

// command to add entry to the host file in ubunut
'''echo "127.0.0.1  copper.opensource.lk copper" >> /etc/hosts'''


# ERRORS

1. An error occurred during a connection to localhost. SSL received a record that exceeded the maximum permissible length. Error code: SSL_ERROR_RX_RECORD_TOO_LONG 

** if browser gives above error it means browser is expecting https encrypted data but web server send unencripted data. you may check it by typing the url without https.

Ex : http://localhost:443

The web server is sending non-secure (HTTP) data where secure (HTTPS) data is expected by Firefox. This can be confirmed by going to http://server-name:443 instead of https://server-name.
Solution

Check the configuration of the server to ensure that SSL has been configured correctly. This most commonly occurs when using Apache or Tomcat as the web server, though it can certainly occur in other server types. Points to consider when troubleshooting this error in either Apache or Tomcat:

In Apache, check that the Listen <port> directive matches the port number in the VirtualHost directive for the website being secured, and that the SSL configuration statements (SSLEngine On, SSLCertificateFile <filename> and so on) appear in the VirtualHost directive for the website or in the SSL configuration file for the server.

'''SSLEngine on
  SSLCertificateFile /etc/ssl/certs/cert.pem
  SSLCertificateKeyFile /etc/ssl/private/privkey.pem'''

In Tomcat, check that the connector in server.xml is configured to use SSL (there should be scheme="https" secure="true", as well as keystoreFile and keystorePass statements) and that the port number listed in the connector is what is expected -- if using the default port (8443), it needs to be specified as part of the URL or be appropriately redirected on the server. Tomcat may also be switching to non-secure mode for a connector where the keystore is corrupt; try creating a new keystore and replacing the SSL certificate.




  