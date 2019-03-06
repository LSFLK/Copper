GO.billing.CustomerReportGrid = function(config){
	
	if(!config)
	{
		config = {};
	}
	
	config.layout='fit';
	config.autoScroll=true;
	config.split=true;
	config.store = new GO.data.JsonStore({
	    url: GO.url('billing/report/customer'),
	    baseParams: {
	    	
	    	},
	    root: 'results',
	    id: 'customer_name',
	    totalProperty:'total',
	    fields: ['customer_name', 'turnover'],
	    remoteSort: true
	});
	
	
	var columnModel =  new Ext.grid.ColumnModel({
		defaults:{
			sortable:true
		},
		columns:[
		{
			header: t("Name"),
			dataIndex: 'customer_name'
		},{
			header: t("Turnover", "billing"), 
			dataIndex: 'turnover'
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
	
	GO.billing.CustomerReportGrid.superclass.constructor.call(this, config);
	
};

Ext.extend(GO.billing.CustomerReportGrid, GO.grid.GridPanel,{

});
