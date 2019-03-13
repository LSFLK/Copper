<?php

namespace GO\Demodata\Controller;


class DemodataController extends \GO\Base\Controller\AbstractController {
	
	protected function allowGuests() {
		return array('create');
	}

	protected function actionCreate($params){
		
		
		if($this->isCli()){
			\GO::session()->runAsRoot();
		}elseif(!\GO::user()->isAdmin())
		{
			throw new \GO\Base\Exception\AccessDenied();
		}
	
		
		if(\GO::modules()->customfields){
			$customfieldModels = \GO\Customfields\CustomfieldsModule::getCustomfieldModels();

			
			$types = \GO\Customfields\CustomfieldsModule::getCustomfieldTypes();
			
			foreach($customfieldModels as $model){
			
//				echo $model->getName(),'<br />';
				$category = \GO\Customfields\Model\Category::model()->createIfNotExists(\GO::getModel($model->getName())->extendsModel(), "Demo Custom fields");
				$category->acl->addGroup(\GO::config()->group_internal, \GO\Base\Model\Acl::WRITE_PERMISSION);
				
				if(strpos(\GO::getModel($model->getName())->extendsModel(), 'Addressbook\\')){
					foreach($types as $t){
						\GO\Customfields\Model\Field::model()->createIfNotExists($category->id, $t['type'],array(
								'datatype'=>$t['className'],
								'helptext'=>($t['className']=="GO\Customfields\Customfieldtype\Text" ? "Some help text for this field" : "")
								));
					}
				}else
				{
					\GO\Customfields\Model\Field::model()->createIfNotExists($category->id, "Custom",array(
								'datatype'=>"GO\Customfields\Customfieldtype\Text",
								'helptext'=>"Some help text for this field"
								));
				}
			}
		}
		


		$addressbook = \GO\Addressbook\Model\Addressbook::model()->findSingleByAttribute('name', \GO::t("Customers", "addressbook"));
		if (!$addressbook) {
			$addressbook = new \GO\Addressbook\Model\Addressbook();
			$addressbook->setAttributes(array(
					'user_id' => 1,
					'name' => \GO::t("Prospects", "addressbook"),
					//				'default_iso_address_format' => $default_language,
					'default_salutation' => \GO::t("Default salutation", "addressbook")
			));
			$addressbook->save();
			$addressbook->acl->addGroup(\GO::config()->group_internal, \GO\Base\Model\Acl::WRITE_PERMISSION);
		}
	
		$company = \GO\Addressbook\Model\Company::model()->findSingleByAttribute('email', 'info@smith.demo');
		if (!$company) {
			$company = new \GO\Addressbook\Model\Company();
			$company->setAttributes(array(
					'addressbook_id' => $addressbook->id,
					'name' => 'Smith Inc',
					'address' => 'Kalverstraat',
					'address_no' => '1',
					'zip' => '1012 NX',
					'city' => 'Amsterdam',
					'state' => 'Noord-Holland',
					'country' => 'NL',
					'post_address' => 'Kalverstraat',
					'post_address_no' => '1',
					'post_zip' => '1012 NX',
					'post_city' => 'Amsterdam',
					'post_state' => 'Noord-Brabant',
					'post_country' => 'NL',
					'phone' => '+31 (0) 10 - 1234567',
					'fax' => '+31 (0) 1234567',
					'email' => 'info@smith.demo',
					'homepage' => 'http://www.smith.demo',
					'bank_no' => '',
					'vat_no' => 'NL 1234.56.789.B01',
					'user_id' => 1,
					'comment' => 'Just a demo company'
			));
			$company->save();
		}

		$john = \GO\Addressbook\Model\Contact::model()->findSingleByAttribute('email', 'john@smith.demo');
		if (!$john) {
			$john = new \GO\Addressbook\Model\Contact();
			$john->addressbook_id = $addressbook->id;
			$john->company_id = $company->id;
			$john->salutation = 'Dear Mr. Smith';
			$john->first_name = 'John';
			$john->last_name = 'Smith';
			$john->function = 'CEO';
			$john->cellular = '06-12345678';
			$john->email = 'john@smith.demo';
			$john->address = 'Kalverstraat';
			$john->address_no = '1';
			$john->zip = '1012 NX';
			$john->city = 'Amsterdam';
			$john->state = 'Noord-Holland';
			$john->country = 'NL';
			
			$john->url_facebook='http://www.facebook.com';
			$john->url_linkedin='http://www.linkedin.com';
			$john->url_twitter='http://www.twitter.com';
			$john->skype_name='echo123';
			
			$john->save();
			$john->setPhoto(new \GO\Base\Fs\File(\GO::modules()->addressbook->path . 'install/noperson.jpg'));
			$john->save();
		}

		$acme = \GO\Addressbook\Model\Company::model()->findSingleByAttribute('email', 'info@acme.demo');
		if (!$acme) {
			$acme = new \GO\Addressbook\Model\Company();
			$acme->setAttributes(array(
					'addressbook_id' => $addressbook->id,
					'name' => 'ACME Corporation',
					'address' => '1111 Broadway',
					'address_no' => '',
					'zip' => '10019',
					'city' => 'New York',
					'state' => 'NY',
					'country' => 'US',
					'post_address' => '1111 Broadway',
					'post_address_no' => '',
					'post_zip' => '10019',
					'post_city' => 'New York',
					'post_state' => 'NY',
					'post_country' => 'US',
					'phone' => '(555) 123-4567',
					'fax' => '(555) 123-4567',
					'email' => 'info@acme.demo',
					'homepage' => 'http://www.acme.demo',
					'bank_no' => '',
					'vat_no' => 'US 1234.56.789.B01',
					'user_id' => 1,
					'comment' => 'The name Acme became popular for businesses by the 1920s, when alphabetized business telephone directories such as the Yellow Pages began to be widespread. There were a flood of businesses named Acme (some of these still survive[1]). For example, early Sears catalogues contained a number of products with the "Acme" trademark, including anvils, which are frequently used in Warner Bros. cartoons.[2]'
			));
			$acme->save();

			$acme->addComment("The company is never clearly defined in Road Runner cartoons but appears to be a conglomerate which produces every product type imaginable, no matter how elaborate or extravagant - none of which ever work as desired or expected. In the Road Runner cartoon Beep, Beep, it was referred to as \"Acme Rocket-Powered Products, Inc.\" based in Fairfield, New Jersey. Many of its products appear to be produced specifically for Wile E. Coyote; for example, the Acme Giant Rubber Band, subtitled \"(For Tripping Road Runners)\".");
			$acme->addComment("Sometimes, Acme can also send living creatures through the mail, though that isn't done very often. Two examples of this are the Acme Wild-Cat, which had been used on Elmer Fudd and Sam Sheepdog (which doesn't maul its intended victim); and Acme Bumblebees in one-fifth bottles (which sting Wile E. Coyote). The Wild Cat was used in the shorts Don't Give Up the Sheep and A Mutt in a Rut, while the bees were used in the short Zoom and Bored.");
		}
		$wile = \GO\Addressbook\Model\Contact::model()->findSingleByAttribute('email', 'wile@acme.demo');
		if (!$wile) {
			$wile = new \GO\Addressbook\Model\Contact();
			$wile->addressbook_id = $addressbook->id;
			$wile->company_id = $acme->id;
			$wile->salutation = 'Dear Mr. Coyote';
			$wile->first_name = 'Wile';
			$wile->middle_name = 'E.';
			$wile->last_name = 'Coyote';
			$wile->function = 'CEO';
			$wile->cellular = '06-12345678';
			$wile->email = 'wile@acme.demo';
			$wile->address = '1111 Broadway';
			$wile->address_no = '';
			$wile->zip = '10019';
			$wile->city = 'New York';
			$wile->state = 'NY';
			$wile->country = 'US';
			
			$wile->url_facebook='http://www.facebook.com';
			$wile->url_linkedin='http://www.linkedin.com';
			$wile->url_twitter='http://www.twitter.com';
			$wile->skype_name='test';

			$wile->save();
			$wile->setPhoto(new \GO\Base\Fs\File(\GO::modules()->addressbook->path . 'install/wecoyote.png'));
			$wile->save();

			$wile->addComment("Wile E. Coyote (also known simply as \"The Coyote\") and The Road Runner are a duo of cartoon characters from a series of Looney Tunes and Merrie Melodies cartoons. The characters (a coyote and Greater Roadrunner) were created by animation director Chuck Jones in 1948 for Warner Bros., while the template for their adventures was the work of writer Michael Maltese. The characters star in a long-running series of theatrical cartoon shorts (the first 16 of which were written by Maltese) and occasional made-for-television cartoons.");

			$wile->addComment("In each episode, instead of animal senses and cunning, Wile E. Coyote uses absurdly complex contraptions (sometimes in the manner of Rube Goldberg) and elaborate plans to pursue his quarry. It was originally meant to parody chase cartoons like Tom and Jerry, but became popular in its own right, much to Jones' chagrin.");

			$file = new \GO\Base\Fs\File(\GO::modules()->addressbook->path . 'install/Demo letter.docx');
			$copy = $file->copy($wile->filesFolder->fsFolder);

			$wile->filesFolder->addFile($copy->name());
		}


		$internalUserGroup = \GO\Base\Model\Group::model()->findByPk(\GO::config()->group_internal);
		

		\GO::config()->password_validate=false;

		$elmer = \GO\Base\Model\User::model()->findSingleByAttribute('username', 'elmer');
		if (!$elmer) {
			$elmer = new \GO\Base\Model\User();
			$elmer->username = 'elmer';
			$elmer->displayName = 'Elmer Fudd';
			$elmer->email = 'elmer@acmerpp.demo';
			$elmer->password='demopass';
			if ($elmer->save(true)) {
				
				//make sure he's member of the internal group.
				$internalUserGroup->addUser($elmer->id);
				
				$this->_setUserContact($elmer);
				$elmer->checkDefaultModels();
			}else
			{
				var_dump($elmer->getValidationErrors());
				exit();
			}
		}
		



		$demo = \GO\Base\Model\User::model()->findSingleByAttribute('username', 'demo');
		if (!$demo) {
			$demo = new \GO\Base\Model\User();
			$demo->username = 'demo';
			$demo->displayName = 'Demo User';
			$demo->email = 'demo@acmerpp.demo';
			$demo->password='demopass';
			if ($demo->save(true)) {
				
				//make sure he's member of the internal group.
				$internalUserGroup->addUser($demo->id);
				
				$this->_setUserContact($demo);
				$demo->checkDefaultModels();
			}else
			{
				var_dump($demo->getValidationErrors());
				exit();
			}
		}


		$linda = \GO\Base\Model\User::model()->findSingleByAttribute('username', 'linda');
		if (!$linda) {
			$linda = new \GO\Base\Model\User();
			$linda->username = 'linda';
      $linda->displayName = 'Linda Smith';
			$linda->email = 'linda@acmerpp.demo';
			$linda->password='demopass';
							
			if ($linda->save(true)) {
				
				//make sure she's member of the internal group.
				$internalUserGroup->addUser($linda->id);
				
				$this->_setUserContact($linda);
				$linda->checkDefaultModels();
			}else
			{
				var_dump($linda->getValidationErrors());
				exit();
			}
		}

		if (\GO::modules()->calendar) {
			
			//share calendars
			\GO\Calendar\Model\Calendar::model()->getDefault($demo)->acl->addGroup(\GO::config()->group_internal, \GO\Base\Model\Acl::READ_PERMISSION);
			\GO\Calendar\Model\Calendar::model()->getDefault($elmer)->acl->addGroup(\GO::config()->group_internal,\GO\Base\Model\Acl::READ_PERMISSION);
			\GO\Calendar\Model\Calendar::model()->getDefault($linda)->acl->addGroup(\GO::config()->group_internal,\GO\Base\Model\Acl::READ_PERMISSION);

			$events = array(
					array('Project meeting', 10),
					array('Meet Wile', 12),
					array('MT Meeting', 14)
			);
			
			//start on tuesday.
			$time = \GO\Base\Util\Date::date_add(\GO\Base\Util\Date::get_last_sunday(time()),2);

			foreach ($events as $e) {
				$event = new \GO\Calendar\Model\Event();
				$event->name = $e[0];
				$event->location = "ACME NY Office";
				$event->start_time = \GO\Base\Util\Date::clear_time($time, $e[1]);
				$event->end_time = $event->start_time + 3600;
				$event->user_id = $demo->id;
				$event->calendar_id = \GO\Calendar\Model\Calendar::model()->getDefault($demo)->id;
				$event->save();

				$participant = new \GO\Calendar\Model\Participant();
				$participant->is_organizer = true;
				$participant->setContact($demo->createContact());
				$event->addParticipant($participant);

				$participant = new \GO\Calendar\Model\Participant();
				$participant->setContact($linda->createContact());
				$event->addParticipant($participant);

				$participant = new \GO\Calendar\Model\Participant();
				$participant->setContact($elmer->createContact());
				$event->addParticipant($participant);


				$participant = new \GO\Calendar\Model\Participant();
				$participant->setContact($wile);
				$event->addParticipant($participant);

				$wile->link($event);
			}

			

			$events = array(
					array('Project meeting', 11),
					array('Meet John', 13),
					array('MT Meeting', 16)
			);

			foreach ($events as $e) {
				$event = new \GO\Calendar\Model\Event();
				$event->name = $e[0];
				$event->location = "ACME NY Office";
				$event->start_time = \GO\Base\Util\Date::date_add(\GO\Base\Util\Date::clear_time($time, $e[1]), 1);
				$event->end_time = $event->start_time + 3600;
				$event->user_id = $linda->id;
				$event->calendar_id = \GO\Calendar\Model\Calendar::model()->getDefault($linda)->id;
				$event->save();

				$participant = new \GO\Calendar\Model\Participant();
				$participant->is_organizer = true;
				$participant->setContact($linda->createContact());
				$event->addParticipant($participant);


				$participant = new \GO\Calendar\Model\Participant();
				$participant->setContact($demo->createContact());
				$event->addParticipant($participant);


				$participant = new \GO\Calendar\Model\Participant();
				$participant->setContact($john);
				$event->addParticipant($participant);

				$john->link($event);
			}
			
			
			
			$events = array(
					array('Rocket testing', 8),
					array('Blast impact test', 15),
					array('Test range extender', 19)
			);

			foreach ($events as $e) {
				$event = new \GO\Calendar\Model\Event();
				$event->name = $e[0];
				$event->location = "ACME Testing fields";
				$event->start_time = \GO\Base\Util\Date::date_add(\GO\Base\Util\Date::clear_time(time(), $e[1]), 1);
				$event->end_time = $event->start_time + 3600;
				$event->user_id = $linda->id;
				$event->calendar_id = \GO\Calendar\Model\Calendar::model()->getDefault($linda)->id;
				$event->save();

				$participant = new \GO\Calendar\Model\Participant();
				$participant->is_organizer = true;
				$participant->setContact($linda->createContact());
				$event->addParticipant($participant);


				$participant = new \GO\Calendar\Model\Participant();
				$participant->setContact($demo->createContact());
				$event->addParticipant($participant);


				$participant = new \GO\Calendar\Model\Participant();
				$participant->setContact($john);
				$event->addParticipant($participant);

				$john->link($event);
			}
			
			
			$view = new \GO\Calendar\Model\View();
			$view->name=\GO::t("Everyone");
			if($view->save()){
				$view->addManyMany('groups', \GO::config()->group_everyone);
			
				//share view
				$view->acl->addGroup(\GO::config()->group_internal);
			}
			
			
			$view = new \GO\Calendar\Model\View();
			$view->name=\GO::t("Everyone").' ('.\GO::t("Merge", "calendar").')';
			$view->merge=true;
			$view->owncolor=true;
			if($view->save()){
				$view->addManyMany('groups', \GO::config()->group_everyone);
			
				//share view
				$view->acl->addGroup(\GO::config()->group_internal);
			}
			
			
			//resource groups
			$resourceGroup = \GO\Calendar\Model\Group::model()->findSingleByAttribute('name', "Meeting rooms");
			if(!$resourceGroup){
				$resourceGroup = new \GO\Calendar\Model\Group();
				$resourceGroup->name="Meeting rooms";
				$resourceGroup->save();
				
				//$resourceGroup->acl->addGroup(\GO::config()->group_internal);
								
			}
			
			$resourceCalendar = \GO\Calendar\Model\Calendar::model()->findSingleByAttribute('name', 'Road Runner Room');
			if(!$resourceCalendar){
				$resourceCalendar = new \GO\Calendar\Model\Calendar();
				$resourceCalendar->group_id=$resourceGroup->id;
				$resourceCalendar->name='Road Runner Room';
				$resourceCalendar->save();
				$resourceCalendar->acl->addGroup(\GO::config()->group_internal);
			}
			
			$resourceCalendar = \GO\Calendar\Model\Calendar::model()->findSingleByAttribute('name', 'Don Coyote Room');
			if(!$resourceCalendar){
				$resourceCalendar = new \GO\Calendar\Model\Calendar();
				$resourceCalendar->group_id=$resourceGroup->id;
				$resourceCalendar->name='Don Coyote Room';
				$resourceCalendar->save();
				$resourceCalendar->acl->addGroup(\GO::config()->group_internal);
			}
			
			
			//setup elmer as a resource admin
			$resourceGroup->addManyMany('admins', $elmer->id);
			
			
		}
		
		if(\GO::modules()->tasks){			
			$task = new \GO\Tasks\Model\Task();
			$task->tasklist_id=  \GO\Tasks\Model\Tasklist::model()->getDefault($demo)->id;
			$task->name='Feed the dog';
			$task->start_time=time();
			$task->due_time=\GO\Base\Util\Date::date_add(time(),2);
			$task->save();			
			
			
			$task = new \GO\Tasks\Model\Task();
			$task->tasklist_id=  \GO\Tasks\Model\Tasklist::model()->getDefault($linda)->id;
			$task->name='Feed the dog';
			$task->start_time=time();
			$task->due_time=\GO\Base\Util\Date::date_add(time(),1);
			$task->save();			
			
			$task = new \GO\Tasks\Model\Task();
			$task->tasklist_id=  \GO\Tasks\Model\Tasklist::model()->getDefault($elmer)->id;
			$task->name='Feed the dog';
			$task->start_time=time();
			$task->due_time=\GO\Base\Util\Date::date_add(time(),1);
			$task->save();
			
			
			
			$task = new \GO\Tasks\Model\Task();
			$task->tasklist_id=  \GO\Tasks\Model\Tasklist::model()->getDefault($demo)->id;
			$task->name='Prepare meeting';
			$task->start_time=time();
			$task->due_time=\GO\Base\Util\Date::date_add(time(),1);
			$task->save();			
			$task->link($wile);
			$task->link($event);
			
			
			$task = new \GO\Tasks\Model\Task();
			$task->tasklist_id=  \GO\Tasks\Model\Tasklist::model()->getDefault($linda)->id;
			$task->name='Prepare meeting';
			$task->start_time=time();
			$task->due_time=\GO\Base\Util\Date::date_add(time(),1);
			$task->save();			
			$task->link($wile);
			$task->link($event);
			
			$task = new \GO\Tasks\Model\Task();
			$task->tasklist_id=  \GO\Tasks\Model\Tasklist::model()->getDefault($elmer)->id;
			$task->name='Prepare meeting';
			$task->start_time=time();
			$task->due_time=\GO\Base\Util\Date::date_add(time(),1);
			$task->save();
			$task->link($wile);
			$task->link($event);
		}
		

		if(\GO::modules()->billing){		
			
			$rocket = \GO\Billing\Model\Product::model()->findSingleByAttribute('article_id', '12345');
			if (!$rocket) {
				$rocket = new \GO\Billing\Model\Product();
				$rocket->article_id=12345;
				$rocket->supplier_company_id=$acme->id;
				$rocket->unit='pcs';
				$rocket->cost_price=1000;
				$rocket->list_price=2999.99;
				$rocket->total_price=2999.99;
				$rocket->vat=0;
				if(!$rocket->save())
					var_dump($rocket->getValidationErrors ());
			
			
			
			
				$lang = new \GO\Billing\Model\ProductLanguage();
				$lang->language_id=1;
				$lang->product_id=$rocket->id;
				$lang->name='Master Rocket 1000';
				$lang->description='Master Rocket 1000. The ultimate rocket to blast rocky mountains.';
				$lang->save();
			}
			
			$rocketLauncher = \GO\Billing\Model\Product::model()->findSingleByAttribute('article_id', '234567');
			if (!$rocketLauncher) {
				$rocketLauncher = new \GO\Billing\Model\Product();
				$rocketLauncher->article_id=234567;
				$rocketLauncher->supplier_company_id=$acme->id;
				$rocketLauncher->unit='pcs';
				$rocketLauncher->cost_price=3000;
				$rocketLauncher->list_price=8999.99;
				$rocketLauncher->total_price=8999.99;
				$rocketLauncher->vat=0;
				if(!$rocketLauncher->save())
					var_dump($rocket->getValidationErrors ());



				$lang = new \GO\Billing\Model\ProductLanguage();
				$lang->language_id=1;
				$lang->product_id=$rocketLauncher->id;
				$lang->name='Rocket Launcher 1000';
				$lang->description='Rocket Launcher 1000. Required to launch rockets.';
				$lang->save();
			}
		
			$books = \GO\Billing\Model\Book::model()->find();
			foreach($books as $book){			
				
				//give demo access
				$book->acl->addGroup(\go\modules\core\groups\model\Group::find()->where(['isUserGroupFor' => $demo->id])->single()->id, \GO\Base\Model\Acl::WRITE_PERMISSION);
				$book->acl->addGroup(\go\modules\core\groups\model\Group::find()->where(['isUserGroupFor' => $elmer->id])->single()->id, \GO\Base\Model\Acl::WRITE_PERMISSION);
				
				
				$order = new \GO\Billing\Model\Order();
				$order->book_id=$book->id;
				$order->btime=time();
				$order->setCustomerFromContact($john);			
				$order->setCustomerFromCompany($company);			
				$order->save();

				$order->addProduct($rocketLauncher, 1);
				$order->addProduct($rocket, 4);
				
				$status = $book->statuses(\GO\Base\Db\FindParams::newInstance()->single());
				$order->status_id=$status->id;
				$order->syncItems();
				
				
				
				$order = new \GO\Billing\Model\Order();
				$order->book_id=$book->id;
				$order->btime=time();
				$order->setCustomerFromContact($wile);			
				$order->setCustomerFromCompany($acme);			
				$order->save();

				$order->addProduct($rocketLauncher, 1);
				$order->addProduct($rocket, 10);
				
				$status = $book->statuses(\GO\Base\Db\FindParams::newInstance()->single());
				$order->status_id=$status->id;
				$order->syncItems();
			}			
		}
		
		if(\GO::modules()->tickets){	
			$ticket = new \GO\Tickets\Model\Ticket();
			$ticket->subject='Malfunctioning rockets';
			$ticket->setFromContact($wile);
			if(!$ticket->save()){
				var_dump($ticket->getValidationErrors());
				exit();
			}
			
			$message = new \GO\Tickets\Model\Message();
			$message->sendEmail=false;
			$message->content="My rocket always circles back right at me? How do I aim right?";
			$message->is_note=false;			
			$message->user_id=0;
			$ticket->addMessage($message);
			
			//elmer picks up the ticket
			$ticket->agent_id=$elmer->id;
			$ticket->save();
			
			//make elmer and demo a ticket agent
			$ticket->type->acl->addGroup(\go\modules\core\groups\model\Group::find()->where(['isUserGroupFor' => $elmer->id])->single()->id, \GO\Base\Model\Acl::MANAGE_PERMISSION);
			$ticket->type->acl->addGroup(\go\modules\core\groups\model\Group::find()->where(['isUserGroupFor' => $demo->id])->single()->id, \GO\Base\Model\Acl::MANAGE_PERMISSION);
			
				
			
			
			$message = new \GO\Tickets\Model\Message();
			$message->sendEmail=false;
			$message->content="Haha, good thing he doesn't know Accelleratii Incredibus designed this rocket and he can't read this note.";
			$message->is_note=true;		
			$message->user_id=$elmer->id;
			$ticket->addMessage($message);
			
			
			$message = new \GO\Tickets\Model\Message();
			$message->sendEmail=false;
			$message->content="Gee I don't know how that can happen. I'll send you some new ones!";
			$message->is_note=false;			
			$message->status_id=\GO\Tickets\Model\Ticket::STATUS_CLOSED;
			$message->has_status=true;
			$message->user_id=$elmer->id;
			$ticket->addMessage($message);			
			
			
			
			
			
			$ticket = new \GO\Tickets\Model\Ticket();
			$ticket->subject='Can I speed up my rockets?';
			$ticket->setFromContact($wile);
			$ticket->ctime=$ticket->mtime=\GO\Base\Util\Date::date_add(time(), -2);
			
			if(!$ticket->save()){
				var_dump($ticket->getValidationErrors());
				exit();
			}
			
			$message = new \GO\Tickets\Model\Message();
			$message->sendEmail=false;
			$message->content="The rockets are too slow to hit my fast moving target. Is there a way to speed them up?";
			$message->is_note=false;			
			$message->user_id=0;
			$message->ctime=$message->mtime=\GO\Base\Util\Date::date_add(time(), -2);
			$ticket->addMessage($message);
			
			//elmer picks up the ticket
//			$ticket->agent_id=$elmer->id;
//			$ticket->save();
			
		
			
			
			$message = new \GO\Tickets\Model\Message();
			$message->sendEmail=false;
			$message->content="Please respond faster. Can't you see this ticket is marked in red?";
			$message->is_note=false;			
			$message->user_id=0;
			$ticket->addMessage($message);	
			
			
			if(!\GO::modules()->isInstalled('site') && \GO::modules()->isAvailable('site')){
				$module = new \GO\Base\Model\Module();
				$module->name='site';			
				$module->save();
			}
			
			if(!\GO::modules()->isInstalled('defaultsite') && \GO::modules()->isAvailable('defaultsite')){
				$module = new \GO\Base\Model\Module();
				$module->name='defaultsite';			
				$module->save();
			}
			
			$settings = \GO\Tickets\Model\Settings::model()->findModel();
			$settings->enable_external_page=true;
			$settings->use_alternative_url=true;
			$settings->allow_anonymous=true;
			$settings->alternative_url = \GO::config()->full_url.'modules/site/index.php?r=tickets/externalpage/ticket';
			$settings->save();
			
			
			if(\GO::modules()->summary){
				
				$title = "Submit support ticket";
			
				$announcement = \GO\Summary\Model\Announcement::model()->findSingleByAttribute('title',$title);
				if(!$announcement){


					$newTicketUrl = \GO::config()->full_url.'modules/site/index.php?r=tickets/externalpage/newTicket';

					$announcement = new \GO\Summary\Model\Announcement();
					$announcement->title=$title;
					$announcement->content='Anyone can submit tickets to the support system here:'.
									'<br /><br /><a href="'.$newTicketUrl.'">'.$newTicketUrl.'</a><br /><br />Anonymous ticket posting can be disabled in the ticket module settings.';

					if($announcement->save()){			
						$announcement->acl->addGroup(\GO::config()->group_everyone);
					}
				}
			}
			
		}
		
//		
//		if(\GO::modules()->notes){
//			
//			$category = \GO\Notes\Model\Category::model()->findSingleByAttribute('name', \GO::t("General", "notes"));
//			
//			if(!$category){
//				$category = new \GO\Notes\Model\Category();
//				$category->name=\GO::t("General", "notes");
//				$category->save();
//				$category->acl->addGroup(\GO::config()->group_everyone, \GO\Base\Model\Acl::READ_PERMISSION);
//			}
//			
//			
//			$note = new \GO\Notes\Model\Note();
//			$note->user_id=$elmer->id;			
//			
//			//$category = \GO\Notes\Model\Category::model()->getDefault($elmer);
//			
//			$note->category_id=$category->id;
//			
//			$note->name="Laws and rules";
//			$note->content='As in other cartoons, the Road Runner and the coyote follow the laws of cartoon physics. For example, the Road Runner has the ability to enter the painted image of a cave, while the coyote cannot (unless there is an opening through which he can fall). Sometimes, however, this is reversed, and the Road Runner can burst through a painting of a broken bridge and continue on his way, while the Coyote will instead enter the mirage painting and fall down the precipice of the cliff where the bridge is out. Sometimes the coyote is allowed to hang in midair until he realizes that he is about to plummet into a chasm (a process occasionally referred to elsewhere as Road-Runnering or Wile E. Coyote moment). The coyote can overtake rocks (or cannons) which fall earlier than he does, and end up being squashed by them. If a chase sequence happens upon a cliff, the Road Runner is not affected by gravity, whereas the Coyote will realize his error eventually and fall to the ground below. A chase sequence that happens upon railroad tracks will always result in the Coyote being run over by a train. If the Coyote uses an explosive (for instance, dynamite) that is triggered by a mechanism that is supposed to force the explosive in a forward motion toward its target, the actual mechanism itself will always shoot forward, leaving the explosive behind to detonate in the Coyote\'s face. Similarly, a complex apparatus that is supposed to propel an object like a boulder or steel ball forward, or trigger a trap, will not work on the Road Runner, but always will on the Coyote. For instance, the Road Runner can jump up and down on the trigger of a large animal trap and eat bird seed off from it, going completely unharmed and not setting off the trap; when the Coyote places the tiniest droplet of oil on the trigger, the trap snaps shut on him without fail. At certain times, the Coyote may don an exquisite Acme costume or propulsion device that briefly allows him to catch up to the Road Runner. This will always result in him losing track of his proximity to large cliffs or walls, and the Road Runner will dart around an extremely sharp turn on a cliff, but the Coyote will rocket right over the edge and fall to the ground.
//
//In his book Chuck Amuck: The Life and Times Of An Animated Cartoonist,[13] Chuck Jones claimed that he and the artists behind the Road Runner and Wile E. cartoons adhered to some simple but strict rules:
//
//The Road Runner cannot harm the Coyote except by going "beep, beep."
//No outside force can harm the Coyote — only his own ineptitude or the failure of Acme products. Trains and trucks were the exception from time to time.
//The Coyote could stop anytime — if he were not a fanatic. (Repeat: "A fanatic is one who redoubles his effort when he has forgotten his aim." — George Santayana).
//Dialogue must never be used, except "beep, beep" and yowling in pain. (This rule, however, was violated in some cartoons.)
//The Road Runner must stay on the road — for no other reason than that he\'s a roadrunner. This rule was broken in Beep, Beep, in a sequence where Wile E. chased the Road Runner into a cactus mine. And also in Fastest with the Mostestwhen Coyote lures Road Runner to the edge of a cliff.
//All action must be confined to the natural environment of the two characters — the southwest American desert.
//All (or at least almost all) tools, weapons, or mechanical conveniences must be obtained from the Acme Corporation. There were sometimes exceptions when the Coyote obtained other items from the desert such as boulders to use in his attempts.
//Whenever possible, make gravity the Coyote\'s greatest enemy (e.g., falling off a cliff).
//The Coyote is always more humiliated than harmed by his failures.
//The audience\'s sympathy must remain with the Coyote.
//The Coyote is not allowed to catch or eat the Road Runner, unless he escapes from the grasp. (The robot that the Coyote created in The Solid Tin Coyote caught the Road Runner so this does not break this rule. The Coyote does catch the Road Runner in Soup or Sonic but is too small to eat him. There is also two CGI shorts on The Looney Tunes Show were he caught the bird, but was not able to eat him because the Road Runner got away in both shorts.)';
//			
//			$note->save();
//			$note->link($john);
//			
//			
//			$note = new \GO\Notes\Model\Note();
//			$note->user_id=$demo->id;			
//			
//			$note->category_id=$category->id;
//			
//			$note->name="Wile E. Coyote and Bugs Bunny";
//			$note->content='Wile E. Coyote has also unsuccessfully attempted to catch and eat Bugs Bunny in another series of cartoons. In these cartoons, the coyote takes on the guise of a self-described "super genius" and speaks with a smooth, generic upper-class accent provided by Mel Blanc. While he is incredibly intelligent, he is limited by technology and his own short-sighted arrogance, and is thus often easily outsmarted, a somewhat physical symbolism of "street smarts" besting "book smarts".
//
//In one short (Hare-Breadth Hurry, 1963), Bugs Bunny — with the help of "speed pills" — even stands in for Road Runner, who has "sprained a giblet", and carries out the duties of outsmarting the hungry scavenger. That is the only Bugs Bunny/Wile E. Coyote short in which the coyote does not speak. As usual Wile E. Coyote ends up falling down a canyon. In a later, made-for-TV short, which had a young Elmer Fudd chasing a young Bugs Bunny, Elmer also falls down a canyon. On the way down he is overtaken by Wile E. Coyote who shows a sign telling Elmer to get out of the way for someone who is more experienced in falling.';
//			
//			$note->save();
//			
//			$note->link($wile);
//		}
		
		
		if(\GO::modules()->summary){
			$title = "Welcome to ".\GO::config()->product_name;
			
			$announcement = \GO\Summary\Model\Announcement::model()->findSingleByAttribute('title',$title);
			if(!$announcement){
				$announcement = new \GO\Summary\Model\Announcement();
				$announcement->title=$title;
				$announcement->content='This is a demo announcements that administrators can set.<br />Have a look around.<br /><br />We hope you\'ll enjoy Group-Office as much as we do!';

				if($announcement->save()){			
					$announcement->acl->addGroup(\GO::config()->group_everyone);
				}
			}
		}
		
		
		if(\GO::modules()->files){
			
			$demoHome = \GO\Files\Model\Folder::model()->findHomeFolder($demo);
			$file = new \GO\Base\Fs\File(\GO::modules()->files->path.'install/templates/empty.docx');
			$copy = $file->copy($demoHome->fsFolder);
			
			$file = new \GO\Base\Fs\File(\GO::modules()->files->path.'install/templates/empty.odt');
			$copy = $file->copy($demoHome->fsFolder);
			
			
			$file = new \GO\Base\Fs\File(\GO::modules()->addressbook->path . 'install/Demo letter.docx');
			$copy = $file->copy($demoHome->fsFolder);
			
			
			$file = new \GO\Base\Fs\File(\GO::modules()->addressbook->path . 'install/wecoyote.png');
			$copy = $file->copy($demoHome->fsFolder);
			
			$file = new \GO\Base\Fs\File(\GO::modules()->addressbook->path . 'install/noperson.jpg');
			$copy = $file->copy($demoHome->fsFolder);
			
			//add files to db.
			$demoHome->syncFilesystem();
			
			
		}
		
		
		if(\GO::modules()->projects){
			
			$templates = \GO\Projects\Model\Template::model()->find();
			
			$folderTemplate = $templates->fetch();
			$projectTemplate = $templates->fetch();
			
			$status = \GO\Projects\Model\Status::model()->findSingle();
			
			$type = \GO\Projects\Model\Type::model()->findSingleByAttribute('name', 'Demo');
			if(!$type){
				$type = new \GO\Projects\Model\Type();
				$type->name='Demo';
				if(!$type->save())
				{
					var_dump($type->getValidationErrors());
					exit();
				}
				$type->acl->addGroup(\GO::config()->group_internal, \GO\Base\Model\Acl::WRITE_PERMISSION);
			}
			
			
			$folderProject = \GO\Projects\Model\Project::model()->findSingleByAttribute('name','Demo');
			if(!$folderProject){
				$folderProject = new \GO\Projects\Model\Project();
				$folderProject->name='Demo';
				$folderProject->description='Just a placeholder for sub projects.';
				$folderProject->template_id=$folderTemplate->id;
				$folderProject->type_id=$type->id;
				$folderProject->status_id=$status->id;
				if(!$folderProject->save()){
						var_dump($folderProject->getValidationErrors());
					exit();
				}
				
			}
			
			
			$rocketProject = \GO\Projects\Model\Project::model()->findSingleByAttribute('name','[001] Develop Rocket 2000');
			if(!$rocketProject){
				$rocketProject = new \GO\Projects\Model\Project();
				$rocketProject->type_id=$type->id;
				$rocketProject->status_id=$status->id;
				$rocketProject->name='[001] Develop Rocket 2000';
				$rocketProject->description='Better range and accuracy';
				$rocketProject->template_id=$projectTemplate->id;
				$rocketProject->parent_project_id=$folderProject->id;
				$rocketProject->start_time=time();
				$rocketProject->due_time=\GO\Base\Util\Date::date_add(time(),0,1);
				$rocketProject->company_id=$acme->id;
				$rocketProject->contact_id=$wile->id;
				$rocketProject->save();
			}
			
			$launcherProject = \GO\Projects\Model\Project::model()->findSingleByAttribute('name','[001] Develop Rocket Launcher');
			if(!$launcherProject){
				$launcherProject = new \GO\Projects\Model\Project();
				$launcherProject->type_id=$type->id;
				$launcherProject->status_id=$status->id;
				$launcherProject->name='[001] Develop Rocket Launcher';
				$launcherProject->description='Better range and accuracy';
				$launcherProject->template_id=$projectTemplate->id;
				$launcherProject->parent_project_id=$folderProject->id;
				$launcherProject->start_time=time();
				$launcherProject->due_time=\GO\Base\Util\Date::date_add(time(),0,1);
				$launcherProject->company_id=$acme->id;
				$launcherProject->contact_id=$wile->id;
				$launcherProject->save();
			}
			
		}
		
		
		
		
			
		if(\GO::modules()->projects2){
			
			
			if(!\GO\Projects2\Model\Employee::model()->count()){
			
				$employee = new \GO\Projects2\Model\Employee();
				$employee->user_id=$elmer->id;
				$employee->external_fee=120;
				$employee->internal_fee=60;
				$employee->save();

				$employee = new \GO\Projects2\Model\Employee();
				$employee->user_id=$demo->id;
				$employee->external_fee=80;
				$employee->internal_fee=40;
				$employee->save();

				$employee = new \GO\Projects2\Model\Employee();
				$employee->user_id=$linda->id;
				$employee->external_fee=90;
				$employee->internal_fee=45;
				$employee->save();
			}else
			{
				$employee = \GO\Projects2\Model\Employee::model()->findSingle();
			}
			
			
			$templates = \GO\Projects2\Model\Template::model()->find();
			
			$folderTemplate = $templates->fetch();
			$projectTemplate = $templates->fetch();
			
			$status = \GO\Projects2\Model\Status::model()->findSingle();
			
			$type = \GO\Projects2\Model\Type::model()->findSingleByAttribute('name', 'Demo');
			if(!$type){
				$type = new \GO\Projects2\Model\Type();
				$type->name='Demo';
				if(!$type->save())
				{
					var_dump($type->getValidationErrors());
					exit();
				}
				$type->acl->addGroup(\GO::config()->group_internal, \GO\Base\Model\Acl::WRITE_PERMISSION);
			}
			
			
			$folderProject = \GO\Projects2\Model\Project::model()->findSingleByAttribute('name','Demo');
			if(!$folderProject){
				$folderProject = new \GO\Projects2\Model\Project();
				$folderProject->name='Demo';
				$folderProject->start_time=time();
				$folderProject->description='Just a placeholder for sub projects.';
				$folderProject->template_id=$folderTemplate->id;
				$folderProject->type_id=$type->id;
				$folderProject->status_id=$status->id;
				if(!$folderProject->save()){
						var_dump($folderProject->getValidationErrors());
					exit();
				}
				
			}
			
			
			$rocketProject = \GO\Projects2\Model\Project::model()->findSingleByAttribute('name','[001] Develop Rocket 2000');
			if(!$rocketProject){
				$rocketProject = new \GO\Projects2\Model\Project();
				$rocketProject->type_id=$type->id;
				$rocketProject->status_id=$status->id;
				$rocketProject->name='[001] Develop Rocket 2000';
				$rocketProject->description='Better range and accuracy';
				$rocketProject->template_id=$projectTemplate->id;
				$rocketProject->parent_project_id=$folderProject->id;
				$rocketProject->start_time=time();
				$rocketProject->due_time=\GO\Base\Util\Date::date_add(time(),0,1);
				$rocketProject->company_id=$acme->id;
				$rocketProject->contact_id=$wile->id;
//				$rocketProject->budget=20000;
				$rocketProject->save();
				
				$resource = new \GO\Projects2\Model\Resource();
				$resource->project_id=$rocketProject->id;
				$resource->user_id=$demo->id;
				$resource->budgeted_units=100;
				$resource->external_fee=80;
				$resource->internal_fee=40;
				$resource->save();
				
				$resource = new \GO\Projects2\Model\Resource();
				$resource->project_id=$rocketProject->id;
				$resource->user_id=$elmer->id;
				$resource->budgeted_units=16;
				$resource->external_fee=120;
				$resource->internal_fee=60;
				$resource->save();
				
				$resource = new \GO\Projects2\Model\Resource();
				$resource->project_id=$rocketProject->id;
				$resource->user_id=$linda->id;
				$resource->budgeted_units=16;
				$resource->external_fee=90;
				$resource->internal_fee=45;
				$resource->save();
				
				
				$groupTask = new \GO\Projects2\Model\Task();
				$groupTask->project_id=$rocketProject->id;
				$groupTask->description='Design';
				$groupTask->duration=8*60;
				$groupTask->user_id=$demo->id;
				$groupTask->save();
				
				
				$task = new \GO\Projects2\Model\Task();
				$task->parent_id=$groupTask->id;
				$task->project_id=$rocketProject->id;
				$task->description='Functional design';
				$task->percentage_complete=100;
				$task->duration=8*60;
				$task->user_id=$demo->id;
				$task->save();
				
				$task = new \GO\Projects2\Model\Task();
				$task->parent_id=$groupTask->id;
				$task->project_id=$rocketProject->id;
				$task->description='Technical design';
				$task->percentage_complete=50;
				$task->duration=8*60;
				$task->user_id=$demo->id;
				$task->save();
				
				
				$groupTask = new \GO\Projects2\Model\Task();
				$groupTask->project_id=$rocketProject->id;
				$groupTask->description='Implementation';
				$groupTask->duration=8*60;
				$groupTask->user_id=$demo->id;
				$groupTask->save();
				
				
				$task = new \GO\Projects2\Model\Task();
				$task->parent_id=$groupTask->id;
				$task->project_id=$rocketProject->id;
				$task->description='Models';
				$task->duration=4*60;
				$task->user_id=$demo->id;
				$task->save();
				
				$task = new \GO\Projects2\Model\Task();
				$task->parent_id=$groupTask->id;
				$task->project_id=$rocketProject->id;
				$task->description='Controllers';
				$task->duration=2*60;
				$task->user_id=$demo->id;
				$task->save();
				
				$task = new \GO\Projects2\Model\Task();
				$task->parent_id=$groupTask->id;
				$task->project_id=$rocketProject->id;
				$task->description='Views';
				$task->duration=6*60;
				$task->user_id=$demo->id;
				$task->save();
				
				$groupTask = new \GO\Projects2\Model\Task();
				$groupTask->project_id=$rocketProject->id;
				$groupTask->description='Testing';
				$groupTask->duration=8*60;
				$groupTask->user_id=$demo->id;
				$groupTask->save();
				
				
				$task = new \GO\Projects2\Model\Task();
				$task->parent_id=$groupTask->id;
				$task->project_id=$rocketProject->id;
				$task->description='GUI';
				$task->duration=8*60;
				$task->user_id=$elmer->id;
				$task->save();
				
				$task = new \GO\Projects2\Model\Task();
				$task->parent_id=$groupTask->id;
				$task->project_id=$rocketProject->id;
				$task->description='Security';
				$task->duration=8*60;
				$task->user_id=$elmer->id;
				$task->save();
				
				
				$expenseBudget = new \GO\Projects2\Model\ExpenseBudget();
				$expenseBudget->description='Machinery';
				$expenseBudget->nett=10000;
				$expenseBudget->project_id=$rocketProject->id;
				$expenseBudget->save();
				
				$expense = new \GO\Projects2\Model\Expense();				
				$expense->description='Rocket fuel';
				$expense->project_id=$rocketProject->id;
				$expense->invoice_id = "1234";
				$expense->nett=3000;
				$expense->save();
				
				
				$expense = new \GO\Projects2\Model\Expense();				
				$expense->expense_budget_id=$expenseBudget->id;
				$expense->description='Fuse machine';
				$expense->invoice_id = "1235";
				$expense->project_id=$rocketProject->id;
				$expense->nett=2000;
				$expense->save();
			}
			
			$launcherProject = \GO\Projects2\Model\Project::model()->findSingleByAttribute('name','[001] Develop Rocket Launcher');
			if(!$launcherProject){
				$launcherProject = new \GO\Projects2\Model\Project();
				$launcherProject->type_id=$type->id;
				$launcherProject->status_id=$status->id;
				$launcherProject->name='[001] Develop Rocket Launcher';
				$launcherProject->description='Better range and accuracy';
				$launcherProject->template_id=$projectTemplate->id;
				$launcherProject->parent_project_id=$folderProject->id;
				$launcherProject->start_time=time();
				$launcherProject->due_time=\GO\Base\Util\Date::date_add(time(),0,1);
				$launcherProject->company_id=$acme->id;
				$launcherProject->contact_id=$wile->id;
				$launcherProject->save();
				
				
				$resource = new \GO\Projects2\Model\Resource();
				$resource->project_id=$launcherProject->id;
				$resource->user_id=$demo->id;
				$resource->external_fee=80;
				$resource->internal_fee=40;
				$resource->budgeted_units=16;
				$resource->save();
			}
			
			$folder = \GO\Files\Model\Folder::model()->findByPath('projects2/template-icons',true);
			$folder->syncFilesystem();
			
		}
		
		
		
		
		if(\GO::modules()->bookmarks){
			$category = \GO\Bookmarks\Model\Category::model()->findSingleByAttribute('name', \GO::t("General", "bookmarks"));
			
			if(!$category){
				$category = new \GO\Bookmarks\Model\Category();
				$category->name=\GO::t("General", "bookmarks");		
				$category->save();
				$category->acl->addGroup(\GO::config()->group_internal, \GO\Base\Model\Acl::READ_PERMISSION);
			}
			$bookmark = \GO\Bookmarks\Model\Bookmark::model()->findSingleByAttribute('name', 'Google Search');

			if(!$bookmark){
				$bookmark = new \GO\Bookmarks\Model\Bookmark();
				$bookmark->category_id=$category->id;
				$bookmark->name='Google Search';
				$bookmark->content='http://www.google.com';
				$bookmark->logo='icons/viewmag.png';
				$bookmark->public_icon=true;
				$bookmark->description='Search the web';
				$bookmark->open_extern=true;
				$bookmark->save();
			}
			
			$bookmark = \GO\Bookmarks\Model\Bookmark::model()->findSingleByAttribute('name', 'Wikipedia');

			if(!$bookmark){
				$bookmark = new \GO\Bookmarks\Model\Bookmark();
				$bookmark->category_id=$category->id;
				$bookmark->name='Wikipedia';
				$bookmark->content='http://www.wikipedia.com';
				$bookmark->logo='icons/agt_web.png';
				$bookmark->public_icon=true;
				$bookmark->description='The Free Encyclopedia';
				$bookmark->behave_as_module=true;
				$bookmark->save();
			}
		}
		
//		if(\GO::modules()->postfixadmin){
//			
//			
//			$domainModel= \GO\Postfixadmin\Model\Domain::model()->findSingleByAttribute('domain', 'acmerpp.demo');
//			if(!$domainModel){
//				$domainModel = new \GO\Postfixadmin\Model\Domain();
//				$domainModel->domain='acmerpp.demo';
//				$domainModel->save();
//			}
//				
//			$this->_createMailbox($domainModel, $demo);
//			$this->_createMailbox($domainModel, $elmer);
//			$this->_createMailbox($domainModel, $linda);
//			
//			
//		}
		
		if(\GO::modules()->savemailas){
			//link some demo mails
			$mimeFile = new \GO\Base\Fs\File(\GO::modules()->savemailas->path.'install/demo.eml');			
			\GO\Savemailas\Model\LinkedEmail::model()->createFromMimeFile($mimeFile, $wile);
			\GO\Savemailas\Model\LinkedEmail::model()->createFromMimeFile($mimeFile, $john);
			if(\GO::modules()->projects){
				\GO\Savemailas\Model\LinkedEmail::model()->createFromMimeFile($mimeFile, $rocketProject);
				\GO\Savemailas\Model\LinkedEmail::model()->createFromMimeFile($mimeFile, $launcherProject);
			}
			
			$mimeFile = new \GO\Base\Fs\File(\GO::modules()->savemailas->path.'install/demo2.eml');
			\GO\Savemailas\Model\LinkedEmail::model()->createFromMimeFile($mimeFile, $wile);
			\GO\Savemailas\Model\LinkedEmail::model()->createFromMimeFile($mimeFile, $john);
			if(\GO::modules()->projects){
				\GO\Savemailas\Model\LinkedEmail::model()->createFromMimeFile($mimeFile, $rocketProject);
				\GO\Savemailas\Model\LinkedEmail::model()->createFromMimeFile($mimeFile, $launcherProject);
			}
		}
		
		//useful for other modules to create stuff
		$this->fireEvent('demodata', array('users'=>array('demo'=>$demo, 'linda'=>$linda, 'elmer'=>$elmer)));
		
		if(\GO::modules()->demodata) {
			\GO::modules()->demodata->delete();
			
			GO()->rebuildCache();
		}
		
		if(!$this->isCli()){
			//login as demo				
			\GO::session()->restart();
			\GO::session()->setCurrentUser($demo->id);
			
			header('Location: ' .GO()->getSettings()->URL);
			exit();
		}		
	}
	
	
	private function _createMailbox($domainModel, $demo){
		$demoMailbox = \GO\Postfixadmin\Model\Mailbox::model()->findSingleByAttribute('username', $demo->email);
		if(!$demoMailbox){
			$demoMailbox = new \GO\Postfixadmin\Model\Mailbox();
			$demoMailbox->domain_id=$domainModel->id;
			$demoMailbox->username=$demo->email;
			$demoMailbox->password='demo';
			$demoMailbox->name=$demo->name;
			$demoMailbox->save();				
		}			

		$accountModel = \GO\Email\Model\Account::model()->findSingleByAttribute('username', $demoMailbox->username);
		if(!$accountModel){
			$accountModel = new \GO\Email\Model\Account();
			$accountModel->user_id=$demo->id;
//			$accountModel->checkImapConnectionOnSave=false;
			$accountModel->host = 'localhost';
			$accountModel->port = 143;

			$accountModel->username = $demoMailbox->username;
			$accountModel->password = 'demo';

			$accountModel->smtp_host = "localhost";
			$accountModel->smtp_port = 25;
			$accountModel->save();
			$accountModel->addAlias($accountModel->username, $demoMailbox->name);			
		}
		
		
		
		
		
		
		
		
		
	
		
		
		
		
	}

