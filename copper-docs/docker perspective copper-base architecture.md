## Docker perspective copper-server architecture

#### In here we are trying to give some brief idea about, how copper-server behave in docker envirenment. 
#### Copper-server contains main 4 docker containers. Those are

  - Reverse proxy
  - Email server
  - Webmail Rainloop
  - Copper agent
  
#### Diagram

![Octocat](https://github.com/LankaSoftwareFoundation/Copper-EmailSolution/blob/master/docker_perspective_copper_base_architecture.png)

#### 1 Reverse proxy

This is very important when accessing internal web application through a single point. It works as a reverse proxy for following web portals.
  1. Web mail
  2. Copper agent

#### 2 Email server

Main container in the solution. It has Postfix (as SMTP server), Dovecot, mailbox, Rsapmd for spam filtering and Zeyple for encrypt the content of the emails.

#### 3 Webmail

It contains webmail client for the soulution. Currently we run rainloop as the webmail client.

#### 4 Copper agent

Monitoring, alerts and updates handling should be controled by agent.
