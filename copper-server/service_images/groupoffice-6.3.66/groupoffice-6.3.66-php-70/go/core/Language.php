<?php

namespace go\core;

use Exception;
use go\core\fs\File;
use go\core\jmap\Request;
use go\modules\core\modules\model\Module;

class Language {

	/**
	 *
	 * @var string eg "en-US".
	 */
	private $isoCode;
	private $data = [];

	public function __construct() {
		$this->isoCode = $this->getBrowserLanguage();	
	}
	
	/**
	 * Get ISO code with underscore separator for region
	 * 
	 * @return string eg. "en" or "en_UK"
	 */
	public function getIsoCode() {
		return $this->isoCode;
	}
	
	public function setLanguage($isoCode = null) {
		
		if(!isset($isoCode)) {
			$isoCode = $this->getBrowserLanguage();
		}
		
		if(!$this->hasLanguage($isoCode)) {
			throw new \Exception("Invalid language given ".$isoCode);
		}
		
		if($isoCode != $this->isoCode) {
			$this->isoCode = $isoCode;
			$this->data = [];
		}
		
	}
	
	private function getBrowserLanguage(){
		
		if(isset($_GET['SET_LANGUAGE']) && $this->hasLanguage($_GET['SET_LANGUAGE'])) {
			setcookie('GO_LANGUAGE', $_GET['SET_LANGUAGE'], time() + (10 * 365 * 24 * 60 * 60));
			return $_GET['SET_LANGUAGE'];
		}
		
		if(isset($_COOKIE['GO_LANGUAGE'])) {
			return $_COOKIE['GO_LANGUAGE'];
		}
		
		$browserLanguages= Request::get()->getAcceptLanguages();
		foreach($browserLanguages as $lang){
			$lang = str_replace('-','_',explode(';', $lang)[0]);
			if($this->hasLanguage($lang)){
				return $lang;
			}
			
			if(($pos = strpos($lang, "_"))) {
				$lang = substr($lang, 0, $pos);
				if($this->hasLanguage($lang)){
					return $lang;
				}
			}
		}
		
		return GO()->getSettings()->language; // from settings if we cant determine
	}

	/**
	 * Translates a language variable name into the local language.
	 * 
	 * @param String $str String to translate
	 * @param String $module Name of the module to find the translation
	 * @param String $package Only applies if module is set to 'base'
	 */
	public function t($str, $package = 'core', $module = 'core') {

		$this->loadSection($package, $module);
		
		//fallback on core lang
		if(!isset($this->data[$package]) || !isset($this->data[$package][$module]) || ($package != "core" && $module != "core" && !isset($this->data[$package][$module][$str]))) {
			return $this->t($str);
		}
		
		return $this->data[$package][$module][$str] ?? $str;
	}
	
	public function translationExists($str, $package = 'core', $module = 'core') {
		$this->loadSection($package, $module);
		
		return isset($this->data[$package]) && isset($this->data[$package][$module]) && isset($this->data[$package][$module][$str]);
	}


	private function loadSection($package = 'core', $module = 'core') {
		if (!isset($this->data[$package])) {
			$this->data[$package] = [];
		} 
		
		if(!isset($this->data[$package][$module])) {
			
			$langData = new util\ArrayObject();
			
			//Get english default
			$file = $this->findLangFile('en',$package, $module);
			if ($file->exists()) {
				$langData = new util\ArrayObject($this->loadFile($file));
			} else {
				GO()->debug('No default(en) language file for module "'.$package.'/'.$module.'" defined.', 'Language');
			}

			//overwirte english with actual language
			if ($this->isoCode != 'en') {
				$file = $this->findLangFile($this->isoCode, $package, $module);
				if ($file->exists()) {
					$langData->mergeRecursive($this->loadFile($file));
				}
			}

			$file = $this->findLangOverride($this->isoCode, $package, $module);
			if ($file->exists()) {
				$langData->mergeRecursive($this->loadFile($file));
			}
			
			$productName = GO()->getConfig()['branding']['name'];

			foreach ($langData as $key => $translation) {
				
				if(!is_string($translation)) {
					continue;
				}
							
				//branding
				$langData[$key]  = str_replace(
								[
										"{product_name}",
										"GroupOffice",
										"Group-Office",
										"Group Office"
								], 
								[
										$productName,
										$productName,
										$productName,
										$productName

								], $langData[$key]);
			}

			$this->data[$package][$module] = $langData->getArray();			
		}
	}
	
	private function loadFile($file) {
		
		$langData = require($file);
		if(!is_array($langData)){
			throw new \Exception("Invalid language file  " . $file);
		}
		
		return $langData;
	}
	
	public function hasLanguage($lang) {
		return $this->findLangFile($lang, 'core', 'core')->exists();
	}

	/**
	 * 
	 * @param string $lang
	 * @param string $module
	 * @param string $basesection
	 * @return File
	 * @throws Exception
	 */
	private function findLangFile($lang, $package, $module) {
		
		if($package == "legacy") {
			$folder = Environment::get()->getInstallFolder()->getFolder('modules/' . $module .'/language');
		} else
		{
			$folder = Environment::get()->getInstallFolder()->getFolder('go/modules/' . $package . '/' . $module .'/language');
		}

		return $folder->getFile($lang . '.php');
	}

	/**
	 * 
	 * @param string $lang
	 * @param string $module
	 * @param string $basesection
	 * @return File
	 */
	private function findLangOverride($lang, $package, $module) {

		$folder = GO()->getDataFolder()->getFolder('users/admin/language/' . $package . '/' .$module);
		
		return $folder->getFile($lang . '.php');
	}

	

	/**
	 * Get all supported languages.
	 * 
	 * @return array array('en'=>'English');
	 */
	public function getLanguages() {
		require(Environment::get()->getInstallFolder() . '/language/languages.php');
		asort($languages);
		return $languages;
	}

	/**
	 * Get all countries
	 * 
	 * @return array array('nl'=>'The Netherlands');
	 */
	public function getCountries() {
		$this->loadSection('core', 'countries');
		asort($this->data['core']['countries']);
		return $this->data['core']['countries'];
	}

	
	
	
	public function getAllLanguage(){
		$modules = Module::find();
		foreach($modules as $module) {
			$this->loadSection($module->package  ?? "legacy", $module->name);
		}
		
		return $this->data;
	}
}
