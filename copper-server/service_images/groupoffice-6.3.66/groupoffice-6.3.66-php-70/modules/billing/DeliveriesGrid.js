GO.billing.DeliveriesGrid = function(config){
	
	if(!config)
	{
		config = {};
	}
	
	config.layout='fit';
	config.autoScroll=true;
	config.split=true;
	config.store = new GO.data.JsonStore({
		url: GO.url("billing/item/deliveries"),
		baseParams: {
			order_id:"0"
		},
		fields: ['id', 'description', 'amount', 'new_delivered', 'amount_to_deliver'],
		remoteSort: true
	});	                
	config.paging=true;
	
	var columns = [{
		header: t("Description"),
		dataIndex: 'description',
		id:'name'
	},{
		header: t("Amount", "billing"),
		dataIndex: 'amount',
		width:50,
		renderer:this.numberRenderer
	},{
		header: t("To deliver", "billing"),
		dataIndex: 'amount_to_deliver',
		width:50,
		renderer:this.numberRenderer
	},{
		header: t("Delivered", "billing"),
		width:80,
		dataIndex: 'new_delivered',
		renderer:this.numberRenderer,
		editor:this.amountDeliveredField = new GO.form.NumberField({
			width:80,
			dataIndex: 'new_delivered',
			fieldLabel: t("Delivered", "billing")
		})
	}];

	var columnModel =  new Ext.grid.ColumnModel({
		defaults:{
			sortable:true
		},
		columns:columns
	});

	config.cm=columnModel;
	config.autoExpandColumn='name';
	config.view=new Ext.grid.GridView({
		emptyText: t("No items to display")		
	}),
	config.sm=new Ext.grid.RowSelectionModel();
	config.loadMask=true;
	config.clicksToEdit=1;
	
	
	GO.billing.DeliveriesGrid.superclass.constructor.call(this, config);

//	this.store.on('beforeload',function()
//	{
//		this.getModifiedRecords();
//
//	}, this);

//	this.store.on('load', function()
//	{
//		for(var i=0; i<this.store.data.items.length; i++)
//		{
//			var record = this.store.data.items[i];
//
//			var new_delivered = this.itemSelected(record.id)
//			if(!new_delivered)
//			{
//				new_delivered = 0;
//			}else
//			{
//				record.set('new_delivered', new_delivered);
//			}
//		}
//	}, this)

	this.on('afteredit', this.afterEdit, this);
	this.on('beforeedit', this.beforeEdit, this);

	this.addEvents({
		'afternoedit' : true
	});

	this.on('afternoedit', this.afterNoEdit, this);
	
};

Ext.extend(GO.billing.DeliveriesGrid, GO.grid.EditorGridPanel,{

	changed : false,
	selectedItems: [],

	selectItem: function(id, amount)
	{
		this.selectedItems.push({
			id:id, 
			new_delivered:amount
		});
	},
	itemSelected: function(id)
	{
		for(var i=0; i<this.selectedItems.length; i++)
		{
			if(this.selectedItems[i].id == id)
			{
				return this.selectedItems[i].new_delivered;
			}
		}
                
		return false;
	},
	updateAmountSelectedItem: function(id, amount)
	{
		for(var i=0; i<this.selectedItems.length; i++)
		{
			if(this.selectedItems[i].id == id)
			{
				this.selectedItems[i].new_delivered = amount;
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
			if(record.data.new_delivered)
			{
				// make sure amount is always a number and not a string
				var amount = 1* record.data.new_delivered;
				if(this.itemSelected(record.id))
				{
					this.updateAmountSelectedItem(record.id, amount);
				}else
				{
					this.selectItem(record.id, amount);
				}
			}
		}

	//this.store.rejectChanges();
	},
	getSelectedItems: function(check_latest)
	{
		if(check_latest)
		{
			this.getModifiedRecords();
		}
                
		return this.selectedItems;
	},
	removeSelectedItems: function()
	{
		this.selectedItems = [];
                
		this.store.rejectChanges();
	},
        
	iconRenderer : function(src,cell,record){
		return '<div class="' + record.data.iconCls +'"></div>';
	},	

	/*
	 * Overide ext method because there's no way to capture afteredit when there's no change.
	 * We need this because we format /unformat numbers before and after edit.
	 */
	onEditComplete : function(ed, value, startValue){

		GO.billing.DeliveriesGrid.superclass.onEditComplete.call(this, ed, value, startValue);

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
//		var type = e.record.id.substr(0, 1);
//		if(type == 'f')
//		{
//			return false;
//		}else
//		{                
			var colId = this.colModel.getColumnId(e.column);

			var col = this.colModel.getColumnById(colId);

			this.currentOriginalValue=e.value;
			if(col && col.editor && col.editor.decimals)
			{
				e.record.set(e.field, GO.util.numberFormat(e.value));
			}
//		}
	},
	
	numberRenderer : function(v)
	{
		//v = GO.util.unlocalizeNumber(v);
		return GO.util.numberFormat(v);
	}
	
});
