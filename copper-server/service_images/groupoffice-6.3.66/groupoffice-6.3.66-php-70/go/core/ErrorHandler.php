<?php

namespace go\core;

use ErrorException;
use go\core\util\DateTime;
use Throwable;

/**
 * Error handler class
 * 
  * All PHP errors will be converted into ErrorExceptions. If they are not caught
 * by the developers code then they will be handled by {@see exceptionHandler()}
 * It will render the error and log it to the system log using error_log 
 * regardless of the php.ini settings.
 * 
 * @copyright (c) 2014, Intermesh BV http://www.intermesh.nl
 * @author Merijn Schering <mschering@intermesh.nl>
 * @license http://www.gnu.org/licenses/agpl-3.0.html AGPLv3
 */
class ErrorHandler {

	public function __construct() {		
		
		//error_reporting(E_ALL);
		
		set_error_handler([$this, 'errorHandler']);
		register_shutdown_function([$this, 'shutdown']);
		set_exception_handler([$this, 'exceptionHandler']);		
	}

	/**
	 * Called when PHP exits.
	 */
	public function shutdown() {
		
		$error = error_get_last();
		if ($error) {
			//Log only fatal errors because other errors should have been logged by the normal error handler
			if (in_array($error['type'], [E_ERROR, E_PARSE, E_CORE_ERROR, E_CORE_WARNING, E_COMPILE_ERROR, E_COMPILE_WARNING])) {
//				$this->printError($error['type'], $error['message'], $error['file'], $error['line']);				
				
				$this->exceptionHandler(new \ErrorException($error['message'],0,$error['type'],$error['file'], $error['line']));
			}
		}

//		$this->debug("shutdown");
	}
	
	/**
	 * Log exception to PHP logging system and debug the exception in GO
	 * 
	 * @param \Exception $e
	 * @return string The string that was logged
	 */
	public static function logException($e) {
		$cls = get_class($e);
		
		$errorString = $cls . " in " . $e->getFile() ." at line ". $e->getLine().': '.$e->getMessage();
		
		if(Environment::get()->isCli()) {
			echo $errorString . "\n";
		}
		
		error_log($errorString, 0);
		
//		echo $e->getTraceAsString();
		
		App::get()->debug($errorString);
		foreach(explode("\n", $e->getTraceAsString()) as $line) {
			App::get()->debug($line);
		}
		
		return $errorString;
	}

	/**
	 * PHP7 has new throwable interface. We can't use type hinting if we want to 
	 * support php 5.6 as well.
	 * @param Throwable $e
	 */
	public function exceptionHandler($e) {				
		$errorString = self::logException($e);
		
		if(!headers_sent()) {
			if($e instanceof http\Exception) {
				http_response_code($e->code);
			}
			header('Content-Type: text/plain');
		}

		echo "[".date(DateTime::FORMAT_API)."] ". $errorString."\n\n";	
		echo "\n\nDebug dump: \n\n";			
		print_r(App::get()->getDebugger()->getEntries());
	}

	/**
	 * Custom error handler that logs to our own error log
	 * 
	 * @param int $errno
	 * @param string $errstr
	 * @param string $errfile
	 * @param int $errline
	 * @return boolean
	 */
	public static function errorHandler($errno, $errstr, $errfile, $errline) {
		if (!(error_reporting() & $errno)) {
			return false;
		}
		throw new ErrorException($errstr, 0, $errno, $errfile, $errline);
	}
}
