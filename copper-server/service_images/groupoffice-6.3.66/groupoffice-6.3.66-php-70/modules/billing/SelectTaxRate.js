GO.billing.SelectTaxRate = Ext.extend(GO.form.ComboBoxReset, {	
	store: GO.billing.SelectTaxRateStore,
	tpl: new Ext.XTemplate(
		 '<tpl for=".">',
		 '<tpl if="this.type != values.type">',
		 '<tpl exec="this.type = values.type"></tpl>',
		 '<h1><b>{type}</b></h1>',
		 '</tpl>',
		 '<div ext:qtip="{description}" class="x-combo-list-item">{percentage}% - {name}</div>',
		 '</tpl>',
		 '<tpl exec="this.type = null"></tpl>'
	),
//	tpl: new Ext.XTemplate(
//		'<tpl for=".">',
//	
//			'<tpl if="xindex == 1">',
//				'<table style="border-collapse:collapse;">',
//			'</tpl>',
//	
//			'<tr class="x-combo-list-item">',
//					'<td style="padding: 0 4px;" ext:qtip="{description}">{percentage} %</td><td style="padding: 0 4px; border-left:1px solid #000;"ext:qtip="{description}">{name}</td>',
//			'</tr>',
//			
//			'<tpl if="xcount-xindex == 0">',
//				'</table>',
//			'</tpl>',
//			
//		'</tpl>'
//	),
	displayField:'percentage',
	valueField: 'percentage',
	mode:'local',
	triggerAction:'all',
	selectOnFocus:true,
	forceSelection: false
});
