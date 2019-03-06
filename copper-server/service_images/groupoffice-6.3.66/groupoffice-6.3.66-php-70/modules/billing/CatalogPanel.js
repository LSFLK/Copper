/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: CatalogPanel.js 22862 2018-01-12 08:00:03Z mschering $
 * @copyright Copyright Intermesh
 * @author Merijn Schering <mschering@intermesh.nl>
 */
 
 
GO.billing.CatalogPanel = function(config){
	
	if(!config)
	{
		config={};
	}
	
	this.categoriesTree = new GO.billing.CategoriesTree({
		region:'west',
		split:true,
		enableDD: true,
		stateId:'bs-categories-tree'
	});
	
	this.categoriesTree.on('click', function(node)	{
		this.setCategory(node.id.substr(10));
	}, this);
	
	this.categoriesTree.on('beforenodedrop', function(e){
		
		var target = {
			category_id: e.target.id.substr(10)
		};
		
		var selections = [];		
		if(e.data.selections)
		{
			//dropped from grid
			for(var i=0;i<e.data.selections.length;i++)
			{
				selections.push('p:'+e.data.selections[i].data.id);
			}
		}else
		{
			//dropped from tree		  
			var selections = ['f:'+e.data.node.id.substr(10)];
		}
		
		this.moveSelections(selections, target);		
	},
	this);
	
	this.productsGrid = new GO.billing.ProductsGrid({
		region:'center',
		stateId:'bs-products-grid',
		enableDragDrop:true,
		deleteConfig: {
			scope:this,
			success:function(){
				var activeNode = this.categoriesTree.getNodeById('bs-folder-'+this.category_id);
				if(activeNode)
				{
					activeNode.reload();
				}else
				{
					this.categoriesTree.getRootNode().reload();
				}
			}
		}
	});
	
	
	GO.billing.categoryDialog = new GO.billing.CategoryDialog();
	GO.billing.categoryDialog.on('save', function(){
		this.productsGrid.store.reload();
		
		var activeNode = this.categoriesTree.getNodeById('bs-folder-'+this.category_id);
		if(activeNode && activeNode.parentNode)
		{
			activeNode.parentNode.reload();			
		}else
		{
			this.categoriesTree.getRootNode().reload();
		}
	}, this);
	
	config.items=[this.categoriesTree, this.productsGrid];	

	config.layout = 'border';
	config.border = false;
	
	//was required to show the search field in the tbar
	config.hideMode = 'offsets';
		
	if(GO.settings.modules.billing.write_permission)
	{
		config.tbar = {enableOverflow:true,items:[{
			iconCls: 'ic-menu',
			handler: function() {
				this.categoriesTree.toggleCollapse();
			},
			scope: this
		},{
			iconCls: 'ic-add',							
			text: t("Product", "billing"),
			handler: function(){
				
				GO.billing.productDialog.show();
				GO.billing.productDialog.formPanel.baseParams.category_id=this.category_id;
			},
			scope: this
		},{
			iconCls: 'ic-add',							
			text: t("Category", "billing"),
			handler: function(){
				
				GO.billing.categoryDialog.show();
				GO.billing.categoryDialog.formPanel.baseParams.parent_id=this.category_id;
			},
			scope: this
		},{
			iconCls: 'ic-delete',
			tooltip: t("Delete"),
			handler: function(){
				this.productsGrid.deleteSelected();
			},
			scope: this
		},
		{
			iconCls:'ic-refresh',
			tooltip:t("Refresh"),
			handler:function(){
				this.refresh();
			},
			scope:this
		},'-',{
			iconCls: 'ic-content-copy',
			tooltip: t("Copy"),
			handler: function(){
			
				var selModel = this.productsGrid.getSelectionModel().selections;
				var selModelTree = this.categoriesTree.getSelectionModel();
				if(selModel.items.length==0)
				{
					Ext.MessageBox.alert(t("Error"), t("Please select a product or category in the right panel first.", "billing"));
				}else
				{
					this.copyFolders=[];
					this.copyFiles=[];
					
					for(var i=0;i<selModel.items.length;i++)
					{
						this.copyFiles.push(selModel.items[i].data.id);
					}
					this.pasteButton.setDisabled(false);
				}
			},
			scope: this
		},this.pasteButton = new Ext.Button({
			disabled:true,
			iconCls: 'ic-content-paste',
			tooltip: t("Paste"),
			handler: function(){
				if(this.copyFiles.length==0)
				{
					Ext.MessageBox.alert(t("Error"), t("Select a target category first.", "billing"));
				}else
				{
					var params = {
						copy_products: Ext.encode(this.copyFiles),
						destination_category_id: this.category_id
					};

					GO.request({
						// url: GO.url('billing/productCategory/pasteSelections'),
						url: 'billing/productCategory/pasteProducts',
						params: params,
						success: function(options, response, result){
							this.productsGrid.store.load();
							this.categoriesTree.root.reload();

							this.copyFolders=[];
							this.copyFiles=[];
							this.pasteButton.setDisabled(true);
						},
						scope:this
					});

				}
			},
			scope: this
		}),'-',{
			iconCls: 'ic-file-upload',
			//hidden:true,
			text:t("Import"),
			handler:function(){
				if(!this.importDialog) {
					this.importDialog = new GO.billing.ImportDialog();
					this.importDialog.on('import', function(){
						this.refresh();
					}, this);
				}                                
				this.importDialog.show();
			},
			scope:this
		},{
			iconCls: 'ic-import-export',
			text: t("Export"),
			scope: this,
			handler: function(){
				window.open(GO.url('billing/exportCatalog/export')+'&category_id='+this.category_id);
			}
		},'->',{xtype:'tbsearch',store:this.productsGrid.store }]};
	} else {
		config.tbar = ['->',{xtype:'tbsearch',store:this.productsGrid.store }];
	}
		
	this.productsGrid.on("rowdblclick", this.rowDoulbleClicked, this);
	
	
	GO.billing.CatalogPanel.superclass.constructor.call(this, config);
	
}

