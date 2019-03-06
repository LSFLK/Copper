GO.workflow.SimpleWorkflowPanel = function(config)
	{
		if(!config)
			config = {};
		
		config.id='su-workflow-grid';
		config.store = GO.workflow.portletWorkflowStore;
		config.store.setDefaultSort('days_left', 'asc');
		config.store.on('load', function(){
			//do layout on Startpage
			if(this.rendered)
				this.ownerCt.ownerCt.ownerCt.doLayout();
		}, this);
	
		config.paging=false,
		config.autoExpandMax=2500;
		config.enableColumnHide=false;
		config.enableColumnMove=false;
		config.cm = new Ext.grid.ColumnModel({
				defaults:{
					sortable:true
				},
				columns:[
					{
            header: t("ID", "workflow"),
            dataIndex: 'id',
            sortable: true,
            hidden:true,
            width: 100
          },
					{
            header: t("Model", "workflow"),
            dataIndex: 'localized_name',
            sortable: true,
            hidden:false,
            width: 100
          },
					{
            header: t("Started by", "workflow"),
            dataIndex: 'user_id',
            sortable: true,
            hidden:true,
            width: 100
          },
					{
            header: t("Model type", "workflow"),
            dataIndex: 'model_name',
            sortable: true,
            hidden:true,
            width: 100
          },
					{
            header: t("Model", "workflow"),
            dataIndex: 'model_id',
            sortable: true,
            hidden:true,
            width: 100
          },
					{
            header: t("Name", "workflow"),
            dataIndex: 'name',
            sortable: true,
            hidden:false,
            width: 200
          },
					{
            header: t("Due until", "workflow"),
            dataIndex: 'due_time',
            sortable: true,
            hidden:true,
            width: 100
          },
					{
            header: t("Step", "workflow"),
            dataIndex: 'stepname',
            sortable: true,
            hidden:false,
            width: 200
          },
					{
            header: t("Process", "workflow"),
            dataIndex: 'processname',
            sortable: true,
            hidden:false,
            width: 300
          },
					{
            header: t("Due in (hours)", "workflow"),
            dataIndex: 'due_in',
            sortable: true,
            hidden:false,
            width: 100
          },
					{
            header: t("Time running", "workflow"),
            dataIndex: 'time_running',
            sortable: false,
            hidden:true,
            width: 100
          },
					{
            header: t("Progress", "workflow"),
            dataIndex: 'progress',
            sortable: true,
            hidden:true,
            width: 100
          },
					{
            header: t("Time remained", "workflow"),
            dataIndex: 'time_remaining',
            sortable: false,
            hidden:true,
            width: 100
          },
					{
            header: t("Hours left", "workflow"),
            dataIndex: 'days_left',
            sortable: true,
            hidden:true,
            width: 100,
						renderer:function(val){
							if(val < 0){
									return '<span style="color:red;">' + val + '</span>';
							}else if(val > 0 && val < 1){
									return '<span style="color:blue;">' + val + '</span>';
							}
							return val;
						}
          }
        ]
			}),
//		config.sm=new Ext.grid.RowSelectionModel();
		config.loadMask=true;
		config.autoHeight=true;
	
		GO.workflow.SimpleWorkflowPanel.superclass.constructor.call(this, config);
	
	};

Ext.extend(GO.workflow.SimpleWorkflowPanel, GO.grid.GridPanel, {
	
	saveListenerAdded : false,
		
	afterRender : function()
	{
		GO.workflow.SimpleWorkflowPanel.superclass.afterRender.call(this);

		this.on("rowdblclick", function(grid, rowClicked, e){
			var record = grid.getSelectionModel().getSelected();
			GO.workflow.showModel({'model_id':record.data.model_id, 'model_name':record.data.model_name});
		}, this);
			
		Ext.TaskMgr.start({
			run: function(){
				this.store.load();
			},
			scope:this,
			interval:960000
		});
	}
});


GO.mainLayout.onReady(function(){
	if(go.Modules.isAvailable("legacy", "summary") && go.Modules.isAvailable("legacy", "workflow"))
	{
		var workflowGrid = new GO.workflow.SimpleWorkflowPanel();
		
		GO.summary.portlets['portlet-workflow']=new GO.summary.Portlet({
			id: 'portlet-workflow',
			//iconCls: 'go-module-icon-tasks',
			title: t("Workflow", "workflow"),
			layout:'fit',
			tools: [
//				{
//				id: 'gear',
//				handler: function(){
//					if(!this.selectTasklistsWin)
//					{
//						this.selectTasklistsWin = new GO.base.model.multiselect.dialog({
//							url:'tasks/portlet',
//							columns:[{ header: t("Name"), dataIndex: 'name', sortable: true }],
//							fields:['id','name'],
//							title:t("visibleTasklists", "workflow"),
//							model_id:GO.settings.user_id,
//							listeners:{
//								hide:function(){
//									tasksGrid.store.reload();
//								},
//								scope:this
//							}
//						});
//					}
//					this.selectTasklistsWin.show();
//				}
//			},
			{
				id:'close',
				handler: function(e, target, panel){
					panel.removePortlet();
				}
			}],
			items: workflowGrid,
			autoHeight:true
		});
	}
});
