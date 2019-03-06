GO.workflow.VisualTemplateWindow = function(config){
	
	Ext.apply(this, config);

	
	
	this.tpl = new Ext.XTemplate(
		'<div class="wf-container">'+
			'<div class="wf-title">'+
				'<h1>'+t("Workflow process “{process_name}” on “{model_type}:{model_name}”", "workflow")+'</h1>'+
				'<p>'+t("Started at {start_time}", "workflow")+'</p>'+
			'</div>'+

			'<tpl for="results">'+
				'<div class="wf-'+
					'<tpl if="current == 1">'+
						'active-'+
					'</tpl>'+
				'step">'+
					'<h2>'+t("{name} : {description}", "workflow")+'</h2>'+
					'<p></p>'+
					'<p>'+t("Needs approval by ", "workflow")+
					'<tpl if="all_must_approve == 1">'+
						t("all ", "workflow")+
					'</tpl>'+
					'<tpl if="all_must_approve == 0">'+
						t("one ", "workflow")+
					'</tpl>'+
						t("of these users: {approvers}", "workflow")+
						t("<br>Due at: {due_at}", "workflow")+'</p>'+
				'</div>'+
			'</tpl>'+
			'<hr />'+
		'</div>'
	);

	GO.workflow.VisualTemplateWindow.superclass.constructor.call(this, {
		modal:false,
		layout:'fit',
		height: 460,
		width: 480,
		resizable: false,
		closeAction:'hide',
		title:t("Workflow", "workflow"),
		items: 
			this.templatePanel = new Ext.Panel({
				layout:'fit'				
			}),		
		buttons: [
			{				
				text: t("Close"),
				handler: function(){this.hide()},
				scope:this
			}
		]
    });
};

Ext.extend(GO.workflow.VisualTemplateWindow, Ext.Window, {
	show : function(workflow_id){
		this.workflow_id = workflow_id;
		
		GO.workflow.VisualTemplateWindow.superclass.show.call(this);
		GO.request({
			url:'workflow/workflow/progressStore',
			params:{
				id:workflow_id
			},
			maskEl:this.templatePanel.getEl(),
			success:function(response, options, result){
				this.tpl.overwrite(this.templatePanel.body, result);
			},
			scope:this
		});
		
	}
});
	
