Ext.namespace('GO.projects2.stores');

GO.projects2.selectProjectStore = new GO.data.JsonStore({
		url: GO.url('projects2/project/store'),
		baseParams: {unfinishedOnly: true},
		fields:['id', 'path'],
		remoteSort: true
	});

GO.projects2.selectBookableProjectStore= new GO.data.JsonStore({
				url: GO.url('projects2/project/selectBookable'),
				baseParams: {unfinishedOnly: true},
				fields:['id', 'path', 'has_mileage','default_distance'],
				remoteSort: true
				
			});

GO.projects2.budgetCategoryStore = new GO.data.JsonStore({
		url: GO.url('projects2/budgetCategory/store'),
		root: 'results',
		id: 'id',
		totalProperty:'total',
		fields: ['id','name'],
		remoteSort: true
	});

GO.projects2.expenseTypesStore= new GO.data.JsonStore({
		url: GO.url('projects2/expenseType/store'),
		baseParams: {
//			task: 'expense_types'
		},
		root: 'results',
		id: 'id',
		totalProperty:'total',
		fields: ['id','name'],
		remoteSort: true
	});

GO.projects2.reportTemplatesStore = new GO.data.JsonStore({
	    url: GO.url('projects2/reportTemplate/store'),//GO.settings.modules.projects2.url+ 'json.php',
	    baseParams: {
	    	start:0,
				limit:0
	    },
	    fields: ['id','user_name','name','combotext','type','fields'],
	    remoteSort: true
	});





GO.projects2.typesStore =new GO.data.JsonStore({
	    url: GO.url('projects2/type/store'),
	    baseParams: {
	    	auth_type:'write'
	    	},
	    root: 'results',
	    id: 'id',
	    totalProperty:'total',
	    fields: ['id','name','acl_id','acl_book','checked'],
	    remoteSort: true
	});

	
GO.projects2.typesStore2 =new GO.data.JsonStore({
	    url: GO.url('projects2/type/store'),
	    baseParams: {
	    	auth_type:'write',
				forStore2: true
	    	},
	    root: 'results',
	    id: 'id',
	    totalProperty:'total',
	    fields: ['id','name','acl_id','acl_book','checked'],
	    remoteSort: true
	});
	
GO.projects2.templatesStore =  new GO.data.JsonStore({
	    url: GO.url('projects2/template/store'),
	    fields: ['id','name','fields','default_status_id', 'default_type_id', 'default_type_name'],
	    remoteSort: true
	});
	
	GO.projects2.statusesStore = new GO.data.JsonStore({
			url: GO.url("projects2/status/store"),
			fields: ['id','name','checked'],
			remoteSort: true,
			baseParams:{
				forEditing:true
			}
	});
	
GO.projects2.standardTaskStore = new GO.data.JsonStore({
	url:GO.url("projects2/standardTask/store"),
	fields:['id','code','name', 'description', 'units', 'disabled','is_billable'],
	remoteSort:true
});
