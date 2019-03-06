<?php
/***********************************************
* File      :   serviceunavailableexception.php
* Project   :   Z-Push
* Descr     :   Exception sending a '503 Service Unavailable' to the mobile.
*
* Created   :   09.08.2016
*
* Copyright 2007 - 2016 Zarafa Deutschland GmbH
*
* This program is free software: you can redistribute it and/or modify
* it under the terms of the GNU Affero General Public License, version 3,
* as published by the Free Software Foundation.
*
* This program is distributed in the hope that it will be useful,
* but WITHOUT ANY WARRANTY; without even the implied warranty of
* MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE. See the
* GNU Affero General Public License for more details.
*
* You should have received a copy of the GNU Affero General Public License
* along with this program.  If not, see <http://www.gnu.org/licenses/>.
*
* Consult LICENSE file for details
************************************************/

class ServiceUnavailableException extends HTTPReturnCodeException {
	protected $defaultLogLevel = LOGLEVEL_INFO;
	protected $httpReturnCode = HTTP_CODE_503;
	protected $httpReturnMessage = "Service Unavailable";
	protected $httpHeaders = array();
	protected $showLegal = false;

	public function __construct($message = "", $code = 0, $previous = NULL, $logLevel = false) {
		parent::__construct($message, $code, $previous, $logLevel);
		if (RETRY_AFTER_DELAY !== false) {
			$this->httpHeaders[] = 'Retry-After: ' . RETRY_AFTER_DELAY;
		}
	}
}