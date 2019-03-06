<?php


namespace GO\Smime\Controller;


class CertificateController extends \GO\Base\Controller\AbstractController {

	public function actionDownload($params) {

		//fetch account for permission check.
		$account = \GO\Email\Model\Account::model()->findByPk($params['account_id']);

		$cert = \GO\Smime\Model\Certificate::model()->findByPk($account->id);
		if (!$cert)
			throw new \GO\Base\Exception\NotFound();

		$filename = str_replace(array('@', '.'), '-', $account->getDefaultAlias()->email) . '.p12';

		$file = new \GO\Base\Fs\File($filename);
		\GO\Base\Util\Http::outputDownloadHeaders($file);

		echo $cert->cert;
	}

	public function actionCheckPassword($params) {
		//fetch account for permission check.
		$account = \GO\Email\Model\Account::model()->findByPk($params['account_id']);

		$cert = \GO\Smime\Model\Certificate::model()->findByPk($account->id);

		openssl_pkcs12_read($cert->cert, $certs, $params['password']);

		$response['success'] = true;
		$response['passwordCorrect'] = !empty($certs);

		if ($response['passwordCorrect']) {
			//store in session for later usage
			\GO::session()->values['smime']['passwords'][$params['account_id']] = $params['password'];
		}
		return $response;
	}

	public function actionVerify($params) {

		$response['success'] = true;
		
		$params['email']= strtolower($params['email']);

		//if file was already stored somewhere after decryption
		if(!empty($params['cert_id'])){
			$cert = \GO\Smime\Model\PublicCertificate::model()->findByPk($params['cert_id']);
			$certData=$cert->cert;
		}else 
		{
//			if (!empty($params['filepath'])) {
//				$srcFile = new \GO\Base\Fs\File(\GO::config()->tmpdir.$params['filepath']);
			if(!empty($params['account_id'])){
				$account = \GO\Email\Model\Account::model()->findByPk($params['account_id']);
				$imapMessage = \GO\Email\Model\ImapMessage::model()->findByUid($account, $params['mailbox'], $params['uid']);

				$srcFile = \GO\Base\Fs\File::tempFile();
				if (!$imapMessage->saveToFile($srcFile->path()))
					throw new \Exception("Could not fetch message from IMAP server");

				$this->_decryptFile($srcFile, $account);
			}
			
//			throw new \Exception($srcFile->path());

			$pubCertFile = \GO\Base\Fs\File::tempFile();
			//Command line:
			//openssl smime -verify -in msg.txt
			$valid = openssl_pkcs7_verify($srcFile->path(), null, $pubCertFile->path(), $this->_getRootCertificates());
			
			//Adding the PKCS7_NOVERIFY flag was used for testing some messages that could not be verified by openssl but did in Mozilla thunderbird.
			//Error msg: error:21075075:PKCS7 routines:PKCS7_verify:certificate verify error
			//
//			$valid = openssl_pkcs7_verify($srcFile->path(), PKCS7_NOVERIFY, $pubCertFile->path(), $this->_getRootCertificates());
//			throw new \Exception($srcFile->path());
			$srcFile->delete();

			if ($valid) {
				if ($pubCertFile->exists()) {
					$certData = $pubCertFile->getContents();

					$arr = openssl_x509_parse($certData);
				
					$senderEmailStr = !empty($arr['extensions']['subjectAltName']) ? $arr['extensions']['subjectAltName'] : $arr['subject']['emailAddress'];
					
					$senderEmails = explode(',', $senderEmailStr);
					$emails = array();
					
					foreach($senderEmails as $emailRaw) {
						$email = strtolower(\GO\Base\Util\StringHelper::get_email_from_string($emailRaw));
						
						if($email) {
							$emails[] = $email;
						}
					}

					$pubCertFile->delete();

					$this->_savePublicCertificate($certData, $emails);
				} else {					
					throw new \Exception('Certificate appears to be valid but could not get certificate from signature. SSL Error: '.openssl_error_string());
				}

				if (empty($certData))
					throw new \Exception('Certificate appears to be valid but could not get certificate from signature.');
			}
		}
	
		
		if(!isset($arr) && isset($certData)){
			$arr = openssl_x509_parse($certData);			

			$senderEmailStr = !empty($arr['extensions']['subjectAltName']) ? $arr['extensions']['subjectAltName'] : $arr['subject']['emailAddress'];
			
			$senderEmails = explode(',', $senderEmailStr);
			$emails = array();

				foreach($senderEmails as $emailRaw) {
					$email = strtolower(\GO\Base\Util\StringHelper::get_email_from_string($emailRaw));

					if($email) {
						$emails[] = $email;
					}
				}
		}else if(empty($emails)){
			$emails = array('unknown');
		}

		$response['html'] = '';
		$response['cls'] = '';
		$response['text'] = '';

		if (isset($params['account_id'])) {
			if (!$valid) {

				$response['cls'] = 'smi-invalid';
				$response['text'] = \GO::t("The certificate is invalid!", "smime");

				$response['html'] .= '<h1 class="smi-invalid">' . \GO::t("The certificate is invalid!", "smime") . '</h1>';
				$response['html'] .= '<p>';
				while ($msg = openssl_error_string())
					$response['html'] .= $msg . "<br />\n";
				$response['html'] .= '</p>';
			} else if (!in_array($params['email'], $emails)) {

				$response['cls'] = 'smi-certemailmismatch';
				$response['text'] = \GO::t("Valid certificate but the e-mail of the certificate does not match the sender address of the e-mail.", "smime");

				$response['html'] .= $response['short_html'] = '<h1 class="smi-certemailmismatch">' . \GO::t("Valid certificate but the e-mail of the certificate does not match the sender address of the e-mail.", "smime") . '</h1>';
			} else {
				$response['cls'] = 'smi-valid';
				$response['text'] = \GO::t("Valid certificate", "smime");

				$response['html'] .= $response['short_html'] = '<h1 class="smi-valid">' . \GO::t("Valid certificate", "smime") . '</h1>';
			}
		}

		if (!isset($params['account_id']) || $valid) {
			$response['html'] .= '<table>';
			$response['html'] .= '<tr><td width="100">' . \GO::t("Name") . ':</td><td>' . $arr['name'] . '</td></tr>';
			$response['html'] .= '<tr><td width="100">'.\GO::t("E-mail", "smime").':</td><td>' . implode(', ', $emails) . '</td></tr>';
			$response['html'] .= '<tr><td>'.\GO::t("Hash", "smime").':</td><td>' . $arr['hash'] . '</td></tr>';
			$response['html'] .= '<tr><td>'.\GO::t("Serial number", "smime").':</td><td>' . $arr['serialNumber'] . '</td></tr>';
			$response['html'] .= '<tr><td>'.\GO::t("Version", "smime").':</td><td>' . $arr['version'] . '</td></tr>';
			$response['html'] .= '<tr><td>'.\GO::t("Issuer", "smime").':</td><td>';

			foreach ($arr['issuer'] as $skey => $svalue) {
				if (is_array($svalue)) {
					foreach ($svalue as $sv) {
						$response['html'] .= $skey . ':' . $sv . '; ';
					}
				} else {
					$response['html'] .= $skey . ':' . $svalue . '; ';
				}
			}
			
			$response['html'] .= '</td></tr>';
			$response['html'] .= '<tr><td>'.\GO::t("Valid from", "smime").':</td><td>' . \GO\Base\Util\Date::get_timestamp($arr['validFrom_time_t']) . '</td></tr>';
			$response['html'] .= '<tr><td>'.\GO::t("Valid to", "smime").':</td><td>' . \GO\Base\Util\Date::get_timestamp($arr['validTo_time_t']) . '</td></tr>';
			$response['html'] .= '</table>';
		}


		return $response;
	}
	
