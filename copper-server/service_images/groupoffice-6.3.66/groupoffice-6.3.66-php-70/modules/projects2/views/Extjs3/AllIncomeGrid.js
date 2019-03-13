/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: AllIncomeGrid.js 22922 2018-01-12 08:01:04Z mschering $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */


GO.projects2.AllIncomeGrid = Ext.extend(GO.grid.GridPanel,{
	
	rowActionsPrint: new Ext.ux.grid.RowActions({
			header:'',
			hideMode:'display',
			keepSelection:true,
			actions:[{
				hideIndex:'hide_print',
				iconCls:'btn-print',
				qtip:t("Print")
			}],
			width: 50,
			summaryRenderer:function(){
				return '&nbsp;';
			}
		}),
		
		
	rowActionsOpenFolder: new Ext.ux.grid.RowActions({
			header:'',
			hideMode:'display',
			keepSelection:true,
			actions:[{
				qtipIndex:'qtip1',
				iconCls:'btn-read',
				tooltip:t("Search files", "projects2"),
				tooltipType: 'title'
			}],
			width: 50
		}),
		
		
	columns:[{
			dataIndex:'invoiceable',
			header: t("Invoiceable", "projects2"),
			renderer: function(v,m,r) { 
				if(r.data.invoiceable){
					return '<i title="'+t("Invoiceable", "projects2")+'" class="icon">warning</i>';
				}
			},
			width: dp(48)
		},{
			dataIndex: 'is_invoiced',
			renderer: function(v,m,r) { 
				if(r.data.is_invoiced){
					return '<i title="'+t("Invoiced", "projects2")+'" class="icon">check</i>';
				}
			}
			,summaryRenderer:function(v, meta, r){
				return t("Total");
			}
			,width: dp(48)
		},{
			header: t("Name"),
			dataIndex: 'project_name',
			hidden:true
		},{
			header: t("Path", "projects2"),
			dataIndex: 'project_path'
		},{
			header: t("Description"),
			dataIndex: 'description'
		},{
			header: t("Reference no.", "projects2"),
			dataIndex: 'reference_no'
		},{
			header: t("Amount", "projects2"),
			dataIndex: 'amount',
			align: 'right',
			renderer: GO.util.format.valuta
		}/*,{
			header: t("Invoiced", "projects2"),
			dataIndex: 'is_invoiced',
			renderer: GO.util.format.yesNo
		}*/,{
			header: t("Invoice at", "projects2"),
			dataIndex: 'invoice_at',
			renderer: function(value){
				return !value.dateFormat ? value : value.dateFormat(GO.settings.date_format);
			},
			summaryRenderer:function(){
				return '&nbsp;';
			}
		},{
			header: t("Invoice No.", "projects2"),
			dataIndex: 'invoice_number'
		},{
			header: t("Type"),
			dataIndex: 'type',
			renderer: function(v) {
				if(v==1)
					return t("Contract Price", "projects2");
				else
					return t("Post calculation", "projects2");
			},
			summaryRenderer:function(){
				return '&nbsp;';
			}
		},{
			header: t("Comment"),
			dataIndex: 'comments',
			sortable: true,
			hidden: true
		}
		

	],
		
	fields: ['id','project_id', 'project_path','project_name', 'description','reference_no', 'amount','is_invoiced','invoiceable','period_start','period_end','invoice_at','invoice_number', 'type','hide_print', 'comments'],
	
	
	plugins: [],
	
	
//	initComponent : GO.grid.GridPanel.prototype.initComponent.createInterceptor(function(){
//			console.log('asd');
//			
////			this.plugins.push(this.rowActionsPrint)
////			this.plugins.push(this.rowActionsOpenFolder)
////			this.columns.push(this.rowActionsOpenFolder)
//			
//			
//			
//			
//	}),
	
	constructor : function(config){
		config = config ? config: {};
		
		var today = new Date();

		this.end = new Date(today.setMonth(today.getMonth()+1));
		
		
		this.summary = new Ext.grid.JsonSummary();
		this.plugins.push(this.summary);
		

		this.store = new GO.data.JsonStore({
			url:GO.url("projects2/income/store"),
			fields:this.fields
		});
		
		this.rowActionsPrint.on({
			action:function(grid, record, action, row, col) {

				switch(action){
					case 'btn-print':
						this.exportFile(record,action);
						break;
				}
			},
			scope: this
		}, this);
		
		this.rowActionsOpenFolder.on({
			action:function(grid, record, action, row, col) {

				switch(action){
					case 'btn-read':
						
						if (!GO.files) {
							Ext.Msg.alert(t("Error"),'This button requires the Files module to be activated.');
						}
						GO.request({
							url:'files/folder/checkModelFolder',
							maskEl:this.ownerCt.ownerCt.getEl(),
							params:{								
								mustExist:true,
								model:'GO\\Projects2\\Model\\Income',
								id:record.data.id
							},
							success:function(response, options, result){														
								GO.files.openFolder(result.files_folder_id);
							},
							scope:this

						});
						break;
				}
			},
			scope: this
		}, this);
		
		
		
		this.plugins.push(this.rowActionsPrint);
		this.plugins.push(this.rowActionsOpenFolder);
		this.columns.push(this.rowActionsPrint);
		this.columns.push(this.rowActionsOpenFolder);
		
		
		
		Ext.apply(config,{
			
			standardTbar:false,
			baseParams: {
				end: Math.round(+this.end/1000)
			},
			tbar:[
				t("From", "projects2"),
				this.from = new Ext.form.DateField({
//					value: null,
					listeners: {
						change: function() {
							this.store.baseParams.start_date = Math.round(+this.from.getValue()/1000);
							this.store.reload();
						},
						select: function() {
							this.store.baseParams.start_date = Math.round(+this.from.getValue()/1000);
							this.store.reload();
						},
						scope: this
					}
				}),
				t("Until", "projects2"),
				this.till = new Ext.form.DateField({
					value: this.end,
					listeners: {
						change: function() {
							this.store.baseParams.end = Math.round(+this.till.getValue()/1000);
							this.store.reload();
						},
						select: function() {
							this.store.baseParams.end = Math.round(+this.till.getValue()/1000);
							this.store.reload();
						},
						scope: this
					}
				}),{
					itemId:'delete',
					iconCls: 'btn-delete',
					text: t("Delete"),
					cls: 'x-btn-text-icon',
					disabled:this.standardTbarDisabled,
					handler: function(){
						this.deleteSelected();
					},
					scope: this
				},
				'-',				
				this.SearchField = new GO.form.SearchField({
					width:150
				}),
				'-',
				this.exportMenu = new GO.base.ExportMenu({className:'GO\\Projects2\\Export\\GridAllIncome'})
			],
			store: this.store,
			border: false,
			paging:true,
			editDialogClass: GO.projects2.IncomeDialog,
			listeners:{
				show:function(){
					this.store.load();
				},
				scope:this
			},
			cm:new Ext.grid.ColumnModel({
				defaults:{
					sortable:true
				},
				columns:this.columns
			})
		});
			
		GO.projects2.AllIncomeGrid.superclass.constructor.call(this, config);	
	},
	
	

	
	btnAdd : function(){
		if(this.editDialogClass){
			this.showEditDialog(0,{
				project_id:this.store.baseParams.project_id
			});
		}
	},
	
	exportFile : function(record,action) {
		
		window.open(GO.url('projects2/income/export',{income_id:record.id}));
		
	},
	
	showEditDialog : function(id, config, record) {
		var config = config || {};
		config['project_id'] = record.data.project_id;
		GO.projects2.AllIncomeGrid.superclass.showEditDialog.call(this,id,config,record);
	},
	
	
	load: function () {
		GO.projects2.typesStore.load();
		
		GO.request({
				url: 'projects2/income/getDateSettings',
				success: function(response,options,result) {
					if (result.start_date > 0) {
						this.allIncomeGrid.from.setValue(new Date(result.start_date * 1000));
						this.allIncomeGrid.store.baseParams['start_date'] = result.start_date;
					}
					if (result.end > 0) {
						this.allIncomeGrid.till.setValue(new Date(result.end * 1000));
						this.allIncomeGrid.store.baseParams['end'] = result.end;
					}
				},
				scope: this
			});
	}
});
