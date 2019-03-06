/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: ExpenseBudgetsGrid.js 22922 2018-01-12 08:01:04Z mschering $
 * @copyright Copyright Intermesh
 * @author Merijn Schering <mschering@intermesh.nl>
 */
 

GO.projects2.ExpenseBudgetsGrid = Ext.extend(GO.grid.GridPanel,{

	initComponent : function(){
		
		Ext.apply(this,{
			title:t("Expense budgets", "projects2"),
			disabled:true,
			standardTbar:true,
			store: new GO.data.JsonStore({
				url:GO.url("projects2/expenseBudget/store"),
				fields:['id','description','supplier_name','nett','gross','vat','comments']
			}),
			border: false,
			deleteConfig: {
				extraWarning: t("When deleting an expense budget all expenses added to this budget will be removed as well", "projects2")+'\n'
				},
			paging:true,
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
				columns:[
				{
					header: 'ID', 
					dataIndex: 'id',
					width: 20
				},{
					header: t("Description"), 
					dataIndex: 'description'
				},{
					header: t("Supplier", "projects2"), 
					dataIndex: 'supplier_name'
				},{
					header: t("Comments", "projects2"), 
					dataIndex: 'comments'
				},{
					header: t("Total Nett", "projects2"), 
					dataIndex: 'nett',
					align:"right",
					renderer: GO.util.format.valuta
				}	
				]
			})
		});
		
		GO.projects2.ExpenseBudgetsGrid.superclass.initComponent.call(this);		
	},
	
	dblClick : function(grid, record, rowIndex){
		this.showExpenseBudgetDialog(record.id);
	},
	
	btnAdd : function(){				
		this.showExpenseBudgetDialog();	  	
	},
	showExpenseBudgetDialog : function(id){
		if(!this.expenseBudgetDialog){
			this.expenseBudgetDialog = new GO.projects2.ExpenseBudgetDialog();

			this.expenseBudgetDialog.on('save', function(){   
				this.store.load(); 			    			
			}, this);	
		}
		this.expenseBudgetDialog.show(id,{
			values:{
				project_id:this.store.baseParams.project_id
				}
		});	  
	},
	
	setProjectId : function(project_id){
		this.store.baseParams.project_id=project_id;
		this.setDisabled(GO.util.empty(project_id));
	}
});
