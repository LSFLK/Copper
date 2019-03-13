/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @copyright Copyright Intermesh
 * @version $Id: ItemsGrid.js 23462 2018-03-06 11:37:47Z mschering $
 * @author Merijn Schering <mschering@intermesh.nl>
 */

GO.billing.OrderItem = Ext.data.Record.create([
	{
		name: 'item_group_id',
		type: 'string'
	}, {
		name: 'item_group_name',
		type: 'string',
		hidden: true
	}, {
		name: 'id',
		type: 'string'
	}, {
		name: 'amount',
		type: 'string'
	}, {
		name: 'vat',
		type: 'string'
	}, {
		name: 'vat_code',
		type: 'string'
	}, {
		name: 'unit_price'
	}, {
		name: 'unit_list'
	}, {
		name: 'unit_cost'
	}, {
		name: 'markup'
	}, {
		name: 'discount',
		type: 'string'
	}, {
		name: 'unit_total'
						//type: 'string'
	}, {
		name: 'description',
		type: 'string'
	}, {
		name: 'cost_code',
		type: 'string'
	}, {
		name: 'tracking_code',
		type: 'string'
	}, {
		name: 'order_at_supplier_company_id'
	}, {
		name: 'allow_supplier_update'
	}, {
		name: 'item_price'
	}, {
		name: 'item_total'
	}, {
		name: 'order_at_supplier'
	}, {
		name: 'order_at_supplier_company_name',
		type: 'string'
	}, {
		name: 'note',
		type: 'string'
	}, {
		name: 'unit'
	}
]);



