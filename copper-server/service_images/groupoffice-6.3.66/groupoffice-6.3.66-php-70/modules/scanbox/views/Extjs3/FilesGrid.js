/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: FilesGrid.js 22927 2018-01-12 08:01:09Z mschering $
 * @copyright Copyright Intermesh
 * @author Wesley Smits <wsmits@intermesh.nl>
 */
 
GO.scanbox.FilesGrid = function(config){
	
	if(!config)
	{
		config = {};
	}

	this.checkColumn = new GO.grid.CheckColumn({
    header: '&nbsp;',
		dataIndex: 'checked',
    width: 20,
    sortable:false
  });

	this.checkColumn.on('change', function(record, checked)
	{
		this.changed=true;
	}, this);


	config.plugins=this.checkColumn;	


	var fields ={
		fields:['checked','name','extension','ctime','mtime','size'],
		columns:[
			this.checkColumn,
		{
			header: t("Name"),
			dataIndex: 'name',
			renderer: function(value, metaData, record, rowIndex, colIndex, store) {
								metaData.css = 'editorgrid-editablecell';
								return value;
							},
			editor: new Ext.form.TextField({
				allowBlank:false
			})
		},{
			header: t("Size"),
			dataIndex: 'size'
		},{
			header: t("Created at"),
			dataIndex: 'ctime',
			width: dp(140)			
		},{
			header: t("Modified at"),
			dataIndex: 'mtime',
			width: dp(140),
			hidden:true
		},{
			header: t("Extension", "scanbox"),
			dataIndex: 'extension',
			renderer : function(value,data,record){
				return '.'+value;
			},
			hidden:true
		}
		]
	};
	
	config.clicksToEdit = 1;
	config.layout='fit';
	config.height='250';
	config.autoScroll=true;
	config.split=true;
	config.store = new GO.data.JsonStore({
		url: GO.url('scanbox/scanbox/grid'),
		root: 'files',
		id: 'name',
		totalProperty:'total',
		fields: fields.fields,
		remoteSort: true
	});

	config.store.on('load', function()
	{
		if(config.store.reader.jsonData.feedback)
		{
			alert(config.store.reader.jsonData.feedback);
		}
	},this)

	config.paging=false;

	var columnModel =  new Ext.grid.ColumnModel({
		defaults:{
			sortable:true
		},
		columns:fields.columns
	});
	
	config.cm=columnModel;
	
	config.view=new Ext.grid.GridView({
		autoFill: true,
		forceFit: true,
		emptyText: t("No items to display")		
	});
	
	config.sm=new Ext.grid.RowSelectionModel();
	config.loadMask=true;
	
	this.searchField = new GO.form.SearchField({
		store: config.store,
		width:320
	});

	GO.scanbox.FilesGrid.superclass.constructor.call(this, config);
};

Ext.extend(GO.scanbox.FilesGrid, Ext.grid.EditorGridPanel,{
	getGridData : function(){
		var data = {};

		for (var i = 0; i < this.store.data.items.length;  i++)
		{
			var r = this.store.data.items[i].data;

			data[i]={};

			for(var key in r)
			{
				data[i][key]=r[key];
			}
		}
		return data;
	}
});
