/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: TemplateEventDialog.js 22922 2018-01-12 08:01:04Z mschering $
 * @copyright Copyright Intermesh
 * @author Merijn Schering <mschering@intermesh.nl>
 */
GO.projects2.TemplateEventDialog = function(config){	
	if(!config)
	{
		config={};
	}
	this.buildForm();
	var focusFirstField = function(){
		this.formPanel.items.items[0].focus();
	};
	config.collapsible=true;
	config.maximizable=true;
	config.layout='fit';
	config.modal=false;
	config.resizable=false;
	config.width=700;
	config.height=440;
	config.closeAction='hide';
	config.title= t("Job", "projects2");					
	config.items= this.formPanel;
	config.focus= focusFirstField.createDelegate(this);
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
	GO.projects2.TemplateEventDialog.superclass.constructor.call(this, config);
	this.addEvents({
		'save' : true
	});
}
Ext.extend(GO.projects2.TemplateEventDialog, Ext.Window,{
	show : function (id) {
//		if(!this.templateCombo.store.loaded){
//			this.templateCombo.store.load({
//				callback:function(){
//					this.show(template_event_id);
//				},
//				scope:this
//			});
//			return false;
//		}

		if(!this.rendered)
		{
			this.render(Ext.getBody());
		}

		//delete this.formPanel.baseParams.template_id;

		this.formPanel.form.reset();

		if(!id)
		{
			id=0;			
		}
		this.setTemplateEventId(id);
		if(id>0)
		{
			this.formPanel.load({
				url : GO.url('projects2/templateEvent/load'),
				waitMsg:t("Loading..."),
				success:function(form, action)
				{					
					GO.projects2.TemplateEventDialog.superclass.show.call(this);
					
					this.formPanel.baseParams.template_id=action.result.data.template_id;
//					this.templateCombo.setDisabled(action.result.data.type!='project');

					GO.dialog.TabbedFormDialog.prototype.setRemoteComboTexts.call(this, action);
					
					this._toggleFields(this.typeField.getValue());
					
				},
				failure:function(form, action)
				{
					GO.errorDialog.show(action.result.feedback);
				},
				scope: this				
			});
		}else 
		{
//			this.templateCombo.setDisabled(false);
			GO.projects2.TemplateEventDialog.superclass.show.call(this);
		}

	//console.log(this.formPanel.baseParams);
	},
	setTemplateEventId : function(id)
	{
		this.formPanel.baseParams['id']=id;
		this.template_event_id=id;
	},
	submitForm : function(hide){
		this.formPanel.form.submit(
		{
			url: GO.url('projects2/templateEvent/submit'),
			params: {
//				'task' : 'save_template_event'
			},
			waitMsg:t("Saving..."),
			success:function(form, action){
				if(action.result.id)
				{
					this.setTemplateEventId(action.result.id);
				}				
				this.fireEvent('save', this, this.template_event_id);				
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

		
		/*if(go.Modules.isAvailable("legacy", "calendar"))
		{
			data.push(['event', t("Appointment", "calendar")]);
		}*/

		this.typeField = new Ext.form.ComboBox({
			fieldLabel : t("Type"),
			hiddenName : 'type',
			store : GO.projects2.templateJobTypesStore,
			value : 'project',
			valueField : 'value',
			displayField : 'text',
			mode : 'local',
			triggerAction : 'all',
			editable : false,
			selectOnFocus : true,
			forceSelection : true,
			anchor: '-20',
			listeners:{
				select: function(cb, record){
					this._toggleFields(record.data.value);
				},
				change: function(cb, newV){
					this._toggleFields(newV);
				},
				scope:this
			}
		});


		this.formPanel = new Ext.form.FormPanel({
			waitMsgTarget:true,
			url: GO.url('projects2/templateEvent/submit'),
			border: false,
			baseParams: {
//				task: 'template_event',
				template_id:0
			},
			//title:t("Properties"),
			cls:'go-form-panel',			
			layout:'form',
			autoScroll:true,
			items:[
			this.typeField,
			this.templateCombo =  new GO.form.ComboBox({
				xtype: 'combo',
				store:GO.projects2.templatesStore,
				name:'new_template_name',
				hiddenName: 'new_template_id',
				anchor: '-20',
				fieldLabel: t("Template", "projects2"),
				mode:'local',
				triggerAction:'all',
				forceSelection:true,
				displayField:'name',
				valueField:'id',
				allowBlank:false,
				pageSize: parseInt(GO.settings.max_rows_list)
			}), {
				xtype: 'textfield',
				name: 'name',
				anchor: '-20',
				fieldLabel: t("Name")
			},{
				xtype: 'xcheckbox',
				name: 'for_manager',
				fieldLabel: t("For manager", "projects2"),
				listeners: {
					check: function(cc, checked) {
						this.selectUser.setDisabled(checked);
					},
					scope:this
				}
			},
			this.selectUser = new GO.projects2.SelectEmployee({				
				anchor:'-20',
				hiddenName: 'user_id',
				allowBlank:true
			}),{
				xtype: 'textarea',
				name: 'description',
				anchor: '-20',
				fieldLabel: t("Description")
			}
			,this.timeOffsetField = new Ext.form.NumberField({
				xtype: 'numberfield',
				name: 'time_offset',
				anchor: '-20',
				fieldLabel: t("Start after (Days)", "projects2")
			})
			,{
				xtype: 'numberfield',
				name: 'duration',
				anchor: '-20',
				fieldLabel: t("Duration", "projects2")
			}
			]
		});
	},
	
	_toggleFields : function(templateType) {

		this.templateCombo.setDisabled(templateType!='project');
		this.templateCombo.setVisible(templateType=='project');
//		this.timeOffsetField.setDisabled(templateType=='task');
//		this.timeOffsetField.setVisible(templateType!='task');
		
	}
});
