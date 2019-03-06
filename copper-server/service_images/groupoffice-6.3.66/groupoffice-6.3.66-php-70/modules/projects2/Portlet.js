GO.projects2.SimpleProjectsPanel = function(config)
	{
		if(!config)
		{
			config = {};
		}

		config.id='su-projects-grid';
		
		var projectFields = {
			fields: ['id', 'name', 'status_name', 'responsible_user_name', 'customer', 'due_time', 'units_budget','type','ctime','mtime','contact', 'icon','path'],
			columns:[
		{
			header:'ID',
			dataIndex: 'id',
			hidden:true,
			sortable:true,
			width:50
		},{
			header: t("Name"),
			dataIndex: 'name',
			sortable: true,
			hideable: true,
			id: 'name'
		},{
			id:'project-portlet-name-col',
			header:t("Path", "projects2"),
			dataIndex: 'path',
			renderer:function(value, p, record){
				if(!GO.util.empty(record.data.description))
				{
					p.attr = 'ext:qtip="'+Ext.util.Format.htmlEncode(record.data.description)+'"';
				}
				return value;
			},
			sortable:true
		},{
			header:t("Customer", "projects2"),
			dataIndex: 'customer',
			sortable:true,
			width:150
		},{
			header:t("Manager", "projects2"),
			dataIndex: 'responsible_user_name',
			sortable:false,
			width:150
		},{
			header:t("Status", "projects2"),
			dataIndex: 'status_name',
			sortable:true,
			width:100
		},{
			header:t("Due at", "projects2"),
			dataIndex: 'due_time',
			sortable:true,
			width:80
		},{
			header:t("Budgeted units", "projects2"),
			dataIndex: 'units_budget',
			sortable:true,
			width:100
		},{
			header:t("Contact", "projects2"),
			dataIndex: 'contact',
			sortable:true,
			hidden:true,
			width:150
		},{
			header:t("Permission type", "projects2"),
			dataIndex: 'type',
			sortable:true,
			hidden:true,
			width:80
		},{
			header: t("Modified at"),
			dataIndex:'mtime',
			hidden:true,
			width: dp(140),
			sortable:true
		},{
			header: t("Created at"),
			dataIndex:'ctime',
			hidden:true,
			width: dp(140),
			sortable:true
		}]
		};
		
		if(go.Modules.isAvailable("core", "customfields"))
			GO.customfields.addColumns("GO\\Projects2\\Model\\Project", projectFields);

		var reader = new Ext.data.JsonReader({
			root: 'results',
			totalProperty: 'total',
			fields:projectFields.fields,
			id: 'id'
		});

		config.store = new Ext.data.GroupingStore({
			url: GO.url("projects2/project/store"),
			baseParams: {
				'portlet':true				
			},
			reader: reader,
			sortInfo: {
				field: 'due_time',
				direction: 'ASC'
			},
			groupField: 'status_name',
			remoteGroup:true,
			remoteSort:true
		});

		config.store.on('load', function(){
			//do layout on Startpage
			if(this.rendered)
				this.ownerCt.ownerCt.ownerCt.doLayout();
		}, this);


		config.paging=false,

		config.autoExpandColumn='project-portlet-name-col';
		config.autoExpandMax=2500;
		config.columns=projectFields.columns;
		config.view=new Ext.grid.GroupingView({
//			scrollOffset: 2,
			hideGroupedColumn:true,
			emptyText: t("noproject", "projects2")

		}),
		config.sm=new Ext.grid.RowSelectionModel();
		config.loadMask=true;

		config.paging=true;


		GO.projects2.SimpleProjectsPanel.superclass.constructor.call(this, config);
		
		
		this.portletConfigWindow = new GO.Window({
			layout: 'border',
			title:t("Statuses", "projects2"),
			modal:false,
			height:400,
			width:600,
			closeAction:'hide',
			items: [
				this.multiselectPanel = new GO.base.model.multiselect.panel({
					region: 'center',
					url:'projects2/portlet',
					columns:[{ header: t("Name"), dataIndex: 'name', sortable: true }],
					fields:['id','name'],
					model_id:GO.settings.user_id
				}),
				new Ext.form.FormPanel({
					region: 'south',
					height: 40,
					items: [
						this.showMineOnlyCheckbox = new Ext.ux.form.XCheckbox({
							boxLabel: t("Show my own", "projects2"),
							labelSeparator: '',
							name: 'showMineOnly',
//							allowBlank: true,
							hideLabel: true,
							handler:  function() {
								GO.request({
									url: 'projects2/portletConfig/saveShowMineOnly',
									params:{
										value: this.getValue()
									}
								})
							}
						}),
						this.showMineWorkCheckbox = new Ext.ux.form.XCheckbox({
							boxLabel: t("Show my work", "projects2"),
							labelSeparator: '',
							name: 'showMineWork',
//							allowBlank: true,
							hideLabel: true,
							handler:  function() {
								GO.request({
									url: 'projects2/portletConfig/saveShowMineWork',
									params:{
										value: this.getValue()
									}
								})
							}

						})
					]
				})
			],
			listeners:{
				hide:function(){
					this.store.reload();
				},
				show: function() {
					this.multiselectPanel.store.load();
					GO.request({
						url: 'projects2/portletConfig/loadShowMineOnly',
						params:{},
						success: function(response, options, result){

							this.showMineOnlyCheckbox.setValue(result['value'])
						},
						scope: this
					});
				},
				scope:this
			},
			buttons: [		
				{
					text: t("Close"),
					handler: function(){
						this.portletConfigWindow.hide();
					},
					scope: this
				}
			]
		})

	};

Ext.extend(GO.projects2.SimpleProjectsPanel, GO.grid.GridPanel, {

	saveListenerAdded : false,
	
	afterRender : function()
	{
		this.store.load();
		GO.projects2.SimpleProjectsPanel.superclass.afterRender.call(this);
		this.on("rowclick", function(grid, rowClicked, e){
			go.Router.goto("#project/" + grid.selModel.selections.keys[0]);	
		}, this);
		
		this.portletConfigWindow.on('show', function() {
						this.multiselectPanel.store.load();
						GO.request({
							url: 'projects2/portletConfig/loadShowMineOnly',
							params:{},
							success: function(response, options, result){

								this.showMineOnlyCheckbox.setValue(result['value'])
							},
							scope: this
						});
						GO.request({
							url: 'projects2/portletConfig/loadShowMineWork',
							params:{},
							success: function(response, options, result){

								this.showMineWorkCheckbox.setValue(result['value'])
							},
							scope: this
						});
					}, this);

	}
});


GO.mainLayout.onReady(function(){
	if(go.Modules.isAvailable("legacy", "summary") && go.Modules.isAvailable("legacy", "projects2"))
	{
		this.projectsGrid = new GO.projects2.SimpleProjectsPanel();

		GO.summary.portlets['portlet-projects']=new GO.summary.Portlet({
			id: 'portlet-projects',
			//iconCls: 'go-module-icon-projects',
			title: t("Projects", "projects2"),
			layout:'fit',
			height:400,
			items: this.projectsGrid,
			tools: [{
				id: 'gear',
				
				handler: function(){
					
					this.projectsGrid.portletConfigWindow.show();
					
				},
				scope: this
			},{
				id:'close',
				handler: function(e, target, panel){
					panel.removePortlet();
				}
			}]
		});
	}
});
