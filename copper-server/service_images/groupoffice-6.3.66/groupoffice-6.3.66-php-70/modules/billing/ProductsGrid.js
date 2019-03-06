/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: ProductsGrid.js 23287 2018-01-25 11:04:44Z mschering $
 * @copyright Copyright Intermesh
 * @author Merijn Schering <mschering@intermesh.nl>
 */
 
 
GO.billing.ProductsGrid = function(config){
	
	if(!config)
	{
		config = {};
	}
	
	var fields ={
		fields:['id','type', 'name','sort_order','category_id','image','cost_price','list_price','vat','total_price','supplier','supplier_product_id','allow_bonus_points','special','special_list_price','special_total_price','charge_shipping_costs','stock','bonus_points','required_products', 'iconCls', 'description', 'stock_min', 'amount', 'article_id', 'unit_stock','article_id'],
		columns:[
			{
				header: t("Name"),
				dataIndex: 'name',
				id:'name',
				renderer: this.iconRenderer
			}
		]};

	config.layout='fit';
	config.autoScroll=true;
	config.split=true;
		
	if(config.selectCategories !== false){
		config.selectCategories = true;
	}		
	
	if(!config.selectProducts)
		config.selectProducts = false;

	if(!config.lowStockOnly)
		config.lowStockOnly = false;
        
	config.ddGroup='BsCategoriesDD';
	config.paging=true;
	
	
	            
//
//	var columns = [{
//		header: t("Name"),
//		dataIndex: 'name',
//		id:'name',
//		renderer: this.iconRenderer
//	}];

	if(config.lowStockOnly)
	{
		fields.columns.push({
			header: t("Article number", "billing"),
			dataIndex: 'article_id'
		});
	}

	fields.columns.push({
		header: t("Supplier", "billing"),
		dataIndex: 'supplier',
		sortable:false
	},{
		header: t("Supplier product ID", "billing"),
		dataIndex: 'supplier_product_id',
		hidden:true
	},{
		header: t("Article number", "billing"),
		dataIndex: 'article_id',
		width:100
	},{
		header: t("List price", "billing"),
		dataIndex: 'list_price',
		//renderer:this.numberRenderer,
		width:80,
		align:'right'
	},{
		header: t("Total price", "billing"),
		dataIndex: 'total_price',
		//renderer:this.numberRenderer,
		width:80,
		align:'right',
		hidden:true
	},{
		header: t("Stock", "billing"),
		dataIndex: 'stock',
		width:80,
		align:'right'
	},{
		header: t("Minimal stock", "billing"),
		dataIndex: 'stock_min',
		width:80,
		align:'right'
	});

	if(go.Modules.isAvailable("core", "customfields"))
	{
		GO.customfields.addColumns("GO\\Billing\\Model\\Product", fields);
	}

	if(config.lowStockOnly)
	{
		fields.columns.push({
			header: t("Unit stock", "billing"),
			dataIndex: 'unit_stock'
		});
	}

	if(config.selectProducts)
	{
		fields.columns.push({
			header: t("Amount", "billing"),
			dataIndex: 'amount',
			align:"center",
			sortable:false,
			width:50,
			//renderer:this.numberRenderer,
			editor:this.amountField = new GO.form.NumberField({
				width:80,
				fieldLabel: t("Amount", "billing"),
				name:'amount'
			})
		});
	}

	var columnModel =  new Ext.grid.ColumnModel({
		defaults:{
			sortable:true
		},
		columns:fields.columns
	});
	
	config.store = new GO.data.JsonStore({
		url: GO.url('billing/product/store'),
		root: 'results',
		id: 'id',
		totalProperty:'total',
		fields: fields.fields,
		remoteSort: true
	});
	
	if(!config.selectCategories){
		config.store.baseParams = {};
	} else {
		config.store.baseParams = {
			category_id:"0"
		};
	}

	config.cm=columnModel;
	config.autoExpandColumn='name';
	config.view=new Ext.grid.GridView({
		emptyText: t("No items to display")		
	}),
	config.sm=new Ext.grid.RowSelectionModel();
	config.loadMask=true;
	config.clicksToEdit=1;
	
	
	GO.billing.productDialog = new GO.billing.ProductDialog();
	    			    		
	GO.billing.productDialog.on('save', function(){
		this.store.reload();
	}, this);

	GO.billing.ProductsGrid.superclass.constructor.call(this, config);

	this.selectedProducts = [];
	/*this.on('rowdblclick', function(grid, rowIndex){
		var record = grid.getStore().getAt(rowIndex);	
		
		GO.billing.productDialog.show(record.data.id);
		
		}, this);*/

	this.store.on('beforeload',function()
	{
		this.getModifiedRecords();

	}, this);

	this.store.on('load', function()
	{
		if(this.selectedProducts.length)
		{
			for(var i=0; i<this.store.data.items.length; i++)
			{
				var record = this.store.data.items[i];

				var amount = this.productSelected(record.id)
				if(!amount)
				{
					amount = 0;
				}else
				{
					record.set('amount', amount);
				}
			}
		}
	}, this)

	this.on('afteredit', this.afterEdit, this);
	this.on('beforeedit', this.beforeEdit, this);

	this.addEvents({
		'afternoedit' : true
	});

	this.on('afternoedit', this.afterNoEdit, this);

	this.addEvents({
		folderOpened : true,
		folderDrop : true
	});
	
	this.on('rowcontextmenu',function(grid,rowIndex,event){
		event.stopEvent();
		var record = grid.store.getAt(rowIndex);
		this.showContextMenu(event.getXY(),record.data.id);
	},this);
	
};

