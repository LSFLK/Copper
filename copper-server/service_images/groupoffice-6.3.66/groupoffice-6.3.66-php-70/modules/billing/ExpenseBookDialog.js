/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @copyright Copyright Intermesh
 * @version $Id: ExpenseBookDialog.js 22862 2018-01-12 08:00:03Z mschering $
 * @author Merijn Schering <mschering@intermesh.nl>
 */

GO.billing.ExpenseBookDialog = function(config){
	
	
	if(!config)
	{
		config={};
	}
	
	
	this.buildForm();
	
	var focusFirstField = function(){
		this.propertiesPanel.items.items[0].focus();
	};
	
	
	config.maximizable=true;
	config.layout='fit';
	config.modal=false;
	config.resizable=false;
	config.width=700;
	config.height=600;
	config.closeAction='hide';
	config.title= t("Expense book", "billing");					
	config.items= this.formPanel;
	config.focus= focusFirstField.createDelegate(this);
	config.buttons=[{
			text: t("Ok"),
			handler: function(){
				this.submitForm(true);
			},
			scope: this
		},{
			text: t("Apply"),
			handler: function(){
				this.submitForm();
			},
			scope:this
		},{
			text: t("Close"),
			handler: function(){
				this.hide();
			},
			scope:this
		}					
	];
	
	GO.billing.ExpenseBookDialog.superclass.constructor.call(this, config);
	this.addEvents({'save' : true});	
}
Ext.extend(GO.billing.ExpenseBookDialog, Ext.Window,{
	
	show : function (expense_book_id) {
		if(!this.rendered)
		{
			this.render(Ext.getBody());
		}
		
		this.tabPanel.setActiveTab(0);
		
		
		
		if(!expense_book_id)
		{
			expense_book_id=0;			
		}
			
		this.setExpenseBookId(expense_book_id);
		
		if(this.expense_book_id>0)
		{
			this.formPanel.load({
				url : GO.url('billing/expenseBook/load'),
				
				success:function(form, action)
				{		
					this.readPermissionsTab.setAcl(action.result.data.acl_id);									
					
					GO.billing.ExpenseBookDialog.superclass.show.call(this);
				},
				failure:function(form, action)
				{
					GO.errorDialog.show(action.result.feedback)
				},
				scope: this
				
			});
		}else 
		{
			
			this.formPanel.form.reset();
			
			this.readPermissionsTab.setAcl(0);
			GO.billing.ExpenseBookDialog.superclass.show.call(this);
		}
	},
	
	
	
	setExpenseBookId : function(expense_book_id)
	{
		this.formPanel.form.baseParams['id']=expense_book_id;
		this.expense_book_id=expense_book_id;
		this.expenseCategoriesTab.setExpenseBookId(expense_book_id);
	},
	
	submitForm : function(hide){
		this.formPanel.form.submit(
		{
			url:GO.url('billing/expenseBook/submit'),			
			waitMsg:t("Saving..."),
			success:function(form, action){
				
				this.fireEvent('save', this);
				
				if(hide)
				{
					this.hide();	
				}else
				{
				
					if(action.result.id)
					{
						this.setExpenseBookId(action.result.id);
						
						this.readPermissionsTab.setAcl(action.result.acl_id);
											
					}
				}
				
									
			},		
			failure: function(form, action) {
				if(action.failureType == 'client')
				{					
					Ext.MessageBox.alert(t("Error"), t("You have errors in your form. The invalid fields are marked."));			
				} else {
					Ext.MessageBox.alert(t("Error"), action.result.feedback);
				}
			},
			scope: this
		});
		
	},
	
	
	buildForm : function () {
		this.propertiesPanel = new Ext.Panel({
			url:GO.url('billing/expenseBook/load'),
			border: false,
			baseParams: {task: 'expense_book'},			
			title:t("Properties"),			
			cls:'go-form-panel',			
			layout:'form',
			autoScroll:true,
			items:[{
				xtype: 'textfield',
			  name: 'name',
				anchor: '100%',
			  allowBlank:false,
			  fieldLabel: t("Name")
			},{
				xtype: 'textfield',
			  name: 'currency',
				anchor: '100%',
			  allowBlank:false,
			  fieldLabel: t("Currency", "billing")
			},{
				xtype: 'textfield',
			  name: 'vat',
				anchor: '100%',
			  allowBlank:false,
			  fieldLabel: t("Tax", "billing")
			}]
				
		});
		var items  = [this.propertiesPanel];
		
    
    
    
		this.expenseCategoriesTab = new GO.billing.ExpenseCategoriesGrid();
		items.push(this.expenseCategoriesTab);
		
    this.readPermissionsTab = new GO.grid.PermissionsPanel({
			
		});

    items.push(this.readPermissionsTab);
 
    this.tabPanel = new Ext.TabPanel({
      activeTab: 0,      
      deferredRender: false,
    	border: false,
      items: items,
      anchor: '100% 100%'
    }) ;    
    
    
    this.formPanel = new Ext.form.FormPanel({
    	waitMsgTarget:true,
			border: false,			
			baseParams: {id: 0},				
			items:this.tabPanel
		});
    
    
	}
});
