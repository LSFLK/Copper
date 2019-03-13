GO.addressbook.AddresbooksGrid = function(config){
	
	if(!config)
	{
		config = {};
	}
	
	config.title = t("Address books", "addressbook");
	//config.layout='fit';
	//config.split=true;
	if(!config.store)
		config.store = GO.addressbook.readableAddressbooksStore;

	Ext.apply(config, {
		viewConfig: {
			//scrollOffset: 0,
			emptyText: t("No items to display")
		},
		tbtools: [{xtype:'tbsearch', store: config.store}],
		allowNoSelection:true,
		bbar: new GO.SmallPagingToolbar({
//			items:[this.searchField = new GO.form.SearchField({
//				store: config.store,
//				emptyText: t("Search")
//			})],
			store:config.store,
			pageSize:GO.settings.config.nav_page_size
		})
	});
	
	GO.addressbook.AddresbooksGrid.superclass.constructor.call(this, config);
};


Ext.extend(GO.addressbook.AddresbooksGrid, GO.grid.MultiSelectGrid, {
	
	type: '',
	afterRender : function()
	{	
		GO.addressbook.AddresbooksGrid.superclass.afterRender.call(this);	

		var DDtarget = new Ext.dd.DropTarget(this.getView().mainBody, {
			ddGroup : 'AddressBooksDD',
			notifyDrop : this.onNotifyDrop.createDelegate(this)
		});	
	},
	setType : function(type)
	{
		this.type = type;
	},
	onNotifyDrop : function(source, e, data)
	{	
		var selections = source.dragData.selections;
        var dropRowIndex = this.getView().findRowIndex(e.target);
        var book_id = this.getView().grid.store.data.items[dropRowIndex].id;

		var show_confirm = false;
		var move_items = [];
		for(var i=0; i<selections.length; i++)
		{
			move_items.push(selections[i].id);
			if(selections[i].json.company_id > 0)
			{
				show_confirm = true;
				//company_id = selections[i].json.company_id;
			}
		}
		
		if(!show_confirm && this.type == 'company')
		{
			show_confirm = true;
		}
			
		if(book_id > 0 && (!show_confirm || confirm(t("The company and all employees will also be moved to the new address book. Are you sure you want to do this?", "addressbook"))))
		{
			GO.request({
				url: 'addressbook/'+this.type+'/changeAddressbook',
				params: {
//					task:'drop_' + this.type,
					book_id:book_id,
					items:Ext.encode(move_items)
				}
			});			
			
			this.fireEvent('drop', this.type);
			
			return true;
		} else {
			return false;
		}	
	}
	
});
