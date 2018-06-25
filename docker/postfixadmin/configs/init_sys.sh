#!/usr/bin/env bash
export DBUSER=${DBUSER:-"postfixuser"}
export DBPASS=${DBPASS:-"postfixpassword"}
export DBHOST=${DBHOST:-"mariadb"}
export DB=${DB:-"mail"}
export DOMAIN=${DOMAIN:-$(hostname --domain)}
export SMTPHOST=${SMTPHOST:-$FQDN}

cat > /postfixadmin/config.local.php <<EOF
<?php
\$CONF['configured'] = true;
\$CONF['database_type'] = 'mysqli';
\$CONF['database_host'] = '${DBHOST}';
\$CONF['database_user'] = '${DBUSER}';
\$CONF['database_password'] = '${DBPASS}';
\$CONF['database_name'] = '${DB}';
\$CONF['smtp_server'] = '${SMTPHOST}';
\$CONF['domain_path'] = 'YES';
\$CONF['domain_in_mailbox'] = 'NO';
\$CONF['fetchmail'] = 'YES';
\$CONF['sendmail'] = 'YES';
\$CONF['admin_email'] = 'admin@${DOMAIN}';
\$CONF['footer_text'] = 'Return to ${DOMAIN}';
\$CONF['footer_link'] = 'http://${DOMAIN}';
\$CONF['default_aliases'] = array (
  'abuse'      => 'abuse@${DOMAIN}',
  'hostmaster' => 'hostmaster@${DOMAIN}',
  'postmaster' => 'postmaster@${DOMAIN}',
  'webmaster'  => 'webmaster@${DOMAIN}'
);

?>
EOF
service php7.0-fpm start
service nginx start
tail -f /dev/null
