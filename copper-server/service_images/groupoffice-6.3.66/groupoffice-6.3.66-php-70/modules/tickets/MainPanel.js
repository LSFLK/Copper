/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: MainPanel.js 23473 2018-03-07 09:55:57Z mdhart $
 * @copyright Copyright Intermesh
 * @author Michiel Schmidt <michiel@intermesh.nl>
 * @author Merijn Schering <mschering@intermesh.nl>
 */

GO.tickets.MainPanel = function(config){

	config = config || {};
	

	
	this.centerPanel = GO.tickets.ticketsGrid = new GO.tickets.TicketsGrid({
//		title: t("Tickets", "tickets"),
		region:'center',
		id:'ti-tickets-grid',
		tbar: new Ext.Toolbar({
			enableOverflow: true
		}),
		border:true,
		resizable:false,
		deleteConfig:{
			scope:this,
			success:function(){
				//refresh statuses
				GO.tickets.statusesStore.load();
			}
		}
	});
	
		var changeAgent = function () {
			var showForAgent = this.agentField.getValue();
			this.centerPanel.store.load({
				params: {showForAgent: showForAgent || 0}
			});
		};

		this.agentField = new GO.tickets.SelectAgent({
			hideLabel: true,
			anchor: '100%',
			emptyText: t("Responsible", "tickets"),
			listeners: {
				select: changeAgent,
				clear: changeAgent,
				//change: changeAgent,
				scope: this
			}
		});
		
	this.centerPanel.store.on('load',function(){
		GO.tickets.totalUnseen=this.centerPanel.store.reader.jsonData.unseen;
		}, this);
	
	this.typesGrid = GO.tickets.typesGrid = new GO.tickets.TypesGrid({
		relatedStore: this.centerPanel.store,
		region:'center',
		id:'ti-types-panel'
	});
	
	this.typesGrid.on('change', function(filterGrid, statuses, records)
	{
		this.filterPanel.store.reload();
	}, this);
	
	this.filterPanel = GO.tickets.filterPanel = new GO.tickets.TicketsFilterGrid({
		region:'south',
		height: dp(280),
		id:'ti-filter-panel',
		title: t("Statuses", "tickets"),
		store:GO.tickets.statusesStore,
		relatedStore: this.centerPanel.store,
		autoLoadRelatedStore:false,
		border:true,
		loadMask:true,
		allowNoSelection:true,
		split:true
	});
		
	var westPanel = new Ext.Panel({
		region:'west',
		layout:'border',
		id:'ti-west-panel',
		border:false,
		split:true,
		cls: 'go-sidenav',
		width:dp(300),
		items:[{
				items: this.agentField,
				region:'north',
				xtype:'fieldset',
				autoHeight:true,
		}, this.typesGrid, this.filterPanel]
	});
	
	this.typesGrid.on('rowclick', function(grid, rowIndex)
	{
		this.centerPanel.selModel.clearSelections();
		this.eastPanel.reset();
		
	}, this);
	

	
	this.centerPanel.on("delayedrowselect",function(grid, rowIndex, r)
	{
		this.eastPanel.load(r.get('id'));
	}, this);

	this.centerPanel.on('rowdblclick', function(grid, rowIndex){
		var record = grid.getStore().getAt(rowIndex);
		if(record.data.level==GO.permissionLevels.manage)
			GO.tickets.showTicketDialog(record.id);
	}, this);
				
	this.eastPanel = this.ticketDetail = new GO.tickets.TicketPanel({
		region:'east',
		id:'ti-ticket-panel',
		mf_id:'ti-message-form',
		mp_id:'ti-message-panel',
		width:dp(560)
//		title:t("Ticket", "tickets")
	});

	var tbarItems = this.buildTbar();
	this.centerPanel.getTopToolbar().add(tbarItems);
	
	config.items=[
	westPanel,
	{
		border:false,
		region:'center',
		titlebar: false,
		layout:'border',
		items: [this.centerPanel,this.eastPanel]
	}
	];   
		
	config.layout='border';
			
	GO.tickets.MainPanel.superclass.constructor.call(this, config);

}

