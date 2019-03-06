GO.calendar.ResourcesGrid = function(config){

	if(!config)
	{
		config = {};
	}

	config.title = t("Resources", "calendar");
	config.layout='fit';
	config.autoScroll=true;
	config.split=true;
	config.paging=true;

	var columnModel =  new Ext.grid.ColumnModel([
	{
		header:t("Name"),
		dataIndex: 'name',
		id:'name',
		sortable:true
	},{
		header:t("Group", "calendar"),
		dataIndex: 'group_name',
		id:'group_name',
		hidden:true
	}]);

	config.cm=columnModel;
	config.view=new Ext.grid.GroupingView({
		autoFill: true,
		forceFit:true,
		groupTextTpl: '{text}',
		emptyText: t("No items to display")
	});

	config.sm=new Ext.grid.RowSelectionModel();
	config.loadMask=true;

	config.tbar=[{
		iconCls: 'btn-add',
		text: t("Add"),
		disabled: !GO.settings.modules.calendar.write_permission,
		cls: 'x-btn-text-icon',
		handler: function(){
			GO.calendar.calendarDialog.show(0, true);
		},
		scope: this
	},{
		iconCls: 'btn-delete',
		disabled: !GO.settings.modules.calendar.write_permission,
		text: t("Delete"),
		cls: 'x-btn-text-icon',
		handler: function(){
			this.deleteSelected();
		},
		scope:this
	},
	'-'
	,
		this.searchField = new GO.form.SearchField({
			store: config.store,
			width:150,
			emptyText: t("Search")
		})
	];


	GO.calendar.ResourcesGrid.superclass.constructor.call(this, config);

	this.on('rowdblclick', function(grid, rowIndex)
	{
		var record = grid.getStore().getAt(rowIndex);
		GO.calendar.calendarDialog.show(record.data.id, true);
	}, this);
    
	this.on('show', function(){
		this.store.load();
	},this, {
		single:true
	});
    
};

Ext.extend(GO.calendar.ResourcesGrid, GO.grid.GridPanel);
