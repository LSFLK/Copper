GO.billing.StockDialog = function(config){
	
	if(!config)
	{
		config={};
	}		

	this.productsGrid = new GO.billing.ProductsGrid({
		region:'center',
		selectProducts:true,
		lowStockOnly:true,
		selectCategories:false
	});

	this.formPanel = new Ext.form.FormPanel({
		region:"south",
		height:40,
		cls:'go-form-panel',
		labelWidth:250,
		waitMsgTarget:true,
		items:[
		this.selectStatus = new Ext.form.ComboBox({
			hiddenName: 'status_id',
			fieldLabel: t("Select a status for the purchase orders", "billing"),
			store: GO.billing.orderStatusesStore,
			valueField:'id',
			displayField:'name',
			mode: 'local',
			triggerAction: 'all',
			editable:false,
			selectOnFocus:true,
			allowBlank:false,
			forceSelection: true,
			anchor: '-20'
		})
		]
	});
		
	config.layout='border';
	config.modal=true;
	config.resizable=true;
	config.border=false;
	config.maximizable=true;
	config.width=750;
	config.height=500;
	config.closeAction='hide';
	config.title= t("Stock", "billing");
	config.items=[this.productsGrid, this.formPanel];
	config.buttons=[{
		text: t("Ok"),
		handler: function(){
			this.submitForm(true);
		},
		scope: this
	},{
		text: t("Save"),
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
	}];	
	
	GO.billing.StockDialog.superclass.constructor.call(this, config);
}

Ext.extend(GO.billing.StockDialog, Ext.Window,{

	submitForm : function(hide)
	{                                
		var records = this.productsGrid.getSelectedProducts(true);                               
		this.productsGrid.removeSelectedProducts();              
                                
		if(records.length > 0)
		{
//			for(var i=0; i<records.length; i++)
//			{
//				records[i].id = records[i].id.substr(2);
//			}

			this.formPanel.form.submit(
			{
				url:GO.url("billing/order/createPurchaseOrders"),
				params: {
					products: Ext.encode(records),
					book_id: GO.billing.orderStatusesStore.baseParams.book_id
				},
				waitMsg:t("Saving..."),
				success:function(form, action)
				{                 
					GO.billing.ordersGrid.store.load();
                                        
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
		}else
		{
			if(hide)
			{
				this.hide();
			}
		}
	},              

	show : function()
	{
		this.formPanel.form.reset();
		this.selectStatus.setValue(0);
                
		this.productsGrid.store.baseParams.show_min_stock_only = '1';
                
		this.productsGrid.store.reload();

		GO.billing.StockDialog.superclass.show.call(this);
	}

});

