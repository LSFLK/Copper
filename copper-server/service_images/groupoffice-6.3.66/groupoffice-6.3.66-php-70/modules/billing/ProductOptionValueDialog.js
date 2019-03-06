GO.billing.ProductOptionValueDialog = Ext.extend(GO.dialog.TabbedFormDialog , {
	
	initComponent : function(){
		
		Ext.apply(this, {
			goDialogId:'product-option',
			title:t("Option Selection", "billing"),
			formControllerUrl: 'billing/productOptionValue',
      width: 450,
      height: 200
		});
		
		GO.billing.ProductOptionValueDialog.superclass.initComponent.call(this);	
	},
	
	buildForm : function () {
		
		var items = [];
		
		var records = GO.billing.languagesStore.getRange();
		
		for(var i=0;i<records.length;i++)
		{
			var textfield = new Ext.form.TextField({
				fieldLabel:t("Name")+' ('+records[i].get("name")+')',
				name:"name_"+records[i].get("id"),
				anchor:'-20',
				allowBlank: false
			});
			
			items.push(textfield);	
		}
		
		this.valueField = new Ext.form.NumberField({
			fieldLabel:t("Price", "billing"),
			name:"value",
			anchor:'-20',
			allowBlank: false
		});
		
		items.push(this.valueField);	
		
		this.propertiesPanel = new Ext.Panel({
			title:t("Properties"),			
			cls:'go-form-panel',
			layout:'form',
			items:items,
			labelWidth:130
		});

		this.addPanel(this.propertiesPanel);
	},
	setProductOptionId : function(productOptionId){
		this.formPanel.baseParams.product_option_id = productOptionId
	}
});
