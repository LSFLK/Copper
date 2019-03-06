GO.projects2.SelectResource = Ext.extend(GO.form.ComboBoxReset,{
	setProjectId : function(id){
//		if(id && this.store.baseParams.project_id!=id){
			this.store.baseParams.project_id=id;
			this.store.load();
//		}
	},
	hiddenName:'user_id',
	fieldLabel:t("User"),
	valueField:'id',
	displayField:'user_name',
	store:new GO.data.JsonStore({
		url:GO.url('projects2/resource/store'),
		fields:['id','user_name'],
		baseParams:{
			project_id:0
		}
	}),
	mode:'local',
	triggerAction:'all',
	editable:false,
	selectOnFocus:true,
	allowBlank:false
});		
