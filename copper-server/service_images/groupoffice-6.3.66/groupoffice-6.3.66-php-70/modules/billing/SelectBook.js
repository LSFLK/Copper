
GO.billing.SelectBook = function(config){
	config = config || {};


	var c = {
		fieldLabel: t("Book", "billing"),
		hiddenName:'book_id',
		anchor:'-20',
		emptyText:t("Please select..."),
		store: GO.billing.writableBooksStore,
		//pageSize: parseInt(GO.settings.max_rows_list),
		valueField:'id',
		displayField:'name',
		mode: 'local',
		triggerAction: 'all',
		editable: false,
		selectOnFocus:true,
		forceSelection: true,
		allowBlank: false

	};

	Ext.apply(c,config);

	GO.billing.SelectBook.superclass.constructor.call(this, c);

	/*this.on('render', function(){

		if(!GO.billing.writableBooksStore.loaded)
			GO.billing.writableBooksStore.load();
	}, this)*/
}
Ext.extend(GO.billing.SelectBook, GO.form.ComboBox);
