/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: SettingsTemplatesGrid.js 22937 2018-01-12 08:01:19Z mschering $
 * @copyright Copyright Intermesh
 * @author Michiel Schmidt <michiel@intermesh.nl>
 * @author Merijn Schering <mschering@intermesh.nl>
 */

GO.tickets.SettingsTemplatesGrid = function(config){
	
	if(!config)
	{
		config = {};
	}
	
	config.title=t("Email templates", "tickets");
	config.layout='fit';
	config.autoScroll=true;
	config.loadMask=true;
	config.store = new GO.data.JsonStore({
		url: GO.url('tickets/template/store'),
		root:'results',	
		id: 'id',
		totalProperty:'total',
		fields: ['id','name','user_id','user_name']		
	}),
	config.paging=true;

	var columnModel =  new Ext.grid.ColumnModel({
		defaults:{
			sortable:true
		},
		columns:[
		{
			header: t("Name"), 
			dataIndex: 'name'
		},{
			header: t("Owner"), 
			dataIndex: 'user_name',
			sortable: false
		}
	]
	});
	
	config.cm=columnModel;
	
	config.view=new Ext.grid.GridView({
		autoFill: true,
		forceFit: true,
		emptyText: t("No items to display")		
	}),
	config.sm= new Ext.grid.RowSelectionModel();
	
	this.templateDialog = new GO.tickets.TemplateDialog();
	    			    		
	this.templateDialog.on('save', function()
	{   
		this.store.reload();	    			    			
		this.changed=true;
	}, this);

	config.tbar=[{
		iconCls: 'btn-add',							
		text: t("Add"),
		cls: 'x-btn-text-icon',
		handler: function()
		{       	
	    	this.templateDialog.show(0);
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
	
	GO.tickets.SettingsTemplatesGrid.superclass.constructor.call(this, config);
	
	this.on('rowdblclick', function(grid, rowIndex)
	{
		var record = grid.getStore().getAt(rowIndex);	
		this.templateDialog.show(record);
		
	}, this);
	
};

Ext.extend(GO.tickets.SettingsTemplatesGrid, GO.grid.GridPanel,{

	changed : false,

	afterRender : function()
	{
		GO.tickets.SettingsTemplatesGrid.superclass.afterRender.call(this);
		
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
