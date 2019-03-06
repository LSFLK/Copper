/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: SelectProductDialog.js 22862 2018-01-12 08:00:03Z mschering $
 * @copyright Copyright Intermesh
 * @author Merijn Schering <mschering@intermesh.nl>
 */
 
 
GO.billing.SelectProductDialog = function(config){
	
	
	if(!config)
	{
		config={};
	}

	config.stateId='bs-select-product-dialog';
	
	this.categoriesTree = new GO.billing.CategoriesTree({
		region:'west',
		split:true,
		title:t("Categories", "billing"),
		enableDD: false,
		stateId:'bs-select-categories-tree'
	});
	
	this.categoriesTree.on('click', function(node)	{
		this.setCategory(node.id.substr(10));
	}, this);
	
	this.productsGrid = new GO.billing.ProductsGrid({
		region:'center',
		selectProducts:true,
		stateId:'bs-products-grid',
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
	

	
	
	config.iconCls='bs-btn-catalog';
	config.layout='border';
	config.modal=false;
	config.resizable=true;
	config.maximizable=true;
	config.width=900;
	config.height=500;
	config.closeAction='hide';
	config.title= t("Product catalog", "billing");					
	config.items=[this.categoriesTree, this.productsGrid];
	config.buttons=[{
		text: t("Ok"),
		handler: function(){
			this.submitForm(true);
		},
		scope: this
	},{
		text: t("Save"),
		handler: function(){
			this.submitForm();
		},
		scope:this
	},{
		text: t("Close"),
		handler: function(){
			this.hide();
		},
		scope:this
	}];



	config.tbar=[
		this.showAllButton = new Ext.Button({
			disabled:true,
			text:t("Show all products", "billing"),
			handler:function(){
				this.setSupplier(0);
				this.setCategory(0);
				this.categoriesTree.getRootNode().reload();
			},
			scope:this
		}),
		'->',
		{xtype:'tbsearch',store:this.productsGrid.store}
	];
	

	
	this.productsGrid.on("rowdblclick", this.rowDoulbleClicked, this);
	
	GO.billing.SelectProductDialog.superclass.constructor.call(this, config);
	
	this.addEvents({
		'productsselected':true
	});
}

Ext.extend(GO.billing.SelectProductDialog, GO.Window,{
	
	afterRender : function(){
		
		GO.billing.CatalogPanel.superclass.afterRender.call(this);		
		this.setCategory(0);
	},
	rowDoulbleClicked : function(grid, rowClicked, e) {
	  this.submitForm(true);
//			
//		var selectionModel = grid.getSelectionModel();
//		var record = selectionModel.getSelected();
//		
//		var type = record.data.id.substr(0,1);
//		var id = record.data.id.substr(2);
//		
//		if(type=='f')
//		{
//			this.setCategory(id);			
//		}else	
//		{
//			//this could go wrong with stock management
////			var col = [];
////			col.push(record);
////			this.fireEvent('productsselected', col);
////			this.hide();
//		}
	},
	
	setCategory : function(category_id)
	{
		var activeNode = this.categoriesTree.getNodeById('bs-folder-'+category_id);
		if(activeNode)
		{
			activeNode.expand();			
		}		
		this.category_id=category_id;
		this.productsGrid.store.baseParams["category_id"]=category_id;
		this.productsGrid.store.load();
	},
        
	submitForm : function(hide)
	{
		var selectedProducts = this.productsGrid.getSelectedProducts(true);
                
		if(!selectedProducts.length)
		{
			var sm = this.productsGrid.getSelectionModel();
			selectedProducts = sm.getSelections();
		}
                
		this.productsGrid.removeSelectedProducts();

		this.fireEvent('productsselected', selectedProducts);
                
		if(hide)
		{
			this.hide();
		}
	},

	show : function(supplier_id)
	{
		if(this.categoriesTree.loader.baseParams.supplier_id != supplier_id)
		{
			this.setSupplier(supplier_id);

			this.categoriesTree.getRootNode().reload();
			this.productsGrid.store.baseParams.category_id = 0;


			this.productsGrid.store.reload();
		}

		GO.billing.SelectProductDialog.superclass.show.call(this);
	},
	
	setSupplier : function(supplier_id){
		this.categoriesTree.loader.baseParams.task = (supplier_id) ? 'categories_suppliers_tree' : 'categories_tree';
		this.categoriesTree.loader.baseParams.supplier_id = supplier_id;
		this.productsGrid.store.baseParams.supplier_id = supplier_id;
		
		this.showAllButton.setDisabled(!supplier_id);

	}

});

