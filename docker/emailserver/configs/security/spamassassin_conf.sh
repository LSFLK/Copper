#!/usr/bin/env bash

#sed -i.bak -e "s;ENABLED;"${HOSTNAME}";g" "/etc/default/spamassassin"
#sed -c -i "s/\(ENABLED *= *\).*/\11/" "/etc/default/spamassassin"
#sed -i -e '/ENABLED =/ s/= .*/= 1/' /etc/default/spamassassin
sed -i "s;ENABLED=0;ENABLED=1;g" /etc/default/spamassassin

chmod -R 755 /amavis/

cp -R /amavis/* /etc/amavis/conf.d/

sed -i "s;final_spam_destiny       = D_BOUNCE;final_spam_destiny       = D_DISCARD;g" /etc/amavis/conf.d/20-debian_defaults
# add spam info headers if at, or above that level
sed -i "s;sa_tag_level_deflt  = 2.0;sa_tag_level_deflt = -999;g" /etc/amavis/conf.d/20-debian_defaults
# add 'spam detected' headers at that level
sed -i "s;sa_tag2_level_deflt = 6.31;sa_tag2_level_deflt = 6.0;g" /etc/amavis/conf.d/20-debian_defaults
# triggers spam evasive actions
sed -i "s;sa_kill_level_deflt = 6.31;sa_kill_level_deflt = 21.0;g" /etc/amavis/conf.d/20-debian_defaults
# spam level beyond which a DSN is not sent
sed -i "s;sa_dsn_cutoff_level = 10;sa_dsn_cutoff_level = 4;g" /etc/amavis/conf.d/20-debian_defaults


# change the hostname and domain names in 50-user file




#systemctl start spamassassin.service
service spamassassin start

exit 0