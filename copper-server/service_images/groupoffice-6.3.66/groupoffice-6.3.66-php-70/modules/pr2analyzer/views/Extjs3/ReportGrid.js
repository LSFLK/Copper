GO.pr2analyzer.ReportGrid = function (config) {

	config = config || {};


	config.store = new GO.data.JsonStore({
		url: GO.url('pr2analyzer/time/report'), // GO.settings.modules.projects2.url + 'json.php',
		root: 'results',
		fields: ['name', 'project_path', 'duration', 'days', 'int_fee_value', 'ext_fee_value', 'profit', 'user_id', 'customer', 'project_id', 'units_budget', 'units_diff'], //, 'expenses', 'income'],
		remoteSort: true
	});

	//config.cls='pm-report-table',
	config.paging = true;
	config.columns = [
		{
			header: t("Name"),
			dataIndex: 'name',
			sortable: true,
			hideable: true,
			id: 'name'
		},
		this.pathColumn = new Ext.grid.Column({
			header: t("Path", "projects2"),
			dataIndex: 'project_path',
			sortable: true,
			hideable: true,
			width: dp(120)
		}), {
			header: t("Duration", "projects2"),
			dataIndex: 'duration',
			renderer: function (v, metaData, record) {
				return this.formatTime(record.data.duration);
			},
			scope: this,
			sortable: true,
			align: 'right',
			width: dp(70)
		}, {
			header: t("Total budget", "projects2"),
			dataIndex: 'units_budget',
			renderer: function (v, metaData, record) {
				if (record.data.units_budget === '')
					return '-';
				return this.formatTime(record.data.units_budget);
			},
			scope: this,
			sortable: true,
			align: 'right',
			width: dp(120)
		}, {
			header: t("Total remaining", "projects2"),
			dataIndex: 'units_diff',
			renderer: function (v, metaData, record) {
				if (record.data.units_diff === '')
					return '-';
				return this.formatTime(record.data.units_diff);
			},
//			renderer: function(v, metaData, record) { 
//				if(record.data.units_budget==='')return '-';
//				var remaining = record.data.units_budget-record.data.duration;
//				if(remaining<0)
//					metaData.attr = 'style="color:red;"';
//				return this.formatTime(remaining); 
//			},
			scope: this,
			sortable: true,
			align: 'right',
			width: dp(120)
		}, {
			header: t("Days"),
			dataIndex: 'days',
			sortable: true,
			align: 'right',
			width: dp(70)
		}];

	if(GO.settings.modules.projects2.permission_level >= GO.permissionLevels.manage)
	{
		config.columns.splice(config.columns.length, 0, {
			header: t("Internal fee", "projects2"),
			dataIndex: 'int_fee_value',
			renderer: function (v, metaData, record) {
				return this.formatCurrency(v);
			},
			scope: this,
			sortable: true,
			align: 'right',
			width: dp(100)
		}, {
			header: t("External fee", "projects2"),
			dataIndex: 'ext_fee_value',
			renderer: function (v, metaData, record) {
				return this.formatCurrency(v);
			},
			scope: this,
			sortable: true,
			align: 'right',
			width: dp(100)
		}
		/*, {
		 header: t("Expenses", "projects2"),
		 dataIndex: 'expenses',
		 renderer: function(v, metaData, record) { return this.formatCurrency(v);  },
		 scope:  this,
		 sortable: true,
		 align: 'right',
		 width: 70
		 }, {
		 header: t("Income", "projects2"),
		 dataIndex: 'income',
		 renderer: function(v, metaData, record) { return this.formatCurrency(v);  },
		 scope:  this,
		 sortable: true,
		 align: 'right',
		 width: 70
		 }*/, {
			header: t("Profit", "projects2"),
			dataIndex: 'profit',
			renderer: function (v, metaData, record) {
				return this.formatCurrency(record.data.ext_fee_value - record.data.int_fee_value);
			},
			scope: this,

			sortable: true,
			align: 'right',
			width: dp(100)
		});
	}

	config.view = new Ext.grid.GridView({
		emptyText: t("There's no data to show", "projects2")
	});

	config.autoExpandColumn = 'name';
	config.sm = new Ext.grid.RowSelectionModel();
	config.loadMask = true;

	var now = new Date();
	var lastMonth = now.add(Date.MONTH, -1);
	var startOfLastMonth = lastMonth.getFirstDateOfMonth();
	var endOfLastMonth = lastMonth.getLastDateOfMonth();

	config.tbar = {
		xtype: 'container',
		items: [{
				xtype: 'toolbar',
				items: [this.groupBy = new Ext.form.ComboBox({
						width: 100,
						fieldLabel: t("Group hours by", "projects2"),
						hiddenName: 'group_by',
						store: new Ext.data.SimpleStore({
							fields: ['value', 'text'],
							data: [
								['project_id', t("Projects", "projects2")],
								['user_id', t("Users")]
							]

						}),
						value: 'project_id',
						valueField: 'value',
						displayField: 'text',
						mode: 'local',
						triggerAction: 'all',
						editable: false,
						selectOnFocus: true,
						forceSelection: true
					}),
					this.selectUser = new GO.projects2.SelectEmployee({startBlank: true, width: 250, allowBlank: true}),
					this.searchField = new Ext.form.TextField({
						emptyText: t("Search"),
						name: 'query',
						width: dp(140)
					}),{
						text: t("Apply", "pr2analyzer"),
						handler: function () {
							if (this.groupBy.getValue() == 'project_id') {
								this.getColumnModel().setHidden(this.pathColumn.id, false);
							} else {
								this.getColumnModel().setHidden(this.pathColumn.id, true);
							}

							this.loadReport();
						},
						scope: this
					}, '-', {
						text: t("Export"),
						scope: this,
						handler: function () {
							this.exportReport();
						}
					}]
			}, {
				xtype: 'toolbar',
				items: [{
						text: '&larr;',
						style: {marginRight: 0},
						handler: function () {
							this.changeMonth(-1);
						},
						scope: this
					}, this.startDate = new Ext.form.DateField({
						width: dp(140),
						name: 'start_date',
						format: GO.settings['date_format'],
						allowBlank: true,
						fieldLabel: t("Start"),
						value: startOfLastMonth.format(GO.settings.date_format),
						listeners: {
							change: {
								fn: this.setDateInput,
								scope: this
							}
						}
					}), this.endDate = new Ext.form.DateField({
						width: dp(140),
						name: 'end_date',
						format: GO.settings['date_format'],
						allowBlank: true,
						fieldLabel: t("End"),
						value: endOfLastMonth.format(GO.settings.date_format),
						listeners: {
							change: {
								fn: this.setDateInput,
								scope: this
							}
						}
					}), {
						text: '&rarr;',
						handler: function () {
							this.changeMonth(1);
						},
						scope: this
					}]

			}]
	};





	config.listeners = {
		rowdblclick: function (grid, rowClicked, e) {

			if (!this.hoursDialog)
			{
				this.hoursPanel = new GO.pr2analyzer.HoursGrid({border: false, reportGrid: this});

				this.hoursDialog = new Ext.Window({
					title: t("Time tracking", "projects2"),
					width: 600,
					height: 400,
					layout: 'fit',
					items: this.hoursPanel,
					stateId: 'pr2a-report-hours-dialog',
					closeAction: 'hide',
					buttons: [{
							text: t("Close"),
							handler: function () {
								this.hoursDialog.hide();
								this.store.reload();
							},
							scope: this
						}
					]
				});
			}

			var selModel = grid.getSelectionModel();
			var record = selModel.getSelected();
			if (record.data[this.store.baseParams.group_by])
			{
				this.hoursPanel.store.baseParams.start_date = this.store.baseParams.start_date;
				this.hoursPanel.store.baseParams.end_date = this.store.baseParams.end_date;
				this.hoursPanel.store.baseParams.user_id = this.store.baseParams.user_id;
//				this.hoursPanel.store.baseParams.query = this.store.baseParams.query;

				this.hoursPanel.store.baseParams[this.store.baseParams.group_by] = record.data[this.store.baseParams.group_by];
				this.hoursPanel.store.load();

				this.hoursDialog.show();
			}

		},
		scope: this
	};

	GO.pr2analyzer.ReportGrid.superclass.constructor.call(this, config);

};

