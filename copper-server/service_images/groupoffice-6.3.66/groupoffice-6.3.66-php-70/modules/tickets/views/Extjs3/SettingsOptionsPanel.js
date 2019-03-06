/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: SettingsOptionsPanel.js 22937 2018-01-12 08:01:19Z mschering $
 * @copyright Copyright Intermesh
 * @author Wesley Smits <wsmits@intermesh.nl>
 */
 
GO.tickets.SettingsOptionsPanel = Ext.extend(Ext.Panel, {
	title:t("Options", "tickets"),			
	cls:'go-form-panel',
	layout:'form',
	labelWidth: 240,
	
	initComponent : function(){
		
		this.buildForm();
		
		GO.tickets.SettingsOptionsPanel.superclass.initComponent.call(this);
	},
	
	buildForm : function(params) {
		
		this.nameField = new Ext.form.TextField({
			name: 'from_name',
			anchor: '100%',
			maxLength: 100,
			allowBlank:false,
			fieldLabel: t("Name")
		});
		
		this.emailField = new Ext.form.TextField({
			name: 'from_email',
			anchor: '100%',
			maxLength: 100,
			allowBlank:false,
			fieldLabel: t("E-mail")
		});
		
		this.subjectField = new Ext.form.TextField({
			name: 'subject',
			anchor: '100%',
			maxLength: 100,
			allowBlank:false,
			fieldLabel: t("Subject")
		});
		
	
		this.languageCombo = new Ext.form.ComboBox({
			fieldLabel: t("Language", "users"),
			name: 'language_id',
			store:  new Ext.data.SimpleStore({
				fields: ['id', 'language'],
				data : GO.Languages
			}),
			displayField:'language',
			valueField: 'id',
			hiddenName:'language',
			mode:'local',
			triggerAction:'all',
			editable: false,
			selectOnFocus:true,
			forceSelection: true,
			anchor: '100%',
			value: GO.settings.language
		});
//			
//		this.customerMessageTextarea = new Ext.form.TextArea({
//			name: 'customer_message',
//			anchor: '100%',
//			allowBlank:false,
//			fieldLabel:t("Customer message on external page", "tickets"),
//			height:100
//		});
//		
//		this.responseMessageTextarea = new Ext.form.TextArea({
//			name: 'response_message',
//			anchor: '100%',
//			allowBlank:false,
//			fieldLabel:t("Ticket saved message on external page", "tickets"),
//			height:100
//		});


		
		this.expireDaysField = new Ext.form.NumberField({
			name: 'expire_days',
			fieldLabel: t("Number of days before tickets that have not been answered by the client, will be automatically closed. Set this to 0 to turn off this feature.", "tickets"),
			width: 50,
			allowNegative: false,
			allowDecimals: false,
			decimalPrecision: 0
		});
		
		this.closeStatusCombo = new GO.form.ComboBoxReset({
			fieldLabel:t("Never close tickets in this status", "tickets"),
			xtype:'comboboxreset',
			hiddenName:'never_close_status_id',
			valueField:'id',
			displayField:'name',	
			store:GO.tickets.statusesStore,
			mode:'local',
			triggerAction:'all',
			anchor: '100%',
			editable:false,
			selectOnFocus:true,
			forceSelection:true
		});
		
		this.notifyContactCheckbox = new Ext.ux.form.XCheckbox({
			name: 'notify_contact',
			width:300,
			anchor: '100%',
			maxLength: 100,
//			allowBlank:false,
			boxLabel: t("Notify contact defaults true", "tickets"),
			hideLabel:true
		});
		
		this.disableAssignedReminderCheckbox = new Ext.ux.form.XCheckbox({
			name: 'disable_reminder_assigned',
			width:300,
			anchor: '100%',
			maxLength: 100,
//			allowBlank:false,
			boxLabel: t("Disable reminder when assign agent", "tickets"),
			hideLabel:true
		});
		
		this.disableUnansweredReminderCheckbox = new Ext.ux.form.XCheckbox({
			name: 'disable_reminder_unanswered',
			width:300,
			anchor: '100%',
			maxLength: 100,
//			allowBlank:false,
			boxLabel: t("Disable reminder for unanswered tickets", "tickets"),
			hideLabel:true
		});
		
		this.leaveTypeBlankByDefault = new Ext.ux.form.XCheckbox({
			name: 'leave_type_blank_by_default',
			width:300,
			anchor: '100%',
			maxLength: 100,
//			allowBlank:false,
			boxLabel: t("When creating new tickets, do not automatically pre-select a ticket type by default", "tickets"),
			hideLabel:true
		});
		
		this.managerReopenTicketOnlyCheckbox = new Ext.ux.form.XCheckbox({
			name: 'manager_reopen_ticket_only',
			width:300,
			anchor: '100%',
			maxLength: 100,
//			allowBlank:false,
			boxLabel: t("Only module managers may reopen closed tickets", "tickets"),
			hideLabel:true
		});
		
		this.showConfirmOnCloseCheckbox = new Ext.ux.form.XCheckbox({
			name: 'show_close_confirm',
			width:300,
			anchor: '100%',
			maxLength: 100,
//			allowBlank:false,
			boxLabel: t("Show confirm dialog when closing ticket", "tickets"),
			hideLabel:true
		});
		
		
//		this.expireFieldset = new Ext.form.FieldSet({
//			border: false,
//			hideLabel: true,
//			labelWidth: 300,
//			bodyStyle:'padding:0px',
//			style:'padding:0px',
//			items:[
//				this.expireDaysField,
//				this.closeStatusCombo
//			]
//		});
		
		this.items = [
			this.nameField,
			this.emailField,
			this.subjectField,
			this.languageCombo,
//			this.customerMessageTextarea,
//			this.responseMessageTextarea,
			this.expireDaysField,
			this.closeStatusCombo,
			this.notifyContactCheckbox,
			this.disableAssignedReminderCheckbox,
			this.disableUnansweredReminderCheckbox,
			this.leaveTypeBlankByDefault,
			this.managerReopenTicketOnlyCheckbox,
			this.showConfirmOnCloseCheckbox
		];
		
		
//		if(GO.settings.modules.email && GO.settings.modules.email.read_permission)
//		{
//			
//			this.items.push({
//				style:'margin-top:20px',
//				xtype:'htmlcomponent',
//				html:t("<b>Caution!</b> Select an IMAP mailbox below to automatically import mails as tickets. All e-mails from the inbox will be REMOVED after the import. So you must use a dedicated mail account for this.", "tickets")
//			})
//			
//			this.selectAccount = new GO.form.ComboBoxReset({
//				fieldLabel: t("Mailbox for new tickets", "tickets"),
//				hiddenName:'email_account_id',
//				anchor:'-20',
//				emptyText:t("None"),
//				store: new GO.data.JsonStore({
//					url: GO.url("email/account/store"),
//					fields: ['id', 'username'],
//					remoteSort: true
//				}),
//				valueField:'id',
//				displayField:'username',
//				typeAhead: true,
//				mode: 'remote',
//				triggerAction: 'all',
//				editable: true,
//				selectOnFocus:true,
//				forceSelection: true,
//				pageSize:GO.settings.max_rows_list
//			});
//
//			this.items.push(this.selectAccount);
//		}
		
		
	}
});
