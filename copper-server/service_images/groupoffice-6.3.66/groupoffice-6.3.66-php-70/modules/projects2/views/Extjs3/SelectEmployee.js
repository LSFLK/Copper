GO.projects2.SelectEmployee = Ext.extend(GO.form.ComboBoxReset,{
	initComponent: function(){
		
		this.store.baseParams.includeInactive = this.includeInactive;
		
		this.setValue(GO.settings.user_id);
		this.setRemoteText(GO.settings.displayName);
		GO.projects2.SelectEmployee.superclass.initComponent.call(this);		
	},
	startBlank : this.startBlank || false,
	//allowBlank : this.allowBlank || false,
	hiddenName: this.hiddenName || 'id',
	fieldLabel:t("Employee", "projects2"),
	valueField:'id',
	displayField:'name',
	store:new GO.data.JsonStore({
		url:GO.url('projects2/employee/users'),
		fields:['id','name'],
		baseParams:{
			includeInactive:0
		}
	}),
	width: this.width || 300,
	pageSize: 50,
	mode:'remote',
	triggerAction:'all',
	editable:true,
	selectOnFocus:true,
	allowBlank:false,
	typeAhead: true
});		     
