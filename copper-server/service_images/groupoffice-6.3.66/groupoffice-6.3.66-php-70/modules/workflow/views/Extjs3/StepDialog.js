GO.workflow.StepDialog = Ext.extend(GO.dialog.TabbedFormDialog , {
	
	initComponent : function(){
		
		Ext.apply(this, {
			goDialogId:'step',
			title:t("Step", "workflow"),
			titleField:'name',
			formControllerUrl: 'workflow/step',
			height: 480
		});
		
		GO.workflow.StepDialog.superclass.initComponent.call(this);	
	},
	  
	buildForm : function () {

		this.approverPanel = new GO.base.model.multiselect.panel({
			title:t("Authorized users", "workflow"),	
			url:'workflow/approver',
			columns:[{header: t("Users", "workflow"), dataIndex: 'name', sortable: true}],
			fields:['step_id','name','user_id'],
			model_id:this.remoteModelId,
			anchor : '100% 50%'
		});

		this.approverGroupPanel = new GO.base.model.multiselect.panel({
			title:t("Authorized groups", "workflow"),	
			url:'workflow/approverGroup',
			columns:[{header: t("Groups", "workflow"), dataIndex: 'name', sortable: true}],
			fields:['step_id','name','group_id'],
			model_id:this.remoteModelId,
			anchor : '100% 50%'
		});
		
		this.propertiesPanel = new Ext.Panel({
			title:t("Properties"),			
			cls:'go-form-panel',
			layout:'form',
			items:[
				{
					xtype: 'textfield',
					name: 'name',
					width:300,
					anchor: '100%',
					maxLength: 100,
					allowBlank:false,
					fieldLabel: t("Name", "workflow")
				},{
					xtype: 'textarea',
					name: 'description',
					width:300,
					anchor: '100%',
					maxLength: 100,
					allowBlank:false,
					fieldLabel: t("Description", "workflow")
				},{
					xtype: 'textfield',
					name: 'due_in',
					width:300,
					anchor: '100%',
					maxLength: 100,
					allowBlank:false,
					fieldLabel: t("Due in (hours)", "workflow")
				},{
					xtype: 'xcheckbox',
					name: 'email_alert',
					width:300,
					anchor: '100%',
					maxLength: 100,
					fieldLabel: t("Email alert", "workflow")
				},{
					xtype: 'xcheckbox',
					name: 'popup_alert',
					width:300,
					anchor: '100%',
					maxLength: 100,
					fieldLabel: t("Popup alert", "workflow")
				},{
					xtype: 'xcheckbox',
					name: 'all_must_approve',
					width:300,
					anchor: '100%',
					maxLength: 100,
					fieldLabel: t("Approve needed by all", "workflow")
				},
//				{
//					xtype: 'xcheckbox',
//					name: 'files_only',
//					width:300,
//					anchor: '100%',
//					maxLength: 100,
//					allowBlank:false,
//					fieldLabel: t("Applies only to files", "workflow")
//				},
				this.actionTypesCB = new GO.form.ComboBox({
					hiddenName: 'action_type_id',
					fieldLabel: t("Action type", "workflow"),
					store: new GO.data.JsonStore({
						url: GO.url('workflow/actionType/store'),
						root: 'results',
						id: 'id',
						totalProperty:'total',
						fields: ['id', 'name', 'class_name'],
						remoteSort: true,
						autoLoad: true
					}),
					width: 300,
					value: '1',
					valueField:'id',
					displayField:'name',
					mode:'remote',
					allowBlank: false,
					triggerAction: 'all'
				}),
				this.selectFolder = new GO.files.SelectFolder({
					fieldLabel : t("Move to this folder", "workflow"),
					width: 300,
					name: 'copy_to_folder'
				}),
				this.keepOriginalCheck = new Ext.ux.form.XCheckbox({
//					xtype: 'xcheckbox',
					name: 'keep_original_copy',
					width:300,
					anchor: '100%',
					maxLength: 100,
//					allowBlank:false,
					fieldLabel: t("Copy instead of move", "workflow")
				})
			]				
		});
		
		this.actionTypesCB.on('select',function(cb,record,value){
			var isCopyAction = record.data['class_name']=='GO\\Workflow\\Action\\Copy' || record.data['class_name']=='GO\\Workflow\\Action\\HistoryPdfInCopy';
			this._enableFileFields(isCopyAction);
		},this);
		
    this.addPanel(this.propertiesPanel);
		this.addPanel(this.approverGroupPanel);
		this.addPanel(this.approverPanel);
	},
	setRemoteModelId : function(remoteModelId) {
		this.approverGroupPanel.setModelId(remoteModelId);
		this.approverPanel.setModelId(remoteModelId);
		GO.workflow.StepDialog.superclass.setRemoteModelId.call(this,remoteModelId);	
	},
	_enableFileFields : function(enable) {
		var disable = !enable;
		this.selectFolder.setDisabled(disable);
		this.keepOriginalCheck.setDisabled(disable);
	},
//	
//	beforeLoad : function(remoteModelId,config) {
//		this.actionTypesCB.store.load();
//	},
	
	afterLoad : function(remoteModelId,config,action) {
		var isCopyAction = this.actionTypesCB.getValue()==2 || this.actionTypesCB.getValue()==4;
		this._enableFileFields(isCopyAction);
	}
});
