## Copper Mail solution

Copper email solution can be used by any organization and can be monitored and controled from a central access point. It consists of 2 main parts
1. [Copper-server](https://github.com/LSFLK/Copper/tree/master/copper-server)
2. [Copper-hub](https://github.com/LSFLK/Copper/tree/master/copper-hub)


## Copper-server

### Architecture

![Octocat](https://github.com/LSFLK/Copper/blob/master/copper-docs/copperBase_mailServerArchitecture_updated.png)


#### Copper-server main components.

- [Postfix](http://www.postfix.org/) : A modular mail transfer agent (MTA)
- [Dovecot](https://www.dovecot.org/) : Secure open-source IMAP and POP3 server (MDA)
- [ClamAV](https://www.clamav.net/) : Antivirus software
- [Rspamd](https://rspamd.com/) : Spam filter
- [Rainloop](https://www.rainloop.net/) : Web client to access mail for users
- [OpenLDAP](https://www.openldap.org/) : Directory service which authenticate users


## Contributors are wellcome

Due to this is an opensource project, contributors are welcome.
Copper-server readme file describe how to use this solution in development environments.
So any one whom, willing to contribute are wellcome and coppermail team is ready to support.

### Further readings

  1. [Ready to deploy email solution](https://docs.google.com/document/d/103ApdgqkJtV1fE3tVQKIwE-ldxtfBPKsAVjk8GFpLb8/edit#heading=h.tca36t2d12pa)

### Instruction for deployment (summary)

#### Create environment

1. Clone the repository [Copper](https://github.com/LSFLK/Copper.git)

```
$ git clone https://github.com/LSFLK/Copper.git
```

2. Edit ".env" file which is inside of copper server, to replicate your settings

3. Create external docker networks using below commands

```
$ docker network create front
$ docker network create back
```
#### Run

Run the system and start Copper server by :

```
$ docker-compose build
$ docker-compose up -d 
```

#### Stay in touch with us.

- [mail group](https://groups.google.com/forum/#!forum/lsf-email-solution) 

- [![Gitter](https://img.shields.io/badge/chat-on%20gitter-blue.svg)](https://gitter.im/copper-mail)
