/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: TimeEntryGrid.js 23462 2018-03-06 11:37:47Z mschering $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */
GO.projects2.TimeEntryGrid = Ext.extend(GO.grid.GridPanel,{

	initComponent : function(){
		
		
		var cols = [];
			
		cols.push({	dataIndex: 'is_invoiced',	renderer: function(v,m,r) { 
				if(r.data.is_invoiced){
					return '<i class="icon" style="color:green;">check</i>';
					//<div title="'+t("Invoiced", "projects2")+'" class="tasks-complete-icon"></div>';
				}
			}, width: 65
		});

		cols.push({	header: t("User"), dataIndex: 'user_displayName'	});
		cols.push({ header: t("Date"), dataIndex: 'date' });
		cols.push({ header: t("Description"),dataIndex: 'comments' });
		cols.push({ header: t("Job", "projects2"), width:150, dataIndex: 'task', sortable:false });
		cols.push({ header: t("Activity", "projects2"),	width:150, dataIndex: 'standard_task' });
		
		cols.push({ header: t("External fee", "projects2"), dataIndex: 'external_fee', align:'right' });
		cols.push({ header: t("Internal fee", "projects2"), dataIndex: 'internal_fee', align:'right' });
		
		cols.push({ header: t("Duration", "projects2"), dataIndex: 'units', align:'right' });	
		cols.push({ header: t("Travel distance", "projects2"), dataIndex: 'travel_distance',	align:'right' });
		
		cols.push({ header: t("Travel costs", "projects2"), dataIndex: 'travel_costs',	align:'right' });

		var colModel = new Ext.grid.ColumnModel({
			defaults:{
				sortable:true
			},
			columns:cols
		});
		
		this.summary = new Ext.grid.JsonSummary();
		this.exportMenu = new GO.base.ExportMenu({className:'GO\\Timeregistration2\\Export\\CurrentGrid'});
		this.exportMenu.setColumnModel(colModel);
		Ext.apply(this,{

			plugins: this.summary,
			title:t("Time entries", "projects2"),
			standardTbar:true,
			tbar:[
				this.exportMenu,
//				{
//				iconCls: 'btn-export',
//				text: t("Export"),
//				cls: 'x-btn-text-icon',
//				handler:function(){
//					if(!this.exportGridDlg){
//						this.exportGridDlg = new GO.ExportGridDialog({
//							url: 'projects2/timeEntry/export',
//							name: 'timeentries',
//							documentTitle: t("Time entries", "projects2"),
//							colModel: colModel							
//						});
//					}
//					
//					this.exportGridDlg.params={};
//					Ext.apply(this.exportGridDlg.params,this.store.baseParams);
//					Ext.apply(this.exportGridDlg.params,this.store.lastOptions.params);
//
//					this.exportGridDlg.show();
//				},
//				scope:this
//			}
			],
			store: new GO.data.JsonStore({
				url:GO.url("projects2/timeEntry/store"),
				model:"GO\\Projects2\\Model\\TimeEntry",
				remoteSort: true,
				fields:['user_id','user_displayName','project_name', 'comments','is_invoiced', 'external_fee','internal_fee', 'date','units','task','standard_task','travel_costs','travel_distance']
			}),
			editDialogClass: GO.projects2.TimeEntryDialog,
			border: false,
			paging:true, //page size of paging
			listeners:{
				show:function(){
					this.store.load();
				},
				scope:this
			},
			cm:colModel
		});
		
		GO.projects2.TimeEntryGrid.superclass.initComponent.call(this);		
	},
  
	btnAdd : function(){
		if(this.editDialogClass){
			this.showEditDialog(null, {
				loadParams: {
					'project_id' : this.store.baseParams.project_id
				}
			});
	}
},
  
setProjectId : function(project_id){
	this.store.baseParams.project_id=project_id;
	this.setDisabled(GO.util.empty(project_id));
}
});
