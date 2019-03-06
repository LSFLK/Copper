GO.projects2.InvoiceProjectDialog = Ext.extend(Ext.Window, {

	width: 960,
	//autoHeight: true,
	maximizable:true,
	
	
	
	initComponent : function(){

this.buttons = [{
		text:t("Create invoice"),
		handler: this.submitForm,
		scope: this
	}];	

		this.title = t("Invoice", "projects2");

		var now = new Date();
		//var lastMonth = now.add(Date.MONTH, -1);
		var startOfLastMonth = now.getFirstDateOfMonth();
		var endOfLastMonth = now.getLastDateOfMonth();
		
		this.recipientCombo = new Ext.form.ComboBox({
			anchor:'0',
			fieldLabel : t("Recipient", "projects2"),
			hiddenName : 'recipient',
			store : new Ext.data.SimpleStore({
				fields : ['value', 'text'],
				data : [
					['company_id', t("Customer")],
					['contact_id', t("Contact", "projects2")]
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

		this.selectBook = new GO.form.ComboBox({
			anchor:'0',
			fieldLabel: t("Book", "billing"),
			hiddenName:'book_id',
			emptyText:t("Please select..."),
			store: new GO.data.JsonStore({
				url: GO.url("billing/book/store"),
				baseParams: {
					permissionLevel: GO.permissionLevels.write
				},
				root: 'results',
				id: 'id',
				totalProperty:'total',
				fields: ['id','name','checked', 'user_name', 'report_checked','country'],
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

		var checkTime = new GO.grid.CheckColumn({
			header: '&nbsp;',
			name: 'checked',
			dataIndex: 'checked',
			width: dp(40)
		});
		
		var checkIncome = new GO.grid.CheckColumn({
			header: '&nbsp;',
			name: 'checked',
			dataIndex: 'checked',
			width: dp(40)
		});
		
		var timeGrid = {
			xtype:'grid',
			plugins: [checkTime],
			height: 400,
			tbar : [this.startTimeFilter = new Ext.form.DateField({
					//xtype:'datefield',
					name:'from',
					fieldLabel:t('From'),
					value: startOfLastMonth,
					listeners : {
						change: function(me,oldVal,newVal) {
							this.timeStore.baseParams.start_date = newVal.format('Y-m-d');
							this.timeStore.load();
						},scope:this
					}
				}),this.endTimeFilter = new Ext.form.DateField({
					//xtype:'datefield',
					name:'till',
					fieldLabel:t('Till'),
					value: endOfLastMonth,
					listeners : {
						change: function(me,oldVal,newVal) {
							this.timeStore.baseParams.end_date = newVal.format('Y-m-d');
							this.timeStore.load();
						},scope:this
					}
				})
			],
			store: this.timeStore = new GO.data.JsonStore({
				url:GO.url("projects2/timeEntry/store"),
				fields:['id','is_invoiced','checked', 'external_fee', 'user_displayName', 'comments','units','duration'],
				baseParams: {
					project_id: this.projectId,
					invoiced:false,
					start_date: this.startTimeFilter.getValue().format('Y-m-d'),
					end_date: this.endTimeFilter.getValue().format('Y-m-d'),
					limit: 1000
				}
			}),
			cm:new Ext.grid.ColumnModel({
				columns:[checkIncome,{
					header: t("Duration"),
					dataIndex: 'units',
					align:'right',
					width:80
				},{
					header: t("Cost"),
					dataIndex: 'external_fee',
					align:'right',
					width:100,
					renderer: function(val, meta, r) {
						var fee = GO.util.unlocalizeNumber(val);
						return go.User.currency + GO.util.numberFormat(fee * r.data.duration / 60, 2);
					}
				},{
					header: t("Employee"),
					dataIndex: 'user_displayName'
				},{
					header: t("Description"),
					dataIndex: 'comments',
					width:300
				}]
			})
		};
		var incomeGrid = {
			xtype:'grid',
			plugins: [checkTime],
			height: 400,
			tbar : [new Ext.form.Checkbox({
					//name: 's',
					boxLabel: t('Show schedualed'),
					value: false,
					listeners: {
						check: function(me, checked) {
							if(!checked) {
								this.incomeStore.baseParams.end = (new Date)/1000;
							} else {
								delete this.incomeStore.baseParams.end;
							}
							this.incomeStore.reload();
						},scope:this
					}
				})
			],
			store: this.incomeStore = new GO.data.JsonStore({
				url:GO.url("projects2/income/store"),
				fields:['id','comments','checked', 'description', 'invoice_at','is_invoiced', 'amount'],
				baseParams: {
					project_id: this.projectId,
					show_invoiced:false,
					end: (new Date)/1000,
					limit: 1000
				}
			}),
			cm:new Ext.grid.ColumnModel({
				columns:[checkTime,{
					header: t("Total"),
					dataIndex: 'amount',
					width:80,
					renderer: function(val, meta, r) {
						return go.User.currency + val;
					}
				},{
					header: t("Invoice at"),
					dataIndex: 'invoice_at'
				},{
					header: t("Description"),
					dataIndex: 'description',
					width: 200
				},{
					header: t("Comments"),
					dataIndex: 'comments',
					renderer: GO.grid.ColumnRenderers.Text
				}]
			})
		};
		
		this.items=this.formPanel = new Ext.form.FormPanel({
			baseParams:{
				income_ids: []
			},
			waitMsgTarget:true,
			items:[{
					xtype:'container',
					layout: 'form',
					style: 'padding: 0 16px',
					items:[{
						xtype: 'plainfield',
						value: t('To create an invoice for this project, select time entry and income records you want to bill'),
						hideLabel: true
					},
					this.recipientCombo,
					this.selectBook,
					this.itemTemplate = new Ext.form.TextArea({
						name:'time_template',
						fieldLabel: t("Time Template", "projects2"),
						value: GO.projects2.bill_item_template,
						anchor : '100%'
					}),
					new Ext.form.Checkbox({
						name: 'groupByEmployee',
						boxLabel: t('Group time by employee on invoice'),
						value: true
					})]
				},
				{
					xtype:'container',
					layout: 'column',
					items:[{
						columnWidth: .5,
						items: [{
							title: 'Time',
							layout: 'form',
							items: [
								timeGrid
							]
						}]
					},{
						columnWidth: .5,
						title: 'Income',
						layout: 'form',
						items: [
							incomeGrid
						]
					}]
				}
			]
		});

		GO.projects2.InvoiceProjectDialog.superclass.initComponent.call(this);
	},
	submitForm : function(){
		this.timeStore.commitChanges();
		this.incomeStore.commitChanges();
		var timeIds = [];
		var incomeIds = [];
		
		this.timeStore.each(function(record) {
			if(record.data.checked === true) {
				timeIds.push(record.id);
			}
		});
		
		this.incomeStore.each(function(record) {
			if(record.data.checked === true) {
				incomeIds.push(record.id);
			}
		});
		
		this.formPanel.form.baseParams.incomeIds = Ext.encode(incomeIds);
		this.formPanel.form.baseParams.timeIds = Ext.encode(timeIds);
		
		this.formPanel.form.submit({
			url: GO.url('projects2/invoice/create'),
			waitMsg:t("Saving..."),
			success:function(form, action){
				this.close();
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
		if (GO.util.empty(config.projectId)) {
			Ext.MessageBox.alert(t("Error"),t("No project selected.", "projects2"));
		} else {
			this.formPanel.form.baseParams.project_id = config.projectId;
			
			GO.projects2.InvoiceProjectDialog.superclass.show.call(this);
			this.timeStore.baseParams.project_id = config.projectId;
			this.timeStore.load();
			this.incomeStore.baseParams.project_id = config.projectId;
			this.incomeStore.load();
//			GO.request({
//				url: 'projects2/income/loadItemTemplate',
//				success: function(response,options,result) {
//					this.itemTemplate.setValue(result.template);
//				},
//				scope: this
//			});
		}
	}
});