Ext.extend(GO.billing.CatalogPanel, Ext.Panel, {

	refresh : function(){
		this.categoriesTree.getRootNode().reload();
		this.productsGrid.store.reload();
	},
	
	afterRender : function(){
		
		GO.billing.CatalogPanel.superclass.afterRender.call(this);
		
		this.setCategory(0);
	},
	
	
	moveSelections : function(selections, target)
	{
		Ext.Ajax.request({
			url: GO.url('billing/productCategory/moveSelections'),
			params: {
				selections : Ext.encode(selections),
				target : Ext.encode(target)
			},
			callback: function(options, success, response){				
				
				if(!success)
				{
					Ext.MessageBox.alert(t("Error"), t("Could not connect to the server. Please check your internet connection."));
				}else
				{
					var responseParams = Ext.decode(response.responseText);
					
					if(responseParams.moved_products)
					{
						for(var i=0;i<responseParams.moved_products.length;i++)
						{
							var arr = responseParams.moved_products[i].split(':');
							if(arr[0]=='p'){
								var record = this.productsGrid.store.getById(arr[1]);
								if(record)
								{
									this.productsGrid.store.remove(record);
								}
							}
						}
					}					
				}
			},
			scope:this								
			
		});
		
		
	},
	
	
	rowDoulbleClicked : function(grid, rowClicked, e) {
			
		var selectionModel = grid.getSelectionModel();
		var record = selectionModel.getSelected();

		GO.billing.productDialog.show(record.data.id);

	},
	
	setWritePermission : function(writePermission){
		this.linkButton.setDisabled(!writePermission);
		this.unlinkButton.setDisabled(!writePermission);
		this.newCategoryButton.setDisabled(!writePermission);
		this.deleteButton.setDisabled(!writePermission);		
	},
	
	setCategory : function(category_id)
	{
		var activeNode = this.categoriesTree.getNodeById('bs-folder-'+category_id);
		if(activeNode) {
			activeNode.expand();			
		}
		
		GO.billing.categoryDialog.category_id=category_id;
		
		this.category_id=category_id;
		this.productsGrid.store.baseParams["category_id"]=category_id;
		this.productsGrid.store.load();
	},

	itemType : function ( id ) {
		return id.substr(0,1);
	},

	folderNumber : function (id) {
		return id.substr(10);
	}

});
