GO.billing.SettingsExpenseBooksGrid = function(config){
	
	if(!config)
	{
		config = {};
	}
	
	config.title = t("Expense books", "billing");
	config.layout='fit';
	config.autoScroll=true;
	config.split=true;
	config.store = GO.billing.writableExpenseBooksStore;
	
	
	var columnModel =  new Ext.grid.ColumnModel({
		defaults:{
			sortable:true
		},
		columns:[
	   {
			header: t("Name"), 
			dataIndex: 'name'
		},		{
			header: t("Owner"), 
			dataIndex: 'user_name',
		  sortable: false
		},		{
			header: t("Currency", "billing"), 
			dataIndex: 'currency'
		},		{
			header: t("Tax", "billing"), 
			dataIndex: 'vat'
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
	
	
	this.expenseBookDialog = new GO.billing.ExpenseBookDialog();
	    			    		
		this.expenseBookDialog.on('save', function(){   
			this.store.reload();	    			    			
		}, this);
	
	

	config.tbar=[{
		iconCls: 'btn-add',
		text: t("Add"),
		cls: 'x-btn-text-icon',
		handler: function(){
			this.expenseBookDialog.show();
		},
		scope: this,
		disabled: !GO.settings.modules.billing.write_permission
	},{
		iconCls: 'btn-delete',
		text: t("Delete"),
		cls: 'x-btn-text-icon',
		handler: function(){
			this.deleteSelected();
		},
		scope: this,
		disabled: !GO.settings.modules.billing.write_permission
	}];
	
	
	
	GO.billing.SettingsExpenseBooksGrid.superclass.constructor.call(this, config);
	
	this.on('rowdblclick', function(grid, rowIndex){
		var record = grid.getStore().getAt(rowIndex);	
		
		this.expenseBookDialog.show(record.data.id);
		
		}, this);
	
};

Ext.extend(GO.billing.SettingsExpenseBooksGrid, GO.grid.GridPanel,{
	
	afterRender : function()
	{
		GO.billing.SettingsExpenseBooksGrid.superclass.afterRender.call(this);
		
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
