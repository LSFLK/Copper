/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: ApprovalGrid.js 22906 2018-01-12 08:00:48Z mschering $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */
GO.hoursapproval2.ApprovalGrid = Ext.extend(GO.grid.GridPanel,{

	weekgrid: null,

	initComponent : function(){ 
		
		
		var summary = new Ext.grid.GroupSummary();
		this.totalSummary = new Ext.grid.JsonSummary();
		
		Ext.apply(this,{
//			disableSelection:true,
			plugins:[summary,this.totalSummary],
			id: 'ha2-approve-grid',
			tbar: [{
					text:t("Approve", "hoursapproval2"),
					iconCls: 'check',
					handler:function(b){
						this.approve(true);
					},
					scope:this
				},{
					text:t("Disapprove", "hoursapproval2"),
					iconCls: 'clear',
					handler:function(b){
						if(!this.disapproveDialog) {
							this.disapproveDialog = new GO.hoursapproval2.DisapproveDialog({});
						}
						var selectedRows = this.selModel.getSelections();
						var ids = [];
						for(var i=0;i<selectedRows.length;i++) {
							ids.push(selectedRows[i].id);
						}
						this.disapproveDialog.show(null, {list:ids});
					},
					scope:this
				},
				{
					iconCls: 'btn-refresh',
					tooltip: t("Refresh"),
					handler: function(){
						this.weekgrid.store.reload();
						this.approvalGrid.store.reload();
					},
					scope: this
			}
			],
			loadMask: true,
			store: new Ext.data.GroupingStore({
				url : GO.url('hoursapproval2/approve/store'),
				baseParams : {
					year : '',
					week : ''
				},
				id : 'id',
				reader:new Ext.data.JsonReader({
					root: 'results',
					totalProperty: 'total',
					id: 'id',
					fields : ['id', 'user_name', 'day','hours', 'project_name', 'task_name', 'user_id','duration', 'status', 'statusText','comments','activity_type_name']
				}),
				groupField:'user_name',
				remoteSort:true,
				remoteGroup:true
			}),
			cm: new Ext.grid.ColumnModel({
				columns:[{
					header : t("Status", "projects2"),
					dataIndex : 'statusText',
					width : 100,
					renderer:function(v, meta, record){
						switch(record.get('status')){
							case 2:
								meta.css='go-icon-cross';
							break;

							case 1:
								meta.css='go-icon-ok';
							break;
							default:
								meta.css='go-icon-unknown';
								break;
						}

						return v;
					},
					summaryRenderer:function(){
						return t("Total");
					}
				},{
					header : t("Date"),
					dataIndex : 'day',
					width:150
				},{
					header : t("Duration", "timeregistration2"),
					dataIndex : 'hours',
					summaryType:'sum',
					width:80,
					summaryRenderer:function(v, meta, r){
						return v;
					}
				}, {
					header : t("User"),
					dataIndex : 'user_name',
					width:200
				},{
					header : t("Project", "projects2"),
					dataIndex : 'project_name',
					width:200
				},{
					header : t("Job", "projects2"),
					dataIndex : 'task_name',
					width:200
				},{
					header : t("Activity type", "projects2"),
					dataIndex : 'activity_type_name',
					width:200
				}]
			}),
			view: new Ext.grid.GroupingView({
				showGroupName: false,
				enableNoGroups:false, // REQUIRED!
				hideGroupedColumn: true,
				emptyText: t("noHours", "timeregistration2"),
				enableRowBody:true,
				showPreview:true,
				getRowClass : function(record, rowIndex, p, store){
						if(this.showPreview){
								p.body = '<p class="go-row-body">'+record.data.comments+'</p>';
								return 'x-grid3-row-expanded';
						}
						return 'x-grid3-row-collapsed';
				}
			})
		});
		
		GO.hoursapproval2.ApprovalGrid.superclass.initComponent.call(this);
	},
	
	approve: function(approve) {
		var url = (approve) ? 'hoursapproval2/approve/approve' : 'hoursapproval2/approve/disapprove';
		
		var selectedRows = this.selModel.getSelections();
		var ids = [];
		for(var i=0;i<selectedRows.length;i++) {
			ids.push(selectedRows[i].id);
		}
		GO.request({
			url: url,
			params:{ ids:Ext.encode(ids) },
			callback:function(){
				this.store.reload();
			},
			scope:this
		});
		this.weekgrid.selectedRecord = this.weekgrid.getSelectionModel().getSelected();
		this.weekgrid.store.reload();
	},

	setWeek : function(year, week){
		this.store.baseParams['year'] = year;
		this.store.baseParams['week'] = week;
		this.store.load();
	}
});
