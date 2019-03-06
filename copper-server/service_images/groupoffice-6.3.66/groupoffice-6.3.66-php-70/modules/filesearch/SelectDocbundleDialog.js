/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: SelectDocbundleDialog.js 22900 2018-01-12 08:00:42Z mschering $
 * @copyright Copyright Intermesh
 * @author Merijn Schering <mschering@intermesh.nl>
 */
GO.filesearch.SelectDocbundleDialog = function(config){
	if(!config)
	{
		config={};
	}
	var focusFirstField = function(){
		this.formPanel.items.items[0].focus();
	};


	this.formPanel = new Ext.form.FormPanel({
		cls:'go-form-panel',
		waitMsgTarget:true,
		autoHeight:true,
		baseParams:{
			task : 'add_to_docbundle',
			files : '',
			dirs : ''
		},
		url: GO.settings.modules.filesearch.url+'action.php',
		border: false,
		items:[{
			xtype:'combo',
			allowBlank:false,
			anchor:'100%',
			fieldLabel:t("Document bundle", "filesearch"),
			hiddenName:'docbundle_id',
			valueField:'id',
			displayField:'name',
			emptyText:t("Please select..."),
			store:new GO.data.JsonStore({	
				url: GO.url("filesearch/docbundle/store"),
				pageSize:parseInt(GO.settings.max_page_size),
				fields: ['id','name'],
				remoteSort: true
			}),
			mode:'remote',
			triggerAction:'all',
			editable:true,
			selectOnFocus:true,
			forceSelection:true
		}]
	});
	
	config.modal=true;
	config.resizable=false;
	config.width=400;
	config.autoHeight=true;
	config.closeAction='hide';
	config.title= t("Select document bundle", "filesearch");
	config.items= this.formPanel;
	config.focus= focusFirstField.createDelegate(this);
	config.buttons=[{
		text: t("Ok"),
		handler: function(){
			this.submitForm();
		},
		scope: this
	},{
		text: t("Cancel"),
		handler: function(){
			this.hide();
		},
		scope:this
	}];
	keys:[{
		scope:this,
		key: Ext.EventObject.ENTER,
		fn: this.submitForm
	}]
	GO.filesearch.SelectDocbundleDialog.superclass.constructor.call(this, config);
	this.addEvents({
		'save' : true
	});
}
Ext.extend(GO.filesearch.SelectDocbundleDialog, GO.Window,{
	show : function(config){
		
		if(config && config.files)
			this.formPanel.baseParams.files = Ext.encode(config.files);
		if(config && config.dirs)
			this.formPanel.baseParams.dirs = Ext.encode(config.dirs);

		GO.filesearch.SelectDocbundleDialog.superclass.show.call(this);
	},
	submitForm : function(){
		this.formPanel.form.submit(
		{
			url:GO.url("filesearch/docbundle/addFiles"),
			waitMsg:t("Saving..."),
			success:function(form, action){
				this.hide();	
			},
			failure: function(form, action) {
				if(action.failureType == 'client')
				{
					Ext.MessageBox.alert(t("Error"), t("You have errors in your form. The invalid fields are marked."));
				} else {
					Ext.MessageBox.alert(t("Error"), action.result.feedback);
				}
			},
			scope: this
		});
	}
});
