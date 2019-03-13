/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @copyright Copyright Intermesh
 * @version $Id: ProjectDialog.js 23462 2018-03-06 11:37:47Z mschering $
 * @author Merijn Schering <mschering@intermesh.nl>
 */
GO.projects2.ProjectDialog = function(config){
	if(!config)
	{
		config={};
	}

	config.goDialogId='project';
	
	this.buildForm();
	
	var focusName = function(){
		this.nameField.focus();		
	};

	config.stateId='pm-project-dialog';
	config.collapsible=true;
	config.maximizable=true;
	config.layout='fit';
	config.modal=false;
	config.resizable=true;
	config.width=750;
	config.height=500;
	if(!config.closeAction) {
		config.closeAction='hide';
	}
	config.title= t("Project", "projects2");					
	config.items= this.formPanel;
	config.focus= focusName.createDelegate(this);
	config.buttons=[{
		text: t("Apply"),
		handler: function(){
			this.submitForm();
		},
		scope:this
	},{
		text: t("Save"),
		handler: function(){
			this.submitForm(true);
		},
		scope: this
	}
	];

	
	GO.projects2.ProjectDialog.superclass.constructor.call(this, config);
	
	
	this.addEvents({
		'save' : true
	});
}

Ext.extend(GO.projects2.ProjectDialog, GO.Window,{

	permissionsPanel: null,
	
	/**
	 * If the projects needs to duplicate another
	 * set this field to the id to duplicate from
	 */
	duplicate_id: false,

	init : function(){
				
	},
	
	setLinkEntity : function(config) {		
	
		this.on('load', function() {
			switch(config.entity) {
				case "Contact":
					//	this.contact_id = config.data.id;
						this.formPanel.baseParams.contact_id=config.data.id;
						this.contactField.setValue(config.data.id);
						this.contactField.setRemoteText(config.data.name);
						if(config.data.company_id) {
							this.customerField.setValue(config.data.company_id);
							this.formPanel.baseParams.company_id=config.data.company_id;
							this.customerField.setRemoteText(config.data.company_name);					
						}
					break;

				case "Company":
						//this.company_id = config.data.id;
						this.formPanel.baseParams.company_id=config.data.id;
						this.customerField.setValue(config.data.id);
						this.customerField.setRemoteText(config.data.name);					
					break;
			}
		}, this, {single: true});
	},
	
	
	show : function (config) {

		config = config || {};

		if(!this.rendered)
			this.render(Ext.getBody());
		
		if(!this.inititalized){

			
			GO.request({
				url: 'core/multiRequest',
				maskEl:this.getEl(),
				params:{
					requests:Ext.encode({
						//templates:{r:'projects2/template/store'},
						types:{
							r:'projects2/type/store'
						},
						statuses:{
							r:'projects2/status/store',
							forEditing:true
						}
					})
				},
				success: function(options, response, result)
				{
					//GO.projects2.templatesStore.loadData(result.templates);
					GO.projects2.typesStore.loadData(result.types);
					GO.projects2.statusesStore.loadData(result.statuses);

					this.inititalized=true;
                    
					if(GO.util.empty(this.selectType.getValue()))
						this.selectType.selectFirst();

					this.show(config);
				},
				scope:this
			});
			return false;
		}

		this.duplicate_id = config.duplicate_id || false;
		if(!config.project_id)
		{
			config.project_id=0;
			

			if(typeof(config.template_id) == "undefined")
			{
				if(!this.selectTemplateWindow){
					this.selectTemplateWindow =new GO.projects2.SelectTemplateWindow();
					this.selectTemplateWindow.projectDialog = this;
				}
				this.selectTemplateWindow.show(config);
				return false;
			}else
			{
				if(!GO.settings.modules.projects2.write_permission)
					this.formPanel.baseParams.template_id=config.template_id;

				config.values = config.values || {};
				config.values.template_id=config.template_id;
			}
		}

		this.formPanel.form.reset();
		this.selectType.setDisabled(!GO.settings.modules.projects2.write_permission);
		this.templateSelect.setDisabled(!GO.settings.modules.projects2.write_permission);
		
//		this.formPanel.baseParams.company_id=0;		
//		this.formPanel.baseParams.contact_id=0;		
		
		this.parent_project_id=this.formPanel.baseParams.parent_project_id=config.parent_project_id;
		
		this.propertiesPanel.show();		
			
		this.setProjectId(config.project_id);
		
//		if(config.project_id>0)
//		{

			//this.tabPanel.hideTabStripItem(this.associationsPanel);
                this.formPanel.load({
                    url : GO.url('projects2/project/load'),
                    params:{
                        template_id:!config.project_id ? config.values.template_id : 0
                    },
                    success:function(form, action)
                    {
                        if(this.permissionsPanel)
                                this.permissionsPanel.setAcl(action.result.data[this.permissionsPanel.fieldName]);
                        this.setWritePermission(action.result.data.write_permission);


												this.formPanel.baseParams.company_id=action.result.data.company_id;
                        this.formPanel.baseParams.contact_id=action.result.data.contact_id;
                        this.parent_project_id=this.formPanel.baseParams.parent_project_id=action.result.data.parent_project_id;

                        this.selectType.setDisabled(action.result.data.permission_level<GO.permissionLevels.writeAndDelete );
                        this.templateSelect.setDisabled(action.result.data.permission_level<GO.permissionLevels.writeAndDelete );

                        this.applyTemplate(action.result.data.template);
                        this.setTitle(this.title + ": " + action.result.data.name);

                        //applytemplate might have rendered new form fields
                        var v = Ext.apply(action.result.data, config.values);
                        this.setValues(v);
                        this.selectUser.setRemoteText(action.result.remoteComboTexts.responsible_user_id);
                        this.selectType.setRemoteText(action.result.remoteComboTexts.type_id);
                        this.selectParentProject.setRemoteText(action.result.data.parent_project_name);

                        //Remove the disabled customer field tabs
                        if(go.Modules.isAvailable("core", "customfields"))
                                GO.customfields.disableTabs(this.tabPanel, action.result);

                        GO.projects2.ProjectDialog.superclass.show.call(this);
												
												this.fireEvent('load', this);
                    },
                    failure:function(form, action)
                    {
                        GO.errorDialog.show(action.result.feedback)
                    },
                    scope: this

                });
//		}

	},
	
	setWritePermission : function(writePermission)
	{
		this.buttons[0].setDisabled(!writePermission);
		this.buttons[1].setDisabled(!writePermission);
	},
	
	setValues : function(values)
	{
		if(values)
		{
			for(var key in values)
			{
				var field = this.formPanel.form.findField(key);
				if(field)
				{
					field.setValue(values[key]);
				}
			}
		}
		
	},
	setProjectId : function(project_id)
	{
		this.formPanel.form.baseParams['id']=project_id;
		this.project_id=project_id;

		if(this.createType){
			this.createType.getEl().up('.x-form-item').setDisplayed(project_id==0);

			this.newTypeName.getEl().up('.x-form-item').setDisplayed(false);
			this.newTypeName.allowBlank=true;
		}
		

		
		if(this.feesPanel){
			this.feesPanel.setProjectId(project_id);
			if(project_id==0)
				this.feesPanel.setDisabled(true);
			else
				this.feesPanel.setDisabled(false);
		}
		
		this.expensesPanel.setProjectId(project_id);
		if (this.incomePanel)
			this.incomePanel.setProjectId(project_id);
		
		this.expenseBudgetsGrid.setProjectId(project_id);
	
		this.timeEntryGrid.setProjectId(project_id);
	},
	
	submitForm : function(hide){
		
		var params={};
		if(this.expensesPanel.store.loaded){
			params['expenses']=Ext.encode(this.expensesPanel.getGridData());
		}
		
		if(!GO.settings.modules.projects2.write_permission)
			params.type_id=this.selectType.getValue();

		var submitUrl = (!this.duplicate_id) ? 
			GO.url('projects2/project/submit') : 
			GO.url('projects2/project/duplicate');
		this.formPanel.form.submit(
		{
			url:submitUrl,
			params: params,
			waitMsg:t("Saving..."),
			success:function(form, action){

				if(action.result.parent_project_id)
				{
					this.parent_project_id = action.result.parent_project_id;
				}
				//console.log(action.result[this.permissionsPanel.fieldName]);
				if (this.permissionsPanel && action.result[this.permissionsPanel.fieldName]) {
					this.permissionsPanel.setAcl(action.result[this.permissionsPanel.fieldName]);
				}
				if(action.result.id)
				{	
					this.nameField.setValue(this.nameField.getValue().replace('{autoid}',action.result.id));

					this.setProjectId(action.result.id, true);
				}

				if(action.result.type_id){					
					this.selectType.store.reload({
						callback:function(){
							this.selectType.setValue(action.result.type_id);
						},
						scope:this
					});
				}

		

				if(this.feesPanel)
					this.feesPanel.store.commitChanges();
				
				this.fireEvent('save', this, this.project_id, this.parent_project_id);	
				
				GO.dialog.TabbedFormDialog.prototype.refreshActiveDisplayPanels.call(this);
				
				if(hide)
				{
					this.hide();	
				}
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

	applyTemplate : function(templateData){
		var showCustomerField = true;
		var showContactField = true;
		var showResUserIdField = true;
		//var showStatusDate=true;
		var showStatus=true;
		var showDate=true;
		var showBudgetFees=true;
		var showExpenses=true;
//		var showCalendar=false;
//		var showTasklist=false;
		var showMileageRegistration=false;
		var showDefaultDistance=false;
		var showTravelCosts=false;
		var showIncome=true;
		var showReferenceNo=true;


		if(!templateData){
			var record = GO.projects2.templatesStore.getById(this.templateSelect.getValue());
			if(record)
				templateData=record.data;
		}else
		{
			this.templateSelect.setRemoteText(templateData.name);
		}
		if(templateData)
			this.loadedTemplateID=templateData.id;


		if(this.templatePanels){

			for(var i=0,count=this.templatePanels.length;i<count;i++)
			{
				//remove will destoy tab. Without destorying form elements are note
				//removed from the Ext.form.BasicForm which causes problems.



				//hack to remove formfields from basicform
				//this.formPanel.processRemove(this.templatePanels[i]);

				//this.templatePanels[i].items.each(this.formPanel.form.remove, this.formPanel.form);

				this.tabPanel.remove(this.templatePanels[i], true);
			}
		}
			
		if(templateData)
		{
			var defaultStatusId = templateData.default_status_id;
			if(defaultStatusId>0 && this.project_id==0){
				this.formPanel.form.findField('status_id').setValue(defaultStatusId);
			}

			var defaultTypeId = templateData.default_type_id;
			if(defaultTypeId>0 && this.project_id==0){
				this.selectType.setValue(defaultTypeId);

				if(templateData.default_type_name)
					this.selectType.setRemoteText(templateData.default_type_name);
			}

			this.setTitle(templateData.name);
			var fieldString = templateData.fields;
			var fields = fieldString.split(',');
			showCustomerField=fields.indexOf('customer')>-1;
			showContactField=fields.indexOf('contact')>-1;
			showResUserIdField=fields.indexOf('responsible_user_id')>-1;
			//showStatusDate=fields.indexOf('status_date')>-1;
			showStatus=fields.indexOf('status')>-1;
			showDate=fields.indexOf('date')>-1;
			showBudgetFees=fields.indexOf('budget_fees')>-1 && GO.timeregistration2;
			showExpenses=fields.indexOf('expenses')>-1;
//			showCalendar=fields.indexOf('calendar')>-1;
//			showTasklist=fields.indexOf('tasklist')>-1;
			showMileageRegistration=fields.indexOf('mileage_registration')>-1;
			showDefaultDistance=fields.indexOf('default_distance')>-1;
			showTravelCosts=fields.indexOf('travel_costs')>-1;
			showIncome=fields.indexOf('income')>-1;
			showReferenceNo=fields.indexOf('reference_no')>-1;

			if(GO.projects2.templates && GO.projects2.templates[templateData.id])
			{
				//get the values because panels that are destroyed might contain fields
				//that will be added empty again.
				var orgValues = this.formPanel.form.getValues();					

				this.tabPanel.doLayout();

				this.formPanel.form.setValues(orgValues);
			}
		}else
		{
			this.setTitle(t("Project", "projects2"));
			this.tabPanel.items.each(function(p){
				if(p.category_id)
					this.tabPanel.unhideTabStripItem(p.id);
			}, this);

		}
		this.templatePanels=[];
		if(go.Modules.isAvailable("core", "customfields") && GO.customfields.types["GO\\Projects2\\Model\\Project"])
		{
			for(var i=0;i<GO.customfields.types["GO\\Projects2\\Model\\Project"].panels.length;i++)
			{
				this.templatePanels.push(this.tabPanel.add(GO.customfields.types["GO\\Projects2\\Model\\Project"].panels[i]));
			}
		}
			
		if(this.customerField)
			this.customerField.getEl().up('.x-form-item').setDisplayed(showCustomerField);

		if(this.contactField)
			this.contactField.getEl().up('.x-form-item').setDisplayed(showContactField);

		this.selectUser.getEl().up('.x-form-item').setDisplayed(showResUserIdField);
		//			this.budgetAndFees.getEl().up('.x-form-item').setDisplayed(showBudgetFees);



		if(this.feesPanel){
			if(showBudgetFees){
				this.tabPanel.unhideTabStripItem(this.timeEntryGrid);
				this.tabPanel.unhideTabStripItem(this.feesPanel);
			}else
			{
				this.tabPanel.hideTabStripItem(this.timeEntryGrid);
				this.tabPanel.hideTabStripItem(this.feesPanel);
			}
		}

		if(showExpenses){
			this.tabPanel.unhideTabStripItem(this.expenseBudgetsGrid);
			this.tabPanel.unhideTabStripItem(this.expensesPanel);
		}else
		{
			this.tabPanel.hideTabStripItem(this.expenseBudgetsGrid);
			this.tabPanel.hideTabStripItem(this.expensesPanel);
		}
			
		if (showIncome) {
			this.tabPanel.unhideTabStripItem(this.incomePanel);
			this.incomeField.setVisible(true);
			this.incomeField.setDisabled(false);
		} else {
			this.tabPanel.hideTabStripItem(this.incomePanel);
			this.incomeField.setVisible(false);
			this.incomeField.setDisabled(true);
		}
			
//		this.mileageDistance.setVisible(showMileageRegistration);
//		if(showMileageRegistration)
//			this.tabPanel.unhideTabStripItem(this.mileageRegistrationGrid);
//		else
//			this.tabPanel.hideTabStripItem(this.mileageRegistrationGrid);
//			

		this.statusField.setVisible(showStatus);
		this.dateFields.setVisible(showDate);
		
		this.mileageDistance.setVisible(showDefaultDistance);
		this.mileageDistance.setDisabled(!showDefaultDistance);
		this.travelCosts.setVisible(showTravelCosts);
		this.travelCosts.setDisabled(!showTravelCosts);
		this.referenceNoField.setVisible(showReferenceNo);
		this.referenceNoField.setDisabled(!showReferenceNo);
	},
	
	buildForm : function () {
		
		var items = [];

		var leftCol = new Ext.Panel({
			itemId:'leftCol',
			columnWidth: .6,
			layout:'form',
			border:false
		});

		
		leftCol.add(this.selectParentProject = new GO.projects2.SelectProject({
			fieldLabel: t("Parent project", "projects2"),
			emptyText:t("Search project", "projects2"),
			hiddenName: 'parent_project_id',
			anchor:'100%',
			minListWidth:600,
			region: 'northdele',
			store:new GO.data.JsonStore({
				url: GO.url('projects2/project/store'),
				fields:['id', 'path','use_tasks_panel'],
				remoteSort: true
			})
			
		}));
		
		leftCol.add(this.nameField = new Ext.form.TextField({
			name: 'name',
			anchor: '100%',
			allowBlank:false,
			fieldLabel: t("Name", "projects2")
		}));
		

		leftCol.add(this.templateSelect = new GO.projects2.SelectTemplate({
			anchor:'100%',
			fieldLabel: t("Template", "projects2"),
			hiddenName:'template_id',
			store:GO.projects2.templatesStore,
			valueField:'id',
			displayField:'name',
			mode: 'local',
			triggerAction: 'all',
			editable: false,
			selectOnFocus:true,
			disabled:false, //!GO.settings.modules.projects2.write_permission,
//			readOnly: true,
			listeners:{
				change:function(){
					this.applyTemplate();
				},
				scope:this
			}
		}));

		if(GO.settings.modules.projects2.write_permission){
			leftCol.add(this.createType = new Ext.form.Checkbox({
				name:'create_type',
				hideLabel:true,
				boxLabel:t("Create new permission type", "projects2"),
				listeners:{
					check:function(cb, checked){
						this.selectType.getEl().up('.x-form-item').setDisplayed(!checked);
						this.selectType.setDisabled(checked);
						this.newTypeName.getEl().up('.x-form-item').setDisplayed(checked);
						this.newTypeName.allowBlank=!checked;
						this.newTypeName.setValue(this.nameField.getValue());
					},
					scope:this
				}
			}));
		

			leftCol.add(this.newTypeName = new Ext.form.TextField({
				name:'new_type_name',
				fieldLabel:t("Name"),
				anchor:'100%'
			}));
		}

		leftCol.add(this.selectType = new GO.projects2.SelectType({    		
			anchor:'100%',
			allowBlank:false
		}));



		leftCol.add(new GO.form.HtmlComponent({
			html:'<br />',
			hideLabel:true
		}));

		leftCol.add(this.selectUser = new GO.projects2.SelectEmployee({
			hiddenName:'responsible_user_id',
			fieldLabel:t("Manager", "projects2"),
			anchor:'100%',
			allowBlank:true
		}));
		

		

		if(go.Modules.isAvailable("legacy", "addressbook"))
		{  
			this.contactField = new GO.addressbook.SelectContact({
				anchor:'100%',
				fieldLabel: t("Contact", "projects2"),
				name:'contact',
				//hiddenName: "contact_id"
			});
			leftCol.add(this.contactField);
			this.customerField = new GO.addressbook.SelectCompany({
				anchor:'100%',
				fieldLabel: t("Customer", "projects2"),
				name: 'customer',
				//hiddenName: "company_id"
			});
			leftCol.add(this.customerField);
//			this.on('show',function(){
				//this.customerField.store.load();
//			}, this);
			
			this.customerField.on('select', function(combo, record){
				this.formPanel.baseParams.company_id=record.data.id;
			}, this);
			this.customerField.on('clear', function(combo){
				this.formPanel.baseParams.company_id=0;
			}, this);
			this.contactField.on('select', function(combo, record){
				this.formPanel.baseParams.contact_id=record.data.id;
				if (record.data.company_id>0) {
					GO.request({
						url: 'addressbook/company/load',
						params: {id: record.data.company_id},
						success: function(options, response, result)
						{
							if (result.data.id && result.data.name_and_name2) {
								var record = new Ext.data.Record();
								record.set('id',result.data.id);
								record.set('name_and_name2',result.data.name_and_name2);
								this.customerField.store.add([record]);
								this.customerField.setValue(record.data.id);
								
								//this.formPanel.baseParams.company_id=record.data.id;	
								
								
							}
						},
						scope: this
					});
				} else {
					this.customerField.reset();
				}
			}, this);
			
			this.contactField.on('clear', function(combo){
				this.formPanel.baseParams.contact_id=0;
			}, this);
			
		}


		var rightCol = new Ext.Panel({
			itemId:'rightCol',
			columnWidth: .4,
			layout:'form',
			border:false
		});

		
		this.statusField = new Ext.form.ComboBox({
			//xtype:'combo',
			anchor:'100%',
			fieldLabel: t("Status", "projects2"),
			hiddenName:'status_id',
			store:GO.projects2.statusesStore,
			valueField:'id',
			displayField:'name',
			mode: 'local',
			triggerAction: 'all',
			editable: false,
			selectOnFocus:true,
			forceSelection: true,
			allowBlank:false
		});
		
		rightCol.add(this.statusField);

		var now = new Date();
		

		this.dateFields = new Ext.Panel({
			border:false,
			layout:'form',
			forceLayout:true,
			bodyStyle:'padding:0px',
			items:[{
				xtype:'datefield',
				name: 'start_time',
				width:dp(146),
				format: GO.settings['date_format'],
//				allowBlank:false,
				fieldLabel: t("Start date", "projects2"),
				value: now.format(GO.settings.date_format)
			},{
				xtype:'datefield',
				format: GO.settings['date_format'],
				name: 'due_time',
				width:dp(146),
//				allowBlank:true,
				fieldLabel: t("Due at", "projects2")//,
			//value: now.format(GO.settings.date_format)
			}]
		});

		rightCol.add(this.dateFields);
    
		rightCol.add(this.mileageDistance = new GO.form.NumberField({
			name:'default_distance',
			fieldLabel:t("Default distance", "projects2"),
			anchor:'100%'
		}));
			
		rightCol.add(this.travelCosts = new GO.form.NumberField({
			name:'travel_costs',
			fieldLabel:t("Travel costs", "projects2"),
			anchor:'100%'
		}));

		rightCol.add(this.incomeField = new Ext.form.ComboBox({
			anchor:'-20',
			fieldLabel : t("Income type", "projects2"),
			hiddenName : 'income_type',
			store : new Ext.data.ArrayStore({
				fields : ['value', 'text'],
				data : [
				[1, t("Contract Price", "projects2")],
				[2, t("Post calculation", "projects2")],
				[3, t("Not billable", "projects2")]
				]
			}),
			value : 'income_type',
			valueField : 'value',
			displayField : 'text',
			mode : 'local',
			triggerAction : 'all',
			editable : false,
			selectOnFocus : true,
			forceSelection : true
		}));

		rightCol.add(this.referenceNoField = new Ext.form.TextField({
			anchor: '-20',
			fieldLabel : t("Reference no.", "projects2"),
			name: 'reference_no',
			maxLength: 64
		}));

		var description = new Ext.form.TextArea({
			name: 'description',
			anchor: '100% 100%',			
			allowBlank:true,
			fieldLabel: t("Description")
		});

		this.propertiesPanel = new Ext.Panel({
			layout:'border',
			url: GO.url('projects2/project/load'),
			border: false,
			baseParams: {},
			title:t("Properties"),					
			items:[{
					region:'north',
					autoHeight:true,
					layout:'column',
					defaults:{
						cls:'go-form-panel'
					},
					items:[leftCol, rightCol]
			},{
				cls:'go-form-panel',
				region:'center',
				layout:'form',
				border: false,
				items:[description]
			}]
		});

		var items  = [this.propertiesPanel];

		//if(GO.settings.modules.timeregistration){
		this.feesPanel = new GO.projects2.ResourceGrid();
		items.push(this.feesPanel);
          

		this.timeEntryGrid = new GO.projects2.TimeEntryGrid();
		items.push(this.timeEntryGrid);
            
		//}
		
		this.expenseBudgetsGrid =  new GO.projects2.ExpenseBudgetsGrid();
		items.push(this.expenseBudgetsGrid);
		
		this.incomePanel =  new GO.projects2.IncomeGrid({
			stateId: 'project-income-grid'
		});
		items.push(this.incomePanel);

		this.expensesPanel = new GO.projects2.ExpensesGrid();
		items.push(this.expensesPanel);

		//add
		this.permissionsPanel = new GO.grid.PermissionsPanel({
			isOverwritable: true,
			levels: [
				GO.permissionLevels.read,
				GO.permissionLevels.create,
				GO.permissionLevels.write,
				GO.permissionLevels.writeAndDelete,
				GO.projects2.permissionLevelFinance, //finance
				GO.permissionLevels.manage
			],
			levelLabels : {
				45: "Finance"
			}
		});
		items.push(this.permissionsPanel);
		
		this.tabPanel = new Ext.TabPanel({
			activeTab: 0,
			deferredRender: false,
			border: false,
			items: items,
			anchor: '100% 100%',
			enableTabScroll:true
		});
		
		this.formPanel = new Ext.form.FormPanel({
			waitMsgTarget:true,
			url: GO.url('projects2/project/load'),
			border: false,
			baseParams: {
				parent_project_id:0
			},
			items:this.tabPanel,
			labelWidth:125
		});    
	}
});
