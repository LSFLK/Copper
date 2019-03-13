GO.tickets.ReportCurrentTicketsDialog = Ext.extend(GO.Window, {
	initComponent: function() {

		Ext.apply(this, {
			layout: 'fit',
			title: t("Current tickets counts", "tickets"),
			width: 950,
			height: 600,
			resizable: true,
			items: [this.chart = new Ext.chart.ColumnChart({
					//xtype: 'stackedcolumnchart',
					store: this.store,
					xField: 'result',
					xAxis: new Ext.chart.CategoryAxis({
						labelRenderer: function(v) {
							return [t("Number of current tickets", "tickets")];
						}
					}),
					yAxis: this.yAxis = new Ext.chart.NumericAxis({
						stackingEnabled: false
					}),
					extraStyle: {
						legend: {
							display: 'bottom',
							padding: 5,
							font: {
								family: 'Tahoma',
								size: 13
							}
						}
					},
					series: [{yField: '2', displayName: 'test'}]
				})]
		});

		GO.tickets.ReportCurrentTicketsDialog.superclass.initComponent.call(this);
	},
	show: function() {
		this.loadAgents();
		GO.tickets.ReportCurrentTicketsDialog.superclass.show.call(this);
	},
	loadAgents: function() {

		GO.request({
			url: 'tickets/report/currentAgents',
			success: function(options, response, result) {

				var fields = ['result'];
				var series = [];
				for (var key in result.data) {
					fields.push(key);
					series.push({yField: key, displayName: result.data[key]});
				}
				this.store = new GO.data.JsonStore({
					fields: fields,
					url: GO.url('tickets/report/currentTickets'),
					baseParams: {
						year: (new Date()).format('Y')
					}
				});
				this.chart.bindStore(this.store);
				this.chart.setSeries(series);
				this.store.load();
			},
			scope: this
		});

	}
});
