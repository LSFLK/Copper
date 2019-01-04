# Identity
Identity management system for copper-mail.

## Prerequisite

### Minimum System requirement

Official documentation for WSO2 Identity Server 5.7 [link](https://docs.wso2.com/display/IS570/Installation+Prerequisites)

1. Minimum memory - 4 GB
2. Swap partition - exact size of the RAM (Production server)
3. Processor - 2 Core/vCPU 1.1GHz or higher
4. Java SE Development Kit 1.8
5. Docker - 18v or higher
6. Docker compose - 1.22v or higher 
7. The Management Console requires full Javascript enablement of the Web browser.


## Installation

### Update configs

#### on dev

add 'localhost.com' mapping to '127.0.0.1' at host file

following is for Unix environments:

edit host file with root permission
```
sudo nano /etc/hosts
```
add the following 
```
127.0.0.1   localhost.com
```

#### on production

replace 'localhost.com' with your ipaddress or domain name in 'is/config/'

carbon.xml >>>
```
<HostName>localhost.com</HostName>
<MgtHostName>localhost.com</MgtHostName>
```

### Create keystores

```
cd <project-folder>/is/files 
keytool -genkey -alias wso2carbon -keyalg RSA -keystore wso2carbon.jks -keysize 2048
```
first and last name? -> ipaddress or domain name  
organizational unit -> Users  
password -> wso2carbon 


```
keytool -export -alias wso2carbon -keystore wso2carbon.jks -file publickey.pem
keytool -import -alias wso2 -file publickey.pem -keystore client-truststore.jks -storepass wso2carbon
```


## Running

To build and up the server
```
# sh start.sh
```

To stop and remove all containers and along with built images
```
# sh reset.sh
```

Give it a minute or 2, for WSO2 Identity Server to start up.

Run `docker logs copper-is` to find server url in the end of the logs to be recognized as the server started successfully.

NB: At times when Identity Server have not started properly on production server, do the following:
```
cd <project-folder>
docker-compose stop
docker-compose up -d
```


## Testing

On production environment replace 'localhost.com' with server ip or domain name. You may always use the server started URL on IS docker logs using `docker logs copper-is` which is found right after the server has started.

1) Visit https://localhost.com:9443/carbon and create a user and add all permission.
2) Goto https://localhost.com:9443/dashboard and try login in successfully.