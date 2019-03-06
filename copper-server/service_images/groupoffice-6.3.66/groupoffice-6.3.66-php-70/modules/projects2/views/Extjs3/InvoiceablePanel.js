/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: InvoiceablePanel.js 23462 2018-03-06 11:37:47Z mschering $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */
GO.projects2.InvoiceablePanel = Ext.extend(Ext.Panel,{

	initComponent : function(){

		var summary = new Ext.grid.JsonSummary();

		var price = [];
		var hours = [];
		
		var today = new Date();

		this.end = new Date(today.setMonth(today.getMonth()+1));

		this.checkColumn = this.pluginCheckColumn || new GO.grid.CheckColumn({
					id: 'pr2-project-invoiced',
					dataIndex: 'is_invoiced',
					width: 30,
					header: '<div class="tasks-complete-icon"></div>',
					sortable:false
					,summaryRenderer:function(v, meta, r){
						return "";
					}
				});
			
		this.gridPlugins = [summary,this.checkColumn];
		if (this.extraCustomGridPlugins) {
			for (var i=0; i<this.extraCustomGridPlugins.length;i++) {
				this.gridPlugins.push(this.extraCustomGridPlugins[i]);
			}
		}
		
		this.gridColumns = [
          this.checkColumn,{
					header: t("Path", "projects2"),
					dataIndex: 'project_path',
					width: 200,
					sortable: true,
					summaryRenderer:function(v, meta, r){
						return t("Total");
					}
				},{
					header: t("Name"),
					dataIndex: 'project_name',
					width: 150,
					sortable: true,
					hidden:true,
					summaryRenderer:function(v, meta, r){
						return '';
					}
				},{
					header: t("Amount", "projects2"), 
					dataIndex: 'amount',
					renderer : function(v, meta, record) {
							return GO.util.format.valuta(v);
					}
					,summaryRenderer:function(v, meta, r){
						return GO.util.format.valuta(v);
					}
					,align: 'right'
				}
				];
		if (this.extraCustomGridColumns) {
			for (var i=0; i<this.extraCustomGridColumns.length;i++) {
				this.gridColumns.push(this.extraCustomGridColumns[i]);
			}
		}
		
		this.grid = new GO.grid.GridPanel({
			region: 'center',
			standardTbar:false,
			border: false,
			editDialog : GO.projects2.IncomeDialog,
			paging:false,
			plugins: this.gridPlugins,
			store: this.store = new GO.data.JsonStore({
				url:GO.url("projects2/income/invoiceable"),
				baseParams: {
					end: Math.round(+this.end/1000)
				},
				id:'project_id',
				fields: ['project_id',
					'project_path',
					'description',
					'invoice_at',
					'invoice_number',
					'amount',
					'price',
					'type',
					'is_invoiced'
				],
				listeners : {
					load : function() {
						price = [];
						hours = [];
					}
				}
			}),
			tbar: [
//				'Van:',
//				this.from = new Ext.form.DateField(),
				t("From", "projects2"),
				this.from = new Ext.form.DateField({
//					value: null,
					listeners: {
						change: function(datefield) {
							this.store.baseParams.start_date = Math.round(+datefield.getValue()/1000);
							this.store.reload();
						},
						select: function(datefield) {
							this.store.baseParams.start_date = Math.round(+datefield.getValue()/1000);
							this.store.reload();
						},
						scope: this
					}
				}),
				t("Until", "projects2"),
				this.till = new Ext.form.DateField({
					value: this.end,
					listeners: {
						change: function(form) {
							this.grid.store.baseParams.end = Math.round(+form.getValue()/1000);
							this.grid.store.reload();
						},
						select: function(form) {
	
							this.grid.store.baseParams.end = Math.round(+form.getValue()/1000);
							this.grid.store.reload();
						},
						scope: this
					}
				}),
				'-',				
				new GO.form.SearchField({
					store: this.store,
					width:150
				}),
				'-',{
					xtype: 'button',
					text: t("Continue", "projects2"),
					enableToggle: true,
					handler: function(button, event){
	//						this.store.baseParams['showCompleted']=button.pressed;
	//						this.store.reload();
						this.markInvoiced(price, hours);
					},
					scope: this
				}
			],
			cm:new Ext.grid.ColumnModel({
				defaults:{
					sortable:false
				},
				columns: this.gridColumns
			})
		});
		
		this.checkColumn.on('change', function(record, newValue){
			var isHour = true;//record.id.toString().charAt(0)==='p';
			if(newValue) {
				if(isHour)
					hours.push(record.id);
				else
					price.push(record.id);
			} else {
				if(isHour) {
					var index = hours.indexOf(record.id);
					if(index!==-1)
						hours.splice(index, 1);
					return;
				}
				var index = price.indexOf(record.id);
				if(index!==-1)
					price.splice(index, 1);
			}
			
		});
		
		
	this.typesMultiSelect = new GO.grid.MultiSelectGrid({
			region:'west',
			width: 250,
			id:'pr2_invoicable_grid',
			title:t("Project type", "projects2"),
			loadMask:true,
			store: new GO.data.JsonStore({
				url: GO.url('projects2/type/store'),
				baseParams: {
					permission_level: GO.projects2.permissionLevelFinance
				},
				root: 'results',
				id: 'id',
				totalProperty:'total',
				fields: ['id','name','acl_id','acl_book','checked'],
				remoteSort: true
			}),
			split:true,
			allowNoSelection:true,
			relatedStore: this.grid.store,
			tbar: [this.showScheduledField = new Ext.form.Checkbox({
				boxLabel: t("Show invoiced projects", "projects2"),
				labelSeparator: '',
				name: 'show_invoiced',		
				allowBlank: true,
//				ctCls:'bs-scheduled-cb',
				listeners: {
					'check': function(checkbox, checked) { 
						this.grid.store.baseParams['show_invoiced'] = checked;
						this.grid.store.reload();
					},
					scope: this
				}
			})]
		});
		
		
		Ext.apply(this,{
			title:t("Post calculation", "projects2"),
			layout:'border',
//			listeners:{
//				show:function(){
//					//if(!grid.store.loaded)
//						grid.store.reload();
//				}
//			},
			items : [this.typesMultiSelect,this.grid]
		});
		
		GO.projects2.InvoiceablePanel.superclass.initComponent.call(this);		
		
		this.grid.store.on('beforeload',function(store){
			store.baseParams['pr2_invoicable_grid'] = Ext.encode(this.typesMultiSelect.getSelected());
		}, this);
	},
	
	markInvoiced : function(ids, hours) {
		GO.request({
			url: 'projects2/income/check',
			jsonData: {
				prices: ids, 
				hours: hours,
				start: Math.round(+this.from.getValue()/1000),
				end: Math.round(+this.till.getValue()/1000)
			},
			success: function(response,options, result){ 
				this.ownerCt.setActiveTab(0);
				if(go.Modules.isAvailable("legacy", "billing")) {
					if (!GO.projects2.billingInvoiceDialog)
						GO.projects2.billingInvoiceDialog = new GO.projects2.BillingInvoiceDialog();
					
					GO.projects2.billingInvoiceDialog.show({income_ids: result.income_ids});
				}
			},
			scope: this
		});
	},
	
	load: function () {
		this.typesMultiSelect.store.load();
			
			GO.request({
				url: 'projects2/income/getInvoiceableDateSettings',
				success: function(response,options,result) {
					if (result.start_date > 0) {
						this.from.setValue(new Date(result.start_date * 1000));
						this.grid.store.baseParams['start_date'] = result.start_date;
					}
					if (result.end > 0) {
						this.till.setValue(new Date(result.end * 1000));
						this.grid.store.baseParams['end'] = result.end;
					}
				},
				scope: this
			});
	}
	
});
