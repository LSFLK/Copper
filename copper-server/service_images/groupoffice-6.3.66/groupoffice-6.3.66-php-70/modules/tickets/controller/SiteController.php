<?php

/*
 * Copyright Intermesh BV.
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 */

/**
 * The Site controller
 *
 * @package GO.modules.Tickets
 * @version $Id: SiteController.php 23127 2018-01-12 10:43:59Z mschering $
 * @copyright Copyright Intermesh BV.
 * @author Wesley Smits wsmits@intermesh.nl
 */
namespace GO\Tickets\Controller;


class SiteController extends \GO\Site\Components\Controller {

	public function allowGuests() {
		return array('showticket', 'ticketlogin', 'newticket', 'downloadattachment','ticketlist','getagentpicture');
	}

	protected function ignoreAclPermissions() {
		return array('showticket', 'ticketlogin', 'newticket','ticketlist','getagentpicture');
	}

	/**
	 * Page with a login form
	 * If $siteconfig['tickets_allow_anonymous'] is set to TRUE then this page 
	 * shows also a link to the "New ticket" page.
	 */
	protected function actionTicketLogin() {
		
		// Create an empty user model
		$model = new \GO\Base\Model\User();
		
		if (\GO\Base\Util\Http::isPostRequest()) {
			
			// Set the posted values to the user model
			$model->username = $_POST['User']['username'];
			$password = $_POST['User']['password'];

			// Check if the login is correct, then the correct user object is returned
			$user = \GO::session()->login($model->username, $password);
			
			if (!$user) {
				// set the correct login failure message
				GOS::site()->notifier->setMessage('error', \GO::t("Wrong username or password"));
			} else {
				if (!empty($_POST['rememberMe'])) {
					
					// Encrypt the username for the rememberMe cookie
					$encUsername = \GO\Base\Util\Crypt::encrypt($model->username);
					if ($encUsername)
						$encUsername = $model->username;

					// Encrypt the password for the rememberMe cookie
					$encPassword = \GO\Base\Util\Crypt::encrypt($password);
					if ($encPassword)
						$encPassword = $password;

					// Set the rememberMe cookies
					\GO\Base\Util\Http::setCookie('GO_UN', $encUsername);
					\GO\Base\Util\Http::setCookie('GO_PW', $encPassword);
				}
				
				// Login is successfull, redirect to the ticketlist page
				$this->redirect(array('tickets/site/ticketlist'));
			}
		}
		
		// Render the loginselection form
		$this->render('loginSelection', array('model' => $model));
	}

	/**
	 * Page with a form to create a new ticket.
	 */
	protected function actionNewTicket() {

		// Check for the user to be logged in and check if it is allowed to use anonymous ticket creation
		if(!\GO::user() && GOS::site()->config->tickets_allow_anonymous !== true)
			Throw new \GO\Base\Exception\AccessDenied();		
		
		// Create a new ticket object
		$ticket = new \GO\Tickets\Model\Ticket();
		
		// Check if the user is logged in.
		if(\GO::user()){
			// Find the contact model of the current user.
			$contact = \GO::user()->contact;

			// Set the ticketfields values from the contact model.
			if($contact)
				$ticket->setFromContact($contact);
		}
		
		
		if(isset($_GET['type_id']))
			$ticket->type_id=$_GET['type_id'];

		// Create a new message object
		$message = new \GO\Tickets\Model\Message();

		// Create an instance of the uploader
		$uploader = new \GO\Site\Widgets\Uploader(
										'uploader',
										$_REQUEST,
										'createticket'
		);

		// Authorize the uploader to handle the uploaded files
		\GO\Base\Authorized\Actions::setAuthorized('plupload');
		
		// enable ACL
		\GO::setIgnoreAclPermissions(false);
		
		// Retreive the tickettypes for showing in the dropdownlist
		if(!\GO::user())			
			$ticketTypes = \GO\Tickets\Model\Type::model()->find(\GO\Base\Db\FindParams::newInstance()->criteria(\GO\Base\Db\FindCriteria::newInstance()->addCondition('publish_on_site', true))->order('name')->ignoreAcl());
		else
			$ticketTypes = \GO\Tickets\Model\Type::model()->find(\GO\Base\Db\FindParams::newInstance()->order('name'));
		
		// disable ACL again
		\GO::setIgnoreAclPermissions(true);
		
		// Check for the form post
		if (\GO\Base\Util\Http::isPostRequest()) {

			// Set the ticket attributes
			$ticket->setAttributes($_POST['Ticket']);

			// Try to save the ticket
			if ($ticket->save()) {

				// Add the posted attributes to the message object
				$message->setAttributes($_POST['Message']);

				// If the ticket is closed by the user
				if (isset($_POST['CloseTicket']))
					$message->setStatus(\GO\Tickets\Model\Ticket::STATUS_CLOSED);

				// Add a message to the ticket.
				if ($ticket->addMessage($message)) {

					// If saving is OK then redirect to the ticket page
					$this->redirect(array(
							'/tickets/site/showTicket',
							'ticket_number' => $ticket->ticket_number,
							'ticket_verifier' => $ticket->ticket_verifier
					));
				}
			}
		} 

		// Render the ticket page
		$this->render("ticket", array('ticket' => $ticket, 'message' => $message, 'uploader' => $uploader, 'ticketTypes' => $ticketTypes));
	}