Ext.extend(GO.tickets.MainPanel, Ext.Panel,{
	onShow : function(){
		this.refresh(true);
		//GO.tickets.notificationEl.setDisplayed(false);
		GO.tickets.MainPanel.superclass.onShow.call(this);
	},

	statuses: '',

	refresh : function(dontRefreshTickerPanel){
		GO.tickets.statusesStore.load();
		this.centerPanel.store.load();
		if(!dontRefreshTickerPanel)
			this.eastPanel.reload();
	},
	
	afterRender : function()
	{
		GO.tickets.MainPanel.superclass.afterRender.call(this);

		//GO.tickets.notificationEl.setDisplayed(false);

		GO.tickets.mainPanel = this;

		GO.dialogListeners.add('ticket',{
			scope:this,
			save:function(e, ticket_id){			
				this.refresh(true);
			}
		});

		this.typesGrid.store.load();
		this.refresh();
		GO.tickets.agentsStore.load();
	},
	
	buildTbar : function() {
		
		var tbarItems = ['->',{
			grid: this.centerPanel,
			xtype:'addbutton',
			text: null,
			handler: function(b){
				this.eastPanel.reset();
				GO.tickets.showTicketDialog(0, {
					loadParams:{
						type_id: b.buttonParams.id						
					}
				});
			},
			scope: this
		}];


		var moreMenuItems = [];
		
		moreMenuItems.push({
			grid: this.centerPanel,
//			xtype:'deletebutton',
			iconCls: 'ic-delete',
			text: t("Delete"),
			hidden:!GO.settings.modules.tickets.write_permission,
			handler: function()
			{
				this.centerPanel.deleteSelected();
			},
			scope: this
		},'-',{
			iconCls: 'ic-refresh',
			text: t("Refresh"),
			handler: function(){
				this.refresh();
			},
			scope: this
		});

		this.exportMenu = new GO.base.ExportMenuItem({className: 'GO\\Tickets\\Export\\CurrentGrid'});


		this.exportMenu.setColumnModel(this.centerPanel.getColumnModel());

		//Only show the export button when the user has manage permissions.
		var csvWithRatesExport = new Ext.menu.Item({
			text:t("CSV with rates", "tickets"),
			hidden: (GO.settings.modules.tickets.permission_level < GO.permissionLevels.manage),
			handler:function(){
				if(!this.exportCsvDialog){

					var now = new Date();
					var lastMonth = now.add(Date.MONTH, -1);
					var startOfLastMonth = lastMonth.getFirstDateOfMonth();
					var endOfLastMonth = lastMonth.getLastDateOfMonth();

					var startDate = new Ext.form.DateField({
						name: 'start_time',
						format: GO.settings['date_format'],
						allowBlank:true,
						fieldLabel: t("Start"),
						value: startOfLastMonth.format(GO.settings.date_format)
					});

					var endDate = new Ext.form.DateField({
						name: 'end_time',
						format: GO.settings['date_format'],
						allowBlank:true,
						fieldLabel: t("End"),
						value: endOfLastMonth.format(GO.settings.date_format)
					});

					this.exportCsvDialog = new GO.dialog.ExportDialog({
						title:t("CSV with rates", "tickets"),
						exportController:'tickets/exportCsv',
						formConfig:{
							labelAlign:'top'
						},
						formItems:[
							startDate,
							endDate								
						]
					});
				}

				this.exportCsvDialog.show();
			}
		});
		
		
		this.exportMenu.insertItem(0,csvWithRatesExport);


		moreMenuItems.push(this.settingsButton = new Ext.menu.Item({
			iconCls: 'ic-settings',
			hidden: !GO.settings.modules.tickets.write_permission,
			text: t("Administration"),
			handler: function() {
				if(!this.settingsDialog) {
					this.settingsDialog = new GO.tickets.SettingsDialog();
					this.settingsDialog.on('update_statuses', function()
					{
						GO.tickets.statusesStore.load();
					}, this);
					this.settingsDialog.on('update_templates', function()
					{
						GO.tickets.templatesStore.load();
					}, this);
				}
				this.settingsDialog.show();
			},
			scope: this
		}),'-',this.exportMenu);

		if(GO.settings.modules.tickets.write_permission){


			if(go.Modules.isAvailable("legacy", "billing")){
				moreMenuItems.push({
					hidden: (GO.settings.modules.tickets.permission_level < GO.permissionLevels.manage),
					iconCls:'ic-euro-symbol',
					text:t("Bill", "tickets"),
					handler:function(){
						if(!GO.tickets.invoiceDialog)
						{
							GO.tickets.invoiceDialog= new GO.tickets.InvoiceDialog({
								listeners:{
									invoice:function(){
										this.refresh();
									},
									scope:this
								}
							});
						}
						GO.tickets.invoiceDialog.show();
					},
					scope:this
				});
			}
		}		
		

		tbarItems.push({
			xtype:'tbsearch',
			store: this.centerPanel.store
		},{
			iconCls: 'ic-more-vert',
			menu: moreMenuItems
		});
		return tbarItems;
	}
});

//do this when Group-Office is fully rendered
GO.mainLayout.onReady(function(){
	
	//register a new request to the checker. It will poll unseen tickets every two minutes
	
	if(go.Modules.isAvailable("legacy", 'tickets')) {
		GO.checker.registerRequest("tickets/ticket/unseen",{},function(checker, data){

		//get the mainpanel of the tickets module
		var tp = GO.mainLayout.getModulePanel('tickets');

		//compare the last unseen valie to the new unseen value
		if(data.tickets.unseen!=GO.tickets.totalUnseen && data.tickets.unseen>0)
		{
			//set the notificationEl 
	//		if(!tp || !tp.isVisible())
	//			GO.tickets.notificationEl.setDisplayed(true);

			//refresh tickets grid
			if(tp && tp.isVisible())
				tp.refresh();
		}

		//set the unseen count
	//	GO.tickets.notificationEl.update(data.tickets.unseen);			
		GO.mainLayout.setNotification('tickets',data.tickets.unseen,'orange');
		GO.tickets.totalUnseen=data.tickets.unseen;		
		},this);
	}
});

	

GO.tickets.showTicketDialog = function(ticket_id, config){

	if(!GO.tickets.ticketDialog) {
		GO.tickets.ticketDialog = new GO.tickets.TicketDialog();
//		if (GO.addressbook && GO.settings.modules.tickets.write_permission) {
//			GO.tickets.ticketDialog.on('save',function(dialog,ticket_id,refresh){
//				GO.moduleManager.getPanel('tickets').eastPanel.setCompanyId(dialog.formPanel.baseParams.company_id);
//			},this);
//		}
	}

	GO.tickets.ticketDialog.show(ticket_id, config);
}



go.Modules.register("legacy", 'tickets', {
	mainPanel: GO.tickets.MainPanel,
	title: t("Tickets", "tickets"),
	iconCls: 'go-tab-icon-tickets',
	entities: [{
			name: "Ticket",			
			linkWindow: function(entity, entityId) {
				var win = new GO.tickets.TicketDialog({
					link: {
						entity: entity,
						entityId: entityId
					}
				});
				win.closeAction = "close";
				return win;
			},
			linkDetail: function() {
				return new GO.tickets.TicketPanel();
			}	
	}]
});

