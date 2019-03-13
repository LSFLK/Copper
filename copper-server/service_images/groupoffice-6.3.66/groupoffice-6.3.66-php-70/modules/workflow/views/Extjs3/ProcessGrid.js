GO.workflow.ProcessGrid = Ext.extend(GO.grid.GridPanel,{
	changed : false,
	
  
	initComponent : function(){
		
    this.searchField = new GO.form.SearchField({
      store: GO.workflow.processStore,
      width:320
    });
    
		Ext.apply(this,{
			standardTbar:true,
			title:t("Processes", "workflow"),
			standardTbarDisabled:!GO.settings.modules.workflow.write_permission,
			store: GO.workflow.processStore,
			border: false,
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
            header: t("Name", "workflow"),
            dataIndex: 'name',
            sortable: true,
            hidden:false,
            width: 100
          },
					{
            header: t("User", "workflow"),
            dataIndex: 'user_id',
            sortable: true,
            hidden:true,
            width: 100
          },
					{
            header: t("Owner", "workflow"),
            dataIndex: 'user_name',
            sortable: false,
            hidden:false,
            width: 100
          }
        ]
			})
		});

		GO.workflow.ProcessGrid.superclass.initComponent.call(this);
		GO.workflow.processStore.load();	
	},
	
	
	dblClick : function(grid, record, rowIndex){
		this.showProcessDialog(record.id);
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
		GO.workflow.ProcessGrid.superclass.deleteSelected.call(this);
		this.changed=true;
	}
});
