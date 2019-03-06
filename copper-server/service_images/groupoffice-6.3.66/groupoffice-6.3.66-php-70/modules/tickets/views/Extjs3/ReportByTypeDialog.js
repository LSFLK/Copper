GO.tickets.ReportByTypeDialog = Ext.extend(GO.Window, {
	initComponent: function() {

		var now = new Date();

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
			title: t("Tickets by type", "tickets"),
			width: 950,
			height: 600,
			tbar: toolbar,
			resizable: true,
			items: [this.chart = new Ext.chart.PieChart({
				store: this.store = new GO.data.JsonStore({
					fields: ['type','count'],
					url: GO.url('tickets/report/byType'),
					baseParams: {
						monthNr: (new Date()).getMonth(),
						year: (new Date()).format('Y')
					}
				}),
				dataField: 'count',
				categoryField: 'type'
				,
				extraStyle: {
					legend: {
						display: 'right',
						padding: 5,
						font: {
							size: 13
						}
					}
				}
			})]
		});

		GO.tickets.ReportByTypeDialog.superclass.initComponent.call(this);
	},
	
	show: function() {
		GO.tickets.ReportByTypeDialog.superclass.show.call(this);
		this.store.load();
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
