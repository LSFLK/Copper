/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: YearOverviewGrid.js 22939 2018-01-12 08:01:21Z mschering $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */
GO.timeregistration2.YearOverviewGrid = Ext.extend(GO.grid.GridPanel,{

	initComponent : function(){
		
		var now = new Date();
		
		Ext.apply(this,{
			title: 'Overview ' + now.format('Y') + ' Workdays: ',
			store: new Ext.data.GroupingStore({
				url: GO.url('timeregistration2/year/overViewStore'),
				baseParams:{ year:now.format('Y')},
				sortInfo:{
					field: 'user_id',
					direction: "ASC"
				},
				//id : 'id',
				reader: new Ext.data.JsonReader({
				  root: 'results',
				  totalProperty: 'total',
				  //id: 'id',
				  fields:['user_id','month', 'hours', 'hours_worked', 'hours_absence','hours_leave', 'total_workdays','earned_leave_time', 'remaining_work_time']
				}),
				groupField:'user_id',
				remoteSort:true,
				remoteGroup:true
			}),
			listeners:{
				show:function(){
					this.store.load();
				},
				scope:this
			},
			cm:new Ext.grid.ColumnModel({
				defaults:{
				  sortable:false
				},
				columns:[
				{
					header:t("Month"),
					dataIndex: 'month',
					width: 40
				},{
					header:t("Total Workdays", "timeregistration2"),
					dataIndex: 'total_workdays',
					align: 'right',
					width: 40
				},{
					header:t("Remaining worktime", "timeregistration2"),
					dataIndex: 'remaining_work_time',
					align: 'right',
					width: 40
				},{
					header:t("Total hours", "timeregistration2"),
					dataIndex: 'hours',
					align: 'right',
					width: 40
				},{
					header:t("Working", "timeregistration2"),
					dataIndex: 'hours_worked',
					align: 'right',
					width: 40
				},{
					header:t("Absence", "timeregistration2"),
					dataIndex: 'hours_absence',
					align: 'right',
					width: 40
				},{
					header:t("Holiday", "timeregistration2"),
					dataIndex: 'hours_leave',
					align: 'right',
					width: 40
				},{
					header:t("Earned leave time", "timeregistration2"),
					dataIndex: 'earned_leave_time',
					align: 'right',
					width: 40
				}]
			})
		});
		
		GO.timeregistration2.YearOverviewGrid.superclass.initComponent.call(this);

	},
	/**
	 * This function is called by the MonthGrd or WeekGrid
	 * It will change and reload the store and display correct time entries
	 */
	loadEntries : function(year) {
	  this.store.baseParams['year'] = year;
	  this.store.reload();
	}
});
