/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: Stores.js 22502 2017-08-30 08:33:43Z mschering $
 * @copyright Copyright Intermesh
 * @author Michiel Schmidt <michiel@intermesh.nl>
 * @author Merijn Schering <mschering@intermesh.nl>
 */

GO.tickets.writableTypesStore = new GO.data.JsonStore({
	url:GO.url('tickets/type/store'),
	baseParams:{
		permissionLevel:GO.permissionLevels.write
	},
	fields:['id','name','description','user_name','acl_id','permission_level','group_name','customfields']
});

GO.tickets.readableTypesStore = new Ext.data.GroupingStore({
	url:GO.url("tickets/type/store"),
	/* The controller is sorting
	multiSortInfo: {
		sorters: [
			{ field: 'group_name', direction: "ASC" },
			{ field: 'name', direction: "ASC" }
		],
		direction: 'ASC'
	},
	sortInfo:{
		field: 'name',
		direction: "ASC"
	},*/
	id : 'id',
	reader: new Ext.data.JsonReader({
		root: 'results',
		totalProperty: 'total',
		id: 'id',
		fields:['id','name','description','acl_id','checked','group_name']
	}),
	baseParams:{
		limit:0 // With this option all the types will be loaded without a limit. (Because the grid doesn't have pagination)
	},
	groupField:'group_name',
	remoteSort:true,
	remoteGroup:true
})
/*
GO.tickets.readableTypesStore = new GO.data.JsonStore({
	url:GO.url('tickets/type/store'),
	baseParams:{
		limit:0 // With this option all the types will be loaded without a limit. (Because the grid doesn't have pagination)
	},
	fields:['id','name','description','acl_id','checked']
});*/
		
GO.tickets.statusesStore = new GO.data.JsonStore({
	url:GO.url('tickets/status/store'),
	fields:['id','name','checked','name_clean'],
	baseParams: {
		showTicketCount: true,
		showOpenClosed: true,
		sort: 'name'
	}
});

GO.tickets.agentsStore = new GO.data.JsonStore({
	url:GO.url('tickets/ticket/agents'),
	fields:['id','name']
});

GO.tickets.templatesStore = new GO.data.JsonStore({
	url:GO.url("tickets/template/store"),
	fields:['id','name']
});



GO.tickets.ratesStore = new GO.data.JsonStore({
	url : GO.url('tickets/rate/store'),
	fields:['id','name','amount','company_id','cost_code'],
	baseParams: {
		include_global_rates: true
	}
});
GO.tickets.companyRatesStore = new GO.data.JsonStore({
	url : GO.url('tickets/rate/store'),
	fields:['id','name','amount','cost_code']
});
