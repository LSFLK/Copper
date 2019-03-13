<?php
/*
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 *
 */

/**
 * This class is used to parse and write RFC822 compliant recipient lists
 * 
 * @package GO.modules.files
 * @version $Id: FilesearchModule.php 21269 2016-03-22 16:01:21Z mschering $
 * @author Merijn Schering <mschering@intermesh.nl>
 * @copyright Copyright Intermesh BV.
 */


namespace GO\Filesearch;


class FilesearchModule extends \GO\Professional\Module{	
	
	public function package() {
		return "Documents";
	}
	
	public static function initListeners() {
		\GO\Files\Model\File::model()->addListener('save', 'GO\Filesearch\FilesearchModule', 'save');
		\GO\Files\Model\File::model()->addListener('delete', 'GO\Filesearch\FilesearchModule', 'delete');
		
	}
	
	public function install() {
		parent::install();
		
		$cron = new \GO\Base\Cron\CronJob();
		
		$cron->name = 'Filesearch index';
		$cron->active = true;
		$cron->runonce = false;
		$cron->minutes = '0';
		$cron->hours = '1';
		$cron->monthdays = '*';
		$cron->months = '*';
		$cron->weekdays = '*';
		$cron->job = 'GO\\Filesearch\\Cron\\FileIndex';		

		$cron->save();
		
		return true;
	}
	
	public static function save($file){
		try{
			if(\GO::router()->getController() && \GO::router()->getController()->getRoute()!='maintenance'){
				
				Model\Filesearch::model()->createFromFile($file, !empty(\GO::config()->filesearch_direct_index));
			}
		}
		catch(\Exception $e){
			\GO::debug((string) $e);
		}
		
	}
	
	public static function delete($file){
		$fs = Model\Filesearch::model()->findByPk($file->id);
		if($fs)
			$fs->delete();
	}
	

	public static function sync(){
		
		echo "Running filesearch index sync for ".\GO::config()->id."\n";
		
		$controller = new Controller\Filesearch();
		$controller->run("sync");				
	}
	
	
}
