<?php

require(__DIR__ . "/vendor/autoload.php");

use go\core\App;
use go\core\auth\Method;
use go\core\auth\model\Token;
use go\modules\core\users\model\User;
use go\core\auth\PrimaryAuthenticator;
use go\core\http\Request;
use go\core\http\Response;
use go\core\jmap\Capabilities;
use go\core\validate\ErrorCode;

function output($data = [], $status = 200, $statusMsg = null) {
	Response::get()->setStatus($status, $statusMsg);
	Response::get()->sendHeaders();

	$data['debug'] = GO()->getDebugger()->getEntries();
	Response::get()->output(json_encode($data));

	exit();
}
	

try {
//Create the app with the config.php file
	App::get();
	
	if(go\core\jmap\Request::get()->getMethod() == "DELETE") {
		$state = new go\core\jmap\State();
		$token = $state->getToken();
		if(!$token) {
			output([], 404);
		}
		$token->delete();
		
		output();		
	}

	if (!Request::get()->isJson()) {
		output([], 400, "Only Content-Type: application/json");	
	}

	$data = Request::get()->getBody();

	Response::get()->setContentType("application/json;charset=utf-8");

	if (isset($data['forgot'])) {

		$user = User::find()->where(['email' => $data['email']])->orWhere(['recoveryEmail' => $data['email']])->single();
		if (empty($user)) {
			GO()->debug("User not found");
			output([], 200, "Recovery mail sent");	//Don't show if user was found or not for security
		}
		
		if(!($user->getPrimaryAuthenticator() instanceof \go\core\auth\Password)) {
			GO()->debug("Authenticator doesn't support recovery");
			output([], 200, "Recovery mail sent");	
		}
		
		$user->sendRecoveryMail($data['email']);
		output([], 200, "Recovery mail sent");	
	}
	if (isset($data['recover'])) {
		$oneHourAgo = (new DateTime())->modify('-1 hour');
		$user = User::find()
										->where('recoveryHash = :hash AND recoverySendAt > :time')
										->bind([
												':hash' => $data['hash'],
												':time' => $oneHourAgo->format(DateTime::ISO8601)
										])->single();
		if (empty($user)) {
			$response = ['success' => false];
		} elseif (!empty($data['newPassword'])) {
			$user->setPassword($data['newPassword']);
			$user->checkRecoveryHash($data['hash']);
			$success = $user->save();
			$response = ['passwordChanged' => $success, 'validationErrors' => $user->getValidationErrors()];
		} else {
			$response = [
					"username" => $user->username,
					"displayName" => $user->displayName
			];
		}
		Response::get()->sendHeaders();
		Response::get()->output(json_encode($response));
		exit();
	}

	/**
	 * 
	 * @param type $username
	 * @param type $password
	 * @return User|boolean
	 */
	function getToken($data) {		
		//loop through all auth methods
		$authMethods = Method::find()->orderBy(['sortOrder' => 'ASC']);
		foreach ($authMethods as $method) {
			$authenticator = $method->getAuthenticator();
			if (!($authenticator instanceof PrimaryAuthenticator)) {
				continue;
			}
			if (!$authenticator->isAvailableFor($data['username'])) {
				continue;
			}
			if (!$user = $authenticator->authenticate($data['username'], $data['password'])) {
				return false;
			}
			
			if(!$user->enabled) {				
				output([], 403, GO()->t("You're account has been disabled."));
			}
			
			if(GO()->getSettings()->maintenanceMode && !$user->isAdmin()) {
				output([], 503, "Service unavailable. Maintenance mode is enabled");
			}

			$token = new Token();
			$token->userId = $user->id;
			$token->addPassedMethod($method);

			if (!$token->save()) {
				throw new Exception("Could not save token");
			}

			return $token;
		}
		return false;
	}

	

	if (!isset($data['loginToken']) && !isset($data['accessToken']) && !empty($data['username'])) {

		$token = getToken($data);
		if (!$token) {
			output([
					'errors' => [
							'username' => ["description" => "Bad username or password", "code" => ErrorCode::INVALID_INPUT]
					]
							], 401, "Bad username or password");
		}
	} else {
		if (isset($data['accessToken'])) {
			$token = Token::find()->where(['accessToken' => $data['accessToken']])->single();
			if ($token && $token->isAuthenticated()) {
				$token->refresh();
			}
		} else {
			$token = Token::find()->where(['loginToken' => $data['loginToken']])->single();
		}

		if (!$token) {
			output([], 400, "Invalid token given");
		}
	}


// Do the actual authentication for each authentication method where from its data is posted
	if (!empty($data['methods'])) {
		$authenticators = $token->authenticateMethods($data['methods']);
	} else {
		$authenticators = [];
	}

	$methods = array_map(function($o) {
		return $o->id;
	}, $token->getPendingAuthenticationMethods());

	if (empty($methods) && !$token->isAuthenticated()) {
		$token->setAuthenticated();
		if(!$token->save()) {
			throw new \Exception("Could not save token: ". var_export($token->getValidationErrors(), true));
		}
	}

	if ($token->isAuthenticated()) {
    $authState = new \go\core\jmap\State();
    $authState->setToken($token);
		GO()->setAuthState($authState);
    $response = $authState->getSession();
    
    $response['accessToken'] = $token->accessToken;
		output($response, 201, "Authentication is complete, access token created.");
	} 
  
  $response = [
    'loginToken' => $token->loginToken,
    'methods' => $methods
  ];
  


	$methods = array_map(function($o) {
		return $o->id;
	}, $token->getPendingAuthenticationMethods());

	$validationErrors = [];
	foreach ($authenticators as $methodId => $authenticator) {
		$errors = $authenticator->getValidationErrors();
		if (!empty($errors)) {
			$validationErrors[$methodId] = $errors;
		}
	}

	if (!empty($validationErrors)) {
		$response['errors'] = $validationErrors;
		output($response, 400, "Validation errors occurred");
	} else {
		output($response, 200, "Success, but more authorization required.");
	}
} catch (\Exception $e) {
  \go\core\ErrorHandler::logException($e);
	output([], 500, $e->getMessage());
}
