/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @copyright Copyright Intermesh
 * @version $Id: ExpenseDialog.js 22862 2018-01-12 08:00:03Z mschering $
 * @author Merijn Schering <mschering@intermesh.nl>
 */

 
GO.billing.ExpenseDialog = function(config){
	
	
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
	config.title= t("Expense", "billing");					
	config.items= this.formPanel;
	config.focus= focusFirstField.createDelegate(this);
	config.buttons=[{
			text: t("Ok"),
			handler: function(){
				this.submitForm("hide");
			},
			scope: this
		},{
			text: t("Apply"),
			handler: function(){
				this.submitForm();
			},
			scope:this
		},{
			text: t("Add + new"),
			handler: function(){
				this.submitForm("reset");
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
	
	GO.billing.ExpenseDialog.superclass.constructor.call(this, config);
	this.addEvents({'save' : true});	
}
Ext.extend(GO.billing.ExpenseDialog, GO.Window,{
	
	show : function (expense_id) {
		if(!this.rendered)
		{
			this.render(Ext.getBody());
		}

		
		if(!expense_id)
		{
			expense_id=0;			
		}
			
		this.setExpenseId(expense_id);
		
		if(this.expense_id>0)
		{
			this.formPanel.load({
				url : GO.url('billing/expense/load'),
				
				success:function(form, action)
				{
					GO.dialog.TabbedFormDialog.prototype.setRemoteComboTexts.call(this, action);
					
					GO.billing.ExpenseDialog.superclass.show.call(this);
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
			
			GO.billing.ExpenseDialog.superclass.show.call(this);
		}
	},
	
	setExpenseId : function(expense_id)
	{
		this.formPanel.form.baseParams['id']=expense_id;
		this.expense_id=expense_id;		
	},
	
	submitForm : function(afterAction){
		this.formPanel.form.submit(
		{
			url:GO.url('billing/expense/submit'),			
			waitMsg:t("Saving..."),
			success:function(form, action){
				
				this.fireEvent('save', this);
				
				if(afterAction && afterAction=="hide")
				{
					this.hide();	
				}else if(afterAction && afterAction=="reset")
				{
					this.totalField.setValue("");
					this.subtotalField.setValue("");
					this.vatField.setValue("");
					this.setExpenseId(0);
				}else
				{				
					if(action.result.expense_id)
					{
						this.setExpenseId(action.result.expense_id);
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
		
		var now = new Date();
		
		this.formPanel = new Ext.form.FormPanel({			
			border: false,
			baseParams: {},			
			waitMsgTarget:true,
			cls:'go-form-panel',			
			layout:'form',
			autoHeight:true,
			items:[new GO.form.ComboBox({
         	hiddenName: 'category_id',
          fieldLabel: t("Category", "billing"),
          store: GO.billing.expenseCategoriesStore,
          value:'',
          valueField:'id',
          displayField:'name',
          mode: 'local',
          triggerAction: 'all',
          editable: true,
          selectOnFocus:true,
          forceSelection: true,
          anchor: '100%'
      }),new GO.addressbook.SelectCompany ({
			  name: 'supplier',
				anchor: '100%',
			  fieldLabel: t("Supplier", "billing")
			}),{
				xtype: 'textfield',
			  name: 'invoice_no',
				anchor: '100%',
			  fieldLabel: t("Invoice no.", "billing")
			},this.btimeField = new Ext.form.DateField({
				xtype: 'datepicker',
			  name: 'btime',
				anchor: '100%',
			  format: GO.settings.date_format,
			  value: now.format(GO.settings.date_format),
			  fieldLabel: t("Date", "billing"),
			  listeners:{
			  	scope:this,
			  	change:function(){
			  		this.ptimeField.setValue(this.btimeField.getValue());
			  	}
			  }
			}),this.totalField = new GO.form.NumberField({
			  name: 'total',
				anchor: '100%',
			  fieldLabel: t("Total", "billing")
			}),this.subtotalField = new GO.form.NumberField({
			  name: 'subtotal',
				anchor: '100%',
			  fieldLabel: t("Sub-total", "billing")
			}),this.vatField = new GO.form.NumberField({
			  name: 'vat',
				anchor: '100%',
			  fieldLabel: t("Tax", "billing")
			}),this.ptimeField = new Ext.form.DateField({
				xtype: 'datepicker',
			  name: 'ptime',
				anchor: '100%',
			  format: GO.settings.date_format,
			  value: now.format(GO.settings.date_format),
			  fieldLabel: t("Paid", "billing")
			})]
				
		});
		this.subtotalField.on('change', function(){
			
			var subtotal = parseFloat(GO.util.unlocalizeNumber(this.subtotalField.getValue()));
			var vat = subtotal*GO.billing.defaultExpenseVAT/100;			
			this.vatField.setValue(GO.util.numberFormat(vat));

			this.totalField.setValue(GO.util.numberFormat(subtotal+vat));
		},this);
		
		this.totalField.on('change', function(){
			
			var total = parseFloat(GO.util.unlocalizeNumber(this.totalField.getValue()));
			var subtotal = (total*100)/(100+GO.billing.defaultExpenseVAT);			
			this.vatField.setValue(GO.util.numberFormat(total-subtotal));
			
			this.subtotalField.setValue(GO.util.numberFormat(subtotal));
		},this);
		
		this.vatField.on('change', function(){
			var subtotal = parseFloat(GO.util.unlocalizeNumber(this.subtotalField.getValue()));
			var vat = parseFloat(GO.util.unlocalizeNumber(this.vatField.getValue()));
			
			this.totalField.setValue(GO.util.numberFormat(subtotal+vat));
		}, this);
		
	}
});
