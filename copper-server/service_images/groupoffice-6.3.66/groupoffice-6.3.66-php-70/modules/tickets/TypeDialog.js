/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: TypeDialog.js 23368 2018-02-05 12:54:36Z mdhart $
 * @copyright Copyright Intermesh
 * @author Michiel Schmidt <michiel@intermesh.nl>
 * @author Merijn Schering <mschering@intermesh.nl>
 */

GO.tickets.TypeDialog = function(config){	
	
	if(!config)
	{
		config={};
	}
	
	this.buildForm();
	
	var focusFirstField = function(){
		this.propertiesPanel.items.items[0].focus();
	};
	
	config.layout='fit';
	config.title=t("Type", "tickets");
	config.maximizable=true;
	config.modal=false;
	config.width=700;
	config.height=600;
	config.resizable=false;
	config.minizable=true;
	config.closeAction='hide';	
	config.items=this.formPanel;
	config.focus=focusFirstField.createDelegate(this);
	config.buttons=[{
		text: t("Ok"),
		handler: function()
		{
			this.submitForm(true);
		},
		scope: this
	},{
		text: t("Apply"),
		handler: function()
		{
			this.submitForm();
		},
		scope:this
	},{
		text: t("Close"),
		handler: function()
		{
			this.hide();
		},
		scope:this
	}];
	
	GO.tickets.TypeDialog.superclass.constructor.call(this, config);
	
	this.addEvents({
		'save' : true
	});
}

