GO.billing.SelectCostCode = Ext.extend(GO.form.ComboBoxReset, {	
	store: GO.billing.costCodesStore,
	tpl: new Ext.XTemplate(
		 '<tpl for=".">',
		 '<tpl if="this.type != values.type">',
		 '<tpl exec="this.type = values.type"></tpl>',
		 '<h1><b>{type}</b></h1>',
		 '</tpl>',
		 '<div ext:qtip="{description}" class="x-combo-list-item">{code} - {name}</div>',
		 '</tpl>',
		 '<tpl exec="this.type = null"></tpl>'
	),
	displayField:'code',
	valueField: 'code',
	mode:'local',
	triggerAction:'all',
	allowBlank:true,
	selectOnFocus:true,
	forceSelection: true,
	minChars: 2, 
	typeAhead:true,
	editable:true
});
