GO.billing.TemplatesGrid = function(config){
	
	if(!config)
	{
		config = {};
	}
	
	config.title = t("PDF templates", "billing");
	config.layout='fit';
	config.autoScroll=true;
	config.split=true;
	config.store = GO.billing.templatesStore = new GO.data.JsonStore({
		url: GO.url('billing/template/store'),
		baseParams: {
			book_id: 0	    	
		},
		root: 'results',
		id: 'id',
		totalProperty:'total',
		fields: ['id','name'],
		remoteSort: true
	});
	
	config.paging=false;
	var columnModel =  new Ext.grid.ColumnModel({
		defaults:{
			sortable:true
		},
		columns:[
		{
			header: t("Name"), 
			dataIndex: 'name'
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
	
	
	this.templateDialog = new GO.billing.TemplateDialog();
	    			    		
	this.templateDialog.on('save', function(){   
		this.store.reload();	    			    			
	}, this);
	
	
	config.tbar=[{
		iconCls: 'btn-add',							
		text: t("Add"),
		cls: 'x-btn-text-icon',
		handler: function(){		
			this.templateDialog.show();
			this.templateDialog.formPanel.baseParams.book_id=this.store.baseParams.book_id;
		},
		scope: this
	},{
		iconCls: 'btn-delete',
		text: t("Delete"),
		cls: 'x-btn-text-icon',
		handler: function(){
			this.deleteSelected();
		},
		scope: this
	},{
		iconCls: 'btn-copy',
		text: t("Copy"),
		cls: 'x-btn-text-icon',
//		handler: function(){
//			this.copySelected(this.store.baseParams.book_id);
//		},
		menu: this.addresslistsMenu = new GO.menu.JsonMenu({
				store: new GO.data.JsonStore({
					url: GO.url("billing/book/menu"),
					baseParams: {
						permissionLevel: GO.permissionLevels.write,
						forContextMenu: true
					},
					fields: ['book_id', 'text'],
					remoteSort: true
				}),
				listeners:{
					scope:this,
					itemclick : function(item, e ) {
						this.copySelected(item.book_id);
						return false;
					}
				}
			}),
		scope: this
	}];

	
	
	GO.billing.TemplatesGrid.superclass.constructor.call(this, config);
	
	this.on('rowdblclick', function(grid, rowIndex){
		var record = grid.getStore().getAt(rowIndex);	
		
		this.templateDialog.show(record.data.id);
		
	}, this);
	
};

Ext.extend(GO.billing.TemplatesGrid, GO.grid.GridPanel,{
	copySelected : function(book_id)
	{
		var sm = this.getSelectionModel();
		var record = sm.getSelected();

		if(record)
		{   
			GO.request({
				url: 'billing/template/copy',
				params: {
					id: record['id'],
					book_id:book_id
				},
				success:function(){
					this.store.load();
				},
				scope:this
				
			},this);
			
		}else
		{
			alert(t("You didn't select an item."));
		}
	}
},this);
