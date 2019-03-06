GO.leavedays.YearCreditDialog = Ext.extend(GO.dialog.TabbedFormDialog, {

	initComponent: function() {

		Ext.apply(this, {
//			titleField:'user_name',
			goDialogId: 'yearcredit',
			title: t("Year credit", "leavedays"),
			autoScroll:true,
			width: 450,
			jsonPost:true,
			updateAction: 'update',
			createAction: 'create',
			formControllerUrl: 'leavedays/yearCredit'
		});

		GO.leavedays.YearCreditDialog.superclass.initComponent.call(this);
	},
	buildForm: function() {

		this.propertiesPanel = new Ext.Panel({
			layout: 'form',
			waitMsgTarget: true,
			baseParams: {},
			autoHeight: true,
			border: false,
			items: [new Ext.form.FieldSet({items:[this.yearField = new GO.form.ComboBox({
					fieldLabel: t("Year", "leavedays"),
					hiddenName: 'YearCredit.year',
					anchor: '100%',
					emptyText: t("Please select..."),
					store: new GO.data.JsonStore({
						url: GO.url('leavedays/leaveday/yearsStore'),
						root: 'results',
						totalProperty: 'total',
						id: 'year',
						fields: ['year'],
						remoteSort: true
					}),
					pageSize: parseInt(GO.settings.max_rows_list),
					valueField: 'year',
					displayField: 'year',
					mode: 'remote',
					triggerAction: 'all',
					editable: false,
					selectOnFocus: true,
					forceSelection: true,
					allowBlank: false
				}), this.selectUserField = new GO.form.SelectUser({
					fieldLabel: t("Employee", "leavedays"),
					hiddenName: 'YearCredit.user_id',
					allowBlank: false,
					anchor: '100%'

				}),
				 this.selectUserManagerField = new GO.form.SelectUser({
					hiddenName: 'YearCredit.manager_user_id',
					fieldLabel: t("Manager", "leavedays"),
					allowBlank: false,
					anchor: '100%'
				}),
			]}),
				this.yearCreditComponent = new Ext.form.FieldSet({
					title: t("Year credit", "leavedays")
//				  autoHeight: true
				})
				
				]
		});

		this.addPanel(this.propertiesPanel);
	},
	
	afterLoad: function(remoteModelId, config, action) {
		
		this.formPanel.getForm().setValues(action.result.data);
		this.setRemoteComboTexts(action);
		
		if(action.result.data.yearCredits) {
			this.updateYearCreditComponent(action.result.data.yearCredits);
		}
	},
	
//	getSubmitParams: function () {
//		var params = this.formPanel.getForm().getValues();
//		for(var i=0; i < this.yearCreditFields.length; i++) {
//			var field = this.yearCreditFields[i];
//			params['YearCredit.yearCredits'][field.name] = {id:field.name,  n_hours: field.getValue()};
//		}
//		
//		return params;
//	},

afterShowAndLoad : function (remoteModelId, config, result){
		if(this.isNew()) {
			this.selectUserField.enable();
		} else {
			this.selectUserField.disable();
		}
	},
	
	
	updateYearCreditComponent: function(list){
		this.yearCreditComponent.removeAll();
		this.yearCreditFields = [];
		
		for(var i in list) {
			var yearCreditItem = list[i];
			var tipId = Ext.id();
			var field =  new GO.form.NumberField({
				fieldLabel: yearCreditItem.name,
				name: 'YearCredit.yearCredits.'+yearCreditItem.id,
				yearCredit: yearCreditItem,
				decimals: 2,
				maxValue: 8784
			});
			
			field.setValue(yearCreditItem.n_hours);
			
			this.yearCreditFields.push(field);
		
		}
		this.yearCreditComponent.add(this.yearCreditFields);
		this.doLayout();
		
	}
	
});
