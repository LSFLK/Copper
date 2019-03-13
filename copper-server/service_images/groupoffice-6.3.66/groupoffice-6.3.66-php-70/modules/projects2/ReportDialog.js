/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @copyright Copyright Intermesh
 * @version $Id: ReportDialog.js 23305 2018-01-26 15:02:11Z mdhart $
 * @author Merijn Schering <mschering@intermesh.nl>
 */


GO.projects2.ReportDialog = Ext.extend(GO.dialog.TabbedFormDialog , {
	initComponent : function(){
		
		Ext.apply(this, {
			//			loadOnNewModel:false,
			enableApplyButton:false,
			goDialogId:'pmreport',
			title:t("Report", "projects2"),
			height: dp(400),
			width: dp(560),
			formControllerUrl: 'projects2/report',
			buttons:[
			{
				text: t("Download", "projects2"),
				handler : function() {
					this.formPanel.form.standardSubmit = true;
					this.formPanel.form.getEl().dom.target='_blank';
					this.formPanel.form.getEl().dom.action=GO.url("projects2/report/print");
					this.submitForm();
				},
				scope: this
			},
			{
				text:t("Save"),
				handler:function(){
					this.formPanel.form.standardSubmit = false;
					this.buttonPressed='download';
					this.submitForm(true);
				},
				scope:this
			},this.saveAndEmailBtn = new Ext.Button({
				text:t("Save + E-mail", "projects2"),
				handler:function(){
					this.formPanel.form.standardSubmit = false;
					this.buttonPressed='email';
					this.submitForm(true);
				},
				scope:this
			}),{
				text: t("Close"),
				handler: function(){
					this.hide();
				},
				scope:this
			}
			]
		});
		
		GO.projects2.ReportDialog.superclass.initComponent.call(this);	
		
		//if(GO.settings.modules.email.permission_level<GO.permissionLevels.read)
		if(GO.settings.modules.email.read_permission==false)
			this.saveAndEmailBtn.setVisible(false);
		
	},
	afterSubmit : function (action){
		if(this.buttonPressed=='email')
			GO.email.emailFiles(action.result.path);
		
//		if(this.buttonPressed=='download')
//			GO.files.openFile({
//				id: action.result.file_id
//			});
	},
	buildForm : function(){	
		
		this.selectTemplate = new GO.projects2.SelectReportTemplate({
			width:150,
			listeners:{
				change:function(combo, newValue, oldValue){
//					this.editGrid.store.baseParams.report_template_class=newValue;
//					this.editGrid.store.load();

					var record = combo.store.getById(newValue);
					
					this.startComp.setDisabled(!record.data.date_range_supported);
					this.startComp.setVisible(record.data.date_range_supported);
					this.endComp.setDisabled(!record.data.date_range_supported);
					this.endComp.setVisible(record.data.date_range_supported);
					
//					this.selectStatus.container.up("div.x-form-item").setDisplayed(record.data.status_filter_supported);
					this.selectStatus.setDisabled(!record.data.status_filter_supported);
					
					if(record.data.status_filter_supported){
						var statuses = Ext.decode(record.data.selected_statuses);
						this.selectStatus.setValue(statuses);
					}
					
					this.filenameField.setValue(this.selectTemplate.getRawValue());
				},
				scope:this				
			}
		});
  	

		
		var now = new Date();
//		var lastMonth = now.add(Date.MONTH, -1);
		var startOfLastMonth = now.getFirstDateOfMonth();
		var endOfLastMonth = now.getLastDateOfMonth();
  
		this.startDate = new Ext.form.DateField({
			flex:1,
			name: 'startdate',
			format: GO.settings['date_format'],
			allowBlank:true,
			fieldLabel: t("Start"),
			value: startOfLastMonth.format(GO.settings.date_format),
			listeners : {
				change : {
					fn : this.setDateInput,
					scope: this
				}
			}
		});
			
		this.endDate = new Ext.form.DateField({  
			flex:1,
			name: 'enddate',
			format: GO.settings['date_format'],
			allowBlank:true,
			fieldLabel: t("End"),
			value: endOfLastMonth.format(GO.settings.date_format),
			listeners : {
				change : {
					fn : this.setDateInput,
					scope: this
				}
			}
		});
		
		
		
		this.editGrid = new GO.grid.EditorGridPanel({
			title:"Batch Filters",
			region:'center',
			fields:['name','label','edit','value','gotype','regex','regex_flags'],
			store:new GO.data.JsonStore({
				url: GO.url('projects2/report/filters'),
				baseParams:{
					report_template_class: '' // config.modelType example: GO\\Addressbook\\Model\\Company
				},
				fields: ['name','label','edit','value','gotype','regex','regex_flags'],
				remoteSort: true
			}),
			columns:[{
				header:t("Label"),
				dataIndex: 'label',
				sortable:false,
				hideable:false,
				editable:false,
				id:'label'
			},{
				header:t("Value"),
				dataIndex: 'value',
				sortable:false,
				hideable:false,
				editable:true,
				editor: new Ext.form.TextField({}),
				id:'value'
			}		
			],
			view:new Ext.grid.GridView({
				autoFill: true,
				forceFit: true,
				emptyText: t("No items to display")
			}),
			sm:new Ext.grid.RowSelectionModel(),
			loadMask:true,
			clicksToEdit:1,
			listeners:{
				beforeedit:function(e){			
					this.setEditor(e.record);
					return true;
				},
				scope:this,
				afteredit:function(e){
					var type = e.record.get('gotype');

					e.record.set('edit',true);
					
					if(type =='date' || type =='unixtimestamp' || type =='unixdate')
						e.record.set(e.field,e.value.format(GO.settings.date_format));
				}
			}
		});	
		
		this.selectFolder = new GO.files.SelectFolder({
			name:'path',
			fieldLabel:t("Save to folder", "projects2")
		});
			
			
		this.selectStatus = Ext.create({
			fieldLabel:"Status filter",
			allowAddNewData:true, //otherwise every value will be looked up at the server. We don't want that.
			xtype:'superboxselect',
			resizable: true,
			store: GO.projects2.statusesStore,
			mode: 'local',
			displayField: 'name',
			displayFieldTpl: '{name}',
			valueField: 'id',
			forceSelection : true,
			valueDelimiter:'|',
			hiddenName:'status_id',
			queryDelay: 0,
			triggerAction: 'all',
			anchor:'100%'
		});
		
		

		
		this.addPanel({
				layout:'form',
				cls:'go-form-panel',
				region:'north',
				defaults:{
					width:300
				},
				height:170,
				items:[
				this.projectId = new Ext.form.Hidden({
					name:'project_id'
				}),
				this.selectTemplate,
				this.selectStatus,
				this.filenameField = new Ext.form.TextField({
					allowBlank:false,
					name:'filename',
					fieldLabel:t("Filename", "projects2")
				}),
				this.selectFolder,				
				this.startComp = new Ext.form.CompositeField({
					disabled:true,
					xtype:'compositefield',					
					items:[
					this.startDate,
					new Ext.Button({
						flex:1,
						text: t("Previous month", "projects2"),
						handler: function(){
							this.changeMonth(-1);
						},
						scope:this
					})
					]
				}), 				
				this.endComp = new Ext.form.CompositeField({
					disabled:true,
					xtype:'compositefield',	
					items:[
					this.endDate,
					new Ext.Button({
						flex:1,
						text: t("Next month", "projects2"),
						handler: function(){
							this.changeMonth(1);
						},
						scope:this
					})
					]
				})
				
				]
			});
		
	},
	afterShowAndLoad : function(remoteModelId, config){
		this.selectTemplate.store.load();
		
		GO.projects2.statusesStore.load();
	},
	
	editors : {},
	
	setEditor : function(record){
		var col = this.editGrid.getColumnModel().getColumnById('value');
		var config ={};
		if(!GO.util.empty(record.get('regex')))
			config = {
				regex: new RegExp(record.get('regex'),record.get('regex_flags'))
			};
		
		var colName = record.get('name');
		if(this.editors[colName])
			var editor = Ext.create(this.editors[colName]);
		else 
			var editor = GO.base.form.getFormFieldByType(record.get('gotype'), record.get('name'), config);
		
		col.setEditor(editor);
	},
	
	getSubmitParams : function(){
		return {
			filters: Ext.encode(this.editGrid.getGridData())
		};
	},
	
	show :function(project_id){
		
		this.formPanel.baseParams.project_id=project_id;
		this.selectTemplate.store.baseParams.project_id=project_id;
		
		GO.projects2.ReportDialog.superclass.show.call(this);
		
		this.projectId.setValue(project_id);
		
//		this.selectStatus.container.up("div.x-form-item").setDisplayed(false);
		
//		if(project_id>0){
//			this.editGrid.hide();
//			this.setHeight(220);
//		}else
//		{
//			this.editGrid.show();
//			this.setHeight(440);
//		}	
		
		

	//		
	//		this.formPanel.form.standardSubmit=true;
	//		this.formPanel.form.getEl().dom.target='_blank';
	//		this.formPanel.form.getEl().dom.action=GO.url("projects2/report/submit");
	},
	
	setDateInput : function(field)
	{
		if(this.startDate.getValue() > this.endDate.getValue())
		{
			if(field.name == 'end_date')
			{
				this.startDate.setValue(this.endDate.getValue());
			}else
			{
				this.endDate.setValue(this.startDate.getValue());
			}
		}
	},
	changeMonth : function(increment)
	{
		var date = this.startDate.getValue();
		date = date.add(Date.MONTH, increment);
		this.startDate.setValue(date.getFirstDateOfMonth().format(GO.settings.date_format));
		this.endDate.setValue(date.getLastDateOfMonth().format(GO.settings.date_format));
		
	}
});
