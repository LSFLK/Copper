docker-compose up --build -d
#docker-compose build
#docker-compose up

docker exec -it openldap /usr/bin/ldapadd -Y EXTERNAL -H ldapi:// -f /97-wso2Person.ldif
docker exec -it openldap /usr/bin/ldapadd -Y EXTERNAL -H ldapi:// -f /98-scimPerson.ldif
docker exec -it openldap /usr/bin/ldapadd -Y EXTERNAL -H ldapi:// -f /99-identityPerson.ldif

docker exec -it openldap /usr/bin/ldapadd -x -D 'cn=admin,dc=copper,dc=opensource,dc=lk' -w admin -H ldapi:// -f /add_content2.ldif
docker-compose up -d
#docker exec -it openldap /usr/bin/ldapadd -x -D 'cn=admin,dc=wso2,dc=com' -w admin -H ldapi:// -f /home/wso2carbon/wso2is-5.6.0/init.sh