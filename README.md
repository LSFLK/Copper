# copper-base
This repo is use for maintain the base docker image regarding the copper mail solution. Note that this is the core of copper mail.  

Initial development of copper base is completed including postfix and dovecot. You may find the source code in “https://github.com/LankaSoftwareFoundation/copper-base.git”.

Instructions (commands) for create the docker image and you may test mail sending and receiving in local environment using telnet.

1. First you need to download the source code from GitHub.
	* https://github.com/LankaSoftwareFoundation/copper-base.git

2. Run below command inside the copper base folder for build the docker image. (It will take severel minutes)
	* sudo docker build -t copper_base .

3. Now you have the docker image “copper_base” and what you need is run the image.
	* sudo docker run -it copper_base /bin/bash/

3. Now you are inside the copper_base. Create a user and grant privileges and finally add the created user to the mail group.

	* useradd (username) 
	* passwd (username) (hit enter and you will be asked to type password twice)
	* mkdir -p /var/www/html/(username)
	* usermod -m -d /var/www/html/(username) (username)
	* chown -R (username):(username) /var/www/html/(username)
	* adduser (username) mail

4. Start the services postfix and dovecot
	* service postfix start
	* service dovecot start

5. Now connect with telnet and send mail locally.
	* telnet localhost 25
	* mail from:(username)@localhost
	* rcpt to:(username)@localhost
	* data
	* Subject: (enter the subject here)
	* "enter the body of the mail here"
	* .
	* quit

6. Check the sent(received) mail
	* telnet localhost 110
	* user (username)
	* pass (password)
	* list (you will see a list of items with labels like “1 2342” and “9 1926”, if you wish to read an email message such as “7 3509”, try following)
	* retr 7 (you can delete mails using del 1, del 2 etc…)

7. When you are done with checking emails, type “quit”.

Note: You may build the docker image using below command
	* sudo docker build -t (image_name) .

And run the created image with
	* docker run -it -p 8080:80 (image_name) /bin/bash

Restart the services apache2, postfix and dovecot. You will be able to access postfixadmin through host machine using port 8080.
	* http://localhost:8080/postfixadmin/setup.php