	/**
	 * Page to show the ticketlist when a user is logged in
	 */
	protected function actionTicketList() {

		if(!\GO::user())
			$this->redirect(array('tickets/site/ticketlogin'));
		
		// Build the findparams to retreive the ticketlist from the DB
		$findParams = \GO\Base\Db\FindParams::newInstance();
		$findParams->getCriteria()->addCondition('user_id', \GO::user()->id);
		$findParams->order('mtime', 'DESC');
		
		if(!isset(\GO::session()->values['sites_ticketlist']))
			\GO::session()->values['sites_ticketlist']='openprogress';
		
		if(isset($_GET['filter']))
			\GO::session()->values['sites_ticketlist']=$_GET['filter'];

		// Option to filter the tickets

		switch(\GO::session()->values['sites_ticketlist']){
			case 'open':
				$findParams->getCriteria()->addCondition('status_id', 0,'=');
				break;

			case 'progress':
				$findParams->getCriteria()->addCondition('status_id', 0,'>');
				break;

			case 'openprogress':
				$findParams->getCriteria()->addCondition('status_id', 0,'>=');
				break;

			case 'closed':
				$findParams->getCriteria()->addCondition('status_id', 0,'<');
				break;

			default:
				break;
		}

				
		// Create the pager for the ticket messages
		$pager = new \GO\Site\Widgets\Pager('p', $_REQUEST, \GO\Tickets\Model\Ticket::model(), $findParams, \GO::user()->max_rows_list, 2);

		// Render the ticketlist page
		$this->render('ticketlist', array('pager' => $pager));
	}

	/**
	 * Page to show the "Active" ticket
	 */
	protected function actionShowTicket() {

		// Check if the needed getters are given otherwise throw a notFound exception
		if (!isset($_GET['ticket_number']) && !isset($_GET['ticket_verifier']))
			throw new \GO\Base\Exception\NotFound();

		// Check if we can find a ticket with the given getters
		$ticket = \GO\Tickets\Model\Ticket::model()->findSingleByAttributes(array(
				'ticket_number' => $_GET['ticket_number'],
				'ticket_verifier' => $_GET['ticket_verifier']
						));

		// If there is no ticket found then throw a notFound exception
		if (!$ticket)
			throw new \GO\Base\Exception\NotFound();

		// Create a new message object
		$message = new \GO\Tickets\Model\Message();

		// Create an instance of the uploader
		$uploader = new \GO\Site\Widgets\Uploader(
										'uploader',
										$_REQUEST,
										'createticket'
		);

		// Authorize the uploader to handle the uploaded files
		\GO\Base\Authorized\Actions::setAuthorized('plupload');

		// Check for the form post
		if (\GO\Base\Util\Http::isPostRequest()) {

			// Add the posted attributes to the message object
			$message->setAttributes($_POST['Message']);

			// If the ticket is closed by the user
			
			if (isset($_POST['CloseTicket']))
				$message->setStatus(\GO\Tickets\Model\Ticket::STATUS_CLOSED);

			// Add a message to the ticket.
			if ($ticket->addMessage($message)) {

				// If saving is OK then redirect to the ticket page
				$this->redirect(array(
						'tickets/site/showTicket',
						'ticket_number' => $ticket->ticket_number,
						'ticket_verifier' => $ticket->ticket_verifier
				));
			}
		}

		// Create the pager for the messages
		$findParams = \GO\Base\Db\FindParams::newInstance();
		$findParams->getCriteria()->addCondition('ticket_id', $ticket->id);
		$findParams->getCriteria()->addCondition('is_note', false);
		$findParams->select('t.*');
		$findParams->order('ctime', 'DESC');

		$pager = new \GO\Site\Widgets\Pager(
								'p',
								$_GET,
								\GO\Tickets\Model\Message::model(),
								$findParams,
								\GO::user() ? \GO::user()->max_rows_list : \GO::config()->nav_page_size,
								2
		);

		// Build the view and pass the required parameters
		$this->render("ticket", array('ticket' => $ticket, 'message' => $message, 'pager' => $pager, 'uploader' => $uploader));
	}

	/**
	 * Download an attachment from the current ticket/message
	 * The file will be outputted to the broser with downloadheaders
	 * 
	 * @throws \GO\Base\Exception\AccessDenied
	 */
	protected function actionDownloadAttachment() {

		// Find the cuttent ticket
		$ticket = \GO\Tickets\Model\Ticket::model()->findSingleByAttributes(array('ticket_number'=>$_GET['ticket_number'],'ticket_verifier'=>$_GET['ticket_verifier']));

		// Throw an AccessDenied exception when the ticket is not found
		if (!$ticket) {
			throw new \GO\Base\Exception\AccessDenied();
		}

		// Get the file from the GET['file'] parameter.
		$file = \GO\Files\Model\File::model()->findSingleByAttributes(array('id'=>$_GET['file'],'folder_id' =>$ticket->files_folder_id));

		// If the file is found then output it to the browser
		if ($file) {
			$fsFile = $file->fsFile;
			\GO\Base\Util\Http::outputDownloadHeaders($fsFile, false);
			$fsFile->output();
		}
	}
	
	protected function actionGetAgentPicture(){

		if(!isset($_GET['agent_contact_id']))
			throw new \GO\Base\Exception\NotFound();
		
		$contact = \GO\Addressbook\Model\Contact::model()->findByPk($_GET['agent_contact_id'],false, true);
		
		if(!$contact)
			throw new \GO\Base\Exception\NotFound();
		
		\GO\Base\Util\Http::outputDownloadHeaders($contact->getPhotoFile(), true, false);
		$contact->getPhotoFile()->output();
	}
}
