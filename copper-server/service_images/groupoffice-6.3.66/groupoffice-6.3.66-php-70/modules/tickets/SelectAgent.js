GO.tickets.SelectAgent = Ext.extend(GO.form.ComboBoxReset, {
	hiddenName:'agent_id',
	fieldLabel:t("Responsible", "tickets"),
	emptyText:t("Nobody", "tickets"),
	valueField:'id',
	displayField:'name',
	store:GO.tickets.agentsStore,
	mode:'local',
	triggerAction:'all',
	editable:true,
	selectOnFocus:true
});
