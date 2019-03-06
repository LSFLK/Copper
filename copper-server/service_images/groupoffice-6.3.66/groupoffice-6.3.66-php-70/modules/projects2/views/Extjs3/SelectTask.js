GO.projects2.SelectTask = Ext.extend(GO.form.ComboBoxReset,{

	hiddenName:'task_id',
	fieldLabel:t("Job", "projects2"),
	valueField:'id',
	displayField:'description',
	store:new GO.data.JsonStore({
		url:GO.url('projects2/task/store'),
		fields:['id','description'],
		baseParams:{
			project_id:0
		}
	}),
	mode:'remote',
	triggerAction:'all',
	editable:false,
	selectOnFocus:true,
	allowBlank:true,
	
	setProjectId : function(project_id){
		if(this.store.baseParams.project_id!=project_id){
			this.store.baseParams.project_id=project_id;
			this.clearLastSearch();
			this.store.removeAll();
		}
	}
});		     
