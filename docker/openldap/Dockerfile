FROM osixia/openldap:1.2.1
MAINTAINER Lanka Software Foundation <opensource.lk>

ADD ./openldap/bootstrap /container/service/slapd/assets/config/bootstrap
ADD ./openldap/certs /container/service/slapd/assets/certs
ADD ./openldap/environment /container/environment/01-custom
ADD ./openldap/ldif /container/environment/ldif
