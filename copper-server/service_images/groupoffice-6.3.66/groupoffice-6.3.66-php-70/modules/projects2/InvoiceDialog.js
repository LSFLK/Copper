GO.projects2.InvoiceDialog = Ext.extend(Ext.Window, {

	actionUrls : {
		'payout_timeregistration_users' : GO.url('projects2/invoice/payout'),
		'company_id' : GO.url('projects2/invoice/sales'),
		'contact_id' : GO.url('projects2/invoice/sales'),
		'responsible_user_id' : GO.url('projects2/invoice/sales')
	},

	initComponent : function(){

		this.title=t("Bill", "projects2");

		this.width=500;
		this.autoHeight=true;

		this.closeAction='hide';


		var now = new Date();
		var lastMonth = now.add(Date.MONTH, -1);
		var startOfLastMonth = lastMonth.getFirstDateOfMonth();
		var endOfLastMonth = lastMonth.getLastDateOfMonth();

		this.recipientCombo = new Ext.form.ComboBox({
			anchor:'-20',
			fieldLabel : t("Recipient", "projects2"),
			hiddenName : 'recipient',
			store : new Ext.data.SimpleStore({
				fields : ['value', 'text'],
				data : [
				['company_id', t("Customer")],
				['contact_id', t("Contact", "projects2")],
				['responsible_user_id', t("Manager", "projects2")],
				['payout_timeregistration_users', t("Payout timeregistration users", "projects2")]
				]

			}),
			value : 'company_id',
			valueField : 'value',
			displayField : 'text',
			mode : 'local',
			triggerAction : 'all',
			editable : false,
			selectOnFocus : true,
			forceSelection : true
		});

		this.startDate = new Ext.form.DateField({
			name: 'start_date',
			format: GO.settings['date_format'],
			allowBlank:true,
			fieldLabel: t("Start"),
			value: startOfLastMonth.format(GO.settings.date_format)
		});

		this.endDate = new Ext.form.DateField({
			name: 'end_date',
			format: GO.settings['date_format'],
			allowBlank:true,
			fieldLabel: t("End"),
			value: endOfLastMonth.format(GO.settings.date_format)
		});

		this.selectBook = new GO.form.ComboBox({
			fieldLabel: t("Book", "billing"),
			hiddenName:'book_id',
			anchor:'-20',
			emptyText:t("Please select..."),
			store: new GO.data.JsonStore({
				url: GO.settings.modules.billing.url+ 'json.php',
				baseParams: {
					task: 'books',
					auth_type: 'write'
				},
				root: 'results',
				id: 'id',
				totalProperty:'total',
				fields: ['id','name', 'user_name', 'report_checked'],
				remoteSort: true
			}),
			pageSize: parseInt(GO.settings.max_rows_list),
			valueField:'id',
			displayField:'name',
			mode: 'remote',
			triggerAction: 'all',
			editable: true,
			selectOnFocus:true,
			forceSelection: true,
			allowBlank: false
		});

		this.items=this.formPanel = new Ext.form.FormPanel({
			url: GO.url('projects2/invoice/sales'), //this could be changed in this.submitForm()
			baseParams:{
//				task:'invoice',
				project_id:0
			},
			bodyStyle:'padding:5px',
			waitMsgTarget:true,
			items:[
			this.recipientCombo,
			{
				layout:'table',
				border:false,
				defaults:{
					border:false,
					layout:'form'
				},
				items:[
				{
					items:this.startDate
				},{
					bodyStyle:'padding-left:5px',
					items:new Ext.Button({
						text: t("Previous month", "projects2"),
						handler: function(){
							this.changeMonth(-1);
						},
						scope:this
					})
				}]
			}, {
				layout:'table',
				border:false,
				defaults:{
					border:false,
					layout:'form'
				},
				items:[
				{
					items:this.endDate
				},{
					bodyStyle:'padding-left:5px',
					items:new Ext.Button({
						text: t("Next month", "projects2"),
						handler: function(){
							this.changeMonth(1);
						},
						scope:this
					})
				}]
			},
			this.selectBook,
			{
				xtype: 'radiogroup',
				hideLabel: true,
				itemCls: 'x-check-group-alt',
				columns: 1,
				items: [
					this.togetherCheck = new Ext.form.Radio({
						boxLabel: t("Invoice the project and subprojects together in one invoice", "projects2"),
						name: 'invoice_sub_projects',
						inputValue: 0,
						checked: true
					}),
					this.separateCheck = new Ext.form.Radio({
						boxLabel: t("Create a separate invoice for each subproject", "projects2"),
						name: 'invoice_sub_projects',
						inputValue: 1					
					})
				]
			},
			{
				xtype:'checkbox',
				hideLabel:true,
				boxLabel:t("Also bill hours and expenses that already have been billed", "projects2"),
				name:'bill_already_billed'
			},this.summaryItemTemplate = new Ext.form.TextArea({
				name:'summary_item_template',
				fieldLabel: t("Invoice item template (summarized)", "projects2"),
				value: GO.projects2.summary_bill_item_template,
				anchor : '100%'
			}),this.detailedCheckbox = new Ext.form.Checkbox({
				hideLabel:true,
				boxLabel:t("Show detailed info after summary", "projects2"),
				name:'detailed_items',
				checked: GO.projects2.detailed_printout_on
			}),this.itemTemplate = new Ext.form.TextArea({
				name:'item_template',
				fieldLabel: t("Invoice item template", "projects2"),
				value: GO.projects2.bill_item_template,
				anchor : '100%',
				disabled: !GO.projects2.detailed_printout_on
			}),this.singleCheckbox = new Ext.form.Checkbox({
//				disabled:this.recipientCombo.getValue()!='payout_timeregistration_users',
				boxLabel: t("Create single document", "projects2"),
				labelSeparator: '',
				name: 'single',
				allowBlank: true,
				hideLabel:true
			}),this.selectUser = new GO.form.SelectUser({
				fieldLabel: t("Document for", "projects2"),
				typeAhead: true,
//				disabled: true,
				disabled: this.recipientCombo.getValue()!='payout_timeregistration_users' || !this.singleCheckbox.getValue(),
//				hidden: true,
				allowBlank: false,
				anchor:'100%'
			}),this.selectProject = new GO.projects2.SelectProject({
				fieldLabel: t("Document for", "projects2"),
				typeAhead: true,
				disabled: this.recipientCombo.getValue()=='payout_timeregistration_users' || !this.singleCheckbox.getValue(),
				hidden: this.recipientCombo.getValue()=='payout_timeregistration_users',
				allowBlank: false,
				storeBaseParams: {'parent_project_id':0,'ignoreStatus':true},
				anchor:'100%'
			})
			]
		});

		this.singleCheckbox.on('check', function(checkbox,checked){
			if (this.selectUser.isVisible())
				this.selectUser.setDisabled(!checked);
			if (this.selectProject.isVisible())
				this.selectProject.setDisabled(!checked);
		},this);
		this.detailedCheckbox.on('check', function(checkbox,checked){
			this.itemTemplate.setDisabled(!checked);
		},this);

		this.recipientCombo.on('change', function(combobox,newValue,oldValue){
			if (newValue=='payout_timeregistration_users') {
				this.itemTemplate.setValue(GO.projects2.payout_item_template);
				this.summaryItemTemplate.setValue(GO.projects2.summary_payout_item_template);
				
				this.selectUser.setDisabled(!this.singleCheckbox.getValue());
				this.selectUser.setVisible(true);
				this.selectProject.setDisabled(true);
				this.selectProject.setVisible(false);
				
			} else if (newValue=='abonnementsgeld') {				
				this.itemTemplate.setValue(GO.projects2.bill_item_template);
				this.summaryItemTemplate.setValue(GO.projects2.summary_bill_item_template);
				
				this.selectUser.setDisabled(!this.singleCheckbox.getValue());
				this.selectUser.setVisible(true);
				this.selectProject.setDisabled(true);
				this.selectProject.setVisible(false);
			} else {
				this.itemTemplate.setValue(GO.projects2.bill_item_template);
				this.summaryItemTemplate.setValue(GO.projects2.summary_bill_item_template);
				this.selectUser.setDisabled(true);
				this.selectUser.setVisible(false);
				this.selectProject.setDisabled(!this.singleCheckbox.getValue());
				this.selectProject.setVisible(true);
				
			}
		}, this);

		this.buttons=[
		{
			text:t("Ok"),
			handler: this.submitForm,
			scope: this
		},
		{
			text:t("Close"),
			handler: function(){
				this.hide()
			},
			scope: this
		}];

		this.addEvents({
			'invoice': true
		});

		this.formPanel.form.timeout=300;

		GO.projects2.InvoiceDialog.superclass.initComponent.call(this);
	},
	submitForm : function(){
		
		if (GO.util.empty(this.actionUrls[this.recipientCombo.getValue()])) {
			Ext.MessageBox.alert(t("Error"),'Please inform the administrator the following: server request path not found for '+this.recipientCombo.getValue()+'.');
		} else {
			this.formPanel.form.url = this.actionUrls[this.recipientCombo.getValue()];
			this.formPanel.form.submit({
				waitMsg:t("Saving..."),
				success:function(form, action){

					if (this.recipientCombo.getValue()=='payout_timeregistration_users') {
						GO.projects2.payout_item_template = this.itemTemplate.getValue();
						GO.projects2.summary_payout_item_template = this.summaryItemTemplate.getValue();
					} else {
						GO.projects2.bill_item_template = this.itemTemplate.getValue();
						GO.projects2.summary_bill_item_template = this.summaryItemTemplate.getValue();
					}

					//if(GO.util.empty())
					//this.hide();

					this.fireEvent('import');

					Ext.MessageBox.alert(t("Success"), action.result.feedback);
				},
				failure: function(form, action) {
					if(action.failureType == 'client')
					{
						Ext.MessageBox.alert(t("Error"), t("You have errors in your form. The invalid fields are marked."));
					} else {
						Ext.MessageBox.alert(t("Error"), action.result.feedback);
					}
				},
				scope: this
			});
		}
				
	},
	changeMonth : function(increment)
	{
		var date = this.startDate.getValue();
		date = date.add(Date.MONTH, increment);
		this.startDate.setValue(date.getFirstDateOfMonth().format(GO.settings.date_format));
		this.endDate.setValue(date.getLastDateOfMonth().format(GO.settings.date_format));
	},
	show:function(config){
		config = config || {};

		this.formPanel.baseParams.project_id=config.project_id;

		this.separateCheck.setValue(config.project_id==0);
		this.togetherCheck.setValue(config.project_id>0);

		this.togetherCheck.setDisabled(config.project_id==0);
		this.separateCheck.setDisabled(config.project_id==0);

		GO.projects2.InvoiceDialog.superclass.show.call(this);
		this.selectUser.setVisible(this.recipientCombo.getValue()=='payout_timeregistration_users');
	}
});

