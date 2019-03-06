GO.documenttemplates.ooTemplatesStore = new GO.data.JsonStore({
    url: GO.url("documenttemplates/documentTemplate/store"),
    baseParams: {
        'type': '1',
				limit: 0
    },
    root: 'results',
    totalProperty: 'total',
    id: 'id',
    fields:['id', 'user_id', 'owner', 'name', 'type', 'acl_id','extension'],
    remoteSort:true
});

GO.documenttemplates.emailTemplatesStore = new GO.data.JsonStore({
    url: GO.url("documenttemplates/emailTemplate/store"),
    root: 'results',
    totalProperty: 'total',
    id: 'id',
    fields:['id', 'user_id', 'owner', 'name', 'type', 'acl_id','extension'],
    remoteSort:true
});
