GO.projects2.MainPanel = function (config) {

	if (!config)
	{
		config = {};
	}

	config.id = config.id || Ext.id();


	/**
	 * This ar the template jobs types !!!
	 */
	var data = [['project', t("Project", "projects2")], ['job', t("Job", "projects2")]];
	if (go.Modules.isAvailable("legacy", "tasks"))
	{
		data.push(['task', t("Task", "tasks")]);
	}


	GO.projects2.templateJobTypesStore = new Ext.data.SimpleStore({
		fields: ['value', 'text'],
		data: data
	});

	this.selectProject = new GO.projects2.SelectProject({
		emptyText: t("Search project", "projects2"),
		hideLabel: true,
		anchor: '100%',
		minListWidth: 600,
		region: 'northdele',
		store: new GO.data.JsonStore({
			url: GO.url('projects2/project/store'),
			fields: ['id', 'path', 'use_tasks_panel'],
			remoteSort: true
		}),
		listeners: {
			select: function (cmb, record) {
				this.project_id = record.id;
				this.tasksPanel.setProjectId(this.project_id, record.data.use_tasks_panel);
				if (this.project_id > 0)
				{
					this.projectPanel.load(this.project_id);
				}
			},
			scope: this
		}
	});

	


	this.treePanel = new GO.projects2.ProjectsTree({
		//		title:t("Projects", "projects2"),
		width: 250,
		split: true,
		autoScroll: true,
		region: 'center',
		border: true
	});

	


	this.treePanel.on('click', function () {
		this.project_id = this.treePanel.project_id;
		this._switchProject(this.project_id)

	}, this);


	this.statusesFilterGrid = new GO.projects2.StatusesFilterGrid({
		region: 'south',
		id: 'pr2-statuses',
		collapsible: true,
		floatable:false,
		height: 250
	});

	this.selectManagerField = new GO.form.SelectUser({
		hiddenName: 'manager_id',
		emptyText: t("Filter on manager", "projects2"),
		startBlank: true,
		hideLabel: true,
		minListWidth: 300,
		allowBlank: true,
		displayField: 'name',
		valueField: 'id',
		anchor: '100%',
		store: new GO.data.JsonStore({
			url: GO.url('projects2/employee/users'),
			root: 'results',
			totalProperty: 'total',
			id: 'id',
			fields: ['id', 'name'],
			remoteSort: true
		}),
		listeners: {
			select: function (cmb, record) {
				// Set the selected manager parameter for the treeloader
				this.treePanel.treeLoader.baseParams.manager_id = record.id;
				this.selectProject.store.baseParams.manager_id = record.id;
				this.selectProject.clearValue();
				this.selectProject.store.reload();
				this.treePanel.rootNode.reload();
			},
			clear: function () {
				// Clear the manager parameter for the treeloader
				this.treePanel.treeLoader.baseParams.manager_id = null;
				this.selectProject.store.baseParams.manager_id = null;
				this.selectProject.store.reload();
				this.treePanel.rootNode.reload();
			},
			scope: this
		}
	});


	var items = [];

	items.push(
		{
			region: 'north',
			autoHeight: true,
			padding: '0px '+dp(8),
			//cls: 'go-form-panel',
			layout: 'form',
			items: [
				this.selectManagerField,
				this.selectProject
			]
		},
		this.treePanel,
		this.statusesFilterGrid
	);

	this.westPanel = new Ext.Panel({
		id: config.id + '-west',
		region: 'west',
		cls: 'go-sidenav',
		layout: 'border',
		split: true,
		width: dp(336),
		items: items
	});


	this.projectPanel = this.projectDetail = new GO.projects2.ProjectPanel({
		region: 'center',
		id: 'pr2-project-panel'
	});
	this.projectPanel.on("fullReload", function (panel) {
		this.refresh();

		this._switchProject(panel.data.parent_project_id);

	}, this);

	this.projectPanel.on('load', function (tp, project_id) {

		this.project_id = project_id;
		this.tasksPanel.setProjectId(project_id, tp.data.use_tasks_panel == 1);

		var node = this.getTreePanel().getNodeById(project_id);

		if (node && node.rendered) {
			this.getTreePanel().getSelectionModel().select(node);
			node.expand();
		}

		if (project_id > 0 && !this.projectPanel.data.write_permission) {
			this.addButton.setDisabled(true);
		} else {
			this.addButton.setDisabled(false);
		}
	}, this);


	
	this.tasksPanel = new GO.projects2.TasksGrid({
		region: 'east',
		width: dp(690),
		id: 'pm-tasks',
		collapsible: true
	});

	this.statusesFilterGrid.on('change', function (grid, statuses, records) {
		this.onChangeStatusesFilterGrid(grid, statuses, records);
	}, this);

	var items = [];

	this.addButton = new Ext.Button({
		iconCls: 'ic-add',
		text: t("Project", "projects2"),
		handler: function () {
			if (GO.projects2.max_projects > 0 && this.store.totalLength >= GO.projects2.max_projects)
			{
				Ext.Msg.alert(t("Error"), t("The maximum number of projects has been reached. Contact your hosting provider to activate unlimited usage of the projects module.", "projects2"));
			} else
			{
				GO.projects2.showProjectDialog({
					parent_project_id: this.project_id
				});
			}
		},
		scope: this
	});
	items.push(this.addButton);

	if (GO.settings.modules.projects2.permission_level == GO.permissionLevels.manage)
	{

		items.push({
			iconCls: 'ic-delete',
			tooltip: t("Delete"),
			handler: function () {
				if (this.project_id && this.project_id != 0) {
					
					if (confirm(t("Are you sure you want to delete '{item}'?").replace('{item}', '#' + this.project_id))) {
						GO.request({
							url: 'projects2/project/delete',
							params: {id: this.project_id},
							scope: this,
							success: function () {
								var selectedNode = this.treePanel.getSelectionModel().getSelectedNode();
								
								if (selectedNode) {
									var parent =  selectedNode.parentNode;
									selectedNode.destroy();
									parent.select();


									this.treePanel.fireEvent('click', parent);
								}
							}
						});
					}
				}
			},
			scope: this
		},"-",{
			iconCls: 'ic-settings',
			tooltip: t("Administration"),
			handler: function () {
				if (!this.settingsDialog)
				{
					this.settingsDialog = new GO.projects2.SettingsDialog();
				}
				this.settingsDialog.show();
			},
			scope: this
		});
	}
	
	items.push({
		iconCls: 'ic-refresh',
		tooltip: t("Refresh"),
		handler: function () {
			this.refresh();
		},
		scope: this
	},'-',
	this.invoiceButton = new Ext.Button({
		iconCls: 'ic-euro-symbol',
		text: t("Financial", "projects2"),
		handler: function () {
			if (!this.invoiceDialog)
				this.invoiceDialog = GO.projects2.invoiceDialog = new GO.projects2.InvoiceDialog();
			this.invoiceDialog.show();
		},
		scope: this
	}),{
		iconCls: 'ic-receipt',
		text: t("Report", "projects2"),
		hidden: GO.settings.modules.projects2.permission_level<GO.projects2.permissionLevelFinance,
		handler: function () {
			if (!this.reportDialog)
			{
				this.reportDialog = new GO.projects2.ReportDialog();
			}
			this.reportDialog.show();
		},
		scope: this
	});

	if (GO.settings.modules.projects2.permission_level == GO.permissionLevels.manage)
	{
		items.push({
			iconCls: 'ic-import-export',
			text: t("Import"),
			handler: function () {
				if (!this.importDialog)
				{
					this.importDialog = new GO.projects2.CsvImportDialog();
				}
				this.importDialog.show();
			},
			scope: this
		});
	}

//	this.addButton = new Ext.Button({
//		iconCls: 'btn-add',
//		text: t("Add project", "projects2"),
//		cls: 'x-btn-text-icon',
//		menu: templateMenu,
//		handler: function() {
//			templateMenu.removeAll();
//			templateMenu.addItem({
//				text: 'Loading...',
//				disabled: true
//			});
//			GO.projects2.templatesStore.load();
//		}
//	});


	//config.tbar = 
	config.items = [
		this.westPanel,
		this.centerPanel = new Ext.Panel({
			region:'center',
			layout: 'border',
			tbar: new Ext.Toolbar({enableOverflow:true,items:items}),
			items: [
				this.tasksPanel,
				this.projectPanel 
			]
		})
	];

	config.border = false;
	config.layout = 'border';
	GO.projects2.MainPanel.superclass.constructor.call(this, config);

//	THIS IS NEW
	this.tasksPanel.on('saved', function (projectId) {
		if (this._saveTaskPanelBeforeLeaving) {
			this.selectProject.reset();
			if (projectId > 0)
			{
				this.projectPanel.load(projectId);
			} else
			{
				this.projectPanel.reset();
			}
			this._saveTaskPanelBeforeLeaving = false;
		}
	}, this);

	this.on('show', function () {
		this.statusesFilterGrid.store.load();
	}, this);
};

