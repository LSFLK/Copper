GO.workflow.TriggerDialog = Ext.extend(GO.dialog.TabbedFormDialog , {
	
	initComponent : function(){
		
		Ext.apply(this, {
			goDialogId:'trigger',
			title:t("Trigger", "workflow"),
			titleField:'name',
			formControllerUrl: 'workflow/trigger'
		});
		
		GO.workflow.TriggerDialog.superclass.initComponent.call(this);	
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
				{
					xtype: 'textfield',
					name: 'model_type_id',
					width:300,
					anchor: '100%',
					maxLength: 100,
					allowBlank:false,
					fieldLabel: t("Type", "workflow")
				},{
					xtype: 'textfield',
					name: 'model_attribute',
					width:300,
					anchor: '100%',
					maxLength: 100,
					allowBlank:false,
					fieldLabel: t("Attribute", "workflow")
				},{
					xtype: 'textfield',
					name: 'model_attribute_value',
					width:300,
					anchor: '100%',
					maxLength: 100,
					allowBlank:false,
					fieldLabel: t("Value", "workflow")
				},
				this.selectProcess
			]				
		});
		
    this.addPanel(this.propertiesPanel);
	}
});
