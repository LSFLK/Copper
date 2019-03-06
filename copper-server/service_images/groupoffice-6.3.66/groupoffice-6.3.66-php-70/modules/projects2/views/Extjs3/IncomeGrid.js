/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: IncomeGrid.js 22922 2018-01-12 08:01:04Z mschering $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */


GO.projects2.IncomeGrid = Ext.extend(GO.grid.GridPanel,{
	plugins: [],
	
	fields:['id', 'project_id', 'description', 'reference_no', 'amount', 'is_invoiced', 'invoiceable', 'invoice_at', 'paid_at', 'invoice_number', 'type', 'comments', 'is_contract', 'contract_repeat_amount', 'contract_repeat_freq', 'hide_print'],

	
	columns:[{
				dataIndex:'invoiceable',
				header: t("Invoiceable", "projects2"),
				renderer: function(v,m,r) { 
					if(r.data.invoiceable){
						return '<i title="'+t("Invoiceable", "projects2")+'" class="icon">warning</i>';
					}
				},
				width: 10
			},{
				dataIndex: 'is_invoiced',
				renderer: function(v,m,r) { 
					if(r.data.is_invoiced){
						return '<i title="'+t("Invoiced", "projects2")+'" class="icon">check</i>';
					}
				},
				width: 10
			},{
				dataIndex: 'is_contract',
				header: t("Contract", "projects2"),
				renderer: function(v,m,r) { 
					if(r.data.is_contract){
						return t("Yes");
						//return '<div title="'+t("Contract", "projects2")+'" class="tasks-complete-icon"></div>';
					} else {
						return t("No");
					}
				},
				width: 80
			},{
				dataIndex: 'contract_repeat_freq',
				header: t("Repeat", "projects2"),
				renderer: function(v,m,r) { 
					if(r.data.contract_repeat_freq){
						return r.data.contract_repeat_amount +' '+ t(GO.util.format.capitalize(r.data.contract_repeat_freq));
					}
				},
				width: dp(140),
				sortable:false
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
				}, {
					header: t("Paid at", "projects2"),
					dataIndex: 'paid_at',
					renderer: function (value) {
						return !value.dateFormat ? value : value.dateFormat(GO.settings.date_format);
					},
					summaryRenderer: function () {
						return '&nbsp;';
					}
				}, {
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
				}
			},{
				header: t("Comment"),
				dataIndex: 'comments',
				sortable: true,
				hidden: true
			}
		],
			
		rowActionsSearchFiles : new Ext.ux.grid.RowActions({
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
	
	constructor : function(config){
		config = config ? config: {};
		
		this.columns.push(this.rowActionsSearchFiles);
		this.columns.push(this.rowActionsPrint);
		
		this.summary = new Ext.grid.GridSummary();
		this.plugins.push(this.summary);
		
		this.rowActionsSearchFiles.on({
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
		
		
		this.plugins.push(this.rowActionsSearchFiles);
		this.plugins.push(this.rowActionsPrint);

		this.store = new GO.data.JsonStore({
			url:GO.url("projects2/income/store"),
			fields: this.fields,
			baseParams: {
				forProjectTabPanel: true
			}
		});
		
		Ext.apply(config,{
			title:t("Income", "projects2"),
			disabled:true,
			tbar: [{
				itemId:'add',
				iconCls: 'btn-add',							
				text: t("Add"),
				cls: 'x-btn-text-icon',
				handler: this.btnAdd,
				disabled:false,
				scope: this
			},{
				itemId:'delete',
				iconCls: 'btn-delete',
				text: t("Delete"),
				cls: 'x-btn-text-icon',
				disabled:false,
				handler: function(){
					this.deleteSelected();
				},
				scope: this
			},
			'-',
			{
				itemId:'duplicate',
				iconCls: 'btn-add',
				text: t("Duplicate", "projects2"),
				cls: 'x-btn-text-icon',
				disabled: false,
				handler: function() {
					this.queryDuplicate();
				},
				scope: this
			}],
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
		
		
	
		GO.projects2.IncomeGrid.superclass.constructor.call(this, config);	
	},
	
	setProjectId : function(project_id){
		this.store.baseParams.project_id=project_id;
		this.setDisabled(GO.util.empty(project_id));
	},
	btnAdd : function(){
		if(this.editDialogClass){
			this.showEditDialog(0,{
				project_id:this.store.baseParams.project_id,
				loadParams: { project_id : this.store.baseParams.project_id }
			});
		}
	},
	
	exportFile : function(record,action) {
		window.open(GO.url('projects2/income/export',{income_id:record.id}));
	},
	
	queryDuplicate: function() {
		Ext.Msg.show({
			title: t("Duplicate items?", "projects2"),
			icon: Ext.MessageBox.QUESTION,
			msg: t("This duplicates the selected items. Proceed?", "projects2"),
			buttons: Ext.Msg.YESNO,
			scope:this,
			fn: function(btn) {
				if (btn=='yes') {
					var selectedRecords = this.getSelectionModel().getSelections();
					
					var selectedIds = new Array();
					for (var i=0; i<selectedRecords.length; i++) {
						selectedIds.push(selectedRecords[i].data.id);
					}
					
					GO.request({
//						timeout:300000,
						maskEl:Ext.getBody(),
						url:'projects2/income/duplicate',
						params:{
							incomeIds:Ext.encode(selectedIds)
						},
						success: function() {
							this.store.load();
						},
						scope:this
					});
				}
			}
		});
	}
});
