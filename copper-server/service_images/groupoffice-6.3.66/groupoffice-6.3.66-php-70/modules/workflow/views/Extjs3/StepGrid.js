GO.workflow.StepGrid = Ext.extend(GO.grid.GridPanel,{
	 
	initComponent : function(){
		
    this.searchField = new GO.form.SearchField({
      store: GO.workflow.stepStore,
      width:320
    });
    
		Ext.apply(this,{
			standardTbar:true,
			title:t("Steps", "workflow"),
			standardTbarDisabled:!GO.settings.modules.workflow.write_permission,
			store: GO.workflow.stepStore,
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
          },{
            header: t("Process", "workflow"),
            dataIndex: 'process_id',
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
            header: t("Due in (hours)", "workflow"),
            dataIndex: 'due_in',
            sortable: true,
            hidden:false,
            width: 100
          },
					{
            header: t("Email alert", "workflow"),
            dataIndex: 'email_alert',
            sortable: true,
            hidden:false,
            width: 100
          },
					{
            header: t("Popup alert", "workflow"),
            dataIndex: 'popup_alert',
            sortable: true,
            hidden:false,
            width: 100
          }
        ]
			})
		});

		GO.workflow.StepGrid.superclass.initComponent.call(this);
	},
	
	editDialogClass : GO.workflow.StepDialog
	
});
