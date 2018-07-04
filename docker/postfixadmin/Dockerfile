From ubuntu:16.04
MAINTAINER LSF <opensource.lk>
ARG DEBIAN_FRONTEND=noninteractive
RUN apt-get update
RUN apt-get -y install apt-utils
RUN apt-get -y install net-tools
RUN apt-get -y install telnet
RUN apt-get -y install nano

RUN apt-get install php php7.0-mysql nginx php-pear php7.0-dev php7.0-zip php7.0-curl -y
RUN apt-get install php7.0-gd php7.0-mysql php7.0-mcrypt php7.0-xml libapache2-mod-php7.0 php7.0-imap php7.0-mbstring -y
RUN mkdir -p /run/php && \
    chown -R www-data:www-data /var/www/html && \
    chown -R www-data:www-data /run/php
ADD https://github.com/postfixadmin/postfixadmin/archive/postfixadmin-3.1.tar.gz /
WORKDIR /
RUN tar -xzf postfixadmin-3.1.tar.gz && mv *postfixadmin-3.1 postfixadmin
RUN mkdir -p /postfixadmin/templates_c
RUN chown -R www-data:www-data /postfixadmin
COPY ./postfixadmin/configs/default /etc/nginx/sites-available/
COPY ./postfixadmin/configs/init_sys.sh /bin/
COPY ./postfixadmin/configs/setup_password.sh /bin/
RUN chmod +x /bin/init_sys.sh
RUN chmod +x /bin/setup_password.sh


# References give how to do it manually in slightly different example
# https://www.rosehosting.com/blog/setup-and-configure-a-mail-server-with-postfixadmin/

# bellow url was found from another project : 
# RUN wget -q -O - "http://downloads.sourceforge.net/project/postfixadmin/postfixadmin/postfixadmin-3.0/postfixadmin-3.0.tar.gz" | sudo tar -xzf - -C /var/www

