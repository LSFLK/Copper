GO.billing.ProductOptionGrid = Ext.extend(GO.grid.GridPanel,{
	changed : false,
	
	initComponent : function(){
		
		Ext.apply(this,{
      title: t("Extra options", "billing"),
			standardTbar:true,
			standardTbarDisabled:!GO.settings.modules.billing.write_permission,
			hideSearchField:true,
			store: GO.billing.productOptionStore,
			border: false,
			paging:true,
			view:new Ext.grid.GridView({
				autoFill: true,
				forceFit: true,
				emptyText: t("No items to display")		
			}),
			cm:new Ext.grid.ColumnModel({
				defaults:{
					sortable:false
				},
				columns:[
          {
            header: t("Option name", "billing"),
            dataIndex: 'name'
          }
        ]
			})
		});
		
		GO.billing.ProductOptionGrid.superclass.initComponent.call(this);
		
		GO.billing.productOptionStore.load();	
	},
	
	dblClick : function(grid, record, rowIndex){
		this.showProductOptionDialog(record.id);
	},
	
	btnAdd : function(){				
		this.showProductOptionDialog();	  	
	},
	showProductOptionDialog : function(id){
		if(!this.productOptionDialog){
			this.productOptionDialog = new GO.billing.ProductOptionDialog();
			
			this.productOptionDialog.on('save', function(){   
				this.store.load();
				this.changed=true;	    			    			
			}, this);	
		}
		this.productOptionDialog.setProductId(this.store.baseParams.product_id);
		this.productOptionDialog.show(id);	  
	},
	deleteSelected : function(){
		GO.billing.ProductOptionGrid.superclass.deleteSelected.call(this);
		this.changed=true;
	}
});
