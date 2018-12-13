#!/bin/bash

docker-compose up --build -d

# STATUS="0"

# until [[ ${STATUS} == *"ok"* ]]; do
#     echo "   wating until slpd is started"
#     STATUS=`docker exec -ti copper-openldap sh -c "service slapd status"`
#     sleep 5
# done

# echo "   slapd has started!"

sleep 20

docker exec -it copper-openldap /usr/bin/ldapadd -Y EXTERNAL -H ldapi:// -f /home/97-wso2Person.ldif
docker exec -it copper-openldap /usr/bin/ldapadd -Y EXTERNAL -H ldapi:// -f /home/98-scimPerson.ldif
docker exec -it copper-openldap /usr/bin/ldapadd -Y EXTERNAL -H ldapi:// -f /home/99-identityPerson.ldif

# docker exec -it copper-openldap /usr/bin/ldapmodify -Y EXTERNAL -H ldapi:// -f /changes.ldif

docker exec -it copper-openldap /usr/bin/ldapadd -x -D 'cn=admin,dc=copper,dc=opensource,dc=lk' -w admin -H ldapi:// -f /home/copper-users.ldif