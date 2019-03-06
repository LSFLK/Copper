GO.workflow.WorkflowTemplate =
		'<tpl if="workflow && workflow.length">'+
		
		'<tpl for="workflow">'+
		
			'{[this.collapsibleSectionHeader(t("Workflow", "workflow")+" - "+values.process_name, "task-workflow-"+values.id, "workflow")]}'+
				'<table class="display-panel" cellpadding="0" cellspacing="0" border="0" id="task-workflow-{id}">'+
					'<tr>'+
						'<td width="140">'+t("Process", "workflow")+':</td>'+
						'<td>{process_name}</td>'+
					'</tr>'+		
					'<tr>'+	
						'<td>'+t("Step", "workflow")+':</td>'+
						'<td><a class="normal_link"  onclick="GO.workflow.showVisual({id});">{step_progress} ({step_name})</a></td>'+
					'</tr>'+
					'<tr>'+	
						'<td>'+t("Started by", "workflow")+':</td>'+
						'<td>{user}</td>'+
					'</tr>'+
					
					'<tpl if="step_id != -1">'+
					
						'<tr>'+
							'<td>'+
								'<tpl if="step_all_must_approve == 1">'+
									t("Approval required by all", "workflow")+
								'</tpl>'+
								'<tpl if="step_all_must_approve != 1">'+
									t("Approval required by one of", "workflow")+
								'</tpl>'+
							':</td>'+
							'<td>'+
	//						'<b>Users</b><br />'+
								'<tpl for="approvers">'+
									'<tpl if="approved == 1">'+
										'<font style="color:green;">'+
									'</tpl>'+
									'<tpl if="approved == 0">'+
										'<font style="color:red;">'+
									'</tpl>'+
										'{name}'+
										'<tpl if="last == 0">'+
											', '+
										'</tpl>'+
									'</font>'+
								'</tpl>'+
	//							'<b>Groups</b><br />'+
	//							'<tpl for="approver_groups">'+
	//								'{name}<br/>'+
	//							'</tpl>'+
							'</td>'+
						'</tr>'+		
						
					'</tpl>'+
					
					'<tr>'+
						'<td>'+t("Time running", "workflow")+':</td>'+
						'<td>{due_time}</td>'+
					'</tr>'+		
					'<tr>'+
						'<td>'+t("Shift due time (hours)", "workflow")+':</td>'+
						'<td>{shift_due_time}</td>'+
					'</tr>'+
					
					'<tr>'+
						'<td colspan="99" style="padding:0px!important;">'+
					
							'<tpl if="is_approver">'+
								'<table>'+
								'<tr>'+
									'<td style="padding:0px!important;"><a class="normal_link"  onclick="GO.workflow.approve({id});">'+t("Approve", "workflow")+'</a> / <a  onclick="GO.workflow.decline({id});">'+t("Decline", "workflow")+'</a></td>'+
								'</tr>'+
								'</table>'+
							'</tpl>'+

							
							'{[this.collapsibleSectionHeader("History", "task-workflow-history-"+values.id, "workflowhistory","collapsible-display-panel-subheader")]}'+
							'<div id="task-workflow-history-{id}" style="border:1px solid #acbbc0; margin:2px;">'+
								'<table class="display-subpanel" cellspacing="0" cellpadding="0" border="0">'+
								'<tpl if="!history.length">'+
									'<tr>'+
										'<td>'+
											t("No history available", "workflow")+
										'</td>'+
									'</tr>'+
								'</tpl>'+	

									'<tpl for="history">'+

										'<tr>'+
											'<td class="display-subpanel-header"><b>{step_name}</b> - <b>'+

											'<tpl if="status == 1">'+
												'<font style="color:green;">'+
											'</tpl>'+	

											'<tpl if="status == 0">'+
												'<font style="color:red;">'+
											'</tpl>'+		

											'{status_name}'+
											'</font></b> '+t("by", "workflow")+' {approver} '+t("at", "workflow")+' {ctime}</td>'+
										'</tr>'+
										'<tr>'+
											'<td class="display-subpanel-content">{comment}</td>'+
										'</tr>'+

								'</tpl>'+	

							'</table>'+
						'</div>'+
						
						'</td>'+
					'<tr>'+
				'</table>'+
			'</tpl>'+
		'</tpl>';
	
	
	GO.workflow.approve = function(id){
		if(!GO.workflow.stepHistoryDialog)
			GO.workflow.stepHistoryDialog = new GO.workflow.StepHistoryDialog();

		GO.workflow.stepHistoryDialog.setProcessModelId(id);
		GO.workflow.stepHistoryDialog.setStatus(1);
		GO.workflow.stepHistoryDialog.show();
	}
	
	GO.workflow.decline = function(id){
		if(!GO.workflow.stepHistoryDialog)
			GO.workflow.stepHistoryDialog = new GO.workflow.StepHistoryDialog();

		GO.workflow.stepHistoryDialog.setProcessModelId(id);
		GO.workflow.stepHistoryDialog.setStatus(0);
		GO.workflow.stepHistoryDialog.show();
	}
	
	GO.workflow.showVisual = function(id){
		if(!GO.workflow.visualTemplateWindow)
			GO.workflow.visualTemplateWindow = new GO.workflow.VisualTemplateWindow();
		GO.workflow.visualTemplateWindow.show(id);
	}
