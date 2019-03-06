GO.billing.ExpensesGrid = function(config){
	
	if(!config)
	{
		config = {};
	}
	
	config.title = t("Expenses", "billing");
	config.layout='fit';
	config.autoScroll=true;
	config.split=true;
	config.store = new GO.data.JsonStore({
	    url: GO.url('billing/expense/store'),
	    baseParams: {
	    	expense_book_id: 0	    	
	    	},
	    root: 'results',
	    id: 'id',
	    totalProperty:'total',
	    fields: ['id','user_name','expense_book_id','category','supplier','invoice_no','ctime','mtime','btime','subtotal','vat','vat_percentage','ptime'],
	    remoteSort: true
	});
	
	config.paging=true;
	var columnModel =  new Ext.grid.ColumnModel({
		defaults:{
			sortable:true
		},
		columns:[
		{
			header: t("Category", "billing"), 
			dataIndex: 'category'
		},		{
			header: t("Supplier", "billing"), 
			dataIndex: 'supplier'
		},		{
			header: t("Invoice no.", "billing"), 
			dataIndex: 'invoice_no'
		},		{
			header: t("Date", "billing"), 
			dataIndex: 'btime'
		},		{
			header: t("Sub-total", "billing"), 
			dataIndex: 'subtotal',
			align: "right"
		},		{
			header: t("Tax", "billing"), 
			dataIndex: 'vat',
			align: "right"
		},		{
			header: t("Paid", "billing"), 
			dataIndex: 'ptime'
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
	
	
	this.expenseDialog = new GO.billing.ExpenseDialog();
	    			    		
		this.expenseDialog.on('save', function(){   
			this.store.reload();	    			    			
		}, this);
	
	this.searchField = new GO.form.SearchField({
								store: config.store,
								width:320
						  });
	
	config['tbar']=[
	            t("Search")+': ', ' ',this.searchField
	            ];
	
	GO.billing.ExpensesGrid.superclass.constructor.call(this, config);
	
	this.on('rowdblclick', function(grid, rowIndex){
		var record = grid.getStore().getAt(rowIndex);	
		
		this.expenseDialog.show(record.data.id);
		
		}, this);
	
};

Ext.extend(GO.billing.ExpensesGrid, GO.grid.GridPanel,{
	boolRender : function(value)
	{
		if(value=="1")
		{
			return t("Yes");
		}else
		{
			return t("No");
		}
	}
});
