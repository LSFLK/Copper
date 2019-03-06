GO.workflow.WorkflowGrid = Ext.extend(GO.grid.GridPanel,{
	changed : false,
	
  
	initComponent : function(){
		
    this.searchField = new GO.form.SearchField({
      store: GO.workflow.workflowStore,
      width:320
    });
    
		Ext.apply(this,{
			standardTbar:false,
			standardTbarDisabled:!GO.settings.modules.workflow.write_permission,
			store: GO.workflow.workflowStore,
			border: false,
      tbar: [{
		xtype:'deletebutton',
		ignoreButtonParams : true,
		grid:this.workflowGrid,
		handler: function(){
			this.workflowGrid.deleteSelected();
		},
		disabled: false,
		scope: this
	},{
		iconCls: 'ic-settings',
		text: t("Administration"),
		cls: 'x-btn-text-icon',
		handler: function(){
			if(!this.propertiesDialog){
				this.propertiesDialog = new GO.workflow.PropertiesDialog();
			}
			this.propertiesDialog.show();

		},
		scope: this

	},
	'->',
	{xtype:'tbsearch',store: GO.workflow.workflowStore}],
			paging:true,
			view:new Ext.grid.GridView({
				autoFill: true,
				forceFit: true,
				emptyText: t("No items to display")		
			}),
			cm:new Ext.grid.ColumnModel({
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
            dataIndex: 'entity',
            sortable: true,
            hidden:false,
            width: 100,
						renderer: function(v) {
							return t(v, go.Entities.get(v).module);
						}
          },
					{
            header: t("Started by", "workflow"),
            dataIndex: 'user_id',
            sortable: false,
            hidden:false,
            width: 100
          },
//					{
//            header: t("Model type", "workflow"),
//            dataIndex: 'model_name',
//            sortable: true,
//            hidden:true,
//            width: 100
//          },
//					{
//            header: t("Model", "workflow"),
//            dataIndex: 'model_id',
//            sortable: true,
//            hidden:true,
//            width: 100
//          },
					{
            header: t("Name", "workflow"),
            dataIndex: 'name',
            sortable: true,
            hidden:false,
            width: 100
          },
					{
            header: t("Due until", "workflow"),
            dataIndex: 'due_time',
            sortable: true,
            hidden:false,
            width: 100
          },
					{
            header: t("Step", "workflow"),
            dataIndex: 'stepname',
            sortable: true,
            hidden:false,
            width: 100
          },
					{
            header: t("Process", "workflow"),
            dataIndex: 'processname',
            sortable: true,
            hidden:false,
            width: 100
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
            sortable: true,
            hidden:false,
            width: 100
          },
					{
            header: t("Progress", "workflow"),
            dataIndex: 'progress',
            sortable: true,
            hidden:false,
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
			})
		});

		GO.workflow.WorkflowGrid.superclass.initComponent.call(this);
	},
	
	dblClick : function(grid, record, rowIndex){
		
		go.Entities.get(record.data.entity).goto(record.data.model_id);
		
		//GO.workflow.showModel({'model_id':record.data.model_id, 'model_name':record.data.model_name});
	},
	
	btnAdd : function(){				
		this.showProcessDialog();	  	
	},
	showProcessDialog : function(id){
		if(!this.processDialog){
			this.processDialog = new GO.workflow.ProcessDialog();

			this.processDialog.on('save', function(){   
				this.store.load();
				this.changed=true;	    			    			
			}, this);	
		}
		this.processDialog.show(id);	  
	},
	deleteSelected : function(){
		GO.workflow.WorkflowGrid.superclass.deleteSelected.call(this);
		this.changed=true;
	}
});
