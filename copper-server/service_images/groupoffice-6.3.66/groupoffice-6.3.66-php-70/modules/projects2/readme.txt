Projects Module


1. Setup threshold level for sending mails to projets Manager about expense budgets

In the config.php file of your installation add the following option:
---------------------------------------------
$config["projects_alert_thresholds"]="75,100";
---------------------------------------------
This will send mail alerts when threshold is 75% and 100% is reached.
- Email alerts are only send when the projects has a manager who has an email address.
- If an email about a higher threshold is already send the lower threshold mail wont be send anymore.
- A cronjob that run every 5 minutes will send the email once per hour when necessary (if the minutes of that hour are below 9)


2. Add new user fees to a project

Give a GroupOffice user book permission on the project type
Go to: Administration -> types -> double click a type -> Book permission -> Add a user or group
When added the user will show up in the "Default fee" tab
