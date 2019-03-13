/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: ReportResponseTimeDialog.js 22937 2018-01-12 08:01:19Z mschering $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */
GO.tickets.ReportResponseTimeDialog = Ext.extend(GO.Window, {

    initComponent: function() {

		now = new Date();

		var toolbar = [this.leftArrow = new Ext.Button({
				text: '«',
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
				text: '»',
				handler : function() {
					this.store.baseParams.year++;
					this.yearPanel.body.update(this.store.baseParams.year);
					this.store.load();
				},
				scope : this
			})];
		
		

        Ext.apply(this, {
            layout: 'fit',
            title: t("Average response time", "tickets"),
			tbar: toolbar,
            width: 950,
            height: 600,
            resizable: true,
            items: [this.chart = new Ext.chart.LineChart({
				//xtype: 'stackedcolumnchart',
				store: this.store = new GO.data.JsonStore({
					fields: ['month', 'response_time'],
					url: GO.url('tickets/report/averageResponseTime'),
					baseParams:{
						year:(new Date()).format('Y')
					}
				}),
				xField: 'month',
				yField: 'response_time', 
				xAxis: new Ext.chart.CategoryAxis({
					labelRenderer: function(v) {
						return t("months")[v];
					}
				}),
				yAxis: new Ext.chart.NumericAxis({
					majorUnit: 3600,
					minimum: 0,
					labelRenderer: function(v) {
						var days	= Math.floor(v / (24*60*60));
						var date = new Date(v*1000),
							hours = date.getUTCHours(),
							minutes = date.getUTCMinutes();
						if(hours < 10) { hours = "0"+hours;}
						if(minutes < 10) { minutes = "0"+minutes;}
						return days+' '+t("days")+' '+hours+':'+minutes;
					}
				})
			})]
        });

        GO.tickets.ReportResponseTimeDialog.superclass.initComponent.call(this);
    },
	show : function() {
		this.chart.store.load();
		GO.tickets.ReportResponseTimeDialog.superclass.show.call(this);
	}
});
