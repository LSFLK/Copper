GO.billing.SelectTrackingCode = Ext.extend(GO.form.ComboBoxReset, {	
	store: new GO.data.JsonStore({
		url: GO.url('billing/trackingCode/store'),
		baseParams: {
			costcode_id: 0
		},
		root: 'results',
		id: 'id',
		totalProperty: 'total',
		fields: ['id','code','name','description','costcode','costcodename'],
		remoteSort: true
	}),
	tpl: new Ext.XTemplate(
		 '<tpl for=".">',
		 '<tpl if="this.costcode != values.costcode">',
		 '<tpl exec="this.costcode = values.costcode"></tpl>',
		 '<h1><b>{costcode} - {costcodename}</b></h1>',
		 '</tpl>',
		 '<div ext:qtip="{description}" class="x-combo-list-item">{code}</div>',
		 '</tpl>',
		 '<tpl exec="this.costcode = null"></tpl>'
	),
	displayField:'code',
	valueField: 'code',
	mode:'local',
	triggerAction:'all',
	allowBlank:true,
	autoShow:true,
	editable:true,
	autoSelect:false,
	forceSelection: false,
	minChars: 2, 
	typeAhead:true,
	selectOnFocus:true
});