	private function _setUserContact($user) {
		$contact = $user->createContact();

		$company = \GO\Addressbook\Model\Company::model()->findSingleByAttribute('name', 'ACME Rocket Powered Products');
		if (!$company) {
			$company = new \GO\Addressbook\Model\Company();
			$company->setAttributes(array(
					'addressbook_id' => $contact->addressbook_id,
					'name' => 'ACME Rocket Powered Products',
					'address' => '1111 Broadway',
					'address_no' => '',
					'zip' => '10019',
					'city' => 'New York',
					'state' => 'NY',
					'country' => 'US',
					'post_address' => '1111 Broadway',
					'post_address_no' => '',
					'post_zip' => '10019',
					'post_city' => 'New York',
					'post_state' => 'NY',
					'post_country' => 'US',
					'phone' => '(555) 123-4567',
					'fax' => '(555) 123-4567',
					'email' => 'info@acmerpp.demo',
					'homepage' => 'http://www.acmerpp.demo',
					'bank_no' => '',
					'vat_no' => 'US 1234.56.789.B01',
					'user_id' => 1,
					'comment' => 'The name Acme became popular for businesses by the 1920s, when alphabetized business telephone directories such as the Yellow Pages began to be widespread. There were a flood of businesses named Acme (some of these still survive[1]). For example, early Sears catalogues contained a number of products with the "Acme" trademark, including anvils, which are frequently used in Warner Bros. cartoons.[2]'
			));
			$company->save();
		}

		$contact->company_id = $company->id;
		$contact->function = 'CEO';
		$contact->cellular = '06-12345678';
		$contact->address = '1111 Broadway';
		$contact->address_no = '';
		$contact->zip = '10019';
		$contact->city = 'New York';
		$contact->state = 'NY';
		$contact->country = 'US';
		$contact->save();
		
		
		
	}

}
