<?php

namespace GO\Tickets;


class TicketsModule extends \GO\Professional\Module{
	
	public function appCenter(){
		return true;
	}
	
	public function install() {
		parent::install();
		$template = new Model\Template();
		$template->name = \GO::t("Default response", "tickets");
		$template->content = \GO::t("Dear sir/madam
Thank you for your response,
{MESSAGE}
Please do not reply to this email. You must go to the following page to reply:
{LINK}
Best regards,
{NAME}.", "tickets");
		$template->autoreply=0;
		$template->default_template=1;
		$template->ticket_created_for_client=0;
		$template->save();
		
		$template = new Model\Template();
		$template->name = \GO::t("Default ticket created by client", "tickets");
		$template->content = \GO::t("Dear sir/madam
We have received your question and a ticket has been created.
We will respond as soon as possible.
The message you sent to us was:
---------------------------------------------------------------------------
{MESSAGE}
---------------------------------------------------------------------------
Please do not reply to this email. You must go to the following page to reply:
{LINK}
Best regards,
{NAME}.", "tickets");
		$template->autoreply=1;
		$template->default_template=0;
		$template->ticket_created_for_client=0;
		$template->save();
		
		$template = new Model\Template();
		$template->name = \GO::t("Default ticket created for client", "tickets");
		$template->content = \GO::t("Dear sir/madam
We have created a ticket for you.
We will respond as soon as possible.
The ticket is about:
---------------------------------------------------------------------------
{MESSAGE}
---------------------------------------------------------------------------
Please do not reply to this email. You must go to the following page to reply:
{LINK}
Best regards,
{NAME}.", "tickets");
		$template->autoreply=0;
		$template->default_template=0;
		$template->ticket_created_for_client=1;
		$template->save();
		
		
		$type = new Model\Type();
		$type->publish_on_site=true;
		$type->name=\GO::t("IT", "tickets");
		$type->save();
		
		$type->acl->addGroup(\GO::config()->group_everyone, \GO\Base\Model\Acl::WRITE_PERMISSION);
		
		$type = new Model\Type();
		$type->name=\GO::t("Sales", "tickets");
		$type->save();
		
		$type->acl->addGroup(\GO::config()->group_everyone, \GO\Base\Model\Acl::WRITE_PERMISSION);
		
		$status = new Model\Status();
		$status->name = \GO::t("In progress", "tickets");
		$status->save();
		
		$status = new Model\Status();
		$status->name = \GO::t("Not resolved", "tickets");
		$status->save();
		
		$settings = new Model\Settings();
		$settings->id=1;
		$settings->save();
		
		
		$cron = new \GO\Base\Cron\CronJob();
		
		$cron->name = 'Close inactive tickets';
		$cron->active = true;
		$cron->runonce = false;
		$cron->minutes = '0';
		$cron->hours = '2';
		$cron->monthdays = '*';
		$cron->months = '*';
		$cron->weekdays = '*';
		$cron->job = 'GO\Tickets\Cron\CloseInactive';

		$cron->save();
		
		
		$cron = new \GO\Base\Cron\CronJob();
		
		$cron->name = 'Ticket reminders';
		$cron->active = true;
		$cron->runonce = false;
		$cron->minutes = '*/5';
		$cron->hours = '*';
		$cron->monthdays = '*';
		$cron->months = '*';
		$cron->weekdays = '*';
		$cron->job = 'GO\Tickets\Cron\Reminder';

		$cron->save();
		
		$cron = new \GO\Base\Cron\CronJob();
		
		$cron->name = 'Import tickets from IMAP';
		$cron->active = true;
		$cron->runonce = false;
		$cron->minutes = '0,5,10,15,20,25,30,35,40,45,50,55';
		$cron->hours = '*';
		$cron->monthdays = '*';
		$cron->months = '*';
		$cron->weekdays = '*';
		$cron->job = 'GO\Tickets\Cron\ImportImap';

		$cron->save();
		
		$cron = new \GO\Base\Cron\CronJob();
		
		$cron->name = 'Sent tickets due reminder';
		$cron->active = true;
		$cron->runonce = false;
		$cron->minutes = '0';
		$cron->hours = '1';
		$cron->monthdays = '*';
		$cron->months = '*';
		$cron->weekdays = '*';
		$cron->job = 'GO\Tickets\Cron\DueMailer';

		$cron->save();
	}
	
	public function autoInstall() {
		return true;
	}
}
