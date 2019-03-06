GO.tickets.SelectType = Ext.extend(GO.form.ComboBox, {	
	hiddenName:'type_id',
	fieldLabel:t("Type"),
	valueField:'id',
	displayField:'name',
	pageSize: 50,
	store:GO.tickets.writableTypesStore,
	mode:'local',
	triggerAction:'all',
	editable:false,
	selectOnFocus:true,
	allowBlank:false,
	forceSelection:true,
	emptyText: t("Please select..."),
	tpl: new Ext.XTemplate(
					 '<tpl for=".">',
					 '<tpl if="this.group_name != values.group_name">',
					 '<tpl exec="this.group_name = values.group_name"></tpl>',
					 '<div class="menu-title">{group_name}</div>',
					 '</tpl>',
					 '<div class="x-combo-list-item">{name}</div>',
					 '</tpl>',
					 '<tpl exec="this.group_name = null"></tpl>'
		 )
});
