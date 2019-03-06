GO.billing.LanguagesGrid = function(config){
	
	if(!config)
	{
		config = {};
	}
	
	config.title = t("Languages", "billing");
	config.layout='fit';
	config.autoScroll=true;
	config.split=true;
	config.store = GO.billing.languagesStore;
	
	GO.billing.languagesStore.on("load", function(){
		Ext.MessageBox.alert(t("Restart required", "billing"), t("\"A restart is required for changes to take effect. Logout and log back in.", "billing"))
	});
	
	config.paging=true;
	var columnModel =  new Ext.grid.ColumnModel({
		defaults:{
			sortable:true
		},
		columns:[
	   {
			header: t("Name"), 
			dataIndex: 'name'
		},{
			header: t("Language", "billing"), 
			dataIndex: 'language'
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
	
	
	this.languageDialog = new GO.billing.LanguageDialog();
	    			    		
		this.languageDialog.on('save', function(){   
			
			this.store.reload();	    			    			
		}, this);
	
	
	config.tbar=[{
			iconCls: 'btn-add',							
			text: t("Add"),
			cls: 'x-btn-text-icon',
			handler: function(){
				
	    	this.languageDialog.show();
	    	
	    	
	    	
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
		}];
	
	
	
	GO.billing.LanguagesGrid.superclass.constructor.call(this, config);
	
	this.on('rowdblclick', function(grid, rowIndex){
		var record = grid.getStore().getAt(rowIndex);	
		
		this.languageDialog.show(record.data.id);
		
		}, this);
	
};

Ext.extend(GO.billing.LanguagesGrid, GO.grid.GridPanel,{
	
});
