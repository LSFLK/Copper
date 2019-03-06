GO.billing.OrderStatusHistoryGrid = function(config){
	
	if(!config)
	{
		config = {};
	}
	
	config.title = t("Order status history", "billing");
	config.layout='fit';
	config.autoScroll=true;
	config.split=true;
	config.store = new GO.data.JsonStore({
			url: GO.url('billing/statusHistory/orderStatusHistory'),
	    baseParams: {
				order_id: 0
	    },
	    root: 'results',
	    id: 'id',
	    totalProperty:'total',
	    fields: ['id','order_id','status_name','user_name','ctime','notified', 'notification_email'],
	    remoteSort: true
	});

	config.noDelete=true;
	
	config.paging=true;
	var columnModel =  new Ext.grid.ColumnModel({
		defaults:{
			sortable:true
		},
		columns:[
		{
			header: t("Status", "billing"), 
			dataIndex: 'status_name'
		},		{
			header: t("Owner"), 
			dataIndex: 'user_name',
		  sortable: false
		},		{
			header: t("Created at"), 
			dataIndex: 'ctime',
			width: dp(140)
		},		{
			header: t("Notified", "billing"), 
			dataIndex: 'notified',
			renderer: this.notifiedRenderer 
		}
	]
	});
	
	config.cm=columnModel;
	
	config.view=new Ext.grid.GridView({
		autoFill: true,
		forceFit: true,
		emptyText: t("No items to display")		
	}),
	config.sm=new Ext.grid.RowSelectionModel();
	config.loadMask=true;
	
	
	this.orderStatusHistoryDialog = new GO.billing.OrderStatusHistoryDialog();
	    			    		
		this.orderStatusHistoryDialog.on('save', function(){   
			this.store.reload();	    			    			
		}, this);
	

	
	GO.billing.OrderStatusHistoryGrid.superclass.constructor.call(this, config);
	
	this.on('rowdblclick', function(grid, rowIndex){
		var record = grid.getStore().getAt(rowIndex);	
		
		this.orderStatusHistoryDialog.show(record.data.id);
		
		}, this);
	
};

Ext.extend(GO.billing.OrderStatusHistoryGrid, GO.grid.GridPanel,{
	notifiedRenderer : function(value, p, record){
		if(value=="1")
		{
			
			return '<div class="go-grid-icon btn-ok"><a  onclick="GO.linkHandlers[\'GO\\\\Savemailas\\\\Model\\\\LinkedEmail\'].call(this, 0, {action:\'path\',path: \''+Ext.util.Format.htmlEncode(record.data.notification_email)+'\'});">'+t("View")+'</a></div>';
		}else
		{
			return "";
		}
	}
});