Ext.extend(GO.billing.ProductsGrid, GO.grid.EditorGridPanel,{

	changed : false,

	selectProduct: function(product_id, amount)
	{
		this.selectedProducts.push({
			id:product_id,
			amount:amount
		});
	},
	productSelected: function(product_id)
	{
		for(var i=0; i<this.selectedProducts.length; i++)
		{
			if(this.selectedProducts[i].id == product_id)
			{
				return this.selectedProducts[i].amount;
			}
		}
                
		return false;
	},
	updateAmountSelectedProduct: function(product_id, amount)
	{
		for(var i=0; i<this.selectedProducts.length; i++)
		{
			if(this.selectedProducts[i].id == product_id)
			{
				this.selectedProducts[i].amount = amount;
			}
		}

		return false;
	},
	getModifiedRecords: function()
	{
		var records = this.store.getModifiedRecords();
		for(var i=0; i<records.length; i++)
		{
			var record = records[i];
			if(record.data.amount)
			{
				// make sure amount is always a number and not a string
				var amount = 1* record.data.amount;
				if(this.productSelected(record.id))
				{
					this.updateAmountSelectedProduct(record.id, amount);
				}else
				{
					this.selectProduct(record.id, amount);
				}
			}
		}
	},
	getSelectedProducts: function(check_latest)
	{
		if(check_latest)
		{
			this.getModifiedRecords();
		}
                
		return this.selectedProducts;
	},
	removeSelectedProducts: function()
	{
		this.selectedProducts = [];
               
		this.store.rejectChanges();
	},
        
	iconRenderer : function(src,cell,record){
		return '<div class="go-grid-icon bs-icon-product">'+record.data.name+'</div>';
	},
	afterRender : function(){
		
		GO.billing.ProductsGrid.superclass.afterRender.call(this);
		
		if(this.enableDragDrop)
		{
			var DDtarget = new Ext.dd.DropTarget(this.getView().mainBody,
			{
				ddGroup : 'BsCategoriesDD',
				copy:false,
//				notifyOver : this.onGridNotifyOver,
				notifyDrop : this.onGridNotifyDrop.createDelegate(this)
			});
		}
		
	},


	/*
	 * Overide ext method because there's no way to capture afteredit when there's no change.
	 * We need this because we format /unformat numbers before and after edit.
	 */
	onEditComplete : function(ed, value, startValue){

		GO.billing.ProductsGrid.superclass.onEditComplete.call(this, ed, value, startValue);

		if(startValue != 'undefined' && String(value) === String(startValue)){
			var r = ed.record;
			var field = this.colModel.getDataIndex(ed.col);
			value = this.postEditValue(value, startValue, r, field);

			var e = {
				grid: this,
				record: r,
				field: field,
				originalValue: startValue,
				value: value,
				row: ed.row,
				column: ed.col,
				cancel:false
			};
			this.fireEvent('afternoedit', e);
		}

	},

	afterNoEdit : function (e)
	{
		e.record.set(e.field, this.currentOriginalValue);		
	},

	afterEdit : function (e)
	{
		this.changed=true;
		
		e.record.set(e.field, GO.util.unlocalizeNumber(e.value));

		var r = e.record.data;
	},

	beforeEdit : function(e)
	{
		var colId = this.colModel.getColumnId(e.column);
		var col = this.colModel.getColumnById(colId);
		this.currentOriginalValue=e.value;
		if(col && col.editor && col.editor.decimals)
		{
			e.record.set(e.field, GO.util.numberFormat(e.value));
		}
	},
	
//	onGridNotifyOver : function(dd, e, data){
//		var dragData = dd.getDragData(e);
//		if(data.grid)
//		{
//			var dropRecord = data.grid.store.data.items[dragData.rowIndex];
//			if(dropRecord)
//			{
//				if(dropRecord.data.id.substr(0,1)=='f')
//				{
//					return this.dropAllowed;
//				}
//			}
//		}
//		return false;
//	},

	onGridNotifyDrop : function(dd, e, data)
	{
		if(data.grid)
		{
			var sm=data.grid.getSelectionModel();
			var rows=sm.getSelections();
			var dragData = dd.getDragData(e);
			
			var dropRecord = data.grid.store.data.items[dragData.rowIndex];
			
//			if(dropRecord.data.id.substr(0,1)=='f')
//			{
//				this.fireEvent('folderDrop', this, data.selections, dropRecord);
//			}
		}else
		{
			return false;
		}
	},
//	numberRenderer : function(v, meta, record)
//	{
//		return v; //GO.util.numberFormat(v);
//	},
//	
	showContextMenu : function(xy,productId) {
		if (GO.util.empty(GO.billing.productsGridContextMenu))
			GO.billing.productsGridContextMenu = new GO.billing.ProductsGridContextMenu();

		GO.billing.productsGridContextMenu.showAt(xy,productId);
	}
	
});
