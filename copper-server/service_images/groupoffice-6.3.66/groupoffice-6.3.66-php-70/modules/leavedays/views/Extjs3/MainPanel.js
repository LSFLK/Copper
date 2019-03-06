GO.leavedays.MainPanel = function (config) {

	if (!config)
	{
		config = {};
	}

	config.layout = 'border';
	config.border = false;

	this.yearsGrid = new GO.grid.GridPanel({
		border: false,
		layout: 'fit',
		title: t("Years", "leavedays"),
		region: 'west',
		width: 100,
		split: true,
		store: new GO.data.JsonStore({
			url: GO.url('leavedays/leaveday/yearsStore'),
			fields: ['year'],
			remoteSort: true
		}),
		cls: 'go-grid3-hide-headers',
//			autoScroll:true,
		columns: [{
				header: t("Year", "leavedays"),
				dataIndex: 'year',
				id: 'year',
				width: 100
			}],
		view: new Ext.grid.GridView({
			forceFit: true,
			autoFill: true
		}),
		sm: new Ext.grid.RowSelectionModel({singleSelect: true})
	});


	if (GO.leavedays.currentUserIsManager) {

		this.yearsGrid.getSelectionModel().on('rowselect', function (rowSelectionModel, rowIndex, event) {
			var record = rowSelectionModel.getSelected();
			this._setYear(record.data['year']);
			this._setUserId(GO.settings.user_id);
			this.userPanel.show({user_name: ''});
		}, this);

		var isManager = GO.settings.modules.leavedays.write_permission;
		var tbarItems = [{
				iconCls: 'ic-add',
				text: t("Add"),
				hidden: !isManager,
				handler: function () {
					if (!GO.leavedays.yearCreditDialog) {
						GO.leavedays.yearCreditDialog = new GO.leavedays.YearCreditDialog();
						GO.leavedays.yearCreditDialog.on('save', function () {
							this.yearSummaryGrid.store.load();
						}, this);
					}
					var yearRecord = this.yearsGrid.getSelectionModel().getSelected();

					GO.leavedays.yearCreditDialog.show(0, {
						loadParams: {
							year: yearRecord.data['year']
						}
					});
				},
				scope: this
			}, {
				iconCls: 'ic-delete',
				tooltip: t("Delete"),
				hidden: !isManager,
				handler: function () {
					this.yearSummaryGrid.deleteSelected({
						callback: function () {
							GO.leavedays.activeUserId = 0;
							this.userPanel.show({empty: true});
						},
						scope: this
					});
				},
				scope: this
			},
			{xtype: 'tbseparator',hidden: !isManager},
			{
				iconCls:'ic-settings',
				tooltip: t("Administration"),
				hidden: !isManager,
				handler: function () {
					if(!this.settingsDialog) {
						this.settingsDialog = new GO.leavedays.SettingsDialog();
						
						this.settingsDialog.on('hide', function () {
							this.loadConfig();
						}, this);
						
					}
					
					this.settingsDialog.show();
					},
				scope: this
			},{
				iconCls: 'ic-content-copy',
				text: t("Copy last year's credits", "leavedays"),
				hidden: !isManager,
				handler: function () {
					var currentYear = GO.leavedays.activeYear;
					var previousYear = currentYear - 1;
					Ext.Msg.show({
						title: t("Copy last year's credits", "leavedays"),
//						icon: Ext.MessageBox.WARNING,
						msg: t("This will copy all the credits from %y1 to %y2, overwriting credits of %y2. Continue?", "leavedays").replace('%y1', previousYear).replace('%y2', currentYear).replace('%y2', currentYear),
						buttons: Ext.Msg.YESNO,
						scope: this,
						fn: function (btn) {
							if (btn == 'yes') {
								GO.request({
									timeout: 300000,
									maskEl: Ext.getBody(),
									url: 'leavedays/leaveday/copyLastYearCredits',
									params: {
										current_year: GO.leavedays.activeYear
									},
									success: function () {
										this.yearSummaryGrid.store.load();
									},
									scope: this
								});
							}
						}
					});
				},
				scope: this
			},
			{xtype: 'tbseparator',hidden: !isManager},
			{
				iconCls: 'ic-import-export',
				text: t("Export"),
				handler: function () {
					window.open(GO.url('leavedays/yearCredit/exportCsv', {'year': GO.leavedays.activeYear}));
				}
			}, {
				iconCls: 'ic-import-export',
				text: t("Month View", "leavedays"),
				handler: function () {
					if (!this.monthView) {
						this.monthView = new GO.leavedays.MonthWindow();
					}
					this.monthView.show(this.yearsGrid.getSelectionModel().getSelected().data.year);
				},
				scope: this
			}
		];

		this.yearSummaryGrid = new GO.grid.GridPanel({
			stateId: 'leavedays_year_summary_grid',
			border: false,
			layout: 'fit',
			region: 'center',
			paging: true,
			store: new GO.data.JsonStore({
				url: GO.url('leavedays/leaveday/yearSummaryStore'),
				fields: ['id', 'year', 'user_id', 'manager_user_id', 'manager_user_name', 'need_approve', 'user_name', 'leftover', 'year_credit', 'whole_year_credit', 'built_up_credit', 'credits_used', 'n_nat_holiday_hours'],
				remoteSort: true
			}),
			columns: [
				{
					header: t("Employee", "leavedays"),
					dataIndex: 'user_name',
					id: 'user_name',
					width: 200,
					renderer: function (v, m, record) {
						
						if (record.get('need_approve'))
							return '<b>' + v + '</b>';
						return v;
					},
					sortable: true,
					hideable: false
				}],
			sm: new Ext.grid.RowSelectionModel({singleSelect: true}),
			tbar: {enableOverflow:true,items:tbarItems}
		});

		this.userPanel = new GO.leavedays.UserPanel({region: 'east', split: true});
		config.items = [
			this.yearsGrid,
			this.yearSummaryGrid,
			this.userPanel
		];

		this.yearSummaryGrid.on('delayedrowselect', function (grid, rowIndex, event) {
			
			var summaryRecord = grid.store.getAt(rowIndex);
			this._setUserId(summaryRecord.data['user_id']);
			this.userPanel.show({user_name: summaryRecord.data['user_name']});
			
		}, this);



		this.yearSummaryGrid.on('rowdblclick', function (grid, rowIndex, event) {
			
			var record = grid.store.getAt(rowIndex);

			// if you not the manager you cant edit it
			if(record.get('manager_user_id') != GO.settings.user_id && !GO.settings.modules.leavedays.permission_level >= GO.permissionLevels.manage) {
				return false;
			}

			if (!GO.leavedays.yearCreditDialog) {
				GO.leavedays.yearCreditDialog = new GO.leavedays.YearCreditDialog();
				GO.leavedays.yearCreditDialog.on('save', function () {
					this.yearSummaryGrid.store.load();
				}, this);
			}
			var yearRecord = this.yearsGrid.getSelectionModel().getSelected();

			GO.leavedays.yearCreditDialog.show(record.id, {
				loadParams: {
					year: yearRecord.data['year']
				}
			});

		}, this);


	} else {

		this.yearsGrid.getSelectionModel().on('rowselect', function (rowSelectionModel, rowIndex, event) {

			var record = rowSelectionModel.getSelected();
			this._setUserId(GO.settings.user_id);
			this._setYear(record.data['year']);

			this.userPanel.show({user_name: ''});
		}, this);

		this.userPanel = new GO.leavedays.UserPanel({region: 'center', split: true});
		config.items = [
			this.yearsGrid,
			this.userPanel
		];
	}

	GO.leavedays.MainPanel.superclass.constructor.call(this, config);

	this.on('afterrender', function (panel) {
		this.yearsGrid.store.load();
	}, this);

	this.yearsGrid.store.on('load', function (store, records, options) {
		if (!GO.util.empty(records[1]))
			this.yearsGrid.getSelectionModel().selectRow(1);
		else
			this.yearsGrid.getSelectionModel().selectRow(0);
	}, this);

}

