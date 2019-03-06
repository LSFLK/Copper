GO.billing.SettingsBooksGrid = function(config){
	
	if(!config)
	{
		config = {};
	}
	
	config.title = t("Books", "billing");
	config.layout='fit';
	config.autoScroll=true;

	config.store = GO.billing.writableBooksStore;
	
	var columnModel =  new Ext.grid.ColumnModel({
		defaults:{
			sortable:true
		},
		columns:[
		{
			header: t("Name"), 
			dataIndex: 'name'
		},
		{
			header: t("Owner"), 
			dataIndex: 'user_name'
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
	
	
	this.bookDialog = new GO.billing.BookDialog();
	    			    		
	this.bookDialog.on('save', function(){
		this.store.load();	    			    			
	}, this);

	
	
	config.tbar=[{
		iconCls: 'btn-add',
		text: t("Add"),
		cls: 'x-btn-text-icon',
		disabled: !GO.settings.modules.billing.write_permission,
		handler: function(){
			this.bookDialog.show();
		},
		scope: this
	},{
		iconCls: 'btn-delete',
		text: t("Delete"),
		cls: 'x-btn-text-icon',
		disabled: !GO.settings.modules.billing.write_permission,
		handler: function(){
			this.deleteSelected();
		},
		scope: this
	}];
	
	
	
	GO.billing.SettingsBooksGrid.superclass.constructor.call(this, config);
	
	this.on('rowdblclick', function(grid, rowIndex){
		var record = grid.getStore().getAt(rowIndex);	

		this.bookDialog.show(record.data.id);
		
		}, this);
	
};

Ext.extend(GO.billing.SettingsBooksGrid, GO.grid.GridPanel,{
	
	
	afterRender : function()
	{
		GO.billing.SettingsBooksGrid.superclass.afterRender.call(this);
		
		if(this.isVisible())
		{
			this.onGridShow();
		}
	},
	
	onGridShow : function(){
		if(!this.store.loaded && this.rendered)
		{
			this.store.load();
		}
	}
	
});
