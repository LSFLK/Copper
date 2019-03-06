/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: SelectProcess.js 22948 2018-01-12 08:01:30Z mschering $
 * @copyright Copyright Intermesh
 * @author Wesley Smits <wsmits@intermesh.nl>
 */
 
/**
 * @class GO.workflow.SelectProcess
 * @extends GO.form.ComboBox
 *
 * Selects a Group-Office workflow process.
 *
 * @constructor
 * Creates a new SelectProcess
 * @param {Object} config Configuration options
 */
GO.workflow.SelectProcess = function(config){

	config = config || {};

	if(typeof(config.allowBlank)=='undefined')
		config.allowBlank=false;

	Ext.apply(this, config);
	
	this.store = new GO.data.JsonStore({
		url: GO.url('workflow/process/store'),
		root: 'results',
		totalProperty: 'total',
		id: 'id',
		fields:['id','name','user_id','acl_id'],
		remoteSort: true
	});
	this.store.setDefaultSort('name', 'asc');

	if(!this.hiddenName)
		this.hiddenName='wf_process_id';

	if(!this.valueField)
		this.valueField='id';
	
	GO.workflow.SelectProcess.superclass.constructor.call(this,{
		displayField: 'name',
		fieldLabel: t("Process", "workflow"),
		triggerAction: 'all',
		selectOnFocus:true,
		forceSelection: true,
		pageSize: parseInt(GO.settings['max_rows_list'])
	});
}

Ext.extend(GO.workflow.SelectProcess, GO.form.ComboBoxReset,{

});

//Ext.reg('selectprocess', GO.workflow.SelectProcess);