	public function actionImportCertificate($params) {
		if(empty($params['blobId']) || empty($params['email'])) {
			throw new \InvalidArgumentException('Invalid parameter posted');
		}
		
		$blob = \go\core\fs\Blob::findById($params['blobId']);
		$success = $this->_savePublicCertificate(file_get_contents($blob->path()), array($params['email']));
		return ['success' => $success];
	}
	
	public function actionImportAttachment($params) {
		// account_id mailbox uid number encoding sender
		$account = \GO\Email\Model\Account::model()->findByPk($params['account_id']);
		$imap = $account->openImapConnection($params['mailbox']);
		$success = true;

		$certData = $imap->get_message_part_decoded($params['uid'], $params['number'], $params['encoding']);
		
		$success = $success && $this->_savePublicCertificate($certData, array($params['sender']));
		return ['success' => $success];
	}

	private function _savePublicCertificate($certData, $emails) {
		$success = true;
		foreach($emails as $email) {
			$findParams = \GO\Base\Db\FindParams::newInstance()->single();
			$findParams->getCriteria()
							->addCondition('email', $email)
							->addCondition('user_id', \GO::user()->id);

			$cert = \GO\Smime\Model\PublicCertificate::model()->find($findParams);
			if (!$cert) {
				$cert = new \GO\Smime\Model\PublicCertificate();
				$cert->email = $email;
				$cert->user_id = \GO::user()->id;
			}
			$cert->cert = $certData;
			$success = $cert->save() && $success;
		}
		return $success;
	}

	private function _getRootCertificates() {
		$certs = array();

//		if(isset($GLOBALS['GO_CONFIG']->smime_root_cert_location)){
//			
//			$GLOBALS['GO_CONFIG']->smime_root_cert_location=rtrim($GLOBALS['GO_CONFIG']->smime_root_cert_location, '/');		
//			
//			if(is_dir($GLOBALS['GO_CONFIG']->smime_root_cert_location)){				
//							
//				$dir = opendir($GLOBALS['GO_CONFIG']->smime_root_cert_location);
//				if ($dir) {
//					while ($item = readdir($dir)) {
//						if ($item != '.' && $item != '..') {
//							$certs[] = $GLOBALS['GO_CONFIG']->smime_root_cert_location.'/'.$item;
//						}
//					}
//					closedir($dir);
//				}
//			}elseif(file_exists($GLOBALS['GO_CONFIG']->smime_root_cert_location)){
//				$certs[]=$GLOBALS['GO_CONFIG']->smime_root_cert_location;
//			}
//		}
//		
		if (isset(\GO::config()->smime_root_cert_location) && file_exists(\GO::config()->smime_root_cert_location))
			$certs[] = \GO::config()->smime_root_cert_location;

		return $certs;
	}

	private function _decryptFile(\GO\Base\Fs\File $srcFile, \GO\Email\Model\Account $account) {
		$data = $srcFile->getContents();
		if (strpos($data, "enveloped-data") || strpos($data, 'Encrypted Message')) {
			$cert = \GO\Smime\Model\Certificate::model()->findByPk($account->id);
			
			$password = \GO::session()->values['smime']['passwords'][$_REQUEST['account_id']];
			openssl_pkcs12_read($cert->cert, $certs, $password);

			$decryptedFile = \GO\Base\Fs\File::tempFile();

			$ret = openssl_pkcs7_decrypt($srcFile->path(), $decryptedFile->path(), $certs['cert'], array($certs['pkey'], $password));
			
			if(!$decryptedFile->exists())
				throw new \Exception("Could not decrypt message: ".openssl_error_string());
			
			$decryptedFile->move($srcFile->parent(), $srcFile->name());
		}
	}

}