Ext.extend(GO.tickets.TypeDialog, Ext.Window,{
		
	show : function (type_id)
	{
		if(!this.rendered)
			this.render(Ext.getBody());
		
		this.tabPanel.setActiveTab(0);
		
		if(!type_id)
		{
			type_id=0;			
		}
			
		this.setTypeId(type_id);
		
		if(this.type_id>0)
		{
			this.formPanel.load({
				url : GO.url("tickets/type/load"),
				
				success:function(form, action)
				{
					
					if(go.Modules.isAvailable("core", "customfields")){
						//GO\Tickets\Model\Ticket
						this.disableTemplateCategoriesPanel.setModel(this.type_id, "GO\\Tickets\\Model\\Ticket");
					}
					
					this.enableTemplates.checkbox.dom.checked = action.result.data.enable_templates;
					this.checkboxToggle(this.enableTemplates.checkbox, this.enableTemplates.checkbox.dom.checked);
					
					this.setRemoteComboTexts(action);
					this.setWritePermission(action.result.data.permission_level>=GO.permissionLevels.write);					
					this.readPermissionsTab.setAcl(action.result.data.acl_id);
					this._enableCustomSenderFields(action.result.data.custom_sender_field);
						
					GO.tickets.TypeDialog.superclass.show.call(this);
				},
				failure:function(form, action)
				{
					GO.errorDialog.show(action.result.feedback)
				},
				scope: this
			});
		}else {
			this.formPanel.form.reset();

			this.readPermissionsTab.setAcl(0);
			
			this.setWritePermission(true);
			
			GO.tickets.TypeDialog.superclass.show.call(this);
		}
	},
	setRemoteComboTexts : function(loadAction){
		if(loadAction.result.remoteComboTexts){
			var t = loadAction.result.remoteComboTexts;
			for(var fieldName in t){
				var f = this.formPanel.form.findField(fieldName);				
				if(f)
					f.setRemoteText(t[fieldName]);
			}
		}
	},
	setWritePermission : function(writePermission)
	{
		this.buttons[0].setDisabled(!writePermission);
		this.buttons[1].setDisabled(!writePermission);
	},
	setTypeId : function(type_id)
	{
		this.formPanel.form.baseParams['id']=type_id;
		
		if(go.Modules.isAvailable("legacy", "email"))
		{
			// Added for the email account selection
			this.selectAccount.store.baseParams['type_id']=type_id;
			this.selectAccount.clearLastSearch();
			this.selectAccount.store.removeAll();
		}
		
		this.type_id=type_id;
	},
	submitForm : function(hide)
	{
		this.formPanel.form.submit(
		{
			url:GO.url("tickets/type/submit"),
			
			waitMsg:t("Saving..."),
			params: {
				enable_templates: this.enableTemplates.checkbox.dom.checked
			},
			
			success:function(form, action)
			{
				this.fireEvent('save', this);
				
				if(hide)
				{
					this.hide();	
				}else{
					if(action.result.id)
					{
						this.setTypeId(action.result.id);
						
						this.readPermissionsTab.setAcl(action.result.acl_id);
					}
				}
			},		
			failure: function(form, action)
			{
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
	buildForm : function ()
	{
		var propItems = [ 
		{
			xtype:'textfield',
			name:'name',
			anchor:'95%',
			allowBlank:false,
			fieldLabel:t("Name")
		},{
			xtype: 'comboboxreset',
			name:'type_group_id',
			hiddenName: 'type_group_id',
			anchor:'95%',
			fieldLabel:t("Type group", "tickets"),
			mode: 'remote',
			pageSize: 10,
			emptyText:t("General", "tickets"),
			autoLoad: true,
			triggerAction: 'all',
			store: new GO.data.JsonStore({
				url: GO.url('tickets/typeGroup/store'),
				fields: ['id', 'name']
			}),
			valueField: 'id',
			displayField: 'name'
        },{
			xtype:'textarea',
			name:'description',
			anchor:'95%',
			allowBlank:true,
			fieldLabel:t("Description")
		},{
			xtype:'xcheckbox',
			name:'show_from_others',
			boxLabel:t("Show tickets from others with this type to regular users", "tickets"),
			hideLabel:true
		},{
			xtype:'xcheckbox',
			name:'email_to_agent',
			boxLabel:t("Send e-mail to agent when a customer replies", "tickets"),
			hideLabel:true
		},this.customSenderCB = new Ext.ux.form.XCheckbox({
			name:'custom_sender_field',
			boxLabel:t("Use alternate sender in emails to customer", "tickets"),
			hideLabel:true
		}),this.customSenderNameField = new Ext.form.TextField({
			name:'sender_name',			
			fieldLabel:t("Alternate sender name", "tickets"),
			anchor:'95%',
			allowBlank: false,
			disabled: true
		}),this.customSenderEmailField = new Ext.form.TextField({
			name:'sender_email',			
			fieldLabel:t("Alternate sender email", "tickets"),
			anchor:'95%',
			allowBlank: false,
			disabled: true
		}),{
			xtype:'xcheckbox',
			name:'publish_on_site',
			boxLabel:t("Show on external page", "tickets"),
			hideLabel:true
		}
		];
				
		this.customSenderCB.on('check',function(cb,checked){
			this._enableCustomSenderFields(checked);
		},this);
		
		if(GO.settings.modules.email && GO.settings.modules.email.read_permission)
		{
			
			propItems.push({
				style:'margin-top:20px; margin-bottom:5px;',
				anchor:'95%',
				xtype:'htmlcomponent',
				html:t("<b>Caution!</b> Select an IMAP mailbox below to automatically import mails as tickets. All e-mails from the inbox will be REMOVED after the import. So you must use a dedicated mail account for this.", "tickets")
			})
			
			this.selectAccount = new GO.form.ComboBoxReset({
				fieldLabel: t("Mailbox for new tickets", "tickets"),
				hiddenName:'email_account_id',
				anchor:'95%',
				emptyText:t("None"),
				store: new GO.data.JsonStore({
					url: GO.url("tickets/type/availableEmailAccounts"),
					fields: ['id', 'username'],
					remoteSort: true
				}),
				valueField:'id',
				displayField:'username',
				typeAhead: true,
				mode: 'remote',
				triggerAction: 'all',
				editable: true,
				selectOnFocus:true,
				forceSelection: true,
				pageSize:GO.settings.max_rows_list
			});

			propItems.push(this.selectAccount);
		}
		
		this.propertiesPanel = new Ext.Panel({
			url:GO.settings.modules.tickets.url+'action.php',
			border:false,
			baseParams:{
				task:'type'
			},
			title:t("Properties"),	
			cls:'go-form-panel',
			waitMsgTarget:true,			
			layout:'form',
			autoScroll:true,
			items:propItems
		});
						     		
		this.readPermissionsTab = new GO.grid.PermissionsPanel({
			levels: [
				GO.permissionLevels.read, 
				GO.permissionLevels.write, 
				GO.permissionLevels.writeAndDelete, 
				GO.permissionLevels.manage
			]
		});
		
		
		this.templates = new Ext.Panel({
			title: t('E-mail notifications', 'tickets'),
			autoScroll: true,
			cls:'go-form-panel',
			bodyStyle:'padding:5px',
			defaults:{
				hideLabel: true
			},
			items: [
				this.enableTemplates = new Ext.form.FieldSet({
					defaults:{
						hideLabel: true
					},
					title: t("Notify following email addresses when new tickets are created", "tickets"),
					items: [
						new Ext.form.Label({
							text: t("\"E-mail to\" on new", "tickets"),
						}),
						new Ext.form.TextArea({
							xtype:'textarea',
							name:'email_on_new',			
							//fieldLabel:t("\"E-mail to\" on new", "tickets"),
							anchor:'100%'
						}),
						new Ext.form.Label({
							text: t("E-mail body", "tickets"),
						}),
						new Ext.form.TextArea({
							xtype:'textarea',
							name:'email_on_new_msg',			
							//fieldLabel:t("\"E-mail to\" on new", "tickets"),
							anchor:'100%'
						})
					]
				}),
				
				this.enableTemplates = new Ext.form.FieldSet({
					collapsible: false,
					onCheckClick: function(e) {
						// add collapsible 
						this.fireEvent('onCheckboxToggle', this,this.checkbox.dom.checked);
					},
					checkboxToggle: true,
					name: 'enable_templates',
					title: t('enable templates by type', 'tickets'),
					checked: false,
					items: []
				}) 
			]
		});
		
		this.enableTemplates.add(
			this.settingsTemplatesForm = new GO.tickets.SettingsTemplatesForm({
				disabled: !this.enableTemplates.checked
			})
		)
//		this.checkbox, 'click'
		this.enableTemplates.on('onCheckboxToggle', this.checkboxToggle, this);
		
		var items = [
			this.propertiesPanel, 
			this.readPermissionsTab, 
			this.templates
		];
		
		if(go.Modules.isAvailable("core", "customfields")){
			this.disableTemplateCategoriesPanel = new GO.customfields.DisableCategoriesPanel({
				title:t("Enabled customfields", "customfields")
			});
			items.push(this.disableTemplateCategoriesPanel);        
		}
			 
		this.tabPanel = new Ext.TabPanel({
			activeTab:0,      
			deferredRender:false,
			border:false,
			items:items,
			anchor:'100% 100%'
		});
	    
		this.formPanel = new Ext.form.FormPanel({
			waitMsgTarget:true,
			url:GO.settings.modules.tickets.url+'action.php',
			border:false,
			baseParams:{
				task:'type'
			},
			items:this.tabPanel
			
			
			
		});
		
	},
	
	_enableCustomSenderFields : function(enable) {
		var disable = !enable;
		this.customSenderNameField.setDisabled(disable);
		this.customSenderEmailField.setDisabled(disable);
	},
	
	checkboxToggle: function(chechBox, checked) {
		if(checked) {
				this.settingsTemplatesForm.enable();
			} else {
				this.settingsTemplatesForm.disable();
			}
	} 
});
