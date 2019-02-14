
## Creating frontend https server with ingress

  '''kubectl create -f frontend.yaml'''

### TLS secreet creation ######
'''kubectl create secret generic tls-certs --from-file=tls/''''


// kubernetes with postfix
https://www.tauceti.blog/post/run-postfix-in-kubernetes/

# Apache web server with https with docker and kubernetes
https://manual.seafile.com/deploy/https_with_apache.html


// building new docker for 
docker build -t homail .

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

