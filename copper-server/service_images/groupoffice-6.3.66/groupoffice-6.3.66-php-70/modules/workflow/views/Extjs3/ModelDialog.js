GO.workflow.ModelDialog = Ext.extend(GO.dialog.TabbedFormDialog , {
	
	initComponent : function(){
		
		Ext.apply(this, {
			goDialogId:'model',
			title:t("Workflow", "workflow"),
			titleField:'process_id',
			formControllerUrl: 'workflow/model',
			enableApplyButton:false,
			height: dp(200),
			width:dp(500),
			formPanelConfig:{
				labelWidth:150
			}
		});
		
		GO.workflow.ModelDialog.superclass.initComponent.call(this);	
	},
	  
	buildForm : function () {

		this.selectProcess = new GO.form.ComboBox({
			fieldLabel: t("Process", "workflow"),
			hiddenName:'process_id',
			anchor:'100%',
			value: 1,
			valueField:'id',
			displayField:'name',
			store: GO.workflow.processStore,
			mode:'remote',
			triggerAction:'all',
			editable:true,
			selectOnFocus:true,
			forceSelection:true,
			allowBlank:false,
			emptyText:t("Please select...")
		});

		this.propertiesPanel = new Ext.Panel({
			title:t("Properties"),			
			cls:'go-form-panel',
			layout:'form',
			items:[
//				{
//					xtype: 'textfield',
//					name: 'model_id',
//					width:300,
//					anchor: '100%',
//					maxLength: 100,
//					allowBlank:false,
//					fieldLabel: t("Model", "workflow")
//				},
//				{
//					xtype: 'textfield',
//					name: 'model_type_id',
//					width:300,
//					anchor: '100%',
//					maxLength: 100,
//					allowBlank:false,
//					fieldLabel: t("Model type", "workflow")
//				},
				this.selectProcess,
//				{
//					xtype: 'textfield',
//					name: 'step_id',
//					width:300,
//					anchor: '100%',
//					maxLength: 100,
//					allowBlank:false,
//					fieldLabel: t("Step", "workflow")
//				},{
//					xtype: 'textfield',
//					name: 'ctime',
//					width:300,
//					anchor: '100%',
//					maxLength: 100,
//					allowBlank:false,
//					fieldLabel: t("Created at", "workflow")
//  			},
//				{
//					xtype: 'textfield',
//					name: 'due_time',
//					width:300,
//					anchor: '100%',
//					maxLength: 100,
//					allowBlank:false,
//					fieldLabel: t("Due until", "workflow")	
//				},
				{
					xtype: 'numberfield',
					name: 'shift_due_time',
					width:100,					
					decimals:0,
					value:0,
					fieldLabel: t("Shift due time (hours)", "workflow")
				}				
			]				
		});
		
    this.addPanel(this.propertiesPanel);
	}
});
