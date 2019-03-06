/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: ImportPaymentsGrid.js 22862 2018-01-12 08:00:03Z mschering $
 * @copyright Copyright Intermesh
 * @author Merijn Schering <mschering@intermesh.nl>
 */

GO.billing.ImportPaymentsGrid = function(config){
	if(!config)
	{
		config = {};
	}	
	config.layout='fit';
	config.autoScroll=true;
	config.split=true;
	//config.disabled=true;
	
	
	var action = new Ext.ux.grid.RowActions({
		header:'',
		hideMode:'display',
		keepSelection:true,
		actions:[{
			iconCls:'btn-save'
		}],
		width: 20
	});
	
	
	config.plugins=action;
	
	
	action.on({
		action:this.submitOrder
	}, this);
	
	
	var fields ={
		fields:['transaction_amount','order_amount' ,'sender','description','order_id','order_text','ptime'],
		columns:[{
			header: t("Customer", "billing"),
			dataIndex: 'sender',
			width:200
		},{
			dataIndex: 'ptime',
			header:t("Paid at", "billing")
		},	{
			header: t("Amount", "billing"),
			dataIndex: 'transaction_amount',
			align:'right',
			width:80,
			renderer:function(value, metaData, record, rowIndex, colIndex, store){
				if(record.data.order_amount!="" && value!=record.data.order_amount){
					metaData.css='summary-error-font';
				}
				return value;
			}
		},{
			width:300,
			dataIndex:'order_id',
			editor: new Ext.grid.GridEditor(this.selectOrder = new GO.form.ComboBoxReset({
					store: new GO.data.JsonStore({
					url: GO.url('billing/order/selectPayableOrder'),
					fields: ['id','text','order_id'],
					remoteSort: true
				}),
				emptyText:"IGNORE",
				valueField:'id',
				displayField:'text',
//				typeAhead: true,
				mode: 'remote',
				triggerAction: 'all',
				pageSize: parseInt(GO.settings['max_rows_list'])
			})),
			renderer:function(value, metaData, record, rowIndex, colIndex, stor){
				return record.data.order_text != '' ?  record.data.order_text : 'IGNORE';
			}
		},action]
	};

	config.store = new GO.data.JsonStore({
		fields: fields.fields,
		remoteSort: true
	});


	var columnModel =  new Ext.grid.ColumnModel({
		defaults:{
			sortable:false
		},
		columns:fields.columns
	});
	
	config.cm=columnModel;
	config.view=new Ext.grid.GridView({
		autoFill: true,
		forceFit: true,
		emptyText: t("No items to display"),
		enableRowBody:true,
		showPreview:true,
		getRowClass : this.applyRowClass
	});
	config.sm=new Ext.grid.RowSelectionModel();
	config.loadMask=true;

	config.clicksToEdit=1;
	
	


	GO.billing.ImportPaymentsGrid.superclass.constructor.call(this, config);
	
	this.on('afteredit', this.afterEdit, this);
	this.on('beforeedit', this.beforeEdit, this);

};
Ext.extend(GO.billing.ImportPaymentsGrid, GO.grid.EditorGridPanel,{

	applyRowClass: function(record, rowIndex, p, ds) {
      if (this.showPreview) {
          p.body = '<p class="description">' +record.data.description+ '</p>';
          return 'x-grid3-row-expanded';
      }
      return 'x-grid3-row-collapsed';
  },
	afterEdit : function (e)
	{		
		var r  = this.selectOrder.store.getById(e.value);
		e.record.set("order_text", r ? r.data.text : '');
	},
	
	beforeEdit:function(e){
		var colId = this.colModel.getColumnId(e.column);

		var col = this.colModel.getColumnById(colId);
		col.editor.setValue("");
	},
	submitOrder :function(grid, record, action, row, col) {
		
		if(GO.util.empty(record.data.order_id)){
			grid.store.remove(record);
		}else
		{
			GO.request({
				url:'billing/order/pay',
				params:{
					id:record.data.order_id,
					ptime:record.data.ptime				
				},		
				success:function(){
					grid.store.remove(record);
				},
				scope:this
			});
		}
	}
});
