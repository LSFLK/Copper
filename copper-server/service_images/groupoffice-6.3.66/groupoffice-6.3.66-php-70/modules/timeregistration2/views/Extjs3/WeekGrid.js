/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: WeekGrid.js 22939 2018-01-12 08:01:21Z mschering $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */
GO.timeregistration2.WeekGrid = Ext.extend(GO.grid.GridPanel,{

	mainPanel : false, //thestore to reload when a week is selected
	
	
	getYear : function(){
		return this.store.baseParams.year;
	},

	initComponent : function(){
		
		var now = new Date();
		
		var toolbar = [this.leftArrow = new Ext.Button({
				iconCls : 'ic-keyboard-arrow-left',
				handler : function() {
					this.store.baseParams.year--;
					this.yearPanel.body.update(this.store.baseParams.year);
					this.store.load();
				},
				scope : this
			}), this.yearPanel = new Ext.Panel({
						html : now.format('Y')+"",
						plain : true,
						border : true,
						cls : 'cal-period'
			}), this.rightArrow = new Ext.Button({
				iconCls : 'ic-keyboard-arrow-right',
				handler : function() {
					this.store.baseParams.year++;
					this.yearPanel.body.update(this.store.baseParams.year);
					this.store.load();
				},
				scope : this
			})]
		  
		  
		
		Ext.applyIf(this,{
			title: t("Week"),
			region:'west',
			cls:'go-grid3-hide-headers',
			tbar: toolbar,
			sm: new Ext.grid.RowSelectionModel({singleSelect:true}),
			store: new GO.data.JsonStore({
				url: GO.url('timeregistration2/week/store'),		
				fields:['weeknb', 'closed', 'disapproved', 'name', 'start_time'],
				baseParams:{ year:now.format('Y')},
				scope: this
			}),
			
			cm:new Ext.grid.ColumnModel({
				columns:[
				  { 
					  header: t("Week"), 
					  dataIndex: 'name',
					  renderer:function(v, meta, record){
						
						if(record.get('disapproved')==true) {
							meta.css='go-icon-cross';
							return v;
						}
						
						switch(record.get('closed')){

							case true:
								meta.css='go-icon-ok';
							break;

							default:
								meta.css='go-icon-empty';
								break;
						}

						return v;
					}
				  }
				]
			})
		});
		
		this.on('viewready', function () {
			
			var weeknb = (new Date()).getWeekOfYear();
			
			var index = this.store.findBy(function(record){
							
				return record.data.weeknb == weeknb;
			});
			
			// make task that runs to check it renders then select every 0.5 second 40 times
			var task = {
					run: function(){
							var index = this.store.findBy(function(record){

								return record.data.weeknb == weeknb;
							});
							
							if(this.getView().getRow(index) && !this.getSelectionModel().getSelected()) {
								 
								this.getSelectionModel().selectRow(index);
								
								this.getView().getRow(index).scrollIntoView();
			
								this.getView().focusRow(index);
			
							}
					},
					scope: this,
					repeat: 40,
					interval: 500 //2 second
			};
			if(!this.getSelectionModel().getSelected()) {
				this.taskJob = Ext.TaskMgr.start(task);
			}
			
		}, this);


		
		
		
		GO.timeregistration2.WeekGrid.superclass.initComponent.call(this);	
		
		this.on('delayedrowselect', function(sm, i, record){
		  if(this.mainPanel){
			this.mainPanel.timeEntryGrid.startTime = record.get('start_time');
			this.mainPanel.cardPanel.layout.setActiveItem(0);
		    this.mainPanel.timeEntryGrid.loadEntries('week', record.get('weeknb'), this.store.baseParams.year);
		  }
		}, this);
	}
});
