# mail-is

## This repository contains following Docker resources:
- WSO2 Identity Server Dockerfile witch has been linkd with separate openLDAP
- openLDAP Dockerfile
- Docker Compose files to manage those dockerfiles.

The identity server dockerfile build genaric docker images from wso2 is official docker image for deploing identity server in containerized envirenments. also include some configurations to link new openLDAP to WSO2 identity server. The openLDAP dockerfile includes osixia/openldap 1.2.2
       Docker compose file has been created for managing Dockerfiles, passing envirenment variables, etc. This includes phpldapadmin image as well.. for managing new openLDAP.
       
       In here we create new keystore for wso2 is other than using wso2 is default keystore.
       
##  Configuration

1. Create a keystore using a new certificate

    using following command you can create new keystore. Make sure to replace wso2carbon.jks in mail-is using new keystore if you are changing.

 #### keytool -genkey -alias wso2 -keyalg RSA -keystore wso2carbon.jks -keysize 2048
 
2. Change carbon.xml file in /product-is/ldap_dep/ directory
   
    use password when you used to create keystore for <KeyPassword> and use aliias as you used in above command in <KeyAlias>
         
       <KeyStore>
            <!-- Keystore file location-->
            <Location>${carbon.home}/repository/resources/security/wso2carbon.jks</Location>
            <!-- Keystore type (JKS/PKCS12 etc.)-->
            <Type>JKS</Type>
            <!-- Keystore password-->
            <Password>adminlsf</Password>
            <!-- Private Key alias-->
            <KeyAlias>wso2</KeyAlias>
            <!-- Private Key password-->
            <KeyPassword>adminlsf</KeyPassword>
        </KeyStore>

        <InternalKeyStore>
            <!-- Keystore file location-->
            <Location>${carbon.home}/repository/resources/security/wso2carbon.jks</Location>
            <!-- Keystore type (JKS/PKCS12 etc.)-->
            <Type>JKS</Type>
            <!-- Keystore password-->
            <Password>adminlsf</Password>
            <!-- Private Key alias-->
            <KeyAlias>wso2</KeyAlias>
            <!-- Private Key password-->
            <KeyPassword>adminlsf</KeyPassword>
        </InternalKeyStore>
        
  3. Change catalina-server.xml file in /product-is/ldap_dep/ directory
 
     change keystorePass as you used when creating keystore
    
  
                   SSLEnabled="true"
                   compressionMinSize="2048"
                   noCompressionUserAgents="gozilla, traviata"
                   compressableMimeType="text/html,text/javascript,application/x-javascript,application/javascript,application                                          /xml,text/css,application/xslt+xml,text/xsl,image/gif,image/jpg,image/jpeg"
                   keystoreFile="${carbon.home}/repository/resources/security/wso2carbon.jks"
                   keystorePass="adminlsf"
                   URIEncoding="UTF-8"/>
                   
 ## How to use
 
    run following command on command line in mail-is directory
    
  ###  #sh iam-up.sh
  
       you can wso2 is on browser using https://localhost:9443/carbon/
       wso2 is end user dashboard using https://localhost:9443/dashboard/
       access openLDAP using http://localhost:8888/
### Usefull dock when configuring

       https://medium.com/@technospace/creating-new-keystores-in-wso2-products-d61cde7d456
       https://docs.wso2.com/display/ADMIN44x/Configuring+Keystores+in+WSO2+Products
       https://docs.wso2.com/display/ADMIN44x/Creating+New+Keystores
