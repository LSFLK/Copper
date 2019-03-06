GO.workflow.MainPanel = function(config){
	
	this.workflowGrid = new GO.workflow.WorkflowGrid({
		region:'center',
		id:'wf-center-panel',
		border:true
	});
	
	this.workflowGrid.store.baseParams['show_required_only'] = Ext.state.Manager.get('wf-showrequiredonly');
	this.workflowGrid.store.baseParams['show_completed'] = Ext.state.Manager.get('wf-showcompleted');
	this.workflowGrid.store.baseParams['show_own_created'] = Ext.state.Manager.get('wf-showowncreated');
	
	
	this.showCompletedCheck = new Ext.form.Checkbox({		
		boxLabel: t("Show completed", "workflow"),
		hideLabel: true,
		checked:GO.workflow.showCompleted=Ext.state.Manager.get('wf-showcompleted')
	});
	
	this.showCompletedCheck.on('check', function(cb, checked){		
		
		var isChecked = checked? '1' : '0';
		this.workflowGrid.store.baseParams['show_completed']=isChecked;
		
		Ext.state.Manager.set('wf-showcompleted', isChecked);
		this.workflowGrid.store.load();
	}, this);
	
	this.showRequiredOnlyCheck = new Ext.form.Checkbox({		
		boxLabel: t("Show my required approvals only", "workflow"),
		hideLabel: true,
		checked:GO.workflow.showRequiredOnly=Ext.state.Manager.get('wf-showrequiredonly')
	});
	
	this.showRequiredOnlyCheck.on('check', function(cb, checked){		
		var isChecked = checked? '1' : '0';
		this.workflowGrid.store.baseParams['show_required_only']=isChecked;
		
		Ext.state.Manager.set('wf-showrequiredonly', isChecked);
		this.workflowGrid.store.load();
	}, this);
	
	this.showOwnCreated = new Ext.form.Checkbox({		
		boxLabel: t("Show created by me only", "workflow"),
		hideLabel: true,
		checked:GO.workflow.showOwnCreated=Ext.state.Manager.get('wf-showowncreated')
	});
	
	this.showOwnCreated.on('check', function(cb, checked){		
		var isChecked = checked? '1' : '0';
		this.workflowGrid.store.baseParams['show_own_created']=isChecked;
		
		Ext.state.Manager.set('wf-showowncreated', isChecked);
		this.workflowGrid.store.load();
	}, this);

	this.filterPanel = new Ext.form.FormPanel({
		title:t("Filter", "workflow"),
		cls:'go-form-panel',
		waitMsgTarget:true,
		region:'west',
		width: 220,
		border:true,
		split:true,
		items: [this.showCompletedCheck,this.showRequiredOnlyCheck,this.showOwnCreated]
	});

	if(!config)
		config = {};

	config.items=[this.filterPanel,this.workflowGrid];	
	config.layout='border';
	GO.workflow.MainPanel.superclass.constructor.call(this, config);	
	
	
	this.on('render', function(){
		this.workflowGrid.store.load();
	}, this);
};

Ext.extend(GO.workflow.MainPanel, Ext.Panel, {

});

go.Modules.register("legacy", 'workflow', {
	mainPanel: GO.workflow.MainPanel,
	title : t("Workflow", "workflow"),
	iconCls : 'go-tab-icon-workflow',
	entities: [{
			name: "Workflow",			
			linkWindow: function(entity, entityId) {
				var modelDialog = new GO.workflow.ModelDialog();
				modelDialog.closeAction = "close";

				modelDialog.addBaseParam('model_id', entityId);
				modelDialog.addBaseParam('model_name', entity);

				modelDialog.show();
			},
			
			linkDetail: function() {
				return new Ext.Panel({
					html: t("Preview not available")
				});
			}	
	}]
});

GO.newMenuItems.push({
	text: t("Workflow", "workflow"),
	iconCls: 'go-module-icon-workflow',
	handler:function(item, e){		
		if(!this.modelDialog)
			this.modelDialog = new GO.workflow.ModelDialog();
		
		this.modelDialog.addBaseParam('model_id', item.parentMenu.link_config.model_id);
		this.modelDialog.addBaseParam('model_name', item.parentMenu.link_config.model_name);
		
		this.modelDialog.show();
	}
});


GO.workflow.showModel = function(params){
	
	var win = GO.linkHandlers[params['model_name']].call(this, params['model_id']);
	if(win){
		win.on('hide',function(){
			var panel = GO.mainLayout.getModulePanel('workflow');
			if(panel)
				panel.workflowGrid.store.reload();
		},this, {single:true});
	}
}
