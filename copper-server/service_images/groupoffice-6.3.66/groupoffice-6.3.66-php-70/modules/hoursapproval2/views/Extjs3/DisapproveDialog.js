GO.hoursapproval2.DisapproveDialog =  Ext.extend(GO.dialog.TabbedFormDialog , { 
	
	
	
	initComponent : function() {		
		Ext.apply(this, {
			title: t("Disapprove", "hoursapproval2"),
			goDialogId: Ext.id(),
			loadOnNewModel:false,
			width: 450,
			height: 200,
			jsonPost:true,
//			updateAction: 'update',
			createAction: 'disapprove',
			enableApplyButton: false,
			formControllerUrl: 'hoursapproval2/approve/disapprove'
		});
		
		GO.hoursapproval2.DisapproveDialog.superclass.initComponent.call(this);
		
	},
	
	buildForm : function () {
		
		this.textField = new Ext.form.TextArea({
			name: 'msg',
			allowBlank:false,
			anchor:'100%',
			hideLabel: true,
			labelWidth: 0,
		});
		
		this.form = new Ext.Panel({
			title:t("Properties"),
			cls:'go-form-panel',
			layout:'form',
			hideLabel: true,
			labelWidth: 0,
			border:false,
			items:[
				{html: t("Please enter the reason for disapproval", "hoursapproval2")},
				this.textField
			]				
		});

		this.addPanel(this.form);
		
	},
	
	
	getSubmitParams : function () {
		this.showConfig 
		
		var params = this.formPanel.getForm().getValues();
		params.list = this.showConfig.list;
		
		
		return params;
		
	}
	
	
	
});
