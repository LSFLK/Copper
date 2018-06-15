2018-05-25
-----------------------------------------------
Postfix starting issue :
/usr/sbin/postconf: warning: /etc/postfix/main.cf: unused parameter: virtual_maildir_limit_message=Sorry, the user's maildir has overdrawn his diskspace quota, please try again later.



Postfix doesn't support quotas out of the box, there are a few different ways to set it up. I would recommend using Dovecot to manage the quotas if it's already working. You can find more information on how to set up quotas on this page: http://www.postfix.org/addon.html#quota

Answers to your questions:

    Those parameters are for the VDA patch, which probably isn't applied on your system: http://vda.sourceforge.net/

    Sometimes postfix is configured to query Dovecot, or pass the emails to Dovecot before making a decision whether to accept / bounce. Post the output of the postconf command if you want an exact answer.

Edit: Based on your config, this parameter:

virtual_transport = lmtp:unix:private/dovecot-lmtp

Is telling postfix to pass emails for virtual mailboxes to dovecot for delivery. It does this using lmtp (search for it). Then dovecot receives the email and decides how to handle it based on its configuration. Note this doesn't apply to local user mailboxes such as root, just the virtual mailboxes.


* So i assume in my configuration dovecot has a issue and it is not up thats may be the reason postfix also cannot start

-----------------------------------------------------
Dovecot starting issue
root@mail:/# service dovecot start
 * Starting IMAP/POP3 mail server dovecot                                                                                                doveconf: Fatal: Error in configuration file /etc/dovecot/conf.d/10-ssl.conf line 12: ssl_cert: Can't open file /etc/letsencrypt/live/mail.example.com/fullchain.pem: No such file or directory
              
To troubleshoot this issue.
    log in to the contatiner
    #docker ps // found the container id
    then exec to the emailserver container
    #sudo docker exec -i -t 2a5bee417d2c /bin/bash
    Then run the shell to configure emailserver which Dockerfile has run the last manually
    #root@mail:/# cd /bin
    #root@mail:/bin# sh ./init_sys.sh

    Failed authorization procedure. mail.example.com (http-01): urn:acme:error:dns :: DNS problem: NXDOMAIN looking up A for mail.example.com


** As a temporary solution i thought to switch off ssl from dovecot
    1. changed configurations in 10-ssl.conf -- > 6,14,15 lines
    2. int_sys. sh file line no 71 exit 1 was commented


**** then davecot successfully up ***
--------------------------------------------------------------

Mariadb issue **  Resolved

When run the sytem by :docker-compose up
message comes as done : check the log
    :docker-compose logs

    following issues found
    mariadb        | 2018-05-25  8:31:06 140337344726912 [ERROR] InnoDB: Operating system error number 2 in a file operation.
mariadb        | 2018-05-25  8:31:06 140337344726912 [ERROR] InnoDB: The error means the system cannot find the path specified.
mariadb        | 2018-05-25  8:31:06 140337344726912 [ERROR] InnoDB: If you are installing InnoDB, remember that you must create directories yourself, InnoDB does not create them.
mariadb        | 2018-05-25  8:31:06 140337344726912 [ERROR] InnoDB: Cannot open datafile for read-only: './mysql/gtid_slave_pos.ibd' OS error: 71

Above issue has happened due to folder permission issue. It was corrected arranging permisson in email server dockerfile for those 
required configuration files.

----------------------------------------------------------------
2018-05-28 :- tc.log error 