GO.billing.ItemsGrid = Ext.extend(Ext.grid.EditorGridPanel, {

	changed: false,
	paging: true,
	defaultCostCode: '',

	supplier_id: 0,

	book_id: 0,
	enableDragDrop: true,
	ddGroup: 'bsItemsDD',

	stateId: 'bs-items-grid',

	cls: 'bs-items-grid',
	layout: 'fit',
	autoScroll: true,
	split: true,
	
	storeFields : ['id', 'order_id', 'product_id', 'description', 'unit_cost', 'unit_price', 'unit_list', 'unit_total', 'amount', 'vat', 'vat_code', 'discount', 'sort_order', 'cost_code', 'tracking_code', 'markup', 'item_price', 'item_total', 'order_at_supplier', 'order_at_supplier_company_id', 'allow_supplier_update', 'order_at_supplier_company_name', 'note', 'unit', 'item_group_id', 'item_group_name', 'item_group_sort_order'],

	view: new Ext.grid.GroupingView({
		autoFill: true,
		forceFit: true,
		emptyText: t("No items to display")
	}),

	sm: new Ext.grid.RowSelectionModel({
		moveEditorOnEnter: false // <- enter will add a new line in textareas instead of finishing editing
	}),

	loadMask: true,
	clicksToEdit: 2,
	
	
	
	constructor: function(config) {
		
		this.trackingCodeBox = new GO.billing.SelectTrackingCode({
				id: 'trackingCodeBox-editor', // Checked in the onEditComplete function
				listeners: {
					select: function (combo, record, index) {

						if (GO.util.empty(record)) {
							this.selectedTrackingCodeRecord = "";
						} else {
							this.selectedTrackingCodeRecord = record; // Used in the setCostCodeField function
						}
					},
					scope: this
				}
			}),
							
							
		this.orderAtSupplierCheckColumn = new GO.grid.CheckColumn({
			dataIndex: 'order_at_supplier',
			width: 120,
			header: t("Order at supplier", "billing"),
			sortable: false
		});

		this.orderAtSupplierCheckColumn.on('change', function (record, checked)
		{
			this.changed = true;
		}, this);

		this.plugins = this.orderAtSupplierCheckColumn;
		
							
							
		this.columnsArr = [{
			id: 'item_group_name',
			header: t("Item group", "billing"),
			dataIndex: 'item_group_name',
//			align:"center",
			width: 100,
			hidden: true,
			groupRenderer: function (v) {
				var i = v.indexOf('|');
				if (i) {
					i++;
					return v.substr(i, v.length - i);
				} else {
					return t("None");
				}
			}
		}, {
			id: 'amount',
			header: t("Amount", "billing"),
			dataIndex: 'amount',
			align: "center",
			width: 50,
			renderer: this.numberRenderer,
			editor: this.amountField = new GO.form.NumberField({
				width: 80,
				fieldLabel: t("Amount", "billing"),
				value: GO.util.numberFormat("1"),
				name: 'amount'
			})
		}, {
			id: 'unit',
			header: t("Unit", "billing"),
			dataIndex: 'unit',
			align: "center",
			width: 50,
			editor: new Ext.form.TextField()
		}, {
			id: 'description',
			header: t("Description"),
			dataIndex: 'description',
			name: 'description',
			width: 250,
			editor: new Ext.grid.GridEditor(
							this.descriptionField = new GO.form.ComboBox({
								width: 500,
								autoSelect: false,
								//height:150,
								displayField: 'name',
								valueField: 'name',
								defaultAutoCreate: {
									tag: "textarea",
									autocomplete: "off",
									//rows: 5
								},
								hideTrigger: true,
								minChars: 3,
								triggerAction: 'all',
								allowBlank: true,
								store: new GO.data.JsonStore({
									url: GO.url("billing/product/store"),
									fields: ['id', 'name']
								}),
								fieldLabel: t("Description"),
							}), {
				autoSize: true,
				completeOnEnter: false // <- enter will stop editing if not set
				, grid: this
				, listeners: {
					beforeshow: function (editor) {
						var rowHeight = Ext.fly(editor.grid.getView().getRow(editor.row)).getHeight();
						if (rowHeight < 100) {
							rowHeight = 100;
						}
						editor.field.el.setHeight(rowHeight);
					}
				}
			}
			),
			renderer: GO.util.nl2br
		}, {
			id: 'cost_code',
			header: t("Cost code", "billing"),
			dataIndex: 'cost_code',
			align: "left",
			width: 100,
			editor: new Ext.grid.GridEditor(
							this.costCodeBox = new GO.billing.SelectCostCode({
								id: 'costCodeBox-editor' // Checked in the onEditComplete function
							}),
							{
								grid: this
							}

			),
			scope: this,
			hidden: true
		}, {
			id: 'tracking_code',
			header: t("Tracking code", "billing"),
			dataIndex: 'tracking_code',
			align: "left",
			width: 100,
			editor: this.trackingCodeBox,
			scope: this,
			hidden: true
		}, {
			id: 'unit_cost',
			header: t("Unit cost", "billing"),
			dataIndex: 'unit_cost',
			align: "right",
			width: 80,
			renderer: this.numberRenderer,
			editor: this.costField = new GO.form.NumberField({
				width: 80,
				fieldLabel: t("Unit cost", "billing"),
				value: GO.util.numberFormat("0"),
				name: 'unit_cost'
			}),
			hidden: true
		}, {
			id: 'unit_price',
			header: t("Unit price", "billing"),
			dataIndex: 'unit_price',
			align: "right",
			width: 80,
			renderer: this.numberRenderer,
			editor: this.priceField = new GO.form.NumberField({
				width: 80,
				fieldLabel: t("Unit price", "billing"),
				value: GO.util.numberFormat("0"),
				name: 'unit_price'
			})
		}, {
			id: 'unit_total',
			header: t("Unit price (incl. VAT)", "billing"),
			dataIndex: 'unit_total',
			align: "right",
			width: 80,
			renderer: this.numberRenderer,
			editor: this.totalField = new GO.form.NumberField({
				width: 80,
				fieldLabel: t("Unit price (incl. VAT)", "billing"),
				value: GO.util.numberFormat("0"),
				name: 'unit_total'
			}),
			hidden: true
		}, {
			id: 'unit_list',
			header: t("Unit list", "billing"),
			dataIndex: 'unit_list',
			align: "right",
			width: 80,
			renderer: this.numberRenderer,
			editor: this.listField = new GO.form.NumberField({
				width: 80,
				fieldLabel: t("Unit list", "billing"),
				value: GO.util.numberFormat("0"),
				name: 'unit_list'
			})
		}, {
			id: 'total-price',
			header: t("Total price", "billing"),
			dataIndex: 'item_price',
			align: "right",
			width: 100,
			renderer: this.numberRenderer
		}, {
			id: 'item_total',
			header: t("Total price (incl. VAT)", "billing"),
			dataIndex: 'item_total',
			align: "right",
			width: 100,
			renderer: this.numberRenderer,
			hidden: true
		}, {
			id: 'vat',
			header: t("Tax", "billing") + ' %',
			dataIndex: 'vat',
			align: "right",
			width: 100,
			renderer: this.numberRenderer,
			editor: this.taxRateBox = new GO.billing.SelectTaxRate({
				name: 'vat',
				id: 'vat-editor' // Checked in the onEditComplete function
			})
		}, {
			id: 'vat_code',
			header: t("Tax", "billing"),
			dataIndex: 'vat_code',
			width: 100,
			hidden: true
		}, {
			id: 'discount',
			header: t("Discount", "billing"),
			dataIndex: 'discount',
			align: "right",
			width: 50,
			renderer: this.numberRenderer,
			editor: this.discountField = new GO.form.NumberField({
				width: 80,
				fieldLabel: t("Discount", "billing"),
				value: GO.util.numberFormat("0"),
				name: 'discount'
			})
		}, {
			id: 'markup',
			header: t("Mark up", "billing"),
			dataIndex: 'markup',
			align: "right",
			width: 80,
			renderer: this.numberRenderer,
			editor: this.markupField = new GO.form.NumberField({
				fieldLabel: t("Mark up", "billing"),
				value: 0,
				name: 'markup'
			}),
			hidden: true
		},
		this.orderAtSupplierCheckColumn,  
		{
			id: 'note',
			header: t("Note", "billing"),
			dataIndex: 'note',
			name: 'note',
			width: 250,
			editor: new Ext.grid.GridEditor(
							this.noteField = new Ext.form.TextArea({
								height: 150,
								width: 500,
								allowBlank: true,
								fieldLabel: t("Note", "billing")
							}), {
				autoSize: false
			}),
			renderer: GO.util.nl2br,
			hidden: true
		}
	]					
							
		
		this.tbar =  {
			xtype:'toolbar',
			enableOverflow: true,
			items:[{
			iconCls: 'btn-add',
			text: t("Add"),
			handler: function () {
				this.addBlankRow();
			},
			scope: this
		},{
			iconCls: 'btn-delete',
			text: t("Delete"),
			handler: function () {
				this.changed = true;
				var selectedRows = this.selModel.getSelections();
				for (var i = 0; i < selectedRows.length; i++)
				{
					selectedRows[i].commit();
					this.store.remove(selectedRows[i]);
				}

				this.updateTotals();
			},
			scope: this
		},'-', {
			iconCls: 'bs-btn-catalog',
			text: t("Catalog", "billing"),
			cls: 'x-btn-text-icon',
			handler: function () {
				if (!this.selectProductDialog)
				{
					this.selectProductDialog = new GO.billing.SelectProductDialog();
					//this.selectProductDialog.on('productselect', this.addProduct, this);
					this.selectProductDialog.on('productsselected', this.addProducts, this);
				}
				this.selectProductDialog.show(this.supplier_id);
			},
			scope: this
		}, {
			iconCls: 'btn-add',
			text: t("Add page break", "billing"),
			handler: function () {
				this.addPageBreak();
			},
			scope: this
		}, {
			iconCls: 'btn-settings',
			text: t("Item groups", "billing"),
			handler: function () {
				this.showGroupManagementDialog();
			},
			scope: this
		}, {
			iconCls: 'btn-import',
			text: t("Import items from file", "billing"),
			handler: function () {
				if (!this.importItemsDialog) {
					this.importItemsDialog = new GO.billing.ImportItemsWindow();
					this.importItemsDialog.on('import', function () {
						this.store.load();
					}, this);
				}
				this.importItemsDialog.show(this.order_id);
			},
			scope: this
		}
	]},
		
		
		
		
		GO.billing.ItemsGrid.superclass.constructor.call(this, config);
	},

	initComponent: function () {
//		
//		if(go.Modules.isAvailable("core", "customfields"))
//		{
//			GO.customfields.addColumns("GO\\Billing\\Model\\Item", {columns: this.columnsArr, fields: this.storeFields});
//		}
//		
//		
//		Ext.each(this.columnsArr , function(column) {
//			
//			if(column.datatype) {
//				
//				
//				column.editor = GO.customfields.getFormField(column);
//				column.editor.name = column.dataIndex;
//				
//				console.log(column.editor);
//			}
//			
//		})

	this.store = new Ext.data.GroupingStore({
		baseParams: {
			order_id: 0,
			limit: 0
		},
		reader: new Ext.data.JsonReader({
			root: 'results',
			id: 'id',
			totalProperty: 'total',
			fields: this.storeFields
		}),
		proxy: new Ext.data.HttpProxy({
			url: GO.url('billing/item/store')
		}),
		groupField: 'item_group_name'
	});
					

		var columnModel = new Ext.grid.ColumnModel({
			defaults: {
				sortable: false
			},
			columns: this.columnsArr
		});

		this.cm = columnModel;





		


		this.store.on('load', this.updateTotals, this);















		this.on('afteredit', this.afterEdit, this);
		this.on('beforeedit', this.beforeEdit, this);

		this.addEvents({
			'afternoedit': true
		});

		this.on('afternoedit', this.afterNoEdit, this);

		this.on('rowcontextmenu', function (grid, rowIndex, e) {
			e.stopEvent();
			var sm = this.getSelectionModel();
			if (sm.isSelected(rowIndex) !== true) {
				sm.clearSelections();
				sm.selectRow(rowIndex);
			}

			this.showContextMenu(e);
		}, this);

		GO.billing.ItemsGrid.superclass.initComponent.call(this);
	},

	/**
	 * 
	 * Override the initEvets function because of lost focus problem on scroll
	 * 
	 * @returns {undefined}
	 */
	initEvents: function () {
		Ext.grid.EditorGridPanel.superclass.initEvents.call(this);

//			this.getGridEl().on('mousewheel', this.stopEditing.createDelegate(this, [true]), this); // <-- Commented out this because of scroll problem
		this.on('columnresize', this.stopEditing, this, [true]);

		if (this.clicksToEdit == 1) {
			this.on("cellclick", this.onCellDblClick, this);
		} else {
			var view = this.getView();
			if (this.clicksToEdit == 'auto' && view.mainBody) {
				view.mainBody.on('mousedown', this.onAutoEditClick, this);
			}
			this.on('celldblclick', this.onCellDblClick, this);
		}
	},

	showContextMenu: function (e) {

		if (!this.contextMenu)
			this.contextMenu = new GO.billing.ItemContextMenu();

		this.contextMenu.itemsGrid = this;
		this.contextMenu.showAt(e.getXY());
	},

	afterRender: function () {

		GO.billing.ItemsGrid.superclass.afterRender.call(this);
		//enable row sorting
		var DDtarget = new Ext.dd.DropTarget(this.getView().mainBody,
						{
							ddGroup: 'bsItemsDD',
							copy: false,
							notifyDrop: this.notifyDrop.createDelegate(this)
						});

		//this.selectSupplier.store.load();
	},

	addBlankRow: function () {
		//this.itemDialog.show();
		//this.itemDialog.formPanel.baseParams.order_id=this.store.baseParams.order_id;

		var i = new GO.billing.OrderItem({
			id: 0,
			amount: 1,
			vat: GO.billing.defaultVAT,
			unit_price: 0,
			unit_list: 0,
			unit_cost: 0,
			item_price: 0,
			item_total: 0,
			discount: 0,
			unit_total: 0,
			product_id: 0,
			description: '',
			cost_code: this.defaultCostCode,
			allow_supplier_update: '1',
			order_at_supplier_company_id: this.supplier_id,
			order_at_supplier_company_name: this.supplier_name,
			note: '',
			item_group_id: 0,
			item_group_name: "",
			order_at_supplier: GO.billing.isPurchaseOrderBook,
			markup: 0
		});
		this.stopEditing();
		this.store.insert(this.store.getCount(), i);
		this.startEditing(this.store.getCount() - 1, 1);

	},

	addPageBreak: function () {

		var i = new GO.billing.OrderItem({
			id: 0,
			amount: '0',
			vat: '0',
			unit_price: '0',
			unit_list: '0',
			unit_cost: '0',
			discount: '0',
			unit_total: '0',
			product_id: 0,
			description: 'PAGEBREAK',
			cost_code: '',
			item_price: '0',
			item_total: '0',
			note: '',
			item_group_id: 0,
			item_group_name: ""
		});
		this.stopEditing();
		this.store.insert(this.store.getCount(), i);
		//this.startEditing(this.store.getCount()-1, 1);

	},

	addProducts: function (records)
	{
		if (records.length > 0)
		{
			var product_ids = new Array();
			var product_amounts = new Array()
			for (var i = 0; i < records.length; i++)
			{
				//var id = records[i].id.substr(2);

//				if(id)
//				{
				product_ids[i] = records[i].id;
				product_amounts[i] = records[i].amount;
//				}
			}

			this.changed = true;

			GO.request({
				url: 'billing/product/loadAsItems',
//				maskEl:this.body,
				params: {
					product_ids: Ext.encode(product_ids),
					order_id: this.order_id,
					default_supplier_id: this.supplier_id
				},
				success: function (options, response, result)
				{
					var results = result.results;
					for (var i = 0; i < results.length; i++)
					{
						var r = results[i];

						var index = product_ids.indexOf(r.id);
						var num_items_total = product_amounts[index];
						if (!num_items_total)
							num_items_total = 1;

						var language_id = GO.billing.orderDialog.formPanel.form.findField('language_id').getValue();

						var item;

						var max_items_stock = (r.stock - r.stock_min);
						if (max_items_stock < 0)
						{
							max_items_stock = 0;
						}

						var num_items_stock = (num_items_total > max_items_stock) ? max_items_stock : num_items_total;

						var desc = r['name_' + language_id];

						if (!GO.util.empty(r['description_' + language_id]))
							desc += "\n" + r['description_' + language_id]

						if (num_items_stock > 0)
						{
							item = new GO.billing.OrderItem({
								id: 0,
								amount: num_items_stock,
								vat: GO.util.unlocalizeNumber(r.vat),
								unit_price: r.list_price,
								unit_list: r.list_price,
								unit_cost: r.cost_price,
								discount: '0',
								unit_total: r.total_price,
								product_id: r.id,
								description: desc,
								order_at_supplier_company_id: r.order_at_supplier_company_id,
								allow_supplier_update: r.allow_supplier_update,
								item_price: num_items_stock * r.list_price,
								item_total: num_items_stock * r.total_price,
								order_at_supplier: 0,
								order_at_supplier_company_name: r.order_at_supplier_company_name,
								note: '',
								unit: r.unit,
								item_group_id: 0,
								item_group_name: "",
								markup: 0,
								cost_code: r.cost_code,
								tracking_code: r.tracking_code
							});

							this.stopEditing();
							this.store.insert(this.store.getCount(), item);
							this.startEditing(this.store.getCount() - 1, 1);
						}

						var num_items_supplier = num_items_total - num_items_stock;
						if (num_items_supplier > 0)
						{
							item = new GO.billing.OrderItem({
								id: 0,
								amount: num_items_supplier,
								vat: GO.util.unlocalizeNumber(r.vat),
								unit_price: r.list_price,
								unit_list: r.list_price,
								unit_cost: r.cost_price,
								discount: '0',
								unit_total: r.total_price,
								product_id: r.id,
								description: desc,
								order_at_supplier_company_id: r.order_at_supplier_company_id,
								allow_supplier_update: r.allow_supplier_update,
								item_price: num_items_supplier * r.list_price,
								item_total: num_items_supplier * r.total_price,
								order_at_supplier: 1,
								order_at_supplier_company_name: r.order_at_supplier_company_name,
								note: '',
								unit: r.unit,
								item_group_id: 0,
								item_group_name: "",
								markup: 0,
								cost_code: r.cost_code,
								tracking_code: r.tracking_code
							});

							this.stopEditing();
							this.store.insert(this.store.getCount(), item);
							this.startEditing(this.store.getCount() - 1, 1);
						}
					}

					this.updateTotals();

				},
				scope: this
			});
		}
	},

	getGridData: function () {

		var data = {};

		for (var i = 0; i < this.store.data.items.length; i++)
		{
			var r = this.store.data.items[i].data;

			data[i] = {};

			for (var key in r)
			{
				data[i][key] = r[key];
			}
		}

		return data;
	},
	overrideParams: {},

	/**
	 * Set the costCode field based on the trackingCode field.
	 * 
	 * Reads the parameter "this.selectedTrackingCodeRecord.data.costcode" that is set in the trackingcodeCombo change listener
	 * 
	 * @param {type} ed
	 * @param {type} value
	 * @param {type} startValue
	 * @returns {undefined}
	 */
	setCostCodeField: function (ed, value, startValue) {
		if (!GO.util.empty(this.selectedTrackingCodeRecord)) {
			ed.record.set('cost_code', this.selectedTrackingCodeRecord.data.costcode);
			this.changed = true;
		}
	},

	/**
	 * Set the trackingCode field based on the costCode field.
	 * 
	 * @param {type} ed
	 * @param {type} value
	 * @param {type} startValue
	 * @returns {undefined}
	 */
	setTrackingCodeField: function (ed, value, startValue) {
		ed.record.set('tracking_code', '');
		this.changed = true;
	},

	/*
	 * Overide ext method because there's no way to capture afteredit when there's no change.
	 * We need this because we format /unformat numbers before and after edit.
	 */
	onEditComplete: function (ed, value, startValue) {

		// Check if the trackingcode field is edited
		if (ed.field.id == 'trackingCodeBox-editor') {
			this.setCostCodeField(ed, value, startValue);
		}

		// Check if the costcode field is edited
		if (ed.field.id == 'costCodeBox-editor') {
			if (value != startValue) { // Only change the value of the trackingcode field if this value is changed
				this.setTrackingCodeField(ed, value, startValue);
			}
		}

		GO.billing.ItemsGrid.superclass.onEditComplete.call(this, ed, value, startValue);

		if (startValue != 'undefined' && String(value) === String(startValue)) {
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
				cancel: false
			};
			this.fireEvent('afternoedit', e);
		}

	},

	afterNoEdit: function (e)
	{
		e.record.set(e.field, this.currentOriginalValue);

		if (e.field == 'discount' && e.row == this.store.getCount() - 1)
		{
			this.addBlankRow.defer(100, this);
		}
	},

	afterEdit: function (e)
	{

		this.changed = true;
		
		// skip text fields
		if(e.grid.colModel.columns[e.column].isCustomField) {
			return true;
		}
		
		if (e.field != 'description' && e.field != 'cost_code' && e.field != 'tracking_code' && e.field != 'note' && e.field != 'unit')
			e.record.set(e.field, GO.util.unlocalizeNumber(e.value));

		var r = e.record.data;

		switch (e.field)
		{
			case 'markup':
				var unit_price = r.unit_cost * (1 + (r.markup / 100));
				e.record.set('unit_price', unit_price);
				var unit_total = r.unit_price * (1 + (r.vat / 100));
				e.record.set('unit_total', unit_total);
				var item_price = r.unit_price * (r.amount);
				e.record.set('item_price', this._roundTotals(item_price));
				var item_total = r.unit_total * (r.amount);
				e.record.set('item_total', this._roundTotals(item_total));
				break;

			case 'amount':
				var item_price = r.unit_price * (r.amount);
				e.record.set('item_price', this._roundTotals(item_price));
				var item_total = r.unit_total * (r.amount);
				e.record.set('item_total', this._roundTotals(item_total));
				break;

			case 'description':

				var combo_record = this.descriptionField.getStore().getAt(this.descriptionField.selectedIndex);
				if (combo_record) {
					e.record.set('unit_price', GO.util.unlocalizeNumber(combo_record.json.list_price));
					e.record.set('unit_list', GO.util.unlocalizeNumber(combo_record.json.list_price));
					e.record.set('unit_cost', GO.util.unlocalizeNumber(combo_record.json.cost_price));
				}

			case 'vat':

				// Do extra things for VAT
				if (GO.util.empty(this.taxRateBox.getValue())) {
					e.record.set('vat_code', '');
				} else {
					var combo_record = this.taxRateBox.getStore().getAt(this.taxRateBox.selectedIndex);
					if (combo_record) {
						e.record.set('vat_code', combo_record.data.name);
					}
				}

				// break; // Commented out because 'vat' needs to do the things underneath the 'unit_price' case too.
			case 'unit_price':
				var unit_total = r.unit_price * (1 + (r.vat / 100));
				e.record.set('unit_total', unit_total);
				var item_price = r.unit_price * (r.amount);
				e.record.set('item_price', this._roundTotals(item_price));
				var item_total = r.unit_total * (r.amount);
				e.record.set('item_total', this._roundTotals(item_total));
				if(r.unit_cost && r.unit_price) {
					var markup = (100 / r.unit_cost * r.unit_price) - 100;
					e.record.set('markup',this._roundTotals(markup));
				}
				break;
			case 'unit_cost':
				if(r.unit_cost && r.unit_price) {
					var markup = (100 / r.unit_cost * r.unit_price) - 100;
					e.record.set('markup',this._roundTotals(markup));
				}
				break;
				
			case 'unit_total':
				var unit_price = r.unit_total / (1 + (r.vat / 100));
				e.record.set('unit_price', unit_price);
				var item_price = r.unit_price * (r.amount);
				e.record.set('item_price', this._roundTotals(item_price));
				var item_total = r.unit_total * (r.amount);
				e.record.set('item_total', this._roundTotals(item_total));
				if(r.unit_cost && r.unit_price) {
					var markup = (100 / r.unit_cost * r.unit_price) - 100;
					e.record.set('markup',this._roundTotals(markup));
				}
				break;

			case 'discount':

				var number = parseFloat(r.unit_list);
				if (number == 0)
				{
					e.record.set('unit_list', r.unit_price);
					number = parseFloat(r.unit_list);
				}

				e.record.set('unit_price', number * ((100 - r.discount) / 100));
				var unit_total = r.unit_price * (1 + (r.vat / 100));
				e.record.set('unit_total', unit_total);
				var item_price = r.unit_price * (r.amount);
				e.record.set('item_price', this._roundTotals(item_price));
				var item_total = r.unit_total * (r.amount);
				e.record.set('item_total', this._roundTotals(item_total));
				break;
		}

		this.updateTotals();
	},

	beforeEdit: function (e)
	{
		if (e.record.get('description') == 'PAGEBREAK') {
			return false;
		}

		var colId = this.colModel.getColumnId(e.column);

		var col = this.colModel.getColumnById(colId);

		if (col.dataIndex == 'order_at_supplier_company_id' && !e.record.data.allow_supplier_update)
		{
			return false;
		}

		this.currentOriginalValue = e.value;
		if (col && col.editor && col.editor.decimals)
		{
			e.record.set(e.field, GO.util.numberFormat(e.value));
		}
	},

	setIds: function (ids)
	{
		for (var index in ids)
		{
			if (index != "remove")
			{
				this.store.data.items[index].set('id', ids[index]);
			}
		}
	},

	notifyDrop: function (dd, e, data)
	{
		if (this.editing)
			return false;

		var sm = this.getSelectionModel();
		var rows = sm.getSelections();
		var dragData = dd.getDragData(e);
		var cindex = dragData.rowIndex;

		if (typeof (cindex) == 'undefined')
			return false;

//		if(cindex=='undefined')
//		{
//			cindex=this.store.data.length-1;
//		}	

		for (i = 0; i < rows.length; i++)
		{
			var rowData = this.store.getById(rows[i].id);

			var targetRow = this.store.getAt(cindex);

			if (!this.copy) {
				this.store.remove(this.store.getById(rows[i].id));
			}
			rowData.set('item_group_name', targetRow.get('item_group_name'));
			rowData.set('item_group_id', targetRow.get('item_group_id'));

			this.store.insert(cindex, rowData);
		}

		//save sort order							
		var records = [];
		for (var i = 0; i < this.store.data.items.length; i++)
		{
			records.push({
				id: this.store.data.items[i].get('id'),
				sort_order: i
			});
		}

		this.changed = true;
		/*
		 
		 Ext.Ajax.request({
		 url: GO.settings.modules.billing.url+'action.php',
		 params: {
		 task: 'save_items_sort_order',
		 items: Ext.encode(records)
		 }
		 });*/

	},

	numberRenderer: function (v, meta, record)
	{
		if (record.get('description') == 'PAGEBREAK') {
			return '-';
		}

		//v = GO.util.unlocalizeNumber(v);
		return GO.util.numberFormat(v);
	},

	numberVATRenderer: function (v, meta, record)
	{

		var suffix = '';

		if (record.get('vat_code')) {
			suffix += '% - ' + record.get('vat_code');
		}

		return GO.util.numberFormat(v) + suffix;
	},

	amountRenderer: function (v, meta, record)
	{
		if (record.get('description') == 'PAGEBREAK') {
			return '-';
		}

		var unit = (record.data.unit) ? ' ' + record.data.unit : '';

		//v = GO.util.unlocalizeNumber(v);
		return GO.util.numberFormat(v) + unit;
	},

	comboRenderer: function (v, meta, record)
	{
		var name = (record.data) ? record.data.order_at_supplier_company_name : '';

		return name;
	},

	updateTotals: function () {

		var records = this.store.getRange();
		
		var costs = 0;
		var subtotal = 0;
		var total = 0;		
		var amount = 0;

		for (var i = 0; i < records.length; i++)
		{
			amount = parseFloat(records[i].get("amount"));			
			total += amount * parseFloat(records[i].get("unit_total"));
			subtotal += amount * parseFloat(records[i].get("unit_price"));
			costs += amount * parseFloat(records[i].get("unit_cost"));
		}
		
		total = this._roundTotals(total);
		subtotal = this._roundTotals(subtotal);
		costs = this._roundTotals(costs);
		
		var profit = (subtotal - costs);
		
		var margin = 0;
		if(costs > 0){
			margin = profit/(costs/100);
		}
	
		var vat = total-subtotal;
		
		GO.billing.itemsCostsField.setValue(GO.util.numberFormat(costs.toString()));
		GO.billing.itemsProfitField.setValue(GO.util.numberFormat(profit.toString()));
		GO.billing.itemsMarginField.setValue(GO.util.numberFormat(margin.toString()) + '%');
		GO.billing.itemsSubtotalField.setValue(GO.util.numberFormat(subtotal.toString()));
		GO.billing.itemsVatField.setValue(GO.util.numberFormat(vat.toString()));
		GO.billing.itemsTotalField.setValue(GO.util.numberFormat(total.toString()));
		
		this.store.loaded = true;
	},

	_roundTotals: function (amount) {
		if (!GO.billing.billingRound)
			return Math.round(amount * 100) / 100;
		switch (GO.billing.billingRound) { // Javascript its floats are only 13 digits after the decimal (fix infinity problem with toPrecision)
			case 'up' :
				return Math.ceil(amount.toPrecision(12) * 100) / 100;
			case 'down' :
				return Math.floor(amount.toPrecision(12) * 100) / 100;
			default :
				return Math.round(amount * 100) / 100;
		}
	},

	setSupplierId: function (book_id, supplier_id, supplier_name)
	{
		var book = GO.billing.readableBooksStore.getById(book_id);
		if (!book)
		{
			book = GO.billing.orderDialog.selectBook.store.getById(book_id);
		}
		if (book)
		{
			this.supplier_id = (book.json.is_purchase_orders_book == '1') ? supplier_id : 0;
			this.supplier_name = (book.json.is_purchase_orders_book == '1') ? supplier_name : "";
			this.setBookId(book_id);
		} else
		{
			this.supplier_id = 0;
			this.supplier_name = "";
		}
	},

	showGroupManagementDialog: function () {
		if (!this.existingGroupsDialog) {
			this.existingGroupsDialog = new GO.billing.ExistingGroupsDialog();
			this.existingGroupsDialog.on('groupSelected', function (item_group_id) {
				if (this.existingGroupsDialog.isManageDialog)
					this.changeGroup(item_group_id);
			}, this);
			this.existingGroupsDialog.on('hide', function () {
				this.orderDialog.submitForm(false, {
					scope: this,
					callback: function () {
						this.store.load();
					}
				});

			}, this);
		}
		this.existingGroupsDialog.setManageDialog(true);
		this.existingGroupsDialog.setOrderId(this.order_id);
		this.existingGroupsDialog.show();
	},

	setPurchaseOrderBook: function (isPOBook) {
		var cm = this.getColumnModel();
		var index = cm.findColumnIndex('order_at_supplier');
		if(index>0) {
			cm.setHidden(index, !isPOBook);
		}
	},

	setOrderId: function (order_id, isPOBook) {
		this.store.baseParams.order_id = order_id;
		this.store.loaded = false;
		this.order_id = order_id;
	},

	setBookId: function (book_id) {
		if (this.book_id != book_id) {
			this.book_id = book_id;
			this.trackingCodeBox.store.baseParams.book_id = book_id;
			this.trackingCodeBox.store.load();
		}
	}

});
