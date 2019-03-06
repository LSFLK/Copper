GO.tickets.SelectStatus = Ext.extend(GO.form.ComboBox, {	
	hiddenName:'status_id',
	valueField:'id',
	displayField:'name_clean',	
	store:GO.tickets.statusesStore,
	mode:'local',
	triggerAction:'all',
	editable:false,
	selectOnFocus:true,
	forceSelection:true
});
