/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @copyright Copyright Intermesh
 * @version $Id: OrderStatusHistoryDialog.js 22862 2018-01-12 08:00:03Z mschering $
 * @author Merijn Schering <mschering@intermesh.nl>
 */

 
GO.billing.OrderStatusHistoryDialog = function(config){
	
	
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
	config.height=500;
	config.closeAction='hide';
	config.title= t("Order status history", "billing");					
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
	
	GO.billing.OrderStatusHistoryDialog.superclass.constructor.call(this, config);
	this.addEvents({'save' : true});	
}
Ext.extend(GO.billing.OrderStatusHistoryDialog, Ext.Window,{
	
	show : function (order_status_history_id) {
		if(!this.rendered)
		{
			this.render(Ext.getBody());
		}
		
		this.tabPanel.setActiveTab(0);
		
		
		
		if(!order_status_history_id)
		{
			order_status_history_id=0;			
		}
			
		this.setOrderStatusHistoryId(order_status_history_id);
		
		if(this.order_status_history_id>0)
		{
			this.formPanel.load({
				url : GO.settings.modules.billing.url+'json.php',
				
				success:function(form, action)
				{
					
					
						
					
					this.selectUser.setRemoteText(action.result.data.user_name);
									
					
					GO.billing.OrderStatusHistoryDialog.superclass.show.call(this);
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
			
			
				
			
			
			GO.billing.OrderStatusHistoryDialog.superclass.show.call(this);
		}
	},
	
	
		
		
	
	
	setOrderStatusHistoryId : function(order_status_history_id)
	{
		this.formPanel.form.baseParams['order_status_history_id']=order_status_history_id;
		this.order_status_history_id=order_status_history_id;
		
	},
	
	submitForm : function(hide){
		this.formPanel.form.submit(
		{
			url:GO.settings.modules.billing.url+'action.php',
			params: {'task' : 'save_order_status_history'},
			waitMsg:t("Saving..."),
			success:function(form, action){
				
				this.fireEvent('save', this);
				
				if(hide)
				{
					this.hide();	
				}else
				{
				
					if(action.result.order_status_history_id)
					{
						this.setOrderStatusHistoryId(action.result.order_status_history_id);
						
						
											
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
			url: GO.settings.modules.billing.url+'action.php',
			border: false,
			baseParams: {task: 'order_status_history'},			
			title:t("Properties"),			
			cls:'go-form-panel',			
			layout:'form',
			autoScroll:true,
			items:[{
				xtype: 'combo',
       	fieldLabel: t("ID", "billing"),
        hiddenName:'order_id',
        anchor:'100%',
        store: GO.billing.writableOrdersStore,
        valueField:'id',
        displayField:'name',
        mode: 'local',
        triggerAction: 'all',
        editable: false,
        selectOnFocus:true,
        forceSelection: true,
        allowBlank: false
    },{
				xtype: 'textfield',
			  name: 'status_id',
				anchor: '100%',
			  allowBlank:false,
			  fieldLabel: t("Status", "billing")
			},this.selectUser = new GO.form.SelectUser({
				fieldLabel: t("User"),
				disabled: !GO.settings.modules['billing']['write_permission'],
				value: GO.settings.user_id,
				anchor: '100%'
			}),{
				xtype: 'textfield',
			  name: 'notified',
				anchor: '100%',
			  allowBlank:false,
			  fieldLabel: t("Notified", "billing")
			},{
				xtype: 'textfield',
			  name: 'notification_email',
				anchor: '100%',
			  allowBlank:false,
			  fieldLabel: t("Notification email", "billing")
			},{
				xtype: 'textarea',
			  name: 'comments',
				anchor: '100%',
			  allowBlank:true,
			  fieldLabel: t("Comments", "billing")
			}
]
				
		});
		var items  = [this.propertiesPanel];
		
    
    
    
		
		
		
 
    this.tabPanel = new Ext.TabPanel({
      activeTab: 0,      
      deferredRender: false,
    	border: false,
      items: items,
      anchor: '100% 100%'
    }) ;    
    
    
    this.formPanel = new Ext.form.FormPanel({
    	waitMsgTarget:true,
			url: GO.settings.modules.billing.url+'action.php',
			border: false,
			baseParams: {task: 'order_status_history'},				
			items:this.tabPanel				
		});
    
    
	}
});
