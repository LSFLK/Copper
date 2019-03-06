/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @copyright Copyright Intermesh
 * @version $Id: DuplicateDialog.js 22862 2018-01-12 08:00:03Z mschering $
 * @author Merijn Schering <mschering@intermesh.nl>
 */

 
GO.billing.DuplicateDialog = function(config){
	
	config = config || {};

	this.formPanel = new Ext.form.FormPanel({
		waitMsgTarget:true,
		border: false,
		baseParams: {
			id: 0
		},			
		cls:'go-form-panel',			
		layout:'form',
		autoHeight:true,
		labelWidth:200,
		items:[
		new Ext.form.ComboBox({
			hiddenName: 'status_id',
			fieldLabel: t("Change status of current order", "billing"),
			store: GO.billing.orderStatusesStore, // GO.billing.orderStatusSelectStore,
			valueField:'id',
			displayField:'name',
			mode: 'local',
			triggerAction: 'all',
			emptyText: t("Don't change the status", "billing"),
			anchor: '-20',
			editable: false
		}),this.newBookField = new Ext.form.ComboBox({
			hiddenName: 'new_book_id',
			fieldLabel: t("Copy to book", "billing"),
			store: GO.billing.writableBooksStore,
			valueField:'id',
			displayField:'name',
			typeAhead: true,
			mode: 'local',
			triggerAction: 'all',
			editable: false,
			anchor: '-20'
		}),new Ext.form.Checkbox({
			boxLabel: t("Notify customer?", "billing"),
			labelSeparator: '',
			name: 'notify_customer',		
			allowBlank: true,
			hideLabel:true
		}),new Ext.form.Checkbox({
			boxLabel: t("Duplicate links", "billing"),
			labelSeparator: '',
			name: 'duplicate_links',		
			allowBlank: true,
			hideLabel:true
		}),new Ext.ux.form.XCheckbox({
			hideLabel: true,
			boxLabel: t("Link duplicate to original", "billing"),
			name: 'link_to_original',
			value: false
		})]
				
	});
	
	
	var focusFirstField = function(){
		this.formPanel.items.items[0].focus();
	};
	
	
	config.maximizable=true;
	config.layout='fit';
	config.modal=true;
	config.resizable=false;
	config.width=500;
	config.autoHeight=true;
	config.closeAction='hide';
	config.title= t("Duplicate order", "billing");					
	config.items= this.formPanel;
	config.focus= focusFirstField.createDelegate(this);
	config.buttons=[{
		text: t("Ok"),
		handler: function(){
			this.submitForm(true);
		},
		scope: this
	},{
		text: t("Cancel"),
		handler: function(){
			this.hide();
		},
		scope:this
	}					
	];
	
	GO.billing.DuplicateDialog.superclass.constructor.call(this, config);
	this.addEvents({
		'save' : true
	});	
}
Ext.extend(GO.billing.DuplicateDialog, Ext.Window,{
	
	show : function (order_id, book_id) {
			
		GO.billing.DuplicateDialog.superclass.show.call(this);
		
		
		this.formPanel.form.reset();
		this.formPanel.baseParams.id=order_id;
		
		this.newBookField.setValue(book_id);

	},
	
	
	submitForm : function(hide){
		this.formPanel.form.submit(
		{
			url:GO.url("billing/order/duplicate"),			
			waitMsg:t("Saving..."),
			success:function(form, action){
				
				this.fireEvent('save', this, action.result.new_order_id, this.newBookField.getValue());
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
