/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @copyright Copyright Intermesh
 * @version $Id: ItemsPanel.js 22862 2018-01-12 08:00:03Z mschering $
 * @author Merijn Schering <mschering@intermesh.nl>
 */

 
GO.billing.ItemsPanel = function(config){
	
	
	if(!config)
	{
		config={};
	}
	
	
	this.itemsGrid = new GO.billing.ItemsGrid({
		orderDialog:config.orderDialog,
		region:'center',
		border:true
	});
	
	
	
	GO.billing.itemsTotalField=new GO.form.PlainField({
		fieldLabel: t("Total", "billing"),
		value: GO.util.numberFormat("0"),
		anchor: '100%'
	});
	
	GO.billing.itemsSubtotalField=new GO.form.PlainField({
		fieldLabel: t("Sub-total", "billing"),
		value: GO.util.numberFormat("0"),
		anchor: '100%'
	});
	
	GO.billing.itemsVatField=new GO.form.PlainField({
		fieldLabel: t("Tax", "billing"),
		value: GO.util.numberFormat("0"),
		anchor: '100%'
	});
	
	GO.billing.itemsCostsField=new GO.form.PlainField({
		fieldLabel: t("Costs", "billing"),
		value: GO.util.numberFormat("0"),
		anchor: '100%'
	});
	
	GO.billing.itemsProfitField=new GO.form.PlainField({
		fieldLabel: t("Profit", "billing"),
		value: GO.util.numberFormat("0"),
		anchor: '100%'
	});
	
	GO.billing.itemsMarginField=new GO.form.PlainField({
		fieldLabel: t("Margin", "billing"),
		value: GO.util.numberFormat("0"),
		anchor: '100%'
	});
	
	
	this.totalsGrid = new Ext.Panel({
		region:'south',
		split: true,
		layout:'column',
		cls:'go-form-panel',waitMsgTarget:true,
		items:[{
			defaults:{
				style: "text-align:right"
			},
			columnWidth: .3,
			layout:'form',
			border:false,
			items:[
				GO.billing.itemsCostsField,
				GO.billing.itemsProfitField,
				GO.billing.itemsMarginField				
			]
		},{
							columnWidth: .4
		},{
			defaults:{
				style: "text-align:right"
			},
			columnWidth: .3,
			layout:'form',
			border:false,
			items:[
				GO.billing.itemsSubtotalField,
				GO.billing.itemsVatField,
				GO.billing.itemsTotalField				
			]
		}
		
		
		]
		
	});
	
	config.title=t("Items", "billing");
	config.layout='border';
	config.items=[this.itemsGrid, this.totalsGrid ];
	config.border=false;
	GO.billing.ItemsPanel.superclass.constructor.call(this, config);	
}

Ext.extend(GO.billing.ItemsPanel, Ext.Panel,{
	setOrderId : function(order_id, loaded)
	{	
		this.itemsGrid.setOrderId(order_id);
		this.itemsGrid.store.loaded=loaded;	
		this.itemsGrid.changed=false;
		this.setDisabled(order_id<1);
	},
	onShow : function()
	{
		if(!this.itemsGrid.store.loaded)
		{
			if(this.itemsGrid.store.baseParams.order_id>0)
			{
				this.itemsGrid.store.load(/*{
					callback:function(){this.itemsGrid.addBlankRow();},
					scope:this
				}*/);
			}else
			{				
				this.itemsGrid.store.removeAll();
				//this.itemsGrid.addBlankRow();
				this.itemsGrid.store.loaded=true;
			}			
		}
		GO.billing.ItemsPanel.superclass.onShow.call(this);
	}
});