mariadb        | 2018-05-28  8:33:44 139757851133824 [ERROR] Bad magic header in tc log
mariadb        | 2018-05-28  8:33:44 139757851133824 [ERROR] Crash recovery failed. Either correct the problem (if it's, for example, out of memory error) and restart, or delete tc log and start mysqld with --tc-heuristic-recover={commit|rollback}
mariadb        | 2018-05-28  8:33:44 139757851133824 [ERROR] Can't init tc log
mariadb        | 2018-05-28  8:33:44 139757851133824 [ERROR] Aborting


For solution changed to the data directory we coppied from the mysql installation
rm -rf *log*
This command will delete all log files including tc.log
Then remove the previous mariadb container and then  build the docker with new database container and issues resolved

--------------------------------------------------------------------------------------
2018-05-28 postfix error
May 28 10:04:14 mail postfix/master[203]: fatal: bind ::1 port 10026: Cannot ass
ign requested address

wso2s-MacBook-Pro:docker wso2$ docker exec -it a176bc09e5e6 /bin/bash
root@mail:/# ls
bin  boot  cert  certs	dev  etc  home	lib  lib64  media  mnt	opt  proc  root  rspamd.sh  run  sbin  sieve  srv  sys	tmp  usr  var
root@mail:/# service postfix status
[ ok ] postfix is not running.
root@mail:/# service postfix start 
[ ok ] Starting Postfix Mail Transport Agent: postfix.
root@mail:/# service dovecot status
[ ok ] dovecot is running.
root@mail:/# 
root@mail:/# 
root@mail:/# cd /var/log
root@mail:/var/log# ls
alternatives.log  btmp	       dpkg.log  lastlog   mail.info  mail.warn  rspamd  wtmp
apt		  dovecot.log  faillog	 mail.err  mail.log   messages	 syslog  zeyple.log
root@mail:/var/log# nano mail.log
bash: nano: command not found
root@mail:/var/log# more mail.log
May 28 09:45:25 mail postfix/master[203]: fatal: bind ::1 port 10026: Cannot assign requested address
May 28 09:48:06 mail postfix/master[402]: fatal: bind ::1 port 10026: Cannot assign requested address

Please paste the output of postconf -n, ip addr and the content of /etc/hosts.

Generally the error you're describing indicates that it's trying to bind to a non-local IP address. The output of the above commands should help us figure out why.

// finaly overcome this issue by commenting follwoing configurations in master.cf file.

#localhost:10026 inet  n       -       n       -       10      smtpd
  #-o content_filter=
  #-o receive_override_options=no_unknown_recipient_checks,no_header_body_checks,no_milters
  #-o smtpd_helo_restrictions=
  #-o smtpd_client_restrictions=
  #-o smtpd_sender_restrictions=
  #-o smtpd_recipient_restrictions=permit_mynetworks,reject
  #-o mynetworks=127.0.0.0/8,[::1]/128
  #-o smtpd_authorized_xforward_hosts=127.0.0.0/8,[::1]/128

------------------------------------------------------------------------------------------

2018-05-30 : Resolved

mysql-virtual_domains.cf: table lookup problem

Above error found in the mail.log in /var/log
when we try to send a mail from telnet this error happens

** Issue was corrected after creating the mysql user with  @'%' access
   and placing /mariadb-sql/mysql- ***.cf file correctly in init_sys.sh

   Refference : https://github.com/docker-library/mysql/issues/275

Check if the database user exists and can connect

In MySQL, each database user is defined with IP address in it, so you can have for example a root user allowed to connect from localhost (127.0.0.1) but not from other IP addresses. With a container, you never access to the database from 127.0.0.1, it could explain the problem.

To check it, you can do the following:
1* From a terminal, connect you to your MySQL running container

docker exec -it your_container_name_or_id bash

2* In your container, connect you to the MySQL database

mysql -u your_user -p

It will ask you your password, you have to write it and press enter.
3* In your MySQL database, execute this SQL script to list all existing database users

SELECT host, user FROM mysql.user;

It will display a table, for example like this:

+------------+------------------+
| host       | user             |
+------------+------------------+
| %          | root             |
| 127.0.0.1  | root             |
| ::1        | root             |
| localhost  | mysql.sys        |
| localhost  | root             |
| localhost  | sonar            |
+------------+------------------+

It has to contain a line with your database user and '%' to works (% means "every IP addresses are allowed"). Example:

+------------+------------------+
| host       | user             |
+------------+------------------+
| %          | root             |
+------------+------------------+

My root user can connect itself from any IP addresses.
Are external connections allowed?

After that, like @ltangvald said, it could be a problem of allowing external connections to the container.

To check it, you can do the following:
1* From a terminal, connect you to your MySQL running container

docker exec -it your_container_name_or_id bash

2* In your container, run this command

mysqld --verbose --help | grep bind-address

It will display address to bind to, for example like this:

  --bind-address=name IP address to bind to.
bind-address                                                 0.0.0.0

The bind address have to be 0.0.0.0 (which means "every IP addresses") to work.
Also, a note:

Using docker-compose, if you link a volume, the parameters

    environment:
       MYSQL_ROOT_PASSWORD: 'pass'
       MYSQL_DATABASE: 'db'
       MYSQL_USER: 'user'
       MYSQL_PASSWORD: 'pass'

in your docker-compose.yml will not be used, so default user will not be created: you have to create it manually or remove the volume declaration.
------------------------------------------------------------------------------------------

2018-05-30 : Resolved
Relay access denied; from=<admin@localhost>

NOQUEUE: reject: RCPT from unknown[172.19.0.1]: 454 4.7.1 <admin@loalhost>: Relay access denied; from=<admin@localhost> t
o=<admin@loalhost> proto=SMTP



**

Notice this part in main.cf:

smtpd_recipient_restrictions = permit_mynetworks ...

So smtpd only permits IP addresses from mynetworks to relay emails.

What you need to do is to add your IP to mynetworks. For example, if your IP address is 192.168.1.123, change the parameter to

mynetworks = 127.0.0.0/8 192.168.1.123

Then you can send emails successfully.


** in my man.cf i change it to 


smtpd_recipient_restrictions =
        permit_sasl_authenticated,
        permit_mynetworks,
        #reject_unauth_destination

        and
mynetworks = 127.0.0.0/8 172.19.0.1


--------------------------------------------------------------------------------------------

2018-05-30 Resolved

550 5.1.1 <admin@localhost>: Recipient address rejected: User unknown in local recipient table

Telnet terminal error


** cleared by adding users manually to database

                                                                                                                                                             redis
wso2s-MacBook-Pro:docker wso2$ docker exec -it 481f07e91680 /bin/bash
root@481f07e91680:/# telnet localhost 25
bash: telnet: command not found
root@481f07e91680:/# telnet localhost 3306
bash: telnet: command not found
root@481f07e91680:/# mysql -u root -proot
Welcome to the MariaDB monitor.  Commands end with ; or \g.
Your MariaDB connection id is 14
Server version: 10.2.14-MariaDB-10.2.14+maria~jessie mariadb.org binary distribution

Copyright (c) 2000, 2018, Oracle, MariaDB Corporation Ab and others.

Type 'help;' or '\h' for help. Type '\c' to clear the current input statement.

MariaDB [(none)]> use mail
Reading table information for completion of table and column names
You can turn off this feature to get a quicker startup with -A

Database changed
MariaDB [mail]> INSERT INTO domains (domain) VALUES ('lsf.copper.net');
Query OK, 1 row affected (0.01 sec)

MariaDB [mail]> INSERT INTO users (email, password) VALUES ('admin@lsf.copper.net', ENCRYPT('password'));
Query OK, 1 row affected (0.00 sec)

MariaDB [mail]> INSERT INTO users (email, password) VALUES ('tharanga@lsf.copper.net', ENCRYPT('password'));
Query OK, 1 row affected (0.00 sec)

MariaDB [mail]> exit
Bye
root@481f07e91680:/# exit
exit
wso2s-MacBook-Pro:docker wso2$ telnet localhost 25
Trying ::1...
telnet: connect to address ::1: Connection refused
Trying 127.0.0.1...
Connected to localhost.
Escape character is '^]'.
220 mail.lsf.copper.net ESMTP Postfix (Ubuntu)
MAIL FROM:admin@lsf.copper.net
250 2.1.0 Ok
RCPT TO:tharanga@lsf.copper.net
250 2.1.5 Ok
data
354 End data with <CR><LF>.<CR><LF>
subject:hello
body:hollow
.
250 2.0.0 Ok: queued as CBB292003CF


>>>>> For further support user creation through scripts follow CHANGELOG.md


--------------------------------------------------------------------------------------------------------
2018-06-01  sieve issue
// syslog : docker-compose logs
sievec: Fatal: Plugin 'sieve_imapsieve' not found from directory /usr/lib/dovecot/modules/sieve

It was ok by following bellow steps.
changing to ubutnu to 18.04
 and changing email server docker following lines and adding new one
 RUN apt-get -y install dovecot-core dovecot-imapd dovecot-pop3d dovecot-lmtpd dovecot-mysql dnsutils

RUN apt-get install -y dovecot-sieve dovecot-managesieved

// inally checked in the emailserver container

wso2s-MacBook-Pro:docker wso2$ docker exec -it e6d926ffa1d8 /bin/bash
root@mail:/# ls
bin   cert   dev  home  lib64  mnt  proc  rspamd.sh  sbin   srv  tmp  var
boot  certs  etc  lib   media  opt  root  run        sieve  sys  usr
root@mail:/# dovecot --version
2.2.33.2 (d6601f4ec)
root@mail:/# cd /usr/lib/dovecot/modules/sieve/
root@mail:/usr/lib/dovecot/modules/sieve# ls
lib90_sieve_extprograms_plugin.so  lib90_sieve_imapsieve_plugin.so

--------------------------------------------------------------------------------------------------------
2018-06-04 

E: Package 'python-gpgme' has no installation candidate
ERROR: Service 'emailserver' failed to build: The command '/bin/sh -c apt-get -y install gnupg python-gpgme dovecot-managesieved sudo' returned a non-zero code: 100

This issue happen when we change the os to ubuntu 18.04 instaed of 16.04
*** Above python installation part removed 

---------------------------------------------------------------------------------------------------------

2018-06-04

| rsyslogd: imklog: cannot open kernel log (/proc/kmsg): Operation not permitted.






--------------------------------------------------------------------------------------------------------

2018-06-12


root@mail:/var/log# more mail.log
Jun 12 05:08:42 mail postfix/master[202]: daemon started -- version 3.3.0, confi
guration /etc/postfix
Jun 12 05:09:48 mail postfix/smtpd[236]: warning: cannot get RSA certificate fro
m file "/etc/letsencrypt/live/mail.coppermail.dyndns.org/fullchain.pem": disabli
ng TLS support

Jun 12 05:09:48 mail postfix/smtpd[236]: warning: TLS library problem: error:020
01002:system library:fopen:No such file or directory:../crypto/bio/bss_file.c:29
2:fopen('/etc/letsencrypt/live/mail.coppermail.dyndns.org/fullchain.pem','r'):


* Issue resolved by changing name of the files putting . infont of them as i observe it has created.

//main.cf
smtpd_tls_cert_file=/etc/letsencrypt/live/%DFQN%/.fullchain.pem
smtpd_tls_key_file=/etc/letsencrypt/live/%DFQN%/.privkey.pem

//10.ssl.conf
ssl_cert = </etc/letsencrypt/live/%DFQN%/.fullchain.pem
ssl_key = </etc/letsencrypt/live/%DFQN%/.privkey.pem

further in the shell file permission changes introduced after file creation



------------------------------------------------------------------------------------------------------

Telnet connection refused

wso2s-MacBook-Pro:docker wso2$ telnet localhost 25
Trying ::1...
telnet: connect to address ::1: Connection refused
Trying 127.0.0.1...
Connected to localhost.
Escape character is '^]'.
Connection closed by foreign host.

mail.log erro

root@mail:/var/log# more mail.log
Jun 12 10:18:05 mail postfix/master[203]: fatal: bind ::1 port 10026: Cannot ass
ign requested address





-------------------------------------------------------------------------------------------------------

docker log in to alpine containers

Issue and solution :

use /bin/sh instead of /bin/bash for apline

Ex:
wso2s-MacBook-Pro:docker wso2$ docker exec -it 8f884f87d885 /bin/bash
OCI runtime exec failed: exec failed: container_linux.go:348: starting container process caused "exec: \"/bin/bash\": stat /bin/bash: no such file or directory": unknown
wso2s-MacBook-Pro:docker wso2$ docker exec -it 8f884f87d885 /bin/sh
/ # ls
bin       home      mnt       root      services  tmp
dev       lib       proc      run       srv       usr
etc       media     rainloop  sbin      sys       var
/ # 
