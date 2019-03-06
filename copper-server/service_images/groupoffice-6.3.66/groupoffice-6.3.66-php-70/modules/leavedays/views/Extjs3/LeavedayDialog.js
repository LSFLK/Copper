GO.leavedays.LeavedayDialog = Ext.extend(GO.dialog.TabbedFormDialog , {
		
	enableApplyButton: false,
		
	initComponent : function(){
		
		Ext.apply(this, {
			//autoHeight:true,
			titleField:'user_name',
			height: dp(480),
			width: 700,
			updateAction: 'update',
			createAction: 'create',
			goDialogId:'leaveday',
			title:t("Holiday", "leavedays"),
			formControllerUrl: 'leavedays/leaveday',
			endDateRequired:true
		});
		
		GO.leavedays.LeavedayDialog.superclass.initComponent.call(this);
		
	},
	
	afterLoad : function(remoteModelId, config, action){
		
		this.yearField.setValue(GO.leavedays.activeYear);
		this.userIdField.setValue(GO.leavedays.activeUserId);
//		this.setTitle(config['user_name']+': '+t("Holiday", "leavedays"));
		
		if (!(remoteModelId>0)) {
			var now = new Date();
			var theDate = new Date(GO.leavedays.activeYear,now.getMonth(),now.getDate());
			this.firstDateField.setValue(theDate);
			this.lastDateField.setValue(theDate);
		}
		
		this._checkDateInput(true);

	},

	
	buildForm : function () {
		this.propertiesPanel = new Ext.form.FieldSet({
			layout: 'column',
			items: [new Ext.Panel({
				columnWidth: .7,
				border: false,
				layout:'form',
				waitMsgTarget:true,			
				items:[this.userIdField = new Ext.form.NumberField({
					hidden: true,
					decimals: 0,
					name: 'user_id'
				}),{
					xtype:'plainfield',
					name:'user_name',
					fieldLabel:t("Employee", "leavedays")
				},
				this.yearField = new GO.form.PlainField({
					fieldLabel: t("Year", "leavedays"),
					decimals: 0,
					name: 'year'
				}),
				this.firstDateField = new Ext.form.DateField({
					fieldLabel : t("First date", "leavedays"),
					name : 'first_date',
					format : GO.settings['date_format'],
					allowBlank : false,			
					listeners : {
						change : {
							fn : this._checkDateInput,
							scope : this
						}
					}
				}), this.lastDateField = new Ext.form.DateField({
					fieldLabel : t("Last date", "leavedays"),
					name : 'last_date',
					format : GO.settings['date_format'],
					allowBlank : !this.endDateRequired,			
					listeners : {
						change : {
							fn : this._checkDateInput,
							scope : this
						}
					}
				}),
				
				this.hoursCompositeField = new Ext.form.CompositeField({
					fieldLabel:t("Leave hours", "leavedays"),
					items:[
						this.hoursField = new GO.form.NumberField({
							fieldLabel : t("Leave hours", "leavedays"),
							name : 'n_hours',
							width : dp(80),
							decimals: 2,
							maxValue: 8784,
							allowBlank : true
						}), 
						this.fromTimeField = new GO.form.TimeField({
							boxLabel : t("From", "leavedays"),
							name : 'from_time',
							width : dp(100)
						}),
						this.fromTimeFieldLabel = new Ext.form.Label({
							text:t("Start time for calendar", "leavedays")
						})
					]
				}),
				
				this.nationalHolidayHoursField = new GO.form.NumberField({
					fieldLabel : t("National holiday hours", "leavedays"),
					name : 'n_nat_holiday_hours',
					width : dp(80),
					decimals: 2,
					maxValue: 8784
//					, readOnly: true
				}), this.commentsField = new Ext.form.TextField({
					fieldLabel : t("Description", "leavedays"),
					name : 'description',
					width : dp(300),
					maxLength : 50
				}),
				this.type = new GO.form.ComboBox({
					fieldLabel: t("Type", "leavedays"),
					hiddenName: 'ld_credit_type_id',
					anchor: '100%',
					emptyText: t("Please select..."),
					store: new GO.data.JsonStore({
						url:GO.url("leavedays/creditType/store"),
						fields:['id','name', 'description'],
						remoteSort:true
					}),
					pageSize: parseInt(GO.settings.max_rows_list),
					valueField: 'id',
					displayField: 'name',
					mode: 'remote',
					triggerAction: 'all',
					editable: false,
					selectOnFocus: true,
					forceSelection: true,
					allowBlank: false,
					tpl: new Ext.XTemplate(
						'<tpl for=".">',
						'<div ext:qtip="{description}" class="x-combo-list-item">{name}</div>',
						'</tpl>'
				 )
				})
				
			]
			}),new Ext.form.FieldSet({
				columnWidth: .3,
				title:t("Working hours", "leavedays"),
				border: false,
				layout:'form',
				waitMsgTarget:true,			
				items:[this.wwMoField = new GO.form.PlainField({
						xtype: 'textfield',
						fieldLabel: t("Monday", "leavedays"), 
						name:'mo_work_hours'
					}),this.wwTuField = new GO.form.PlainField({
						xtype: 'textfield',
						fieldLabel: t("Tuesday", "leavedays"), 
						name:'tu_work_hours'
					}),this.wwWeField = new GO.form.PlainField({
						xtype: 'textfield',
						fieldLabel: t("Wednesday", "leavedays"), 
						name:'we_work_hours'
					}),this.wwThField = new GO.form.PlainField({
						xtype: 'textfield',
						fieldLabel: t("Thursday", "leavedays"), 
						name:'th_work_hours'
					}),this.wwFrField = new GO.form.PlainField({
						xtype: 'textfield',
						fieldLabel: t("Friday", "leavedays"), 
						name:'fr_work_hours'
					}),this.wwSaField = new GO.form.PlainField({
						xtype: 'textfield',
						fieldLabel: t("Saturday", "leavedays"), 
						name:'sa_work_hours'
					}),this.wwSuField = new GO.form.PlainField({
						xtype: 'textfield',
						fieldLabel: t("Sunday", "leavedays"), 
						name:'su_work_hours'
					})]
			})]
		});

		this.addPanel(this.propertiesPanel);
	},
					
	_checkDateInput : function(loading) {
		
		loading = loading || false;

		var eD = this.lastDateField.getValue();
		var sD = this.firstDateField.getValue();

		if (!GO.util.empty(sD) && sD.getFullYear()!=this.yearField.getValue()) {
			Ext.MessageBox.alert('',t("The holiday entry must be completely in the year %y.", "leavedays").replace('%y',this.yearField.getValue()));
			this.firstDateField.reset();
		} else if (!GO.util.empty(eD) && eD.getFullYear()!=this.yearField.getValue()) {
			Ext.MessageBox.alert('',t("The holiday entry must be completely in the year %y.", "leavedays").replace('%y',this.yearField.getValue()));
			this.lastDateField.reset();
		}

		if (!GO.util.empty(sD) && GO.util.empty(eD) && this.endDateRequired) {
			this.lastDateField.setValue(sD);
		}

		if (!GO.util.empty(sD) && !GO.util.empty(eD)) {		
			
			if (sD > eD)
				this.lastDateField.setValue(sD);

			eD = this.lastDateField.getValue();
			sD = this.firstDateField.getValue();
			
		}
		
		if(loading === true) return;
		
		
		var params = {
				'leaveday_id' : this.remoteModelId,
				'user_id': this.userIdField.getValue(),
				'first_date' : sD.format(GO.settings.date_format)
			};
			
		if(this.endDateRequired){
			params.last_date = eD.format(GO.settings.date_format);
		} else {
			params.last_date = 0;
		}
		
		GO.request({
			url: 'leavedays/leaveday/defaultWorkingHours',
			params: params,
			success: function(options, response, result) {
				if (!GO.util.empty(result.feedback))
					Ext.MessageBox.alert('', result.feedback);

				this.hoursField.setValue(result.data['n_leave_hours']);
				this.nationalHolidayHoursField.setValue(result.data['national_holiday_hours']);
			},
			scope: this
		});

	}
	
});
