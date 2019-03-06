GO.billing.DeliveryDialog = function(config){
	
	
	if(!config)
	{
		config={};
	}		
	
	this.deliveriesGrid = new GO.billing.DeliveriesGrid({
		region:'center'		
	});
		
	config.layout='border';
	config.modal=false;
	config.resizable=true;
	config.maximizable=true;
	config.width=600;
	config.height=400;
	config.closeAction='hide';
	config.title= t("Delivery", "billing");
	config.items=[this.deliveriesGrid];
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
	

	GO.billing.DeliveryDialog.superclass.constructor.call(this, config);	
}

Ext.extend(GO.billing.DeliveryDialog, Ext.Window,{

	order_id: 0,
        
	submitForm : function(hide)
	{
		var selectedItems = this.deliveriesGrid.getSelectedItems(true);
              
		if(selectedItems.length)
		{
			this.deliveriesGrid.removeSelectedItems();
			this.deliveriesGrid.store.baseParams.delivery_items = Ext.encode(selectedItems);
                        
			this.deliveriesGrid.store.load({
				callback: function()
				{
					var data = this.deliveriesGrid.store.reader.jsonData;
                                        
					if(data.deliveredSuccess)
					{
						hide = true;
					}

					if(data.feedback)
					{
						Ext.Msg.alert(t("Success"), data.feedback);
                                                
						GO.billing.ordersGrid.store.reload();
					}else
					if(data.feedback_err)
					{
						GO.errorDialog.show(data.feedback_err);
					}
                                        
					if(hide)
					{
						this.hide();
					}
                                        
					GO.billing.activePanel.reload();

					delete(this.deliveriesGrid.store.baseParams.delivery_items);
				},
				scope:this
			});
		}else
		if(hide)
		{                        
			this.hide();
		}                
	},
        
	show : function(order_id)
	{
		this.order_id = order_id;
            
		this.deliveriesGrid.store.baseParams.order_id = order_id;
            
		this.deliveriesGrid.store.load();

		GO.billing.DeliveryDialog.superclass.show.call(this);
	}
});
