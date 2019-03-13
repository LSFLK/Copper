<?php

namespace GO\Customfields\Controller;


class BlockFieldController extends \GO\Base\Controller\AbstractJsonController{

	protected function actionSelectStore($params) {
		
		$columnModel = new \GO\Base\Data\ColumnModel(\GO\Customfields\Model\Field::model());
		$columnModel->formatColumn('extendsModel', '$model->category->extendsModel', array(), 'category_id');
		$columnModel->formatColumn('full_info','"[".\GO::t($model->category->extendsModel,"customfields")."] ".$model->category->name." : ".$model->name." (".$model->databaseName.")"', array(), 'category_id');
		
		$findParams = \GO\Base\Db\FindParams::newInstance()
			->joinModel(array(
				'model'=>'GO\Customfields\Model\Category',
				'localTableAlias'=>'t',
				'localField'=>'category_id',
				'foreignField'=>'id',
				'tableAlias'=>'c'
			))
			->criteria(
				\GO\Base\Db\FindCriteria::newInstance()
					->addInCondition(
						'extendsModel',
						array(
							'GO\Addressbook\Model\Contact',
							'GO\Addressbook\Model\Company',
							'GO\Projects2\Model\Project',
							'GO\Base\Model\User'
						),
						'c'
					)
					->addInCondition(
						'datatype',
						array(
							'GO\Addressbook\Customfieldtype\Contact',
							'GO\Addressbook\Customfieldtype\Company'
						),
						't'
					)
			);
		
		$store = new \GO\Base\Data\DbStore('GO\Customfields\Model\Field', $columnModel, $params, $findParams);

		echo $this->renderStore($store);
		
	}
	
}
