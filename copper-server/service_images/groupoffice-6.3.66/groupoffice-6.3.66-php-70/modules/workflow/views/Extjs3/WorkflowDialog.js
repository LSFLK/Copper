GO.workflow.WorkflowDialog = Ext.extend(GO.dialog.TabbedFormDialog , {
	
	initComponent : function(){
		
		Ext.apply(this, {
			goDialogId:'workflow',
			title:t("Workflow", "workflow"),
			formControllerUrl: 'workflow/workflow'
		});
		
		GO.workflow.WorkflowDialog.superclass.initComponent.call(this);	
	},
	  
	buildForm : function () {
	
		this.propertiesPanel = new Ext.Panel({
			title:t("Properties"),			
			cls:'go-form-panel',
			layout:'form',
			items:[]				
		});

    this.addPanel(this.propertiesPanel);
	}
});
