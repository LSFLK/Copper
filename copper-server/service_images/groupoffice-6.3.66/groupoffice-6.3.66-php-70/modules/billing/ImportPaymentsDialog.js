GO.billing.ImportPaymentsDialog = Ext.extend(GO.Window,{
	title:t("Import payments", "billing"),
	layout:'card',
	maximizable:true,
	collapsible:true,
	width:1000,
	height:500,
	initComponent:function(){
		
		this.uploadFile = new GO.form.UploadFile({
			inputName : 'importfile',
			max:1  				
		});		
		
		this.formPanel = new Ext.form.FormPanel({
			fileUpload:true,
			cls:'go-form-panel',
			url:GO.url('billing/order/mt940'),
			items:[{
					xtype:'htmlcomponent',
					html:t("Select an MT940 file and click on continue. On the next screen you can match invoices or orders to the payment transaction. The application will try to match the invoice already for you based on the transaction description. You have to click on the save icon for each invoice that's correct. Invoices set to IGNORE will be ignored and nothing will be changed.", "billing")
				},
				this.uploadFile],
			buttons:[{
					text:t("Continue"),
					handler:function(){
						this.submitForm();
					},
					scope:this
			}]
		});
		
		this.gridPanel = new GO.billing.ImportPaymentsGrid();
		
		this.items=[this.formPanel, this.gridPanel];
		
		this.on('show',function(){this.getLayout().setActiveItem(this.formPanel);}, this);
	
		GO.billing.ImportPaymentsDialog.superclass.initComponent.call(this);
	},
	submitForm:function(){
		this.formPanel.form.submit({
			success:function(form, action){
				
				this.gridPanel.store.loadData(action.result);
				this.getLayout().setActiveItem(this.gridPanel);
			},
			failure:function(form, action){
				GO.errorDialog.show(action.result.feedback);
			},
			scope:this
		})
	}
})
