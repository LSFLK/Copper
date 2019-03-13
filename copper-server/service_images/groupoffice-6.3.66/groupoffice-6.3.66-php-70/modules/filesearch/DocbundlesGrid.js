/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: DocbundlesGrid.js 22900 2018-01-12 08:00:42Z mschering $
 * @copyright Copyright Intermesh
 * @author Merijn Schering <mschering@intermesh.nl>
 */
GO.filesearch.DocbundlesGrid = function(config){
	if(!config)
	{
		config = {};
	}

	config.cls='fs-docbundles-grid';
	
	config.layout='fit';
	config.autoScroll=true;
	config.split=true;

	var action = new Ext.ux.grid.RowActions({
		header:'',
		hideMode:'display',
		keepSelection:true,
		actions:[{
			iconCls:'btn-edit',
			qtip:t("Edit")
		}],
		listeners:{
			scope:this,
			action:function(grid, record, action, row, col) {
				GO.filesearch.showDocbundleDialog(record.id);
			}
		}
		//width: 20
	});

	config.plugins=[action];

	var fields ={
		fields:['id','user_name','name','ctime','mtime','description'],
		columns:[				{
			id:'name',
			header: t("Name"), 
			dataIndex: 'name'
		}
		,{
			header: t("Owner"),
			dataIndex: 'user_name',
			sortable: false,
			width:120
		}
		,		{
			header: t("Created at"), 
			dataIndex: 'ctime',
			hidden:true,
			width: dp(140)
		}
		,		{
			header: t("Modified at"), 
			dataIndex: 'mtime',
			width: dp(140)
		},
		action
		]
	};
	if(go.Modules.isAvailable("core", "customfields"))
	{
		GO.customfields.addColumns("GO\\Filesearch\\Model\\Docbundle", fields);
	}
	config.store = new GO.data.JsonStore({
		url: GO.url("filesearch/docbundle/store"),
		totalProperty:'total',
		fields: fields.fields,
		remoteSort: true
	});
	config.paging=true;
	var columnModel =  new Ext.grid.ColumnModel({
		defaults:{
			sortable:true
		},
		columns:fields.columns
	});
	config.autoExpandColumn='name';
	config.cm=columnModel;
	config.view=new Ext.grid.GridView({
			emptyText:t("No items to display"),
			enableRowBody:true,
			getRowClass : function(record, rowIndex, p, store){
				p.body = record.data.description;

				return 'x-grid3-row-expanded';
			}
		});
	config.sm=new Ext.grid.RowSelectionModel();
	config.loadMask=true;

	this.searchField = new GO.form.SearchField({
		store: config.store,
		width:160
  });

	

	config.tbar=[{
		iconCls: 'btn-delete',
		text: t("Delete"),
		cls: 'x-btn-text-icon',
		handler: function(){
			this.deleteSelected();
		},
		scope: this
	},'-',t("Search") + ':', this.searchField];	

	Ext.apply(config.listeners,{
		scope:this
		,
		render:function(){
			this.store.load();
			GO.filesearch.docbundleDialogListeners={
				scope:this,
				save:function(){
					this.store.reload();
				}
			}
		}
	/*,rowdblclick:function(grid, rowIndex){
			var record = grid.getStore().getAt(rowIndex);
			GO.filesearch.showDocbundleDialog(record.data.id);
		}*/
	});
	
	GO.filesearch.DocbundlesGrid.superclass.constructor.call(this, config);	
};
Ext.extend(GO.filesearch.DocbundlesGrid, GO.grid.GridPanel,{
	});
