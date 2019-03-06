/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: MainPanel.js 23430 2018-02-13 14:47:33Z mschering $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */
GO.timeregistration2.MainPanel = Ext.extend(Ext.Panel, {
  
	initComponent: function() { 
		
		this.timeEntryGrid = new GO.timeregistration2.TimeEntryGrid({mainPanel: this});
//		this.yearOverview = new GO.timeregistration2.YearOverviewGrid();

		Ext.apply(this, {
			layout : 'border',
			collapsable: false,
			listeners:{
				scope:this,
				render:function(){
					this.weekGrid.store.load();
				}
			},
			items : [
			new Ext.TabPanel({
				region:'west',
				tbar: GO.settings.modules.timeregistration2.write_permission ? [
					this.selectUser = new GO.projects2.SelectEmployee({
						width: dp(216),
						listWidth: dp(336),
						includeInactive:true,						
						store:new GO.data.JsonStore({
							url:GO.url('projects2/employee/store'),
							fields:['user_id','name'],
							id:'user_id'
						}),
						valueField: 'user_id',
						listeners:{
							select:function(cb, r){
								GO.request({
									url: 'timeregistration2/settings/changeUser',
									params: {
										user_id: r.data.user_id
									},
									success: function(options, response, result) {
										if(this.timeEntryGrid.isVisible())
											this.timeEntryGrid.store.reload();						

										if(go.Modules.isAvailable("legacy", "leavedays")){
											GO.leavedays.activeUserId=r.data.user_id;
										}

		//								if(this.yearOverview.isVisible())
		//									this.yearOverview.store.reload();

										if(this.weekGrid.isVisible())
											this.weekGrid.store.reload();
										if(this.monthGrid.isVisible())
											this.monthGrid.store.reload();

										GO.projects2.selectBookableProjectStore.load();

									},
									scope: this
								});
							},
							scope: this
						}
				})] : null,
				border:false,
				activeTab: 0,
				split:true,
				collapsible:false,
				cls: 'go-sidenav',
				width: dp(224),
				items:[
				this.weekGrid = new GO.timeregistration2.WeekGrid({
					mainPanel: this
				}),
				this.monthGrid = new GO.timeregistration2.MonthGrid({
					mainPanel: this
				})
//				,
//				new GO.timeregistration2.YearGrid({
//					mainPanel: this
//				})

				
				
				]
			}),
			this.cardPanel = new Ext.Panel({
				id:'tr-center',
				region:'center',
				border:false,
				layout : 'card',
				collapsible:false,
				items: [
				this.timeEntryGrid
//				this.yearOverview
			
				]
			})
			]
		});

		GO.timeregistration2.MainPanel.superclass.initComponent.call(this);
	}
  
});

// This will add the module to the main tabpanel filled with all the modules
GO.moduleManager.addModule('timeregistration2', GO.timeregistration2.MainPanel, {
	title : t("Time tracking", "timeregistration2"),  //Module name in startmenu
	iconCls : 'go-tab-icon-timeregistration2' //The css class with icon for startmenu
});
