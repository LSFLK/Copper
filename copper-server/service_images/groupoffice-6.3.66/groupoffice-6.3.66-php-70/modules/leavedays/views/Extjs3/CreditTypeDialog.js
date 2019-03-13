
GO.leavedays.CreditTypeDialog = Ext.extend(GO.dialog.TabbedFormDialog , {
	
	initComponent : function(){
		Ext.apply(this, {
			title: t("Type", "leavedays"),
			height: 320,
			resizable: false,
			autoScroll:true,
      formControllerUrl: 'leavedays/creditType',
//			jsonPost:true,
cls:'go-form-panel',
			updateAction: 'update',
			createAction: 'create'
		});
		
		GO.leavedays.CreditTypeDialog.superclass.initComponent.call(this);	
	},
	
	buildForm: function() {
		
		
		this.typeForm = new Ext.Panel({
			
			layout:'form',
			items: [
				this.nameField = new Ext.form.TextField({
					name: 'name',
					width: 300,
					anchor: '100%',
					maxLength: 100,
					allowBlank: false,
					fieldLabel: t("Name")
				}),
				this.descriptionField = new Ext.form.TextArea({
					name: 'description',
					width: 300,
					anchor: '100%',
					fieldLabel: t("Description")
				}),
				this.creditDoesntExpiredField = new Ext.ux.form.XCheckbox({
					name: 'credit_doesnt_expired',
					width: 300,
					anchor: '100%',
					maxLength: 100,
					boxLabel: t("Remaining credit may automatically taken to next year", "leavedays")
				})
				
			
		
			]
		});
		
		this.addPanel(this.typeForm);
		
	}
	
	
	
});
