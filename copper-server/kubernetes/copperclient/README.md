# Docker - Apache with Let's Encrypt

This is a debian-based image which runs an apache and get's it SSL-certificates automatically from Let's Encrypt.
Further you can use already created key files by coppying them to tls folder.
Even though automatic key configuration failed it will be up with this coppied key files.

## Instructions

### Prepare your apache-config

There are some things you have to care about in your apache-config if you want to use it with certbot:

- for every domain given in `DOMAINS` there must be a apache-vhost which uses this domain as `ServerName` or `ServerAlias`. Else certbot won't get a certificate for this domain.
- this image contains a simple apache webserver. Therefore you can configure your vhosts like you ever did.

### Run it

For an easy test-startup you just have to clone and build following project.

```
// Download the repository
$ git clone https://github.com/tharangar/apache-docker.git
cd apache-docker
// Build the homail docker image
$ docker build -t homail .
// run the docker image 
$ docker run -p 80:80 -p 89:89 -p 443:443 -p 433:433 --name homail -d homail

```

Now you have locally an apache running, which gets it SSL-certificates from Let's Encrypt.

The image will get letsencrypt-certificates on first boot. A cron-job renews the existing certificates automatically, so you don't have to care about it.

If you want to expand your certificate and you can remove the existing docker-container and start new one with the updated `DOMAINS`-list. If you don't want to recreate the container you can execute the following commands:

```
$ UPDATED_DOMAINS="example.org,more.example.org"
$ docker exec -it apache-ssl /run_letsencrypt.sh --domains $UPDATED_DOMAINS
```

### Test the result

You can test following urls whether they are working properly

'''
// test the apache main page
http://localhost
// rainloop with https
https://localhost
// rainloop with https and optiional port
https://localhost:433/
'''

