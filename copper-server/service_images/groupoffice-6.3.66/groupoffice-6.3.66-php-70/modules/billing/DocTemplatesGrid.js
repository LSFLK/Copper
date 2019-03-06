GO.billing.DocTemplatesGrid = function(config) {

	if (!config)
	{
		config = {};
	}

	config.title = t("Document templates", "billing");
	config.layout = 'fit';
	config.autoScroll = true;
	config.split = true;
	config.store = GO.billing.docTemplatesStore = new GO.data.JsonStore({
		url: GO.url('billing/docTemplate/store'),
		baseParams: {
			book_id: 0
		},
		root: 'results',
		id: 'id',
		totalProperty: 'total',
		fields: ['id', 'name'],
		remoteSort: true
	});

	config.paging = false;
	var columnModel = new Ext.grid.ColumnModel({
		defaults: {
			sortable: true
		},
		columns: [
			{
				header: t("Name"),
				dataIndex: 'name'
			}
		]
	});

	config.cm = columnModel;

	config.view = new Ext.grid.GridView({
		autoFill: true,
		forceFit: true,
		emptyText: t("No items to display")
	}),
	config.sm = new Ext.grid.RowSelectionModel();
	config.loadMask = true;


	this.templateDialog = new GO.billing.DocTemplateDialog();

	this.templateDialog.on('save', function() {
		this.store.reload();
	}, this);


	config.tbar = [{
			iconCls: 'btn-add',
			text: t("Add"),
			cls: 'x-btn-text-icon',
			handler: function()
			{
				this.templateDialog.show();
				this.templateDialog.formPanel.baseParams.book_id = this.store.baseParams.book_id;
			},
			scope: this
		}, {
			iconCls: 'btn-delete',
			text: t("Delete"),
			cls: 'x-btn-text-icon',
			handler: function()
			{
				this.deleteSelected();
			},
			scope: this
		}, {
			iconCls: 'btn-copy',
			text: t("Copy"),
			cls: 'x-btn-text-icon',
			handler: function()
			{
				this.copySelected();
			},
			scope: this
		}];



	GO.billing.DocTemplatesGrid.superclass.constructor.call(this, config);

	this.on('rowdblclick', function(grid, rowIndex) {
		var record = grid.getStore().getAt(rowIndex);

		this.templateDialog.show(record.data.id);

	}, this);

};

Ext.extend(GO.billing.DocTemplatesGrid, GO.grid.GridPanel, {
	copySelected: function()
	{
		var sm = this.getSelectionModel();
		var record = sm.getSelected();

		if (record)
		{
			GO.request({
				url: 'billing/docTemplate/copy',
				params: {
					id: record['id']
				},
				success:function(){
					this.store.load();
				},
				scope:this
				
			}, this);
			
		} else
		{
			alert(t("You didn't select an item."));
		}
	}
}, this);
