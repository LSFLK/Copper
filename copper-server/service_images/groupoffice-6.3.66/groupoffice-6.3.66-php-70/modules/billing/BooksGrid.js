GO.billing.BooksGrid = function(config){
	
	if(!config)
	{
		config = {};
	}
	
	config.cls='go-grid3-hide-headers';
//	config.title = t("Books", "billing");
	config.layout='fit';
	config.autoScroll=true;
	config.split=true;
	config.store = GO.billing.readableBooksStore;
	
	
	var columnModel =  new Ext.grid.ColumnModel({
		defaults:{
			sortable:true
		},
		columns:[
		{
			header: t("Name"), 
			dataIndex: 'name'
		}]
	});
	
	config.cm=columnModel;
	
	config.view=new Ext.grid.GridView({
		autoFill: true,
		forceFit: true,
		emptyText: t("No items to display")		
	});
	config.sm=new Ext.grid.RowSelectionModel();
	config.loadMask=true;
	
	GO.billing.BooksGrid.superclass.constructor.call(this, config);
};

Ext.extend(GO.billing.BooksGrid, GO.grid.GridPanel,{
	
	
});
