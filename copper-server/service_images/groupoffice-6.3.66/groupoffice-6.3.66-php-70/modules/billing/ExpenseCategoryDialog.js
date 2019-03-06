/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @copyright Copyright Intermesh
 * @version $Id: ExpenseCategoryDialog.js 22862 2018-01-12 08:00:03Z mschering $
 * @author Merijn Schering <mschering@intermesh.nl>
 */

 
GO.billing.ExpenseCategoryDialog = function(config){
	
	
	if(!config)
	{
		config={};
	}
	
	
	this.buildForm();
	
	var focusFirstField = function(){
		this.formPanel.items.items[0].focus();
	};
	
	
	config.maximizable=true;
	config.layout='fit';
	config.modal=false;
	config.resizable=false;
	config.width=500;
	config.autoHeight=true;
	config.closeAction='hide';
	config.title= t("Expense category", "billing");					
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
	
	GO.billing.ExpenseCategoryDialog.superclass.constructor.call(this, config);
	this.addEvents({'save' : true});	
}
Ext.extend(GO.billing.ExpenseCategoryDialog, Ext.Window,{
	
	show : function (expense_category_id) {
		if(!this.rendered)
		{
			this.render(Ext.getBody());
		}

		if(!expense_category_id)
		{
			expense_category_id=0;			
		}
			
		this.setExpenseCategoryId(expense_category_id);
		
		if(this.expense_category_id>0)
		{
			this.formPanel.load({
				url : GO.url('billing/expenseCategory/load'),
				
				success:function(form, action)
				{
					this.formPanel.baseParams.id=action.result.data.expense_book_id;
					GO.billing.ExpenseCategoryDialog.superclass.show.call(this);
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
			GO.billing.ExpenseCategoryDialog.superclass.show.call(this);
		}
	},
	
	setExpenseCategoryId : function(expense_category_id)
	{
		this.formPanel.form.baseParams['id']=expense_category_id;
		this.expense_category_id=expense_category_id;
		
	},
	
	submitForm : function(hide){
		this.formPanel.form.submit(
		{
			url: GO.url('billing/expenseCategory/submit'),			
			waitMsg:t("Saving..."),
			success:function(form, action){
				
				this.fireEvent('save', this);
				
				if(hide)
				{
					this.hide();	
				}else
				{				
					if(action.result.expense_category_id)
					{
						this.setExpenseCategoryId(action.result.expense_category_id);
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
		
		this.formPanel = new Ext.form.FormPanel({			
			border: false,
			waitMsgTarget:true,
			baseParams: {},			
			cls:'go-form-panel',			
			layout:'form',
			autoHeight:true,
			items:[{
				xtype: 'textfield',
			  name: 'name',
				anchor: '100%',
			  allowBlank:false,
			  fieldLabel: t("Name")
			}]
				
		});
		
	}
});