Ext.extend(GO.projects2.MainPanel, Ext.Panel, {

	project_id: 0,

	_saveTaskPanelBeforeLeaving: false,

	// passthrough for compatibility with modules 
	getTopToolbar: function() {
		return this.centerPanel.getTopToolbar();
	},

	refresh: function () {
//		this.filterPanel.store.load();
//		this.projectsView.projectsPanel.store.load();
		this.getTreePanel().rootNode.reload();
	},

	onChangeStatusesFilterGrid: function (grid, statuses, records) {
		this.getTreePanel().treeLoader.baseParams.pr2_statuses = Ext.encode(statuses);
		//var node = this.getTreePanel().getNodeById(this.project_id) || this.getTreePanel().getRootNode();
		this.getTreePanel().getRootNode().reload();

	},

	getTreePanel: function () {
		return this.treePanel;
	},

	afterRender: function () {

		GO.projects2.MainPanel.superclass.afterRender.call(this);
//		this.filterPanel.store.load();

		GO.dialogListeners.add('project', {
			scope: this,
			save: function (e, project_id, parent_project_id) {
//				this.projectsView.projectsPanel.store.reload();
//				this.getTreePanel().project_id = parent_project_id;
				this.getTreePanel().reloadActiveNode();

			}
		});
	},
	route: function(projectId) {
		this._switchProject(projectId);
	},
	_switchProject: function (projectId) {

		if (!this.tasksPanel.isDirty()) {
			this.selectProject.reset();

			if (projectId > 0) {
				this.projectPanel.load(projectId);
			} else {
				this.projectPanel.reset();

				// Disable the "Add project" button when the root node is clicked and the user doesn't have manage permissions on the project2 module.
				if (!GO.settings.modules.projects2.write_permission) {
					this.addButton.setDisabled(true);
				} else {
					this.addButton.setDisabled(false);
				}
			}
		} else {
			Ext.Msg.show({
				title: t("Save job changes before leaving?", "projects2"),
				msg: t("There are unsaved changes in the project jobs. Do you want to save them before switching to another project? If you click No, unsaved changes will be lost. If you click Cancel, we will stay at the current project.", "projects2"),
				buttons: Ext.Msg.YESNOCANCEL,
				scope: this,
				fn: function (btn) {
					if (btn == 'no') {
						this.selectProject.reset();

						if (projectId > 0)
						{
							this.projectPanel.load(projectId);
						} else
						{
							this.projectPanel.reset();
						}
					} else if (btn == 'yes') {
						this._saveTaskPanelBeforeLeaving = true;
						this.tasksPanel.save(projectId);
					}
				}
			});
		}

	}

});

GO.projects2.showProjectDialog = function (config) {
	if (!GO.projects2.projectDialog)
		GO.projects2.projectDialog = new GO.projects2.ProjectDialog();



	GO.projects2.projectDialog.show(config);
};

/**
 * Open the projects2 tab and select the given project
 * 
 * @param int id The project id
 */
GO.projects2.openProjectTab = function (id) {
	GO.mainLayout.openModule('projects2');

	var pr2Panel = GO.mainLayout.getModulePanel('projects2');
	pr2Panel._switchProject(id);
};



go.Modules.register("legacy", 'projects2', {
	mainPanel: GO.projects2.MainPanel,
	title: t("Projects", "projects2"),
	iconCls: 'go-tab-icon-projects',
	entities: [{
			name: "Project",			
			linkWindow: function() {
				var win = new GO.projects2.ProjectDialog();
				win.closeAction = "close";
				return win;
			},
			linkDetail: function() {
				return new GO.projects2.ProjectPanel();
			}	
	}]
});

GO.projects2.permissionLevelFinance = 45;

