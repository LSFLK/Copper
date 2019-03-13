GO.workflow.StepHistoryDialog = Ext.extend(GO.dialog.TabbedFormDialog , {
	
	initComponent : function(){
		
		Ext.apply(this, {
			goDialogId:'stephistory',
			title:t("Step", "workflow"),
			//titleField:'name',
			formControllerUrl: 'workflow/stepHistory',
			height: 200
		});
		
		GO.workflow.StepHistoryDialog.superclass.initComponent.call(this);	
	},
	  
	buildForm : function () {

		this.propertiesPanel = new Ext.Panel({
			title:t("Properties"),			
			cls:'go-form-panel',
			layout:'form',
			items:[
				{
					xtype: 'textarea',
					name: 'comment',
					width:300,
					anchor: '100% 100%',
					allowBlank:false,
					fieldLabel: t("Comment", "workflow"),
					hideLabel: true
				}
			]				
		});
		
    this.addPanel(this.propertiesPanel);
	},
	
	setProcessModelId: function(pmid){
		this.formPanel.form.baseParams.process_model_id = pmid;
	},
	
	setStatus: function(status){
		this.formPanel.form.baseParams.status = status;
	},
	afterSubmit : function(action){
		GO.checker.checkForNotifications();
		GO.workflow.StepHistoryDialog.superclass.afterSubmit.call(this,action);
	}	
});
