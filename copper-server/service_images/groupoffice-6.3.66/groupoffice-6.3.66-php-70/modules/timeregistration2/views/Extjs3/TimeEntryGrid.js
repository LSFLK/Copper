/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: TimeEntryGrid.js 23422 2018-02-11 19:12:16Z mschering $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */
GO.timeregistration2.TimeEntryGrid = Ext.extend(GO.grid.GridPanel,{

	newEntryDay: null, // The day that is set when clicking New entry button
	startTime: null, // The start timestamp of the selected timespan
	_weekIsClosed: false,

	initComponent : function(){

		var now = new Date();
		
		var store = new Ext.data.GroupingStore({
			url: GO.url('timeregistration2/timeEntry/store'),
			baseParams:{
				year:now.format('Y'), 
				week:'3'
			},
			sortInfo:{
				field: 'date',
				direction: "ASC"
			},
			id : 'id',
			reader: new Ext.data.JsonReader({
				root: 'results',
				totalProperty: 'total',
				id: 'id',
				fields:['id','units', 'start_time', 'end_time', 'date', 'comments', 'project_name', 'standard_task','task', 'status','status_id', 'day','travel_distance','duration']
			}),
			groupField:'day',
			remoteSort:true,
			remoteGroup:true
		});

		// group sumaries don't work with time
		this.summary = new Ext.grid.GroupSummary();
		this.totalSummary = new Ext.grid.JsonSummary();
		
		Ext.grid.GridSummary.Calculations.sumTime = function(v, record, field){
			return v+record.data.duration;
		};
		
		GO.projects2.timerButton = new GO.projects2.TimerButton({
			startTime: GO.projects2.timerStartTime,
			listeners:{
				scope:this,
				beforestoptimer:function(btn){
					return confirm(t("Are you sure you like to stop the timer?", "timeregistration2"));
				}
			}
		});
		
		this.exportMenu = new GO.base.ExportMenu({className:'GO\\Timeregistration2\\Export\\CurrentGrid'});		
		
		this.printButton = new Ext.Button({
			iconCls: 'ic-print',
			tooltip: t("Print"),
			overflowText: t("Print"),
			handler: function(){
				window.open(GO.url('timeregistration2/week/print', {
					'week': '15', 
					'year': '2013'
				}));
			},
			scope: this
		});
		
		if(go.Modules.isAvailable("legacy", "leavedays")){
			this.addLeavedayButton = new Ext.Button({
				text: t("Add holiday", "leavedays"),
				iconCls: 'ic-add',
				handler: function(){					

					GO.mainLayout.openModule('leavedays');
					GO.leavedays.showLeavedayDialog();
				},				
				scope: this
			});
		}

			
		Ext.apply(this,{
			id: 'tr-entry-grid',
			plugins: [this.summary, this.totalSummary],
			autoFill: true,
			editDialogClass: GO.projects2.TimeEntryDialog,
			tbar: {
				enableOverflow:true, 
				items: [
			this.weekIsClosedField = new go.toolbar.TitleItem({
				text: t("This week is closed", "timeregistration2"),
				hidden: true
			}),
			this.addEntryButton = new Ext.Button({
				text: t("Add Time", "timeregistration2"),
				iconCls: 'ic-add',
				handler: function(){
					if(!this.editDialog){
						this.editDialog = new GO.projects2.TimeEntryDialog();
						this.editDialog.on('save', function(){
							this.store.reload();
						}, this);
					}
					this.editDialog.show(0,{
						loadParams: {
							start_time: this.startTime
							}
						});
			},
			scope: this
		}),
		this.addLeavedayButton || '',
		this.deleteButton = new Ext.Button({
			iconCls: 'ic-delete',
			text: t("Delete"),
			handler: function(){
				this.deleteSelected();
			},
			scope: this
		}),
		GO.projects2.timerButton,
		this.closeButton = new Ext.Button({ //see setTimeSpan for handler
			text: t("Close week", "timeregistration2"),
			iconCls: 'ic-lock',
			scope: this
		}),
//		this.approveButton = new Ext.Button({ //see setTimeSpan for handler
//			text: t("Approve", "timeregistration2"),
//			iconCls: 'btn-actions',
//			hidden: !GO.settings.modules.timeregistration2.write_permission,
//			scope: this
//		})
			'->',
			this.exportMenu,
			this.printButton
		]},
		view: new Ext.grid.GroupingView({
			showGroupName: false,
			enableNoGroups:false, // REQUIRED!
			hideGroupedColumn: true,
			emptyText: t("No hours registered", "timeregistration2")
		}),
		store: store,
		listeners:{
			show:function(){
				this.store.load();
			},
			rowcontextmenu: function(grid, index, event){
				if(GO.settings.modules.timeregistration2.write_permission) {
					if(!this.contextMenu){
						this.contextMenu = new Ext.menu.Menu({
							items: [{
								text: t("Approve", "timeregistration2"),
								handler: function() {
									GO.request({
										params:{
											ids: Ext.encode(grid.selModel.selections.keys)
										},
										url:"timeregistration2/timeEntry/approve",
										success: function(response, options, result){
											grid.store.reload();
										},
										scope:this
									});
								}
							}, {
								text: t("Disapprove", "timeregistration2"),
								handler: function() {
									GO.request({
										params:{
											ids: Ext.encode(grid.selModel.selections.keys)
										},
										url:"timeregistration2/timeEntry/disapprove",
										success: function(response, options, result){
											grid.store.reload();
										},
										scope:this
									});
								}
							}],
							scope: this
						});
					}
					event.stopEvent();
					this.contextMenu.showAt(event.xy);
				}
			}
		},
		cm:new Ext.grid.ColumnModel({
			columns:[
			{
				header:t("Start"),
				dataIndex: 'start_time',
				width:dp(72),
				align:'right',
				summaryRenderer:function(){
					return t("Total");
				}
			},{
				header:t("End"),
				dataIndex: 'end_time',
				width:dp(72),
				align:'right'
			},{
				header:t("Duration", "timeregistration2"),
				dataIndex: 'units',
				width:dp(72),
				align:'right',
				summaryType:'sumTime',
				summaryRenderer:function(v, meta, r){
					
					if (typeof v =='string' && v.indexOf(':')!=-1) {
						return v;
					} else if (typeof v=='undefined') {
						return "0:00";
					}
					
					var hours = Math.floor(v/60);
					var mod = v % 60;
					var mins = mod+"";
					
					if(mins.length==1)
						mins = "0"+mins;
					
					return hours+":"+mins;
					
				}
			},{
				header:t("Project", "timeregistration2"),
				dataIndex: 'project_name',
				width:300,
				id:'project',
				renderer:function(v, meta, r){
					if(v!=null)
						return v+'<p class="pm-hours-comments" style="padding-left:0px;">'+r.data.comments+'</p>';
					else
						return "";
				}
			},{
				header:t("Job", "timeregistration2"),
				width:200,
				dataIndex: 'task'
			},{
				header:t("Activity", "timeregistration2"),
				width:150,
				dataIndex: 'standard_task'
			},{
				header:t("Status"),
				dataIndex: 'status'
			},{
				header:t("Day"),
				dataIndex: 'day'
			},{
				header:t("Travel distance", "timeregistration2"),
				dataIndex: 'travel_distance'
			},{
				header:t("Comments", "timeregistration2"),
				dataIndex: 'comments',
				hidden:true
			}]
		})
		});

	this.store.on('load',function(store,records,options){
		this._weekIsClosed = store.reader.jsonData['is_closed_week'];
		this.closeButton.setDisabled(this._weekIsClosed);
		this.closeButton.setVisible(!this._weekIsClosed);
		this.addEntryButton.setDisabled(this._weekIsClosed);
		this.addEntryButton.setVisible(!this._weekIsClosed);
		this.deleteButton.setDisabled(this._weekIsClosed);
		this.deleteButton.setVisible(!this._weekIsClosed);
		if (this.addLeavedayButton) {
			this.addLeavedayButton.setDisabled(this._weekIsClosed);
			this.addLeavedayButton.setVisible(!this._weekIsClosed);
		}
		this.weekIsClosedField.setVisible(this._weekIsClosed);
	},this);
		
	GO.timeregistration2.TimeEntryGrid.superclass.initComponent.call(this);

},
setTimeSpan : function(timespan) {
	if(timespan=="week"){
		this.closeButton.setText(t("Close week", "timeregistration2"));
		this.closeButton.setHandler(function(){
			GO.request({
				params:{ 
					year: this.store.baseParams['year'] ,
					week : this.store.baseParams['week'] 
				},
				url:"timeregistration2/week/close",
				success: function(response, options, result){
					this.store.reload();
					this.mainPanel.weekGrid.store.reload();
					alert(t("All time entries in the current week are closed", "timeregistration2"));
				},
				scope:this
			});
		},this);
		
		this.printButton.setHandler(function(){
			window.open(GO.url('timeregistration2/week/print', {
				'week': this.store.baseParams['week'], 
				'year': this.store.baseParams['year']
				}));
		},this);
		
//		this.approveButton.setHandler(function(){
//			GO.request({
//				params:{ 
//					year: this.store.baseParams['year'] ,
//					week : this.store.baseParams['week'] 
//				},
//				url:"timeregistration2/week/approve",
//				success: function(response, options, result){
//					this.store.reload();
//					this.mainPanel.monthGrid.store.reload();
//					alert(t("All closed time entry in this timespan were approved", "timeregistration2"));
//				},
//				scope:this
//			});
//		},this);
	}
	else {
		this.closeButton.setText(t("Close month", "timeregistration2"));
		this.closeButton.setHandler(function(){
			GO.request({
				params:{ 
					year: this.store.baseParams['year'] ,
					month : this.store.baseParams['month'] 
				},
				url:"timeregistration2/month/close",
				success: function(response, options, result){
					this.store.reload();
					alert(t("All time entries in the current month are closed", "timeregistration2"));
				},
				scope:this
			});
		},this);
		
		this.printButton.setHandler(function(){
			window.open(GO.url('timeregistration2/month/print', {
				'month': this.store.baseParams['month'], 
				'year': this.store.baseParams['year']
				}));
		},this);
		
//		this.approveButton.setHandler(function(){
//			GO.request({
//				params:{ 
//					year: this.store.baseParams['year'] ,
//					month : this.store.baseParams['month'] 
//				},
//				url:"timeregistration2/month/approve",
//				success: function(response, options, result){
//					this.store.reload();
//					alert(t("All closed time entry in this timespan were approved", "timeregistration2"));
//				},
//				scope:this
//			});
//		},this);
	}
},
/**
	 * This function is called by the MonthGrd or WeekGrid
	 * It will change and reload the store and display correct time entries
	 */
loadEntries : function(timespan, key, yearnb) {
	this.setTimeSpan(timespan);
	this.store.baseParams = {
		'year': yearnb
	};
	this.store.baseParams[timespan] = key;
	this.store.reload();
},

	showEditDialog : function(id, config, record){
		if (!this._weekIsClosed || record.data.status_id==2) {
			GO.timeregistration2.TimeEntryGrid.superclass.showEditDialog.call(this,id,config,record);
		} else {
			alert(t("This week is closed", "timeregistration2"));
		}
	}	
});
