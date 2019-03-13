/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: StatusesGrid.js 22922 2018-01-12 08:01:04Z mschering $
 * @copyright Copyright Intermesh
 * @author Merijn Schering <mschering@intermesh.nl>
 */
GO.projects2.StatusesGrid = function(config){
	if(!config)
	{
		config = {};
	}
	config.title = t("Statuses", "projects2");
	config.layout='fit';
	config.autoScroll=true;
	config.split=true;
	config.store = GO.projects2.statusesStore;
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
	config.loadMask=true;
	
	config.tbar=[{
			iconCls: 'btn-add',							
			text: t("Add"),
			cls: 'x-btn-text-icon',
			handler: function(){
	    	this.showStatusDialog();
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
		
	
	config.enableDragDrop= true;
	config.ddGroup = 'pm-statuses-dd';
	
	GO.projects2.StatusesGrid.superclass.constructor.call(this, config);
	this.on('rowdblclick', function(grid, rowIndex){
		var record = grid.getStore().getAt(rowIndex);	
		this.showStatusDialog(record.data.id);
		}, this);
};
Ext.extend(GO.projects2.StatusesGrid, GO.grid.GridPanel,{
	showStatusDialog : function(statusId,config){
		var config = config || {};
		if(!this.statusDialog){
			this.statusDialog = new GO.projects2.StatusDialog();
			this.statusDialog.on('save', function(){
				this.store.reload();
			}, this);
		}
		config.nStatuses = this.store.data.length;
		this.statusDialog.show(statusId,config);
	},
	
	afterRender : function(){
		
		GO.projects2.StatusesGrid.superclass.afterRender.call(this);
		
		var DDtarget = new Ext.dd.DropTarget(this.getView().mainBody, {
			ddGroup : 'pm-statuses-dd',
			copy:false,
			notifyDrop : this.onNotifyDrop.createDelegate(this)
		});
		
		this.store.load();
	},
	onNotifyDrop : function(dd, e, data)
	{		
		var rows=this.selModel.getSelections();
		var dragData = dd.getDragData(e);
		var cindex=dragData.rowIndex;
		if(cindex=='undefined')
		{
			cindex=this.store.data.length-1;
		}					
		
		for(i = 0; i < rows.length; i++) 
		{								
			var rowData=this.store.getById(rows[i].id);
		
			if(!this.copy){
				this.store.remove(this.store.getById(rows[i].id));
			}
			
			this.store.insert(cindex,rowData);
		}
		
		//save sort order							
		var statuses = {};

  	for (var i = 0; i < this.store.data.items.length;  i++)
  	{			    	
			statuses[this.store.data.items[i].get('id')] = i;
  	}
		
		Ext.Ajax.request({
			url: GO.url('projects2/status/order'),
			params: {
				sort_order: Ext.encode(statuses)
			}
		});		
	}
});
