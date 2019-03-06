GO.workflow.PropertiesDialog = function(config){
	
	if(!config)
	{
		config={};
	}
		
	this.processGrid = new GO.workflow.ProcessGrid();
	
  this.tabPanel = new Ext.TabPanel({
    activeTab:0,
    border:false,
    items:[this.processGrid]
  });

	config.maximizable=true;
	config.layout='fit';
	config.modal=false;
	config.resizable=true;
	config.width=600;
	config.height=400;
	config.closeAction='hide';
	config.title= t("Properties", "workflow");					
	config.items= this.tabPanel;
	config.buttons=[{
			text: t("Close"),
			handler: function(){				
				this.hide();				
			},
			scope:this
		}					
	];
	
	GO.workflow.PropertiesDialog.superclass.constructor.call(this, config);
}

Ext.extend(GO.workflow.PropertiesDialog, GO.Window,{

});
