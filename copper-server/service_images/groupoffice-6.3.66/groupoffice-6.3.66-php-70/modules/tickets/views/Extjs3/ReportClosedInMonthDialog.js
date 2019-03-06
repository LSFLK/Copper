GO.tickets.ReportClosedInMonthDialog = Ext.extend(GO.Window, {

    initComponent: function() {

		now = new Date();

		var toolbar = [this.leftArrow = new Ext.Button({
				text: '«',
				handler : function() {
					this.decrementTime();
					this.store.load();
				},
				scope : this
			}), this.timePanel = new Ext.Panel({
					html : t("months")[now.getMonth()]+" "+now.format('Y')+"",
					plain : true,
					border : true,
					cls : 'cal-period'
			}), this.rightArrow = new Ext.Button({
				text: '»',
				handler : function() {
					this.incrementTime();
					this.store.load();
				},
				scope : this
			})];
		
		

        Ext.apply(this, {
            layout: 'fit',
            title: t("Closed tickets in month", "tickets"),
						tbar: toolbar,
            width: 950,
            height: 600,
            resizable: true,
            items: [this.chart = new Ext.chart.LineChart({
				//xtype: 'stackedcolumnchart',
				store: this.store,
				xField: 'dayNr',
				xAxis: new Ext.chart.CategoryAxis({
//					labelRenderer: function(v) {
//						return t("months")[v];
//					}
				}),
				yAxis: new Ext.chart.NumericAxis({
//					labelRenderer: function(v) {
//						return t("Closed tickets in month", "tickets")+': '+v;
//					}
				}),
				extraStyle: {
					legend: {
						display: 'bottom',
						padding: 5,
						font: {
							size: 13
						}
					}
				}
//				,
//				series: [{
//						yField: '2', 
//						displayName: 'test'
//					}]
			})]
        });

        GO.tickets.ReportClosedInMonthDialog.superclass.initComponent.call(this);
    },
	show : function() {
		this.loadAgents();
		GO.tickets.ReportClosedInMonthDialog.superclass.show.call(this);
	},
	loadAgents : function() {

		GO.request({
			url: 'tickets/report/agents',
			success: function(options, response, result) {

				var fields = ['dayNr'];
				var series = [];
				for(var key in result.data) {
					fields.push(key);
					series.push({
						yField: key, 
						displayName: result.data[key]
					});
				}
				this.store = new GO.data.JsonStore({
					fields: fields,
					url: GO.url('tickets/report/closedInMonth'),
					baseParams:{
						monthNr: (new Date()).getMonth(),
						year:(new Date()).format('Y')
					}
				});
				this.chart.bindStore(this.store);
				this.chart.setSeries(series);
				this.store.load();
			},
			scope:this
		});
		
	},
	
	decrementTime : function() {
		
		var monthNr = this.store.baseParams['monthNr'];
		var year = this.store.baseParams['year'];
		
		if (monthNr<2) {
			year--;
			monthNr=12;
		} else {
			monthNr--;
		}
		
		this.store.baseParams['year'] = year;
		this.store.baseParams['monthNr'] = monthNr;
		
		this.timePanel.body.update(t("months")[monthNr]+" "+year);
		
	},
	
	incrementTime : function() {
		
		var monthNr = this.store.baseParams['monthNr'];
		var year = this.store.baseParams['year'];
		
		if (monthNr>11) {
			year++;
			monthNr=1;
		} else {
			monthNr++;
		}
		
		this.store.baseParams['year'] = year;
		this.store.baseParams['monthNr'] = monthNr;
		
		this.timePanel.body.update(t("months")[monthNr]+" "+year);
		
	}
	
});
