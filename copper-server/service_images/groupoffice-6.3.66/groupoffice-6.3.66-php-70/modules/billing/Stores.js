GO.billing.SelectTaxRateStore = new GO.data.JsonStore({
	url: GO.url('billing/taxRate/store'),
	baseParams : {
		book_id:0
	},
	root: 'results',
	id: 'id',
	totalProperty: 'total',
	fields: ['id','percentage','name','description','type'],
	remoteSort: true,
	setBookId : function(book_id){
		if(this.baseParams.book_id!=book_id){
			
			this.baseParams.book_id=book_id;
			this.reload();
		}
	}
});

GO.billing.costCodesStore = new GO.data.JsonStore({
	url : GO.url('billing/costcode/store'),
	baseParams : {
		book_id:0,
		sort:"code",
		dir:"ASC"
	},
	fields : ['id','code','name','description','label','type'],
	root : 'results',
	id : 'id',
	totalProperty : 'total',
	setBookId : function(book_id){
		if(this.baseParams.book_id!=book_id){
			this.baseParams.book_id=book_id;
			this.reload();
		}
	}
});

GO.billing.trackingCodeStore = new GO.data.JsonStore({
	url: GO.url('billing/trackingCode/store'),
	baseParams: {
		costcode_id: 0
	},
	root: 'results',
	id: 'id',
	totalProperty: 'total',
	fields: ['id','code','name','description','costcode'],
	remoteSort: true
});

GO.billing.orderStatusesStore =  new GO.data.JsonStore({
	url: GO.url('billing/status/store'),
	    baseParams: {
	    	book_id: 0
	    	},
	    id: 'id',
	    fields: ['id','name','checked']
	});
	
GO.billing.orderStatusSelectStore = new GO.data.JsonStore({
	url: GO.url('billing/status/store'),
	baseParams: {},
	id: 'id',
	fields: ['id','name']
});

GO.billing.languagesStore = new GO.data.JsonStore({
	    url: GO.url('billing/language/store'),
	    root: 'results',
	    id: 'id',
	    totalProperty:'total',
	    fields: ['id','language','name'],
	    remoteSort: true
	});
	
GO.billing.expenseCategoriesStore = new GO.data.JsonStore({
	    url: GO.url('billing/expenseCategory/store'),
	    baseParams: {
	    	expense_book_id: 0	,
				limit: 0
	    },
	    root: 'results',
	    id: 'id',
	    totalProperty:'total',
	    fields: ['id','expense_book_id','name'],
	    remoteSort: true
		});
		
GO.billing.readableBooksStore =  new GO.data.JsonStore({
	    url: GO.url("billing/book/store"),
	    root: 'results',
	    id: 'id',
	    totalProperty:'total',
	    fields: ['id','name', 'default_vat','country', 'report_checked'],
	    remoteSort: true
	});
	
GO.billing.writableBooksStore =new GO.data.JsonStore({
	    url: GO.url("billing/book/store"),
	    baseParams: {
	    	permissionLevel: GO.permissionLevels.write
	    },
	    root: 'results',
	    id: 'id',
	    totalProperty:'total',
	    fields: ['id','name', 'user_name','country'],
	    remoteSort: true
	});

GO.billing.writableBooksStore.on('load', function(){
			GO.billing.writableBooksStore.on('load', function(){
				GO.billing.readableBooksStore.load();
			}, this);
		}, this, {single:true});

	
	
	
GO.billing.writableExpenseBooksStore = new GO.data.JsonStore({
	    url: GO.url('billing/expenseBook/store'),
	    baseParams: {	    	
	    	perrmissionLevel: GO.permissionLevels.write
	    },
	    root: 'results',
	    id: 'id',
	    totalProperty:'total',
	    fields: ['id','user_name','name','currency','vat'],
	    remoteSort: true
	});
GO.billing.writableExpenseBooksStore.on('load', function(){
		GO.billing.readableExpenseBooksStore.load();
	}, this);
	
GO.billing.readableExpenseBooksStore = new GO.data.JsonStore({
	    url: GO.url('billing/expenseBook/store'),
	    baseParams: {	    	
	    	perrmissionLevel: GO.permissionLevels.read
	    },	    
	    root: 'results',
	    id: 'id',
	    totalProperty:'total',
	    fields: ['id','user_name','acl_id','name','currency','vat', 'report_checked'],
	    remoteSort: true
	});
	
	
GO.billing.productOptionStore = new GO.data.JsonStore({
		url: GO.url('billing/productOption/store'),
		baseParams: {

		},
		root: 'results',
		id: 'id',
		totalProperty:'total',
		fields: ['id','name'],
		remoteSort: true
});

GO.billing.productOptionValueStore = new GO.data.JsonStore({
		url: GO.url('billing/productOptionValue/store'),
		baseParams: {

		},
		root: 'results',
		id: 'id',
		totalProperty:'total',
		fields: ['id','name','value'],
		remoteSort: true
});
	
if(go.Modules.isAvailable("legacy", "webshop"))
{
	GO.billing.webshopsStore = new GO.data.JsonStore({
	    url: GO.url('webshop/webshop/store'),
	    totalProperty:'total',
	    fields: ['id','name'],
	    remoteSort: true
	}); 
}
