GO.pr2analyzer.HoursGrid = function(config) {

	

	config = config || {};
	config.store = new GO.data.JsonStore({
		url: GO.url('pr2analyzer/time/entries'),
		root: 'results',
		totalProperty: 'total',
		id: 'id',
		fields: ['id', 'duration', 'user_name', 'date', 'fee_name', 'comments', 'project_name', 'internal_fee', 'external_fee', 'invoice_id', 'payout_invoice_id', 'ctime', 'mtime', 'status'],
		remoteSort: true
	});

	if (config.project_id)
	{
		this.setProjectId(config.project_id);
	}

	config.stateId = 'pr2-hours-table';
	config.paging = true;

	var columns = [
		{
			header: t("Units", "projects2"),
			dataIndex: 'duration',
			renderer: function(v, metaData, record) { return this.reportGrid.formatTime(v);  },
			scope:  this,
			width: 50,
			align: 'right'
		},
		{
			header: t("Project", "projects2"),
			dataIndex: 'project_name',
			width: 120
		},
		{
			header: t("User"),
			dataIndex: 'user_name',
			width: 120,
			sortable: false
		},
		{
			header: t("Date"),
			dataIndex: 'date',
			width: 80
		},
		/*{
			header: t("Fee", "projects2"),
			dataIndex: 'fee_name',
			width: 120
		},*/
		{
			header: t("Created at"),
			dataIndex: 'ctime',
			hidden: true,
			width: dp(140)
		},
		{
			header: t("Modified at"),
			dataIndex: 'mtime',
			hidden: true,
			width: dp(140)
		}
	];

	if (GO.settings.modules.projects2.write_permission)
	{
		columns.splice(columns.length, 0, {
			header: t("Internal fee", "projects2"),
			dataIndex: 'internal_fee',
			sortable: false,
			align: 'right'
		}, {
			header: t("External fee", "projects2"),
			dataIndex: 'external_fee',
			sortable: false,
			align: 'right'
		}/*, {
			header: t("Profit", "projects2"),
			dataIndex: 'profit',
			renderer : function(v, metaData, record) { return '-'; },
			sortable: false,
			align: 'right'
		}, {
			header: t("Invoice ID", "projects2"),
			dataIndex: 'invoice_id',
			sortable: true
		}*/, {
			header: t("Payout invoice ID", "projects2"),
			dataIndex: 'payout_invoice_id',
			sortable: true
		});
	}

	if(go.Modules.isAvailable("legacy", "hoursapproval2")) {
		columns.push({
			header: t("Approved", "hoursapproval2"),
			dataIndex: 'status',
			sortable: true,
			width: 30
		});
	}

	var columnModel = new Ext.grid.ColumnModel({
		defaults: {
			sortable: true
		},
		columns: columns
	});

	config.cm = columnModel;

	config.view = new Ext.grid.GridView({
		emptyText: t("No hours to display", "projects2"),
		enableRowBody: true,
		showPreview: true,
		getRowClass: function(record, rowIndex, p, store) {
			if (this.showPreview) {
				p.body = '<p class="pr2-hours-comments">' + record.data.comments + '</p>';
				return 'x-grid3-row-expanded';
			}
			return 'x-grid3-row-collapsed';
		}
	}),
			config.sm = new Ext.grid.RowSelectionModel();
	config.loadMask = true;

	config.tbar = [{
			iconCls: 'btn-delete',
			text: t("Delete"),
			cls: 'x-btn-text-icon',
			handler: function() {
				this.deleteSelected();
			},
			scope: this
		}/*,{
			iconCls: 'btn-export',
			text: t("Export"),
			scope: this,
			handler: function() {
				if (!this.exportDialog)
				{
					this.exportDialog = new GO.ExportQueryDialog({
						query: 'timeregistration'
					});
				}
				this.exportDialog.show({
					colModel: this.getColumnModel(),
					title: this.ownerCt.title
							//searchQuery: this.centerPanel.searchField.getValue()
				});
			}
		}*/];
	config.listeners = {
		rowdblclick: function(grid, rowClicked, e) {
			if (!this.hoursDialog)
			{
				this.hoursDialog = new GO.projects2.TimeEntryDialog();
				this.hoursDialog.on('save', function() {
					this.store.reload();
				}, this);
			}
			this.hoursDialog.show(grid.selModel.selections.keys[0]);
		},
		show: function() {
			if (this.loaded_project_id != this.project_id)
			{
				this.loaded_project_id = this.project_id;
				this.store.load();
			}
		},
		scope: this
	};

	GO.pr2analyzer.HoursGrid.superclass.constructor.call(this, config);

};

Ext.extend(GO.pr2analyzer.HoursGrid, GO.grid.GridPanel, {
	project_id: 0,
	loaded_project_id: 0,
	setProjectId: function(project_id)
	{
		this.project_id = project_id;
		this.store.baseParams.project_id = project_id;
	}
});
