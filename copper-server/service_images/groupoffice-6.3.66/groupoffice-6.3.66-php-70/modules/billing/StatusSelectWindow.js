		
GO.billing.OrderStatusWindow = Ext.extend(Ext.Window, {
	
	initComponent : function(){

		this.orderStatusList = new GO.grid.SimpleSelectList({
			store: new GO.data.JsonStore({
				url: GO.url('billing/status/store'),
				baseParams: {
					book_id: GO.billing.orderStatusesStore.baseParams.book_id   	
				},
				root: 'results',
				id: 'id',
				totalProperty:'total',
				fields: ['id','name'],
				remoteSort: true
			})
			});
			
		this.orderStatusList.store.load();
		
		GO.billing.orderStatusesStore.on('load', function(){
			this.orderStatusList.store.baseParams.book_id=GO.billing.orderStatusesStore.baseParams.book_id;
			this.orderStatusList.store.load();
		}, this);
		
		this.orderStatusList.on('click', function(dataview, index){
                        
			//GO.billing.activePanel.getFile(this.orderId, this.is_pdf, dataview.store.data.items[index].id);
			
			this.handler.call(this.scope, dataview.store.data.items[index].id);
				
			this.hide();
		}, this);
		
		
		this.title= t("Select an order status", "billing");
		this.layout='fit';
		this.modal=false;
		this.height=400;			
		this.width=600;
		this.closable=true;
		this.closeAction='hide';	
		this.items= new Ext.Panel({
			autoScroll:true,
			items: this.orderStatusList,
			cls: 'go-form-panel'
		});
		
		GO.billing.OrderStatusWindow.superclass.initComponent.call(this);
	}
	
//	show : function(orderId, is_pdf){
//		
//		this.orderId = orderId;
//		this.is_pdf = (is_pdf) ? true : false;
//                
//		GO.billing.OrderStatusWindow.superclass.show.call(this);
//	}
});
