/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: SettingsTypesGrid.js 23275 2018-01-19 11:52:00Z mschering $
 * @copyright Copyright Intermesh
 * @author Michiel Schmidt <michiel@intermesh.nl>
 * @author Merijn Schering <mschering@intermesh.nl>
 */

GO.tickets.SettingsTypesGrid = function(config){

	if(!config)
	{
		config = {};
	}

	config.title=t("Types", "tickets");
	config.layout='fit';
	config.autoScroll=true;
	config.loadMask=true;
	config.paging=true;



	config.view= new Ext.grid.GroupingView({
				showGroupName: false,
				enableNoGroups:false, // REQUIRED!
				hideGroupedColumn: true,
				emptyText: t("General", "tickets"),
				autoFill: true,
				forceFit: true
			});
	config.store = new Ext.data.GroupingStore({
				url:GO.url("tickets/type/store"),
				sortInfo:{
					field: 'group_name',
					direction: "ASC"
				},
				id : 'id',
				reader: new Ext.data.JsonReader({
					root: 'results',
					totalProperty: 'total',
					id: 'id',
					fields:['id','name','description','acl_id','checked','group_name','user_name']
				}),
				groupField:'group_name',
				remoteSort:true,
				remoteGroup:true
			});
	/*
	config.store =  new GO.data.JsonStore({
		url:GO.url('tickets/type/store'),
		baseParams:{
			limit:0 // With this option all the types will be loaded without a limit. (Because the grid doesn't have pagination)
		},
		fields:['id','name','description','acl_id','checked','group_name']
	});

	config.view=new Ext.grid.GridView({
		autoFill: true,
		forceFit: true
	});*/

	var columnModel =  new Ext.grid.ColumnModel({
		defaults:{
			sortable:true
		},
		columns:[
		{
			header: 'ID',
			dataIndex: 'id',
			hidden:true
		},{
			header: t("Name"),
			dataIndex: 'name',
      renderer:function(value, p, record){
        if(!GO.util.empty(record.data.description))
        {
          p.attr = 'ext:qtip="'+Ext.util.Format.htmlEncode(record.data.description)+'"';
        }
        return value;
      }
		},{
			header: t("Owner"),
			dataIndex: 'user_name'
		},{
			header: t("Type group", "tickets"),
			dataIndex: 'group_name'
		}
	]
	});

	config.cm=columnModel;

	config.sm=new Ext.grid.RowSelectionModel();

	this.typeDialog = new GO.tickets.TypeDialog();

	this.typeDialog.on('save', function()
	{
		this.store.reload();
        this.fireEvent('update_types', this);
	}, this);

	if(GO.settings.modules.tickets.write_permission)
	{
		config.tbar=[{
			iconCls: 'btn-add',
			text: t("Add"),
			cls: 'x-btn-text-icon',
			handler: function()
			{
	    		this.typeDialog.show();
			},
			scope: this
		},{
			iconCls: 'btn-delete',
			text: t("Delete"),
			cls: 'x-btn-text-icon',
			handler: function()
			{
				this.deleteSelected();
                this.fireEvent('update_types', this);
			},
			scope: this
		},{
			iconCls: 'btn-folder',
			text: t("Manage groups", "tickets"),
			cls: 'x-btn-text-icon',
			handler: function(){
				if(!GO.tickets.ticketTypeGroupsWindow) {
					GO.tickets.ticketTypeGroupsWindow = new GO.Window({
						title: t("Type group", "tickets"),
						width: 550,
						layout: 'fit',
						buttons: [{
							text: t("Close"),
							handler: function(){
								GO.tickets.ticketTypeGroupsWindow.hide();
							},
							scope: this
						}],
						items: [this.typeGroupGrid = new GO.tickets.TypeGroupGridDialog()],
						scope: this
					});
					GO.tickets.ticketTypeGroupsWindow.on('show',function(){
						this.typeGroupGrid.store.load();
					},this);
				}
				GO.tickets.ticketTypeGroupsWindow.show();
			},
			scope: this
		}];
	}

	GO.tickets.SettingsTypesGrid.superclass.constructor.call(this, config);

	this.on('rowdblclick', function(grid, rowIndex)
	{
		var record = grid.getStore().getAt(rowIndex);
		this.typeDialog.show(record.data.id);

	}, this);

};

Ext.extend(GO.tickets.SettingsTypesGrid, GO.grid.GridPanel,{

	afterRender : function()
	{
		GO.tickets.SettingsTypesGrid.superclass.afterRender.call(this);

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
