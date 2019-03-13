/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: RemindersGrid.js 22112 2018-01-12 07:59:41Z mschering $
 * @copyright Copyright Intermesh
 * @author Merijn Schering <mschering@intermesh.nl>
 */
GO.reminders.RemindersGrid = function(config){
	if(!config)
	{
		config = {};
	}
	
	config.layout='fit';
	config.autoScroll=true;
	config.split=true;
	var fields ={
		fields:['id','link_id','link_type','name','time','vtime','mail_send','snooze_time','manual'],
		columns:[{
			header: t("Time", "reminders"),
			dataIndex: 'time',
			width:120
		},{
			header: t("Name"),
			dataIndex: 'name',
			id:'name'
		}
		]
	};
	
	config.store = new GO.data.JsonStore({
		url: GO.url('reminders/reminder/store'),
		baseParams: {},
		root: 'results',
		id: 'id',
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
	config.cm=columnModel;
	config.view=new Ext.grid.GridView({
			emptyText: t("No items to display")		
	});
	config.autoExpandColumn='name';
	config.sm=new Ext.grid.RowSelectionModel();
	config.loadMask=true;

	config.tbar=new Ext.Toolbar({
		cls:'go-head-tb',
		items:[{
			iconCls: 'btn-add',
			text: t("Add"),
			cls: 'x-btn-text-icon',
			handler: function(){
				this.showReminderDialog();
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
		}]
	});

	config.listeners={
		scope:this
		,
		render:function(){
			this.store.load();
		}
		,
		rowdblclick:function(grid, rowIndex){
			var record = grid.getStore().getAt(rowIndex);
			this.showReminderDialog(record.data.id);
		}
	}
	GO.reminders.RemindersGrid.superclass.constructor.call(this, config);	
};
Ext.extend(GO.reminders.RemindersGrid, GO.grid.GridPanel,{

	showReminderDialog : function(reminder_id){
		if(!this.reminderDialog){
			this.reminderDialog = new GO.reminders.ReminderDialog({
				listeners:{
					save:function(){
						this.store.reload();
					},
					scope:this
				}
			});
		}
		this.reminderDialog.show(reminder_id);

	}
	});
