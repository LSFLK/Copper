/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @copyright Copyright Intermesh
 * @version $Id: StatusPanel.js 22862 2018-01-12 08:00:03Z mschering $
 * @author Merijn Schering <mschering@intermesh.nl>
 */

GO.billing.StatusPanel = function(config){
	
	
	if(!config)
	{
		config={};
	}
		
	this.statusForm = new Ext.Panel({
		region:"north",
		layout:"form",
		split:true,
		cls:'go-form-panel',waitMsgTarget:true,
		items:[this.selectStatus = new Ext.form.ComboBox({
         	hiddenName: 'status_id',
          fieldLabel: t("Status", "billing"),
          store: GO.billing.orderStatusSelectStore,
          valueField:'id',
          displayField:'name',
          mode: 'local',
          triggerAction: 'all',
          editable: false,
          selectOnFocus:true,
          forceSelection: true,
          anchor: '-20'
      }),this.notifyCustomer = new Ext.ux.form.XCheckbox({
				boxLabel: t("Notify customer?", "billing"),
				labelSeparator: '',
				name: 'notify_customer',		
//				allowBlank: true,
				hideLabel:true
			})
		]
	})
	
	
	this.statusGrid = new GO.billing.OrderStatusHistoryGrid({
		region:'center',
		border:true
	});
	
	config.title=t("Status", "billing");
	config.layout='border';
	config.items=[this.statusForm, this.statusGrid];
	//config.disabled=true;
	config.border=false;
	GO.billing.StatusPanel.superclass.constructor.call(this, config);	
}

Ext.extend(GO.billing.StatusPanel, Ext.Panel,{
	setOrderId : function(order_id)
	{
		this.statusGrid.store.baseParams.order_id=order_id;
		this.statusGrid.store.loaded=false;	
		//this.setDisabled(order_id==0);
	},
	
	setBookId : function(book_id)
	{
		if(this.selectStatus.store.baseParams.book_id!=book_id)
		{		
			this.selectStatus.store.baseParams.book_id=book_id;
			if(book_id>0)
			{				
				this.selectStatus.store.load({
					callback: function(){
						//set the status because the ID will show otherwise
						this.selectStatus.setValue(this.selectStatus.getValue());
					},
					scope:this
				});
			}else
			{
				this.selectStatus.store.removeAll();
			}
		}
	},
	onShow : function()
	{
		if(!this.statusGrid.store.loaded)
		{
			if(this.statusGrid.store.baseParams.order_id>0)
			{
				this.statusGrid.store.load();
			}else
			{
				this.statusGrid.store.removeAll();
			}
		}
		GO.billing.StatusPanel.superclass.onShow.call(this);
	},
	changeLabelsForBookType : function(booktype){

		if(booktype == 'purchaseorder'){
			this.notifyCustomer.setBoxLabel(t("Notify supplier?", "billing"));
		} else {
			this.notifyCustomer.setBoxLabel(t("Notify customer?", "billing"));
		}
	}
});
