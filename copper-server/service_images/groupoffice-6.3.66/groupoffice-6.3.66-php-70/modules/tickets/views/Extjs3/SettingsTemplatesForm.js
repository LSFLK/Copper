//SettingsTemplates

GO.tickets.SettingsTemplatesForm = Ext.extend(Ext.Panel,{
	layout: 'form',
	initComponent : function(){

		Ext.apply(this,{
			autoScroll: true,
			cls:'go-form-panel',
			bodyStyle:'padding:5px',
			defaults:{
				hideLabel: true
			},
			items:[
				
				this.newTicketCheckbox = new Ext.ux.form.XCheckbox({
					name: 'new_ticket',
					boxLabel: t('New ticket', 'tickets'),
					checked: true
				}), 
				this.newTicketText = new Ext.form.TextArea({
					name: 'new_ticket_msg',
					height: 200,
					anchor: '100%',
					disabled: !this.newTicketCheckbox.checked
				}),
				
				this.assignedCheckbox = new Ext.ux.form.XCheckbox({
					name: 'assigned_to',
					boxLabel: t('Assigned to agent', 'tickets'),
					checked: true
				}),
				this.assignedText = new Ext.form.TextArea({
					name: 'assigned_to_msg',
					height: 200,
					anchor: '100%',
					disabled: !this.assignedCheckbox.checked
				}),
				
				this.notifyAgentCheckbox = new Ext.ux.form.XCheckbox({
					name: 'notify_agent',
					boxLabel: t('Message to agent on new message', 'tickets'),
					checked: true									
				}),
				this.notifyAgentText = new Ext.form.TextArea({
					name: 'notify_agent_msg',
					height: 200,
					anchor: '100%',
					disabled: !this.notifyAgentCheckbox.checked
				}),
				
				this.notifydueDateCheckbox = new Ext.ux.form.XCheckbox({
					name: 'notify_due_date',
					boxLabel: t('Message when due date has passed'),
					checked: true,
					listeners: {
						check:function(cb, checked) {
							this.notifyDueDateText.setDisabled(!checked);
						},
						scope:this
					}
				}),
				this.notifyDueDateText = new Ext.form.TextArea({
					name: 'notify_due_date_msg',
					height: 200,
					anchor: '100%',
					disabled: !this.notifydueDateCheckbox.checked
				})
			]
		});
		
		
		this.newTicketCheckbox.on('check', function(chechBox, checked) {
			if(checked) {
				this.newTicketText.enable();
			} else {
				this.newTicketText.disable();
			}
		}, this);
		this.assignedCheckbox.on('check', function(chechBox, checked) {
			if(checked) {
				this.assignedText.enable();
			} else {
				this.assignedText.disable();
			}
		}, this);
		this.notifyAgentCheckbox.on('check', function(chechBox, checked) {
			if(checked) {
				this.notifyAgentText.enable();
			} else {
				this.notifyAgentText.disable();
			}
		}, this);

		GO.tickets.SettingsTemplatesForm.superclass.initComponent.call(this);	
	}
	
	
	
})
