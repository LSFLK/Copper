GO.workflow.workflowStore = new GO.data.JsonStore({
  url: GO.url('workflow/workflow/store'),		
  root: 'results',
  id: 'id',
  totalProperty:'total',
  fields: ['id','model_id','user_id','entity','model_name','name','processname','stepname','due_in','due_time','time_running','progress','time_remaining','days_left'],
  remoteSort: true
});

GO.workflow.portletWorkflowStore = new GO.data.JsonStore({
  url: GO.url('workflow/workflow/store'),
	baseParams:{
		'portlet' : true
	},
  root: 'results',
  id: 'id',
  totalProperty:'total',
  fields: ['id','model_id','user_id','entity','model_name','name','processname','stepname','due_in','due_time','time_running','progress','time_remaining','days_left'],
  remoteSort: true
});

GO.workflow.processStore = new GO.data.JsonStore({
  url: GO.url('workflow/process/store'),		
  root: 'results',
  id: 'id',
  totalProperty:'total',
  fields: ['id','name','user_id','acl_id','user_name'],
  remoteSort: true
});

GO.workflow.stepStore = new GO.data.JsonStore({
  url: GO.url('workflow/step/store'),		
  root: 'results',
  id: 'id',
  totalProperty:'total',
  fields: ['id','process_id','name','sort_order','description','due_in','email_alert','popup_alert','all_must_approve'],
  remoteSort: true
});

GO.workflow.approverStore = new GO.data.JsonStore({
  url: GO.url('workflow/approver/store'),		
  root: 'results',
  id: 'id',
  totalProperty:'total',
  fields: ['step_id','user_id'],
  remoteSort: true
});

GO.workflow.approverGroupStore = new GO.data.JsonStore({
  url: GO.url('workflow/approverGroup/store'),		
  root: 'results',
  id: 'id',
  totalProperty:'total',
  fields: ['step_id','group_id'],
  remoteSort: true
});
