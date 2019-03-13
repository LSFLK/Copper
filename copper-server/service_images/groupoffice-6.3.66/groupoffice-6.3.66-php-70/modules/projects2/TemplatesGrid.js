/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: TemplatesGrid.js 22922 2018-01-12 08:01:04Z mschering $
 * @copyright Copyright Intermesh
 * @author Merijn Schering <mschering@intermesh.nl>
 */
GO.projects2.TemplatesGrid = function(config){
	if(!config)
	{
		config = {};
	}
	config.title = t("Templates", "projects2");
	config.layout='fit';
	config.region='center';
	config.autoScroll=true;
	config.split=true;
	config.store = new GO.data.JsonStore({
		url: GO.url('projects2/template/store'),
		baseParams: {
			auth_type:'write'
		},
		root: 'results',
		id: 'id',
		totalProperty:'total',
		fields: ['id','user_name','project_type', 'name','acl_id'],
		remoteSort: true
	});

	config.store.on('load', function(){
		config.store.on('load', function(){
			GO.projects2.templatesStore.load();
		}, this);
	}, this);

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
	},{
      header: t("projetType", "projects2"),
      dataIndex: 'project_type'
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
	config.loadMask=true;
	
	config.tbar=[{
		iconCls: 'btn-add',
		text: t("Add"),
		cls: 'x-btn-text-icon',
		handler: function(){
			this.showTemplateDialog();
		},
		scope: this
	},{
		iconCls: 'btn-delete',
		text: t("Delete"),
		cls: 'x-btn-text-icon',
		handler: function(){
			this.deleteSelected();
		},
		scope: this
	}];

	config.listeners={
		render:function(){
			if(!this.store.loaded)
				this.store.load();
		},
		scope:this
	};

	GO.projects2.TemplatesGrid.superclass.constructor.call(this, config);
	
	this.on('rowdblclick', function(grid, rowIndex){
		var record = grid.getStore().getAt(rowIndex);	
		this.showTemplateDialog(record.data.id);
	}, this);
};
Ext.extend(GO.projects2.TemplatesGrid, GO.grid.GridPanel,{
	

	showTemplateDialog : function(config){
		if(!this.templateDialog){
			this.templateDialog = new GO.projects2.TemplateDialog();
			this.templateDialog.on('save', function(){
				this.store.reload();
			}, this);
		}

		this.templateDialog.show(config);
	}
});
