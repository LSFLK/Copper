

2018-05-25
Seive removing steps

1. Removed seive config file from the folder dovecot/config.d  , Removed file placed in garbage folder

2. protocols = "imap pop3 lmtp sieve"
   change dovecot.conf   line changed romoving sieve


2018-05-28
Data base changing steps

1. Same MariaDB database folder changing
    1. Change the folder in /docker/database/data
    2. docker-compose.yml
        MYSQL_DATABASE=mail  // change the name of the database 
    3. docker-common.yml
        change the mariadb parameters
        MYSQL_DATABASE=mail // change the name
    4. change the .cf files to folder in /docker/emailserver/config/postfix/<foldername>/<file set with same start name>
        https://www.linode.com/docs/email/postfix/email-with-postfix-dovecot-and-mariadb-on-centos-7/
        Above url give good support for vmail creation with databases.

    5. Then in emailserver dockerfile which copy .cf files to the postfix folder and followinng permission changes done
        COPY ./emailserver/configs/Postfix /etc/postfix/
        COPY ./emailserver/configs/Dovecot /etc/dovecot/

        #COPY ./emailserver/configs/Postfix/sql /etc/postfix/sql/
        #RUN chmod 775 -R /etc/postfix/sql/mysql-virtual_*.cf
        RUN chmod o= /etc/postfix/sql/mysql_virtual_*.cf
        RUN chgrp postfix /etc/postfix/sql/mysql_virtual_*.cf

        make sure your file locations are correct
    6.  change the main.cf which is postfix main configuratio file
        #virtual_mailbox_domains = proxy:mysql:/etc/postfix/sql/mysql_virtual_domains_maps.cf
            virtual_mailbox_domains = proxy:mysql:/etc/postfix/mariadb-sql/mysql-virtual_domains.cf
            virtual_alias_maps =
            #proxy:mysql:/etc/postfix/sql/mysql_virtual_alias_maps.cf,
            #proxy:mysql:/etc/postfix/sql/mysql_virtual_alias_domain_maps.cf,
            #proxy:mysql:/etc/postfix/sql/mysql_virtual_alias_domain_catchall_maps.cf
            #New configurations files created myself
            proxy:mysql:/etc/postfix/mariadb-sql/mysql-virtual_forwardings.cf, 
            proxy:mysql:/etc/postfix/mariadb-sql/mysql-virtual_email2email.cf
            virtual_mailbox_maps =
            #proxy:mysql:/etc/postfix/sql/mysql_virtual_mailbox_maps.cf,
            #proxy:mysql:/etc/postfix/sql/mysql_virtual_alias_domain_mailbox_maps.cf
            proxy:mysql:/etc/postfix/mariadb-sql/mysql-virtual_mailboxes.cf

    7.  dovecot.sql.conf.ext file following changes to be done


            driver = mysql
            connect = host=127.0.0.1 dbname=mail user=mail_admin password=mail_admin_password
            default_pass_scheme = CRYPT
            password_query = SELECT email as user, password FROM users WHERE email='%u';





-----------------------------------------------------------------------------------------------------------------------------------
Creating users automatically in mariadb


// Then create  shell script to exicute queries.

You need to use the -p flag to send a password. And it's tricky because you must have no space between -p and the password.

$ mysql -h "server-name" -u "root" "-pXXXXXXXX" "database-name" < "filename.sql"

If you use a space after -p it makes the mysql client prompt you interactively for the password, and then it interprets the next command argument as a database-name:

$ mysql -h "server-name" -u "root" -p "XXXXXXXX" "database-name" < "filename.sql"
Enter password: <you type it in here>
ERROR 1049 (42000): Unknown database 'XXXXXXXX'

Actually, I prefer to store the user and password in ~/.my.cnf so I don't have to put it on the command-line at all:

[client]
user = root
password = XXXXXXXX

Then:

$ mysql -h "server-name" "database-name" < "filename.sql"



--------------------------------------------------------------------------------------------------------------

mail folder replacement
sieve configuration

There was a folder called mail in the root folder inside there were sieve and vhost some of configuration files.
It was removed and in the composer file line contained volume adding to mail directory removed under emailserver service


--------------------------------------------------------------------------------------------------------------


