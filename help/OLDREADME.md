# email-solution

Initial version of email solution

## Functionalities
- Core
  - [x] ESMTP Server 
    - [POSTFIX](http://www.postfix.org/) : a modular mail transfer agent.
  - [x] IMAP Server and POP Server
    - [DOVECOT](https://www.dovecot.org/) : secure open-source IMAP and POP3 server.
  - [x] Spam Filtering Tool
    - [RSPAMD](https://rspamd.com/) : advanced spam filtering system with SPF, DKIM, DMARC DNS black lists, URL black lists , Greylisting capabilities
  - [x] Mailing List Capability
    - Supported by Postfix alias. Can be managed through [POSTFIXADMIN](http://postfixadmin.sourceforge.net/) web interface
  - [x] Mail Signing and Encryption
    - [ZEYPLE](https://infertux.com/labs/zeyple/) :automatic GPG encryption to email server    
- Email Anti-Spoofing
  - [x] SPF
    - Need to set a DNS txt Record
  - [x] DKIM
    - DKIM Signing done through Rspamd
 
  - [ ] Desktop
    - Supports Thunderbird
- Support for LDAP and SSO
  - TBD


## How to Setup

### Before We Start

Make sure any other application does not use ports that we are going to listen to

```
$ netstat -tulpn | grep -E -w '25|80|110|143|443|465|587|993|995|4190|11334'
```

### Firewall

Unblock following ports

| Service | Software | Protocol | Port |
| ------- | -------- | -------- | ---- |
| SMTP | Postfix | TCP | 25 |
| HTTP | Nginx | TCP | 80 |
| POP3 | Dovecot | TCP | 110 |
| IMAP | Dovecot | TCP | 143 |
| HTTPS | Nginx | TCP | 443 |
| SMTPS | Postfix | TCP | 465 |
| Submission | Postfix | TCP | 587 |
| IMAPS | Dovecot | TCP | 993 |
| POP3S | Dovecot | TCP | 995 |
| ManageSieve | Dovecot | TCP | 4190 |
| HTTP | Rspamd | TCP | 11334 |


### DNS Setup

Setup these DNS records on your DNS Server

| HOSTNAME | CLASS | TYPE | PRIORITY | VALUE |
| -------- | ----- | ---- | -------- | ----- |
| mail | IN | A/AAAA | any | Your Server IP ex:(1.1.1.1) |
| imap | IN | CNAME | any | mail.domain.tld. |
| smtp | IN | CNAME | any | mail.domain.tld. |
| webmail | IN | CNAME | any | mail.domain.tld. |
| postfixadmin | IN | CNAME | any | mail.domain.tld. |
| @ | IN | MX | 10 | mail.domain.tld. |
| @ | IN | TXT | any | "v=spf1 a mx ip4:SERVER_IPV4 ~all" |
| 2018._domainkey | IN | TXT | any | "v=DKIM1; k=rsa; p=Your DKIM Public Key" |
| _dmarc | IN | TXT | any | "v=DMARC1; p=reject; rua=mailto:postmaster@domain.tld; ruf=mailto:admin@domain.tld; fo=0; adkim=s; aspf=s; pct=100; rf=afrf; sp=reject" |

**Your DKIM Public Key will be printed in the logs of your emailserver container 
  or you can manually find it by running**
```
$ docker exec emailserver cat /var/lib/rspamd/dkim/2018.txt
```

## Installation

1. Clone this Repository

```
$ git clone git@github.com:prabod/email-solution.git
```

2. Edit .env file to replicate your settings

3. Create external Docker Network

```
$ docker network create reverse-proxy
```
## Running

Run the system and start all services by :

```
$ docker-compose up -d 
```

## Access Services

1. PostfixAdmin to manage Domains and Mailboxes

    - Direct your web browser to postfixadmin.domain.tld/setup.php
    - Enter a Setup Password
    - Append the generated hash to the config file
    - ```$ docker exec -it postfixadmin /bin/setup_password.sh```
    - Add Admin account
    - Add Domains and Mailboxes
  
2. Access Webmail

    - Direct your web browser to webmail.domain.tld/?admin 
    - Default login is "admin", password is "12345"
    - Setup IMAP and SMTP accounts
  
3. Access Rspamd WebUI

    - Direct your web browser to mail.domain.tld:11334
    - Login using the password mentioned in the .env file
  
4. Setup Desktop / Mobile Clients
    - IMAP Server : imap.domain.tld
    - IMAP Port : 993
    - SMTP Server : smtp.domain.tld
    - SMTP Port : 465
    - Encryption : SSL/TLS
    - Username : user@domain.tld
    - To support signing and encryption install 
      - [openkeychain](https://play.google.com/store/apps/details?id=org.sufficientlysecure.keychain&hl=en) alongside with K9 on Android. 
      - [Enigmail Plugin](https://addons.mozilla.org/en-US/thunderbird/addon/enigmail/) for Thunderbird
      - [Encryptomatic Plugin](https://www.encryptomatic.com/openpgp/) for Outlook
