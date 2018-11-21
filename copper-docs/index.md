Copper email solution can be used by any organization and can be monitored and controled from a central access point. It consists of 3 main parts
1. Copper-base
2. Copper-suite
3. Copper-hub


## Copper-base

### Architecture

![Octocat](https://github.com/LankaSoftwareFoundation/Copper-EmailSolution/blob/master/copperBase_mailServerArchitecture.png?raw=true)


#### Copper-base main components.

- [Postfix](http://www.postfix.org/) : A modular mail transfer agent (MTA)
- [Dovecot](https://www.dovecot.org/) : Secure open-source IMAP and POP3 server (MDA)
- [ClamAV](https://www.clamav.net/) : Antivirus software
- [Rspamd](https://rspamd.com/) : Spam filter
- [Rainloop](https://www.rainloop.net/) : Web client to access mail for users
- [OpenLDAP](https://www.openldap.org/) : Directory service which authenticate users


## Contributors are wellcome

Due to this is an opensource project, contributors are welcome.
Copper-base readme file describe how to use this solution in development environments.
So any one whom, willing to contribute are wellcome and coppermail team is ready to support.

### Further readings

  1. [Copper-base readme.md](https://github.com/LankaSoftwareFoundation/copper-base/blob/master/README.md)

  2. [Docker perspective copper base architecture](https://github.com/LankaSoftwareFoundation/Copper-EmailSolution/blob/master/docker%20perspective%20copper-base%20architecture.md)
  
  3. [Copper mail solution abstract architecture](https://docs.google.com/drawings/d/1wwptKob-_G_trksjU4VX9iOO4hrRiZFj7v3jX7qvvvc/edit?usp=sharing)

### Instruction for deployment (summary)

#### Create environment

1. Clone the repository [Copper-base](https://github.com/LankaSoftwareFoundation/copper-base.git)

```
$ git clone https://github.com/LankaSoftwareFoundation/copper-base.git
```

2. Edit ".env" file to replicate your settings

3. Create external docker networks using below commands

```
$ docker network create front
$ docker network create back
```
#### Run

Run the system and start all services by :

```
$ docker-compose build
$ docker-compose up -d 
```

#### Stay in touch with us.

- [mail group](https://groups.google.com/forum/#!forum/lsf-email-solution) 

- [![Gitter](https://img.shields.io/badge/chat-on%20gitter-blue.svg)](https://gitter.im/copper-mail)
