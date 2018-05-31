# copper-base
This repo is use for maintain the base docker image regarding the copper mail solution. Note that this is the core of copper mail.  

Initial development of copper base is completed including postfix and dovecot. You may find the source code in “https://github.com/LankaSoftwareFoundation/copper-base.git”.

Instructions (commands) for create the docker image and you may test mail sending and receiving in local environment using telnet.

First you need to download the source code from GitHub. https://github.com/LankaSoftwareFoundation/copper-base.git

Run below command inside the copper base folder for build the docker image. (It will take severel minutes) sudo docker build -t copper_base .

Now you have the docker image “copper_base” and what you need is run the image. sudo docker run -it copper_base /bin/bash/

Now you are inside the copper_base. Create a user and grant privileges and finally add the created user to the mail group. useradd passwd (hit enter and you will be asked to type password twice) mkdir -p /var/www/html/ usermod -m -d /var/www/html/ chown -R : /var/www/html/ adduser mail

Start the services postfix and dovecot start service postfix start service dovecot

Now connect with telnet and send mail locally. telnet localhost 25 mail from:@localhost rcpt to:@localhost data Subject: . quit

Check the sent(received) mail telnet localhost 110 user pass list (you will see a list of items with labels like “1 2342” and “9 1926”, if you wish to read an email message such as “7 3509”, try following) retr 7 (you can delete mails using del 1, del 2 etc…)

When you are done with checking emails, type quit.
