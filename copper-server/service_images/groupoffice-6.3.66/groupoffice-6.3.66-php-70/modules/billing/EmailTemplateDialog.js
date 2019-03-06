/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @copyright Copyright Intermesh
 * @version $Id: EmailTemplateDialog.js 22862 2018-01-12 08:00:03Z mschering $
 * @author Merijn Schering <mschering@intermesh.nl>
 */

 
GO.billing.EmailTemplateDialog = function(config){
	if(!config)
	{
		config={};
	}	
	this.buildForm();	
	var focusFirstField = function(){
		this.formPanel.items.items[0].focus();
	};	
	
	config.maximizable=true;
	config.layout='fit';
	config.modal=false;
	config.resizable=false;
	config.width=700;
	config.height=500;
	config.closeAction='hide';
	config.title= t("E-mail template", "billing");					
	config.items= this.formPanel;
	config.focus= focusFirstField.createDelegate(this);
	config.tbar=[this.htmlEditPanel.getAttachmentsButton()];
	config.buttons=[{
			text: t("Ok"),
			handler: function(){
				this.submitForm(true);
			},
			scope: this
		},{
			text: t("Apply"),
			handler: function(){
				this.submitForm();
			},
			scope:this
		},{
			text: t("Close"),
			handler: function(){
				this.hide();
			},
			scope:this
		}					
	];
	
	GO.billing.EmailTemplateDialog.superclass.constructor.call(this, config);
	this.addEvents({'save' : true});	
}
Ext.extend(GO.billing.EmailTemplateDialog, Ext.Window,{
	
	inline_attachments : [],
	
	show : function (status_id, language_id) {
		if(!this.rendered)
		{
			this.render(Ext.getBody());
		}		
		this.setEmailTemplateId(status_id, language_id);
		

		this.formPanel.load({				
			url: GO.url("billing/status/loadEmailTemplate"),
			success:function(form, action)
			{
				this.inline_attachments=action.result.data.inline_attachments;
				
				GO.billing.EmailTemplateDialog.superclass.show.call(this);
			},
			failure:function(form, action)
			{
				GO.errorDialog.show(action.result.feedback)
			},
			scope: this
			
		});
	},
	
	setEmailTemplateId : function(order_status_id, language_id)
	{
		this.formPanel.form.baseParams['language_id']=language_id;
		this.formPanel.form.baseParams['id']=order_status_id;
		this.language_id=language_id;
		this.order_status_id=order_status_id;		
	},
	
	submitForm : function(hide){
		this.formPanel.form.submit(
		{
			url:GO.url("billing/status/submitEmailTemplate"),

			waitMsg:t("Saving..."),
			success:function(form, action){
				
				this.fireEvent('save', this);
				
				if(hide)
				{
					this.hide();	
				}					
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
		
	},
	
	
	buildForm : function () {
		
		this.formPanel = new Ext.form.FormPanel({
			baseParams:{language_id:0},			
			border: false,
			waitMsgTarget:true,			
			cls:'go-form-panel',			
			layout:'form',
			anchor:'100% 100%',
			items:[{
				xtype: 'textfield',
			  name: 'email_subject',
				anchor: '100%',
			  allowBlank:false,
			  fieldLabel: t("Subject")
			},this.htmlEditPanel = new GO.base.email.EmailEditorPanel({
				anchor: '100% -50'
			})]
				
		});
		    
	}
});
