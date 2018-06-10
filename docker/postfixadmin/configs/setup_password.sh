#!/bin/bash

read -rp "> Postfixadmin setup password hash : " HASH

while [ ${#HASH} -ne 73 ]; do
  read -rp "> Postfixadmin setup hash : " HASH
  echo ""
done

sed -i "s|\($CONF\['setup_password'\].*=\).*|\1 '${HASH}';|" /postfixadmin/config.inc.php

echo -e "Setup done!!"