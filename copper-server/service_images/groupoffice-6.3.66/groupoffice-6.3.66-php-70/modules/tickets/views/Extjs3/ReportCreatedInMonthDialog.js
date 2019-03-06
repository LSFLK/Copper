GO.tickets.ReportCreatedInMonthDialog = Ext.extend(GO.Window, {
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
			html: t("months")[now.getMonth()] + " " + now.format('Y') + "",
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
			fields: ['count','day','month','year'],
			url: GO.url('tickets/report/createdInMonth'),
			baseParams: {
				monthNr: (new Date()).getMonth(),
				year: (new Date()).format('Y')
			}
		});

		this.chart = new Ext.chart.ColumnChart({
			series: [{yField: 'count', xField: 'day', displayName: t("Created tickets", "tickets")}],
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
			title: t("Created tickets per month", "tickets"),
			tbar: [this.leftArrow, this.timePanel, this.rightArrow],
			width: 950,
			height: 600,
			resizable: true,
			items: [this.chart]
		});

		GO.tickets.ReportCreatedInMonthDialog.superclass.initComponent.call(this);
	},
	show: function () {
		this.store.load();
		GO.tickets.ReportCreatedInMonthDialog.superclass.show.call(this);
	},
	decrementTime: function () {

		var monthNr = this.store.baseParams['monthNr'];
		var year = this.store.baseParams['year'];

		if (monthNr < 2) {
			year--;
			monthNr = 12;
		} else {
			monthNr--;
		}

		this.store.baseParams['year'] = year;
		this.store.baseParams['monthNr'] = monthNr;

		this.timePanel.body.update(t("months")[monthNr] + " " + year);

	},
	incrementTime: function () {

		var monthNr = this.store.baseParams['monthNr'];
		var year = this.store.baseParams['year'];

		if (monthNr > 11) {
			year++;
			monthNr = 1;
		} else {
			monthNr++;
		}

		this.store.baseParams['year'] = year;
		this.store.baseParams['monthNr'] = monthNr;

		this.timePanel.body.update(t("months")[monthNr] + " " + year);

	}

});
