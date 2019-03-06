GO.projects2.BillingInvoiceDialog = Ext.extend(GO.Window, {

	initComponent : function(){

		this.title=t("Bill", "projects2");

		this.width=500;
		this.autoHeight=true;

		this.closeAction='hide';


		var now = new Date();
		var lastMonth = now.add(Date.MONTH, -1);
		var startOfLastMonth = lastMonth.getFirstDateOfMonth();
		var endOfLastMonth = lastMonth.getLastDateOfMonth();

		this.selectBook = new GO.form.ComboBox({
			fieldLabel: t("Book", "billing"),
			hiddenName:'book_id',
			anchor:'-20',
			emptyText:t("Please select..."),
			store: new GO.data.JsonStore({
				url: GO.url("billing/book/store"),
				baseParams: {
					permissionLevel: GO.permissionLevels.write
				},
				root: 'results',
				id: 'id',
				totalProperty:'total',
				fields: ['id','name', 'user_name', 'report_checked','country'],
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
			baseParams:{
//				task:'invoice',
				income_ids: []
			},
			bodyStyle:'padding:5px',
			waitMsgTarget:true,
			items:[
			{
				xtype: 'plainfield',
				value: t("This allows you to bill the postcalculations into the Billing module.", "projects2"),
				hideLabel: true
			},
			this.selectBook,
			this.itemTemplate = new Ext.form.TextArea({
				name:'item_template',
				fieldLabel: t("Invoice item template", "projects2"),
				value: GO.projects2.bill_item_template,
				anchor : '100%'
			})]
		});

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

		GO.projects2.BillingInvoiceDialog.superclass.initComponent.call(this);
	},
	submitForm : function(){
		
		this.formPanel.form.submit({
			url: GO.url('projects2/income/billingInvoice'),
			waitMsg:t("Saving..."),
			success:function(form, action){
//				Ext.MessageBox.alert(t("Success"), action.result.feedback);
				this.hide();
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
				
	},
	show:function(config){
		config = config || {};
		if (GO.util.empty(config.income_ids)) {
			Ext.MessageBox.alert(t("Error"),t("No incomes have been invoiced.", "projects2"));
		} else {
			this.formPanel.baseParams.income_ids=Ext.encode(config.income_ids);
			GO.projects2.BillingInvoiceDialog.superclass.show.call(this);
			GO.request({
				url: 'projects2/income/loadItemTemplate',
				success: function(response,options,result) {
					this.itemTemplate.setValue(result.template);
				},
				scope: this
			});
		}
	}
});

