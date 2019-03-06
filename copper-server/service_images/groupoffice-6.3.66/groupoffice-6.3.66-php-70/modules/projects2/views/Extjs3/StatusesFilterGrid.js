GO.projects2.StatusesFilterGrid = function(config){
	
	if(!config)
	{
		config = {};
	}
	
	config.title = t("Statuses", "projects2");
	config.layout='fit';
	config.autoScroll=true;
	config.split=true;
	if(!config.store)
		config.store = new GO.data.JsonStore({
			url: GO.url("projects2/status/store"),
			fields: ['id','name','checked'],
			remoteSort: true,
			baseParams:{
				forEditing:true,
				forFilterPanel:true,
				limit:400
			}
	});

	Ext.apply(config, {
		allowNoSelection:true
	});
	
	GO.projects2.StatusesFilterGrid.superclass.constructor.call(this, config);
};


Ext.extend(GO.projects2.StatusesFilterGrid, GO.grid.MultiSelectGrid, {
	
	type: '',

	setType : function(type)
	{
		this.type = type;
	}
});
