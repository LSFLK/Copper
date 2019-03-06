GO.tickets.ReportCreatedInYearWeekDialog = Ext.extend(GO.Window, {
	initComponent: function () {

		var now = new Date();

		this.leftArrow = new Ext.Button({
			text: '«',
			handler: function () {
				this.decrementTime();
				this.store.load();
			},
			scope: this
		});

		this.timePanel = new Ext.Panel({
			html: now.format('Y'),
			plain: true,
			border: true,
			cls: 'cal-period'
		});

		this.rightArrow = new Ext.Button({
			text: '»',
			handler: function () {
				this.incrementTime();
				this.store.load();
			},
			scope: this
		});

		this.store = new GO.data.JsonStore({
			fields: ['count','week','year'],
			url: GO.url('tickets/report/createdInYearPerWeek'),
			baseParams: {
				year: (new Date()).format('Y')
			}
		});

		this.chart = new Ext.chart.ColumnChart({
			series: [{yField: 'count', xField: 'week', displayName: t("Created tickets", "tickets")}],
			store: this.store,
			xAxis: new Ext.chart.CategoryAxis(),
			yAxis: new Ext.chart.NumericAxis({
				majorUnit: 1
			}),
			tipRenderer : function(chart, record, index, series){
				return record.data.count;
			},
			extraStyle: {
				legend: {
					display: 'bottom',
					padding: 5,
					font: {
						size: 13
					}
				}
			}
		});

		Ext.apply(this, {
			layout: 'fit',
			title: t("Created tickets per year in weeks", "tickets"),
			tbar: [this.leftArrow, this.timePanel, this.rightArrow],
			width: 950,
			height: 600,
			resizable: true,
			items: [this.chart]
		});

		GO.tickets.ReportCreatedInYearWeekDialog.superclass.initComponent.call(this);
	},
	show: function () {
		this.store.load();
		GO.tickets.ReportCreatedInYearWeekDialog.superclass.show.call(this);
	},
	decrementTime: function () {
		var year = this.store.baseParams['year'];
		year--;

		this.store.baseParams['year'] = year;
		this.timePanel.body.update(year);
	},
	incrementTime: function () {
		var year = this.store.baseParams['year'];
		year++;

		this.store.baseParams['year'] = year;
		this.timePanel.body.update(year);
	}

});
