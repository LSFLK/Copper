/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @copyright Copyright Intermesh
 * @version $Id: ExpensesWindow.js 22862 2018-01-12 08:00:03Z mschering $
 * @author Merijn Schering <mschering@intermesh.nl>
 */

GO.billing.ExpensesWindow = function(config){	
	
	if(!config)
	{
		config={};
	}	

	this.booksPanel = new GO.billing.ExpenseBooksGrid({
    region:'west',
    title:t("Expense books", "billing"),
		autoScroll:true,				
		width:200,
		split:true
	});	
		
	this.booksPanel.on('rowclick', function(grid, rowIndex)
	{
		var record = grid.getStore().getAt(rowIndex);	
		
		GO.billing.defaultExpenseVAT = parseFloat(record.data.vat);
		this.setBookId(record.data.id);		
	}, this);
	
	this.booksPanel.store.on('load', function(){
		this.booksPanel.selModel.selectFirstRow();
		
		var record = this.booksPanel.selModel.getSelected();
		if(record)
		{
			GO.billing.defaultExpenseVAT = parseFloat(record.data.vat);
			this.setBookId(record.data.id);			
		}		
	}, this);
	
	this.centerPanel = new GO.billing.ExpensesGrid({
		region:'center',
		border:true,
		resizable:false
	});
	
	this.centerPanel.store.on('load', function(){
		this.setWritePermission(this.centerPanel.store.reader.jsonData.permissionLevel>GO.permissionLevels.read);
	}, this);
	
	config.tbar=[this.addButton = new Ext.Button({
			iconCls: 'btn-add',
			text: t("Add"),
			cls: 'x-btn-text-icon',
			handler: function(){
	    	this.centerPanel.expenseDialog.show();
	    	this.centerPanel.expenseDialog.formPanel.baseParams.expense_book_id=this.centerPanel.store.baseParams.expense_book_id;
			},
			disabled: true,
			scope: this
		}),this.deleteButton = new Ext.Button({
			iconCls: 'btn-delete',
			text: t("Delete"),
			cls: 'x-btn-text-icon',
			handler: function(){
				this.centerPanel.deleteSelected();
			},
			scope: this,
			disabled: true
		})
		
//		,'-',{
//			iconCls: 'btn-export',
//			text: t("Export"),
//			cls: 'x-btn-text-icon',
//			scope: this,
//			handler: function(){
//				if(!this.exportDialog)
//				{
//					this.exportDialog = new GO.billing.ExportDialog({
//							query:'expenses'
//						});
//				}
//				this.exportDialog.show({
//					colModel:this.centerPanel.getColumnModel(),
//					title:this.title,
//					searchQuery: this.centerPanel.searchField.getValue()
//				});
//			}
//		}
	];
	
	config.items=[
		this.booksPanel,
		this.centerPanel
	];
	
	config.layout='border';
	config.modal=false;
	config.resizable=true;
	config.maximizable=true;
	config.width=800;
	config.height=500;
	config.closeAction='hide';
	config.title= t("Expenses", "billing");					
	
	GO.billing.ExpensesWindow.superclass.constructor.call(this, config);
	
	
	this.addEvents({'save' : true});	
}

Ext.extend(GO.billing.ExpensesWindow, GO.Window,{
	
	afterRender : function(){
		GO.billing.ExpensesWindow.superclass.afterRender.call(this);
		this.booksPanel.store.load();

	},
	
	setWritePermission : function(write_permission)
	{
		this.deleteButton.setDisabled(!write_permission);
		this.addButton.setDisabled(!write_permission);		
	},
	
	
	setBookId : function(expense_book_id)
	{		
		this.centerPanel.store.baseParams.expense_book_id = expense_book_id;
		this.centerPanel.store.load();	
		
		if(GO.billing.expenseCategoriesStore.baseParams.expense_book_id!=expense_book_id)
		{
			GO.billing.expenseCategoriesStore.baseParams.expense_book_id=expense_book_id;
			GO.billing.expenseCategoriesStore.load();
		}	
	}

});

