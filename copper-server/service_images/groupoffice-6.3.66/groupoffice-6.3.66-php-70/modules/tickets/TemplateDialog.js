/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: TemplateDialog.js 23368 2018-02-05 12:54:36Z mdhart $
 * @copyright Copyright Intermesh
 * @author Michiel Schmidt <michiel@intermesh.nl>
 * @author Merijn Schering <mschering@intermesh.nl>
 */

GO.tickets.TemplateDialog = function(config){

	if(!config)
	{
		config = {};
	}

	this.buildForm();

	var focusFirstField = function(){
		this.formPanel.items.items[0].focus();
	};

	config.layout='fit';
	config.title=t("Template", "tickets");
	config.modal=false;
	config.border=false;
	config.width=600;
	config.height=430;
	config.resizable=true;
	config.closeAction='hide';
	config.items=this.formPanel;
	config.focus=focusFirstField.createDelegate(this);
	config.buttons=[{
		text:t("Save"),
		handler: function()
		{
			this.submitForm(true)
		},
		scope: this
	}];
		
	GO.tickets.TemplateDialog.superclass.constructor.call(this,config);
	
	this.addEvents({
		'save' : true
	});
}

Ext.extend(GO.tickets.TemplateDialog, GO.Window, {
	
	show : function (record)
	{		
		if(!this.rendered)
			this.render(Ext.getBody());
			
		if(record)
		{
			this.template_id=record.data.id;
		}else
		{
			this.template_id=0;
		}
      
		if(this.template_id > 0)
		{			
			Ext.Ajax.request({
				url: GO.url("tickets/template/load"),
				params: {
					id: this.template_id
				},
				scope: this,
				callback: function(options, success, response)
				{
					var data = Ext.decode(response.responseText);
					
					if (!data.success)
					{					
						GO.errorDialog.show(data.feedback)
					} else {
						this.formPanel.form.setValues(data.data);
					}
					
					this.disableTemplateCategoriesPanel.setModel(this.template_id, "GO\\Tickets\\Model\\Ticket");
				}
			});			
		}else
		{
			this.formPanel.form.reset();
		}
		
		GO.tickets.TemplateDialog.superclass.show.call(this);
	
	},
	submitForm : function(hide)
	{
		this.formPanel.form.submit(
		{		
			url:GO.url("tickets/template/submit"),
			params: {				
				id:this.template_id
			},
			waitMsg:t("Saving..."),
			success:function(form, action)
			{
				if(action.result.id)
				{
					this.template_id=action.result.id;
				}

				if(this.formPanel.form.findField('ticket_created_for_client').getValue())
				{
					GO.tickets.ticketCreatedforClientTemplateID=this.template_id;
				}
			
				this.fireEvent('save');
				
				if(hide)
				{
					this.hide();
				}
			},
			failure: function(form, action) 
			{
				var error = '';
				if(action.failureType=='client')
				{
					error = t("You have errors in your form. The invalid fields are marked.");
				}
				else
				{
					error = action.result.feedback;
				}
				Ext.MessageBox.alert(t("Error"), error);
			},
			scope:this
		});		
	},
	buildForm : function () 
	{		
		this.formPanel = new Ext.FormPanel({
			cls:'go-form-panel',
			anchor:'100% 100%',
			bodyStyle:'padding:5px',
			defaults:{
				anchor: '95%'
			},
			defaultType:'textfield',
			waitMsgTarget:true,
			labelWidth:75,
			items: [
			{
				fieldLabel: t("Name"),
				name: 'name',
				allowBlank:false
			},{
				xtype:'textarea',
				name:'content',
				fieldLabel:t("Template", "tickets"),
				height:210,
				allowBlank:false
			},{
				xtype:'xcheckbox',
				name:'default_template',
				boxLabel:t("Default response", "tickets"),
				hideLabel:true
			}
//			,{
//				xtype:'xcheckbox',
//				name:'autoreply',
//				boxLabel:t("Auto reply", "tickets"),
//				hideLabel:true
//			}
			,{
				xtype:'xcheckbox',
				name:'ticket_created_for_client',
				boxLabel:t("Use this template when an agent creates a ticket for the customer", "tickets"),
				hideLabel:true
			}
//			,{
//				xtype:'xcheckbox',
//				name:'ticket_mail_for_agent',
//				boxLabel:t("Ticket created for agent", "tickets"),
//				hideLabel:true
//			},{
//				xtype:'xcheckbox',
//				name:'ticket_claim_notification',
//				boxLabel:t("Ticket claim notification", "tickets"),
//				hideLabel:true
//			}
			]
		});
		
		if(go.Modules.isAvailable("core", "customfields")){
			this.disableTemplateCategoriesPanel = new GO.customfields.DisableCategoriesPanel({
				title:t("Enabled customfields", "customfields")
			});     
		}

	}
});