Ext.extend(GO.leavedays.MainPanel, Ext.Panel, {
	
	initComponent: function (userId) {
//		this.loadConfig();
		
		GO.leavedays.MainPanel.superclass.initComponent.call(this);
	},
	
	
	_setUserId: function (userId) {
		GO.leavedays.activeUserId = userId;
	},
	_setYear: function (fullYear) {
		GO.leavedays.activeYear = fullYear;
		if (GO.leavedays.currentUserIsManager) {
			this.yearSummaryGrid.store.baseParams['year'] = fullYear;
			this.loadConfig();
		}
	},
	
	
	loadConfig: function() {
		
		GO.request({
			url: 'leavedays/leaveday/gridConfig',
			params: {
				
			},
			success: function(options, response, result) {
				
				var fields = [];
				var columns = [];
				
				fields.push('id');
				fields.push('user_id');
				fields.push('user_name');
				fields.push('company_name');
				fields.push('need_approve');
				fields.push('manager_user_name');
				fields.push('manager_user_id');
				
				Ext.each(result.data.storeFields, function(item) {
					fields.push(item);
				})
				
				
				columns.push({
					header: t("Employee", "leavedays"),
					dataIndex: 'user_name',
					id: 'user_name',
					width: 200,
					renderer: function (v, m, record) {
						if (record.get('need_approve'))
							return '<b>' + v + '</b>';
						return v;
					},
					sortable: true,
					hideable: false
				});
				
				
				columns.push({
					header: t("Company"),
					dataIndex: 'company_name',
					width: 200,
					renderer: function (v, m, record) {
						if (record.get('need_approve') && v)
							return '<b>' + v + '</b>';
						return v;
					},
					sortable: true,
					hideable: true
				});
				
				columns.push({
					header: t("Manager", "leavedays"),
					dataIndex: 'manager_user_name',
					id: 'manager_user_name',
					width: 200,
					sortable: true,
					hideable: false
				});
				
				Ext.each(result.data.columns, function(item) {
					columns.push(item);
				})
				
				
				var year = this.yearSummaryGrid.store.baseParams['year'];
				
				this.reconfigureYearSummaryGrid(fields, columns);
				
				this.yearSummaryGrid.getStore().on('load', function() {
					if(this.yearSummaryGrid.getStore().getCount()) {
						this.yearSummaryGrid.getSelectionModel().selectRow(0);
					}
				}, this)
				this.yearSummaryGrid.getBottomToolbar().bindStore(this.yearSummaryGrid.getStore());
				
				this.yearSummaryGrid.initStateEvents();
				this.yearSummaryGrid.initState();
				
				this.yearSummaryGrid.store.baseParams['year'] = year;
				this.yearSummaryGrid.store.load();
				
				
			},
			scope: this
		});
		
	},
	
	reconfigureYearSummaryGrid: function(storeFields, columns) {
		this.yearSummaryGrid.reconfigure(
			new GO.data.JsonStore({
				url: GO.url('leavedays/leaveday/yearSummaryStore'),
				fields: storeFields,
				remoteSort: true
			}),
			new Ext.grid.ColumnModel(columns)	
			); 
			
	}
	
	

});



/*
 * This will add the module to the main tabpanel filled with all the modules
 */

GO.moduleManager.addModule('leavedays', GO.leavedays.MainPanel, {
	title: t("Holidays", "leavedays"),
	iconCls: 'go-tab-icon-timeregistration'
});



GO.leavedays.showLeavedayDialog = function (leavedayRecordId, config) {
	if (!GO.leavedays.leavedayDialog) {
		GO.leavedays.leavedayDialog = new GO.leavedays.LeavedayDialog();

	}
	GO.leavedays.leavedayDialog.show(leavedayRecordId, {user_name: this._user_name, loadParams: {user_id: GO.leavedays.activeUserId}});
}
