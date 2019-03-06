GO.projects2.SubProjectsGrid = Ext.extend(GO.grid.GridPanel, {

	initComponent: function () {


		var subProjectFields = {
			fields: ['id', 'name', 'reference_no', 'status_name', 'user_name', 'type_name', 'template_name', 'responsible_user_name', 'icon', 'start_time', 'due_time', 'customer_name', 'contact'],
			columns: [{
					header: '',
					dataIndex: 'icon',
					xtype: 'iconcolumn'
				}, {
					header: 'ID',
					dataIndex: 'id',
					id: 'id',
					width: 50,
					hidden: true
				}, {
					header: t("Name"),
					dataIndex: 'name',
					id: 'name',
					width: 150
				}, {
					header: t("Reference no.", "projects2"),
					dataIndex: 'reference_no',
					id: 'reference_no',
					width: 150,
					hidden: true
				}, {
					header: t("Status", "projects2"),
					dataIndex: 'status_name',
					id: 'status_name',
					width: 100
				}, {
					header: t("Start time", "projects2"),
					dataIndex: 'start_time',
					id: 'start_time',
					width: 100,
					scope: this,
					hidden: true
				}, {
					header: t("Due at", "projects2"),
					dataIndex: 'due_time',
					id: 'due_time',
					width: 100,
//					renderer: function (value, metaData, record) {
//						return '<span class="' + this.projectPanel.templateConfig.getClass(record.data) + '">' + value + '</span>';
//					},
					scope: this
				}, {
					header: t("User"),
					dataIndex: 'user_name',
					id: 'user_name',
					width: 150,
					sortable: false,
					hidden: true
				}, {
					header: t("Permission type", "projects2"),
					dataIndex: 'type_name',
					id: 'type_name',
					width: 80,
					hidden: true
				}, {
					header: t("Template", "projects2"),
					dataIndex: 'template_name',
					id: 'template_name',
					width: 80,
					hidden: true
				}, {
					header: t("Manager", "projects2"),
					dataIndex: 'responsible_user_name',
					id: 'responsible_user_name',
					width: 120,
					sortable: false,
					hidden: true
				}, {
					header: t("Customer", "projects2"),
					dataIndex: 'customer_name',
					id: 'customer_name',
					width: 150,
					sortable: false
				}, {
					header: t("Contact", "projects2"),
					dataIndex: 'contact',
					id: 'contact',
					width: 120,
					sortable: false,
					hidden: true
				}]
		}


		if (go.Modules.isAvailable("core", "customfields"))
			GO.customfields.addColumns("GO\\Projects2\\Model\\Project", subProjectFields);

//		var exportBtn = new GO.base.ExportMenu({className: 'GO\\Projects2\\Export\\CurrentGrid'});
//		exportBtn.iconCls = null;
		

		this.store = new GO.data.JsonStore({
			url: GO.url('projects2/project/store'),
			baseParams: {
				parent_project_id: 0
			},
			root: 'results',
			totalProperty: 'total',
			id: 'id',
			fields: subProjectFields.fields,
			remoteSort: true
		});

		Ext.apply(this, {
//			tbar: [exportBtn,
//				this.searchField = new GO.form.SearchField({
//					store: this.store,
//					width: 120,
//					emptyText: t("Search")
//				}),
//				this.showMineOnlyField = new Ext.form.Checkbox({
//					boxLabel: t("Show my projects only", "projects2"),
//					labelSeparator: '',
//					name: 'show_mine_only',
//					allowBlank: true,
//					ctCls: 'apr-show-mine-only-cb'
//				})],
//			autoExpandColumn: 'name',
			border: false,
			autoHeight: true,
			title: t("Sub projects", "projects2"),
			enableDragDrop: true,
			ddGroup: 'ProjectsDD',
			id: 'pr2-sub-projects',
			split: true,
			autoScroll: true,
//			paging: true,
			cm: new Ext.grid.ColumnModel({
				defaultSortable: true,
				columns: subProjectFields.columns

			}),
			scope: this
		});

		GO.projects2.SubProjectsGrid.superclass.initComponent.call(this);
		
		
//		exportBtn.setColumnModel(this.getColumnModel());
		
//		
//		this.store.on('load', function (store, records, options) {
//			this.showMineOnlyField.setValue(!GO.util.empty(store.reader.jsonData.showMineOnly));
//		}, this);
//
//		this.showMineOnlyField.on('check', function (checkBox, checked) {
//			this.store.baseParams.showMineOnly = checked;
//			//this.getTreePanel().getRootNode().reload();
//			this.store.load();
//			delete this.store.baseParams.showMineOnly;
//			//delete this.getTreePanel().treeLoader.baseParams.showMineOnly;
//		}, this);
	
	}

});
