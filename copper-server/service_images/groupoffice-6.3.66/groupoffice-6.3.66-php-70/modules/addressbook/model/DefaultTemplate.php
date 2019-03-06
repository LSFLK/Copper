<?php

/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @copyright Copyright Intermesh
 * @author Merijn Schering <mschering@intermesh.nl>
 * @author Wilmar van Beusekom <wilmar@intermesh.nl>
 * @property int $template_id
 * @property int $user_id
 */


namespace GO\Addressbook\Model;


class DefaultTemplate extends \GO\Base\Db\ActiveRecord {
	
	/**
	 * Returns a static model of itself
	 * 
	 * @param String $className
	 * @return Company 
	 */
	public static function model($className=__CLASS__)
	{	
		return parent::model($className);
	}
	
	public function tableName() {
		return 'ab_default_email_templates';
	}
	
	public function primaryKey() {
		return 'user_id';
	}
	
	public function relations(){
		return array(
			'emailTemplate' => array('type'=>self::BELONGS_TO, 'model'=>'GO\Addressbook\Model\Template', 'field'=>'template_id')
		);
	}
	
	protected function defaultAttributes() {
		$attr = parent::defaultAttributes();
		
		$findParams = \GO\Base\Db\FindParams::newInstance()->limit(1);
		$stmt = Template::model()->find($findParams);
		
		if($template=$stmt->fetch())
		{
			$attr['template_id']=$template->id;
		}else
		{
			$attr['template_id']=0;
		}
		
		return $attr;
	}
}
