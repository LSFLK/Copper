# docker-ldapserver

A basic ldap server in a docker container with admin gui.

Read:
https://www.digitalocean.com/community/tutorials/how-to-install-and-configure-a-basic-ldap-server-on-an-ubuntu-12-04-vps
https://wiki.r00tedvw.com/index.php/Ubuntu/openldap

Still WIP.


Directories /etc/ldap and /usr/share/slapd must be saved outside.

To build:

sudo docker build -t ldap .

To run:

sudo docker run -d -p 8888:80 -p 8889:389 -v /tmp/data/etc:/etc/ldap -v /tmp/data/slapd:/usr/share/slapd --name ldap -t ldap 

sudo docker exec -it ldap dpkg-reconfigure slapd

Config like this (example tampere.hacklab.fi):

Configuring slapd
-----------------

If you enable this option, no initial configuration or database will be created for you.

Omit OpenLDAP server configuration? [yes/no] no

The DNS domain name is used to construct the base DN of the LDAP directory. For example, 'foo.example.org' will create the directory with 'dc=foo, dc=example, dc=org' as base DN.

DNS domain name: tampere.hacklab.fi

Please enter the name of the organization to use in the base DN of your LDAP directory.

Organization name: Tampere Hacklab

Please enter the password for the admin entry in your LDAP directory.

Administrator password: 

Please enter the admin password for your LDAP directory again to verify that you have typed it correctly.

Confirm password: 

HDB and BDB use similar storage formats, but HDB adds support for subtree renames. Both support the same configuration options.

The MDB backend is recommended. MDB uses a new storage format and requires less configuration than BDB or HDB.

In any case, you should review the resulting database configuration for your needs. See /usr/share/doc/slapd/README.Debian.gz for more details.

  1. BDB  2. HDB  3. MDB
Database backend to use: 2

Do you want the database to be removed when slapd is purged? [yes/no] yes

There are still files in /var/lib/ldap which will probably break the configuration process. If you enable this option, the maintainer scripts will move the old database files out of the way
before creating a new database.

Move old database? [yes/no] yes

The obsolete LDAPv2 protocol is disabled by default in slapd. Programs and users should upgrade to LDAPv3.  If you have old programs which can't use LDAPv3, you should select this option and
'allow bind_v2' will be added to your slapd.conf file.

Allow LDAPv2 protocol? [yes/no] no

  Moving old database directory to /var/backups:
  - directory unknown... done.
  Creating initial configuration... done.
  Creating LDAP directory... done.
invoke-rc.d: could not determine current runlevel
invoke-rc.d: policy-rc.d denied execution of start.


Then:

nano /etc/phpldapadmin/config.php


change:

$servers->setValue('server','base',array('dc=tampere,dc=hacklab,dc=fi'));
$servers->setValue('login','bind_id','cn=admin,dc=tampere,dc=hacklab,dc=fi');

run:
service slapd start
service apache2 start

Open browser at http://localhost:8888/phpldapadmin

Admin login: cn=admin,dc=tampere,dc=hacklab,dc=fi

