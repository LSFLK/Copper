FROM osixia/openldap:1.2.1
MAINTAINER Lanka Software Foundation <support@opensource.lk>

RUN apt-get update
COPY ./openldap/changes.ldif /
COPY ./openldap/init_sys.sh /
# CMD /init_sys.sh
# CMD ldapmodify -Y EXTERNAL -H ldapi:/// -f /changes.ldif

# ADD ./openldap/bootstrap /container/service/slapd/assets/config/bootstrap
# ADD ./openldap/certs /container/service/slapd/assets/certs
# ADD ./openldap/environment /container/environment/01-custom
# ADD ./openldap/ldif /container/environment/ldif
