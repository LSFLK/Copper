/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @copyright Copyright Intermesh
 * @version $Id: CategoryDialog.js 22862 2018-01-12 08:00:03Z mschering $
 * @author Merijn Schering <mschering@intermesh.nl>
 */

 
GO.billing.CategoryDialog = function(config){
	
	
	if(!config)
	{
		config={};
	}
	
	var focusFirstField = function(){
		this.formPanel.items.items[0].focus();
	};
	
	var records = GO.billing.languagesStore.getRange();
		
	var items = [];
	for(var i=0;i<records.length;i++)
	{
		var textfield = new Ext.form.TextField({
			fieldLabel:t("Name")+' ('+records[i].get("name")+')',
			name:"name_"+records[i].get("id"),
			anchor:'-20',
			allowBlank: false
		});			
		
		items.push(textfield);	
	}
	
	//if webshop module
	if(go.Modules.isAvailable("legacy", "webshop"))
	{
		items.push({
			  xtype: 'xcheckbox',
				boxLabel : t("Published in webshop", "billing"),
				labelSeparator : '',
				name : 'published',
				hideLabel : true
			});
	}
	
	this.formPanel = new Ext.form.FormPanel({
			defaultType: 'textfield',
			labelWidth:120,
			waitMsgTarget:true,
			items:items,
			autoHeight:true	,
			baseParams:{id : 0}
		});
	
	
	
	
	config.layout='fit';
	config.modal=false;
	config.resizable=false;
	config.width=400;
	config.cls = 'go-form-panel';
	config.autHeight=true;
	config.closeAction='hide';
	config.title= t("New category", "billing");					
	config.items= this.formPanel;
	config.focus= focusFirstField.createDelegate(this);
	config.buttons=[{
			text: t("Save"),
			handler: function(){
				this.submitForm(true);
			},
			scope: this
		}					
	];

	
	GO.billing.CategoryDialog.superclass.constructor.call(this, config);
	
	
	this.addEvents({'save' : true});	
}

Ext.extend(GO.billing.CategoryDialog, Ext.Window,{

	
	show : function (category_id) {
		
		if(!this.rendered)
			this.render(Ext.getBody());

		this.setCategoryId(category_id);
		
		if(this.category_id>0)
		{
			this.formPanel.load({
				url : GO.url('billing/productCategory/load'),
				
				success:function(form, action)
				{		
					this.setCategoryId (action.result.data.id);
					this.formPanel.baseParams.parent_id=action.result.data.parent_id;
					this.setTitle(t("Category", "billing"));
					
					GO.billing.CategoryDialog.superclass.show.call(this);
				},
				failure:function(form, action)
				{
					GO.errorDialog.show(action.result.feedback)
				},
				scope: this
				
			});
		}else 
		{
			this.setTitle(t("New category", "billing"));
			this.formPanel.form.reset();
			
			GO.billing.CategoryDialog.superclass.show.call(this);
		}
	},
	
	setCategoryId : function(category_id)
	{
		if(!category_id)
		{
			category_id = 0;
		} 
		this.formPanel.form.baseParams['id']=category_id;
		this.category_id=category_id;		
	},
	
	submitForm : function(hide){
		this.formPanel.form.submit(
		{
			url: GO.url('billing/productCategory/submit'),
			params: {
//				'task' : 'save_category'
				},
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
						this.setCategoryId(action.result.id);
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
		
	}
});

