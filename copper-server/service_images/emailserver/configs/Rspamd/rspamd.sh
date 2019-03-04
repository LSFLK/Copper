apt-get install -y lsb-release wget # optional
CODENAME=`lsb_release -c -s`
wget -O- https://rspamd.com/apt-stable/gpg.key | apt-key add -
echo "deb http://rspamd.com/apt-stable/ $CODENAME main" > /etc/apt/sources.list.d/rspamd.list
echo "deb-src http://rspamd.com/apt-stable/ $CODENAME main" >> /etc/apt/sources.list.d/rspamd.list
apt-get -y update
apt-get --no-install-recommends install -y rspamd
