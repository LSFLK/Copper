Horde Groupware
==============
Updated Fork of [zauberertz/horde](https://git.ziegler.bz/docker/horde) to work with Ubuntu 16.04 and php7.

### With local Database via Socket-Share
```
docker run --name ts_horde -d \
-v /path/to/horde/storage:/etc/horde \
-v [YOURSOCKET]:/var/run/mysqld/mysqld.sock \
-p [YOURPORT]:80 \
-e HORDE_TEST_DISABLE=true 
-e HTTP_X_FORWARDED_FOR=webmail.domain.tld \
-e HTTP_X_FORWARDED_PROTO=webmail.domain.tld \
-e DB_PASS=[dbpassword] \
boredland/horde-docker
```

```
Set HTTP_X_FORWARDED_FOR to the Romote address of the server
Set HTTP_X_FORWARDED_PROTO for HTTPS
```

Enter `horde-db-migrate` into an interactive shell on first run. Could create a better horde-init.sh if I've some time to spare though..
### DB default values or link a mysql
```
DB default values or link a mysql
ENV DB_HOST localhost
ENV DB_PORT 3306
ENV DB_NAME horde
ENV DB_USER horde
ENV DB_PASS horde
ENV DB_PROTOCOL SOCKET
ENV DB_DRIVER mysqli
ENV HORDE_TEST_DISABLE false
```
You can overwrite them using the `-e [PARAMETER_NAME]=[VALUE]`-Flag

### Disable test.php of horde by setting this to true
```HORDE_TEST_DISABLE true```

Openssl and GNU PGP both under ```/usr/bin/``` 