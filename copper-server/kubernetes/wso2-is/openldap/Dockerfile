# Use osixia/light-baseimage
# sources: https://github.com/osixia/docker-light-baseimage
#FROM osixia/light-baseimage:1.1.1
FROM osixia/openldap:1.2.2
MAINTAINER Lanka Software Foundation <opensource.lk>

#ARG LDAP_OPENLDAP_GID
#ARG LDAP_OPENLDAP_UID
COPY ./product-is/ldif/* /
COPY ./product-is/ldap_dep/ldapdep.sh /
#RUN chmod +x /ldapdep.sh
#CMD ./ldapdep.sh   

RUN apt-get update
COPY ./openldap/add_content2.ldif /
#COPY ./openldap/init_op.sh /

#EXPOSE 389 636

# Put ldap config and database dir in a volume to persist data.
# VOLUME /etc/ldap/slapd.d /var/lib/ldap