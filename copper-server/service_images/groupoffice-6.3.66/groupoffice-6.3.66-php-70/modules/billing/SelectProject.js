GO.projects.SelectProject = function(config){
	
	Ext.apply(this, config);
		
	this.store = new GO.data.JsonStore({
		url: 'projects/project/store',
		id: 'id',
		fields:['id', 'name'],
        remoteSort: true
	});

	GO.projects.SelectProject.superclass.constructor.call(this,{
		displayField: 'name',
		hiddenName:'project_id',
		valueField: 'id',
		triggerAction:'all',
		mode:'remote',
		editable: true,
		selectOnFocus:true,
        forceSelection: true,
		typeAhead: true,
        allowBlank:false,
		pageSize: parseInt(GO.settings['max_rows_list']),
		fieldLabel: t("project", "projects")
	});
		
	this.store.setDefaultSort('name', 'asc');
	
}
Ext.extend(GO.projects.SelectProject, GO.form.ComboBoxReset);
