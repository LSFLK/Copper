# https://itnext.io/setting-up-https-for-jenkins-with-nginx-everything-in-docker-4a118dc29127
# https://reinout.vanrees.org/weblog/2017/05/02/https-behind-proxy.html
FROM nginx:alpine
MAINTAINER Lanka Software Foundation <support@opensource.lk> 
COPY ./reverseproxy/configs/nginx.conf /etc/nginx/nginx.conf
RUN mkdir /cert
COPY ./cert/* /cert/