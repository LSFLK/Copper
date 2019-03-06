GO.billing.ProductOptionDialog = Ext.extend(GO.dialog.TabbedFormDialog , {
	
	initComponent : function(){
		
		Ext.apply(this, {
			goDialogId:'product-option',
			title:t("Option", "billing"),
			formControllerUrl: 'billing/productOption',
      width: 600,
      height: 400
		});
		
		GO.billing.ProductOptionDialog.superclass.initComponent.call(this);	
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
		
		this.propertiesPanel = new Ext.Panel({
			title:t("Properties"),			
			cls:'go-form-panel',
			layout:'form',
			items:items
		});
		
		this.productOptionValueGrid = new GO.billing.ProductOptionValueGrid();

		this.addPanel(this.propertiesPanel);
		this.addPanel(this.productOptionValueGrid,'product_option_id');
	},
	setProductId : function(productId){
		this.formPanel.baseParams.product_id = productId
	}
});
