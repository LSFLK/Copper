
# pull from wso2 official image
FROM wso2/wso2is:5.7.0
MAINTAINER LSF Docker Maintainers "opensource.lk"

# set user configurations
ARG USER=wso2carbon
ARG USER_ID=802
ARG USER_GROUP=wso2
ARG USER_GROUP_ID=802
ARG USER_HOME=/home/${USER}
# set dependant files directory
ARG FILES=./product-is/files
ARG JAVA_HOME=${USER_HOME}/java
# set wso2 product configurations
ARG WSO2_SERVER=wso2is
ARG WSO2_SERVER_VERSION=5.7.0
ARG WSO2_SERVER_PACK=${WSO2_SERVER}-${WSO2_SERVER_VERSION}
ARG WSO2_SERVER_HOME=${USER_HOME}/${WSO2_SERVER}-${WSO2_SERVER_VERSION}

USER root

# Define working directory.
WORKDIR /data

# Define default command.
CMD ["bash"]    

COPY --chown=wso2carbon:wso2 init.sh ${USER_HOME}/
ADD --chown=wso2carbon:wso2 https://repo1.maven.org/maven2/dnsjava/dnsjava/2.1.8/dnsjava-2.1.8.jar ${USER_HOME}/${WSO2_SERVER_PACK}/repository/components/lib/
# set the user and work directory

USER ${USER_ID}
WORKDIR ${USER_HOME}

# set environment variables
ENV JAVA_HOME=${JAVA_HOME} \
    PATH=$JAVA_HOME/bin:$PATH \
    WSO2_SERVER_HOME=${WSO2_SERVER_HOME} \
    WORKING_DIRECTORY=${USER_HOME}

# Set openLDAP credentials in side wso2 is
COPY ./product-is/ldap_dep/* /${USER_HOME}/${WSO2_SERVER_PACK}/repository/conf/

# Set openLDAP dependancies
COPY ./product-is/ldif/* /

COPY ./product-is/ldap_dep/ldapdep.sh /

#Update keystore references in configuration files
COPY ./product-is/ldap_dep/catalina-server.xml /${USER_HOME}/${WSO2_SERVER_PACK}/repository/conf/tomcat/

# Configuring the primary keystore in carbon.xml
COPY ./wso2carbon.jks /${USER_HOME}/${WSO2_SERVER_PACK}/repository/resources/security/wso2carbon.jks

#set work directory for creating keystore
WORKDIR ${USER_HOME}/${WSO2_SERVER_PACK}/repository/resources/security/

RUN echo $(ls ${USER_HOME}) --no-cache

# Export the public certificate to a .pem file
RUN keytool -export -alias wso2 -keystore wso2carbon.jks -file publickey.pem

RUN echo $(ls ${USER_HOME}/${WSO2_SERVER_PACK}/repository/resources/) --no-cache

# Import the .pem file to client-truststore.jks.
RUN yes | keytool -import -alias wso2 -file publickey.pem -keystore client-truststore.jks -storepass wso2carbon

#run wso2server
ENTRYPOINT ${WORKING_DIRECTORY}/init.sh

