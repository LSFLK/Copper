/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: MonthWindow.js 22911 2018-01-12 08:00:53Z mschering $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */
GO.leavedays.MonthWindow = Ext.extend(GO.Window,{
	
	tpl: null,
	
	initComponent : function(){
		
		var now = new Date();
		
		var fields = ['name'];
		for(var d = 0; d <= 30; d++){
			fields.push(d.toString());
		}
		
		var store = this.store = new GO.data.JsonStore({
			url: GO.url('leavedays/report/month'),
			id: 'id',
			baseParams: {
				month: now.getMonth(),
				year: now.getFullYear()
			},
			scope:this,
			fields: fields,
			remoteSort: true
		});
		
		

		this.tpl = new Ext.XTemplate(
			'<table cellspacing="0" class="monthReport x-grid3">',
			'<thead class="x-grid3-header">',
				'{[this.renderHeader()]}',
			'</thead>',
			'<tbody class="x-grid3-body">',
				'{[this.renderRows(values)]}',
			'</tbody>',
			'</table>',
			{
				month: now.getMonth(),
				year: now.getFullYear(),
				renderHeader : function() {
					var today = new Date(this.year,this.month,1),
						firstDay = new Date(today.getFullYear(), today.getMonth(), 1),
						lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);

					var h2 = '<tr><th></th>',
						h3 = '<tr><th>'+t("Name")+'</th>',
						day = new Date(firstDay.getTime()), 
						firstWeekDay = day.getDay(); 
					for(; day <= lastDay; day.setDate(day.getDate() + 1)) {
						if(day.getDay() == 0) { //sunday
							h2 += '<th colspan="'+(7-(day.getDate()<7?firstWeekDay-1:0))+'">Week '+day.getWeekOfYear()+'</th>';
						}
						h3 += '<th style="text-align:center">'+day.getDate()+'</th>';
					}
					return h2+'</tr>'+h3+'</tr>';
				},
				renderRows : function(data) {
					
					var today = new Date(this.year,this.month,1),
						firstDay = new Date(today.getFullYear(), today.getMonth(), 1),
						lastDay = new Date(today.getFullYear(), today.getMonth() + 1, 0);
					
					var row = '',
						day, style = '';
					Ext.each(data, function(r) {
						row += '<tr class="x-grid3-row"><th>'+r['name']+'</th>';
						for(day = new Date(firstDay.getTime()); day <= lastDay; day.setDate(day.getDate() + 1)) {
							if(r[day.getDate()-1].id) {
								row += '<td style="background-color:#8bc34a;">';
							}
							else if(day.getDay() == 0 || day.getDay() == 6) //saturday or sunday
								row += '<td style="background-color:#eee;">';
							else
								row += '<td>';
							row += '&nbsp;</td>';
						}
						row +='</tr>';
					});
					return row;
				}
			}
		);

		Ext.apply(this,{
			frame:true,
			width:960,
			height:700,
			//autoHeight:true,
			collapsible:false,
			resizable: true,
			maximizable: true,
			layout:'fit',
			title:t("Month report", "leavedays")+ ' '+now.getFullYear(),
			tbar: [
				t("Month", "leavedays")+': ',
				{
					xtype: 'combo',
					displayField:'month',
					valueField:'id',
					hiddenValue:this.month,
					editable:false,
					readOnly:false,
					mode: 'local',
					triggerAction: 'all',
					store: new Ext.data.SimpleStore({
						fields : ['id', 'month'],
						data : [
							[0, t("Jan", "leavedays")],
							[1, t("Feb", "leavedays")],
							[2, t("Mar", "leavedays")],
							[3, t("Apr", "leavedays")],
							[4, t("May", "leavedays")],
							[5, t("Jun", "leavedays")],
							[6, t("Jul", "leavedays")],
							[7, t("Aug", "leavedays")],
							[8, t("Sep", "leavedays")],
							[9, t("Oct", "leavedays")],
							[10, t("Nov", "leavedays")],
							[11, t("Dec", "leavedays")]
						]
					}),
					listeners: {
						select: function(me, value) {
							this.tpl.month = value.data.id;
							store.baseParams['month'] = value.data.id;
							store.reload();
						},
						scope:this
					}
				},{
					text: t("Reload", "leavedays"),
					handler: function() {
						store.reload();
					}
				}
			],
			items: 
				new Ext.DataView({
					store: this.store,
					tpl: this.tpl,
					autoHeight:true,
					multiSelect: true,
					emptyText: t("There are no holidays taken this month", "leavedays")
				})
			
		});
		
		GO.leavedays.MonthWindow.superclass.initComponent.call(this);		
	},
	
	show : function(year) {
		
		
		this.store.baseParams['year'] = year;
		this.tpl.year = year;
		if(this.year != year || !this.store.loaded) {
			this.store.load();
		}
		this.setTitle(t("Month report", "leavedays")+ ' '+this.year);
		
		GO.leavedays.MonthWindow.superclass.show.call(this);
	}

});
