<?php


namespace GO\Billing;


class BillingModule extends \GO\Professional\Module {
	
	private static $_defaultLangId;

	public function author() {
		return 'Merijn Schering';
	}

	public function authorEmail() {
		return 'mschering@intermesh.nl';
	}
	
	public function package() {
		return "Billing";
	}

	/**
	 * 
	 * When a user is created, updated or logs in this function will be called.
	 * The function can check if the default calendar, addressbook, notebook etc.
	 * is created for this user.
	 * 
	 */
	public static function firstRun() {
		
	}

	public function install() {

		parent::install();
		
		$lang = new Model\Language();
		$lang->id=1;
		$lang->name=\GO::t("Default", "billing");
		$lang->language=\GO::config()->language;
		$lang->save();
		
		
		$quoteBook = new Model\Book();
		$quoteBook->name=\GO::t("Quotes", "billing");
		$quoteBook->order_id_prefix="Q%y";
		$quoteBook->call_after_days=3;
		$quoteBook->createStatuses=array('Sent','Accepted','Lost','In process');
		$quoteBook->save();
		
		$orderBook = new Model\Book();
		$orderBook->name=\GO::t("Orders", "billing");
		$orderBook->order_id_prefix="O%y";
		$quoteBook->createStatuses=array('In process','Delivered','Sent','Billed');
		$orderBook->save();
		
		$invoiceBook = new Model\Book();
		$invoiceBook->name=\GO::t("Invoices", "billing");
		$invoiceBook->order_id_prefix="I%y";
		$invoiceBook->save();
		
		
		if (\GO::modules()->files) {
	
			$folder = \GO\Files\Model\Folder::model()->findByPath('billing/product_images',true);
			if($folder->acl_id != \GO::modules()->billing->acl_id){
				$folder->acl_id=\GO::modules()->billing->acl_id;
				$folder->save(true);		
			}
		}

		return true;
	}
	
	public function autoInstall() {
		return true;
	}

	
	public static function getDefaultLangId(){
		if(!isset(self::$_defaultLangId)){
			$lang = Model\Language::model()->findSingleByAttribute('language',\GO::language()->getLanguage());
			self::$_defaultLangId = $lang ? $lang->id : 1;
		}
		return self::$_defaultLangId;
	}
	
	
	public function checkDatabase(&$response) {
		parent::checkDatabase($response);
		
		if (\GO::modules()->files) {
	
			$folder = \GO\Files\Model\Folder::model()->findByPath('billing/product_images',true);
			if($folder->acl_id != \GO::modules()->billing->acl_id){
				$folder->acl_id=\GO::modules()->billing->acl_id;
				$folder->save(true);		
			}
		}
		
	}
}
