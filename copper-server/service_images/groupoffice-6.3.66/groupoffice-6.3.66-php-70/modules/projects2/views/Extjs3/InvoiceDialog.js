/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: InvoiceDialog.js 22922 2018-01-12 08:01:04Z mschering $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */
GO.projects2.InvoiceDialog = Ext.extend(GO.Window,{

	initComponent : function(){
		
		this.invoiceablePanel = new GO.projects2.InvoiceablePanel({
			id:"pr2_invoicable"
		});
		
		
		this.incomePanel = new GO.projects2.AllIncomePanel();

		this.contractPanel = new GO.projects2.ContractIncomePanel();

		this.tabPanel = new Ext.TabPanel({
			activeTab:0,
			doLayoutOnTabChange:true,
			items:[
				this.incomePanel,
				this.invoiceablePanel,
				this.contractPanel
			]
		});
		
		this.tabPanel.on('tabchange', function(tabPanel, p) {
			
			p.load();
		});
			
		Ext.apply(this,{
			title:t("Financial", "projects2"),
			height: 650,
			width: 1000,
			layout:'fit',
			items : [this.tabPanel],
			maximizable: true,
			listeners:{
				show:function(){
					this.tabPanel.setActiveTab(0);
				},
				scope:this
			}
		});
		
		GO.projects2.InvoiceDialog.superclass.initComponent.call(this);		
		
		this.on('show',function(){
			this.maximize();
		}, this);
		
	}
});
