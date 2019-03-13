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
 * The ScanboxModule class
 *
 * @package GO.modules.Scanbox
 * @version $Id: ScanboxModule.php 18636 2014-03-25 16:13:05Z mschering $
 * @copyright Copyright Intermesh BV.
 * @author Wesley Smits wsmits@intermesh.nl
 *
 */


namespace GO\Scanbox;


class ScanboxModule extends \GO\Professional\Module{

	public static function initListeners(){		
		
	}	
	
	public function author() {
		return 'Wesley Smits';
	}
	
	public function authorEmail() {
		return 'wsmits@intermesh.nl';
	}
}
