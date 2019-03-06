/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: ExpensesGrid.js 22922 2018-01-12 08:01:04Z mschering $
 * @copyright Copyright Intermesh
 * @author Merijn Schering <mschering@intermesh.nl>
 * @author Michael de Hart <msdhart@intermesh.nl>
 */


GO.projects2.ExpensesGrid = Ext.extend(GO.grid.GridPanel,{

	showAllPanel: false,

	initComponent : function(){
		
		this.summary = new Ext.grid.GridSummary();

		this.store = new GO.data.JsonStore({
			url:GO.url("projects2/expense/store"),
			fields:['id','project_id','nett','vat','date','description','expense_budget'],
			baseParams: {limit: 0}
		})
		this.store.on('load', function(me, records, options){ 
			if(records.length===0)
				this.summary.view.summary.update();
		},this);

		Ext.applyIf(this, {
			plugins: [this.summary],
			title:t("Expenses", "projects2"),
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
			editDialogClass: GO.projects2.ExpenseDialog,
			listeners:{
				show: function () {
					this.store.load();
				},
				scope:this
			},
			cm:new Ext.grid.ColumnModel({
				defaults:{
					sortable:true
				},
				columns:[{
					header: t("Expense budget", "projects2"),
					dataIndex: 'expense_budget'
				},{
					header: t("Description"),
					dataIndex: 'description'
				},{
					header: t("Amount", "projects2"),
					dataIndex: 'nett',
					summaryType: 'sum',
					editor: new GO.form.NumberField({
						allowBlank: false
					}),
					align:'right'
//					renderer:function(v){
//						var number = GO.util.unlocalizeNumber(v);
//						return GO.util.numberFormat(number);
//					}
				},{
					header: t("VAT (%)", "projects2"),
					dataIndex: 'vat',
					
					editor: new GO.form.NumberField({
						allowBlank: false
					}),
					align:'right'
				},{
					header: t("Date"),
					dataIndex: 'date',
					editor: new Ext.form.DateField({
						format:GO.settings.date_format
					}),

					renderer: function(value){
						return typeof(value.dateFormat)=='undefined' ? value : value.dateFormat(GO.settings.date_format);
					},
					summaryRenderer:function(){
						return '&nbsp;';
					}
				}]
			})
		});
		
		GO.projects2.ExpensesGrid.superclass.initComponent.call(this);		
	},

	
	setProjectId: function (project_id) {
		if (this.showAllPanel) {
			return;
		}
		this.store.baseParams.project_id = project_id;
		this.setDisabled(GO.util.empty(project_id));
	},
	btnAdd : function(){
		if(this.editDialogClass){
			this.showEditDialog(0,{
				values:{
					project_id:this.store.baseParams.project_id
					}
			});
		}
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
						url:'projects2/expense/duplicate',
						params:{
							expenseIds:Ext.encode(selectedIds)
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
