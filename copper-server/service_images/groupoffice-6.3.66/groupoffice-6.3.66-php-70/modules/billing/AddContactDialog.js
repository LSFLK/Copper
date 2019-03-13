/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: AddContactDialog.js 22862 2018-01-12 08:00:03Z mschering $
 * @copyright Copyright Intermesh
 * @author Wesley Smits <wsmits@intermesh.nl>
 */

GO.billing.AddContactDialog = function(config){

	if(!config)
	{
		config={};
	}

	this.addToAddressbook = false;

	this.selectAddressbook = new GO.addressbook.SelectAddressbook({
		fieldLabel:t("Select addressbook", "billing"),
		anchor:'100%'
	});

	this.formPanel = new Ext.form.FormPanel({
		labelWidth:60,
		//url: GO.settings.modules.billing.url+'action.php',
		border: false,
		//baseParams: {task: 'l'},
		cls:'go-form-panel',
		waitMsgTarget:true,
		autoScroll:true,
		items:[{
			xtype: 'box',
			autoEl: {cn: t("The given user doesn\'t exist in the addressbook. Do you want to add the user to the addressbook?", "billing")}
		},this.selectAddressbook]
	});

	config.maximizable=true;
	config.layout='fit';
	config.modal=false;
	config.resizable=false;
	config.width=400;
	config.height=140;
	config.closeAction='hide';
	config.title= t("Add Contact", "billing");
	config.items= [this.formPanel];
	config.buttons=[{
		text: t("Yes"),
		handler: function(){
			this.addToAddressbook = true;
			this.hide();
			this.addToAddressbook = false;
		},
		scope: this
	},{
		text: t("No"),
		handler: function(){
			this.hide();
		},
		scope:this
	}];

	GO.billing.AddContactDialog.superclass.constructor.call(this, config);
}

Ext.extend(GO.billing.AddContactDialog, GO.Window,{
	getData : function(hide){
			this.selectAddressbook.getValue();
	}
});
