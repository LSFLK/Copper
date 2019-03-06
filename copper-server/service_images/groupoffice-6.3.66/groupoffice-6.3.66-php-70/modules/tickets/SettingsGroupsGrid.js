/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: SettingsGroupsGrid.js 22937 2018-01-12 08:01:19Z mschering $
 * @copyright Copyright Intermesh
 * @author Michiel Schmidt <michiel@intermesh.nl>
 * @author Merijn Schering <mschering@intermesh.nl>
 */

GO.tickets.SettingsGroupsGrid = function(config) {
	
	if(!config)
	{
	    config = {};
	}
	
	config.title=t("Ticket groups", "tickets");
	config.layout='fit';
	config.autoScroll=true;
	config.loadMask=true;
	config.store = new GO.data.JsonStore({
	    url: GO.url('tickets/ticketGroup/store'),
	    baseParams: {
				'company_id' : this.company_id,
				permissionLevel : GO.permissionLevels.write
	    },
	    root: 'results',
	    id: 'id',
	    totalProperty:'total',
		fields: ['id','name','acl_id']
	});
	config.paging=true;
		
	var columnModel =  new Ext.grid.ColumnModel({
		defaults:{
		    sortable:true
		},
		columns:[
		{
		    header: t("Name"),
		    dataIndex: 'name'
		}
		]
	});
	
	config.cm=columnModel;
	
	config.view=new Ext.grid.GridView({
		autoFill: true,
		forceFit: true,
		emptyText: t("No items to display")		
	});
	config.sm=new Ext.grid.RowSelectionModel();

	if (GO.settings.modules.tickets.write_permission && GO.settings.modules.addressbook.write_permission)
	{
		config.tbar=[{
			iconCls: 'btn-add',							
			text: t("Add"),
			cls: 'x-btn-text-icon',
			handler: function()
			{				
				this.ticketGroupDialog.setCompanyId(this.company_id);
	    	this.ticketGroupDialog.show();
			},
			scope: this
		},{
			iconCls: 'btn-delete',
			text: t("Delete"),
			cls: 'x-btn-text-icon',
			handler: function()
			{
				this.deleteSelected();
				this.changed=true;
			},
			scope: this
		}];
	}
	
	GO.tickets.SettingsStatusesGrid.superclass.constructor.call(this, config);

	this.setCompanyId(-1);
};

Ext.extend(GO.tickets.SettingsGroupsGrid, GO.grid.GridPanel,{
	
	changed : false,
	
	setCompanyId : function(company_id) {
	    this.store.baseParams.company_id = this.company_id = company_id;
	},
	
	afterRender : function()
	{
		GO.tickets.SettingsStatusesGrid.superclass.afterRender.call(this);

		if (GO.settings.modules.tickets.write_permission && GO.settings.modules.addressbook.write_permission) {
			this.ticketGroupDialog = new GO.tickets.TicketGroupDialog();

			this.on('rowdblclick', function(grid, rowIndex)
			{
				var record = grid.getStore().getAt(rowIndex);
				this.ticketGroupDialog.show(record.data.id);
			}, this);
			this.ticketGroupDialog.on('submit',function(){
				this.store.reload();
				this.changed=true;
			},this);
		}

		if(this.isVisible())
		{
			this.onGridShow();
		}
	},
	
	onGridShow : function()
	{
		if(!this.store.loaded && this.rendered)
		{
			this.store.load();
		}	
	}
});