Ext.extend(GO.pr2analyzer.ReportGrid, GO.grid.GridPanel, {
	changeMonth: function (increment)
	{
		var date = this.startDate.getValue();
		date = date.add(Date.MONTH, increment);
		this.startDate.setValue(date.getFirstDateOfMonth().format(GO.settings.date_format));
		this.endDate.setValue(date.getLastDateOfMonth().format(GO.settings.date_format));

		this.loadReport();
	}
	, exportReport: function () {
		var params = {};
		for (var paramName in this.store.baseParams) {
			params[paramName] = this.store.baseParams[paramName];
		}
		if(this.store.sortInfo) {
			if (this.store.sortInfo.field) {
				params['sort'] = this.store.sortInfo.field
			}
			if (this.store.sortInfo.direction) {
				params['dir'] = this.store.sortInfo.direction
			}
		}
		params['export'] = 1;
		delete params['limit'];
		window.open(GO.url('Pr2analyzer/time/report', params));
	}
	, loadReport: function () {
		this.store.baseParams.group_by = this.groupBy.getValue();
		this.store.baseParams.user_id = this.selectUser.getValue();

		var startDate = this.startDate.getValue();
		var endDate = this.endDate.getValue();

		this.store.baseParams.query = this.searchField.getValue();
		this.store.baseParams.start_date = startDate ? startDate.format(GO.settings.date_format) : '';
		this.store.baseParams.end_date = endDate ? endDate.format(GO.settings.date_format) : '';
		this.store.load();

//		if(this.printDialog)
//		{
//			this.printDialog.setValues(this.groupBy.getValue(), this.selectUser.getValue(), this.startDate.getRawValue(), this.endDate.getRawValue(), this.reportGrid.getColumnModel());
//		}
	}
	, afterRender: function () {

		this.loadReport();

		GO.pr2analyzer.ReportGrid.superclass.afterRender.call(this);
	}
	, onShow: function () {
		GO.pr2analyzer.ReportGrid.superclass.onShow.call(this);

		if (!this.reportGrid.store.loaded)
			this.loadReport();
	}
	, formatTime: function (totalMinutes) {
		totalMinutes = GO.util.unlocalizeNumber(totalMinutes);
		var prefix = '';
		if (totalMinutes < 0) { //negative time
			totalMinutes = 0 - totalMinutes;
			prefix = '-';
		}

		var time = GO.util.unlocalizeNumber(totalMinutes); //needed because default SUM summary will localize the number and formating to time wont work
		var hours = Math.floor(time / 60);
		var minutes = time % 60;
		minutes = (minutes < 10) ? "0" + minutes : minutes;
		return prefix + hours + ':' + minutes;
	}
	, formatCurrency: function (value) {
		return GO.settings.currency + ' ' + parseFloat(Math.round(value * 100) / 100).toFixed(2);
	}
});
