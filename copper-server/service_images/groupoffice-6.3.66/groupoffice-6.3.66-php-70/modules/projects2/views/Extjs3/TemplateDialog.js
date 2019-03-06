/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * This is the dialog that shows up when double clicking a template
 * Was converted to a TabbedFormDialog at Nov 14 2012
 *
 * @version $Id: TemplateDialog.js 22922 2018-01-12 08:01:04Z mschering $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */
GO.projects2.TemplateDialog = Ext.extend(GO.dialog.TabbedFormDialog, {
	initComponent: function() {

		Ext.apply(this, {
			goDialogId: 'pm-template-dialog',
			layout: 'fit',
			title: t("Template", "projects2"),
			width: 800,
			height: 700,
			resizable: true,
			formControllerUrl: 'projects2/template'
		});

		GO.projects2.TemplateDialog.superclass.initComponent.call(this);
	},
	buildForm: function() {

		this.fieldsPanel = {
			xtype: 'checkboxgroup',
			fieldLabel: t("Enabled fields", "projects2"),
			columns: 3,
			items:[{
				name:'fields[responsible_user_id]',
				boxLabel:t("Manager", "projects2")
			},{
				name:'fields[customer]',
				boxLabel:t("Customer")
			},{
				name:'fields[contact]',
				boxLabel:t("Contact", "projects2")
			},{
				name:'fields[date]',
				boxLabel:t("Date")
			},{
				name:'fields[status]',
				boxLabel:t("Status", "projects2")
			},{
				name:'fields[budget_fees]',
				boxLabel:t("Budget and fees", "projects2")
			},{
				name:'fields[expenses]',
				boxLabel:t("Expenses", "projects2")
			},{
				name:'fields[default_distance]',
				boxLabel:t("Default distance", "projects2")
			},{
				name:'fields[travel_costs]',
				boxLabel:t("Travel costs", "projects2")
			},{
				name:'fields[income]',
				boxLabel:t("Income", "projects2")
			},{
				name: 'fields[tasks_panel]',
				boxLabel:t("Show jobs panel", "projects2")
			},{
				name: 'fields[reference_no]',
				boxLabel:t("Reference no.", "projects2")
			},{
				name: 'fields[std_task_required]',
				boxLabel:t("Activity type required", "projects2")
			},{
				name: 'fields[show_subproject_totals]',
				boxLabel:t("Show subproject totals of: budget, internal fee, expenses", "projects2")
			}]
		};
		


		//Define the Properties tab
	
		this.propertiesPanel = new Ext.Panel({
			title: t("Properties"),
			cls: 'go-form-panel',
			layout: 'form',
			autoScroll: true,
			items: [{
				xtype: 'textfield',
				name: 'name',
				anchor: '-20',
				fieldLabel: t("Name")
			}, {
				xtype: 'combo',
				fieldLabel: t("Type"),
				hiddenName: 'project_type',
				store: new Ext.data.SimpleStore({
					fields: ['value', 'text'],
					data: [
					['0', t("Container", "projects2")],
					['1', t("Project", "projects2")]
					]
				}),
				value: '1',
				valueField: 'value',
				displayField: 'text',
				mode: 'local',
				triggerAction: 'all',
				editable: false,
				selectOnFocus: true,
				forceSelection: true
			}, new GO.projects2.SelectStatus({
				anchor: '-20',
				fieldLabel: t("Default status", "projects2"),
				hiddenName: 'default_status_id',
				allowBlank: false
			}), new GO.projects2.SelectType({
				anchor: '-20',
				fieldLabel: t("Default permission type", "projects2"),
				hiddenName: 'default_type_id',
				emptyText:t("Inherit from parent project", "projects2")
			}),
			this.fieldsPanel]
		});

		if(go.Modules.isAvailable("legacy", "files"))
		{
			this.propertiesPanel.add({
				xtype: 'selectfile',
				name: 'icon',
				anchor: '-20',
				fieldLabel: 'Icon (16x16px)',
				root_folder_id: GO.projects2.templateIconsFolderId
			});
			this.fileBrowseButton = new GO.files.FileBrowserButton({
				iconCls:'',
				model_name: "GO\\Projects2\\Model\\Template"
			});
			this.propertiesPanel.add(this.fileBrowseButton);
		} 
		
		this.propertiesPanel.add(this.useProjectNameTemplate = new  Ext.ux.form.XCheckbox({
			boxLabel: t("Enable automatic sequence number", "projects2"),
			hideLabel: true,
			name: 'use_name_template',
			labelStyle:'margin:5px'
		}));
		
		this.propertiesPanel.add(this.projectNameTemplate = new Ext.form.TextField({
			fieldLabel: t("Sequence number format", "projects2"),
			name: 'name_template',
			labelStyle:'margin:5px'
		}));

		this.selectDefaultNotificationTemplate = new GO.form.ComboBoxReset({
			hiddenName: 'default_income_email_template',
			valueField: 'id',
			displayField: 'name',
			store: new GO.data.JsonStore({
				url: GO.url('addressbook/template/store'),
				baseParams: {'type': 0},
				root: 'results',
				id: 'id',
				fields: ['id', 'name'],
				remoteSort: true
			}),
			mode: 'remote',
			triggerAction: 'all',
			editable: false,
			selectOnFocus: true,
			forceSelection: true,
			fieldLabel: t("Default income email template", "projects2")
		});

		this.propertiesPanel.add(this.selectDefaultNotificationTemplate);
		
		
		
		this.addPanel(this.propertiesPanel);

		this.templateEventsGrid = new GO.projects2.TemplateEventsGrid();
		this.addPanel(this.templateEventsGrid); // This is the default jobs grid
		
		this.defaultResourcesGrid = new GO.projects2.ResourceGrid({template:true});
		this.addPanel(this.defaultResourcesGrid);

		if(go.Modules.isAvailable("core", "customfields")){
			this.disableTemplateCategoriesPanel = new GO.customfields.DisableCategoriesPanel({
				title:t("Enabled customfields", "customfields")
			});
			this.addPanel(this.disableTemplateCategoriesPanel);        
		}

		this.readPermissionsTab = new GO.grid.PermissionsPanel({
			title : t("Read permissions"),
			hideLevel:true
		});
		this.addPanel(this.readPermissionsTab);
    
	},
        
	afterLoad : function(remoteModelId, config, action){
		if(go.Modules.isAvailable("core", "customfields")){
			this.disableTemplateCategoriesPanel.setModel(remoteModelId, "GO\\Projects2\\Model\\Project");
		}
		this.templateEventsGrid.setTemplateID(remoteModelId);
	  
		this.readPermissionsTab.setAcl(action.result.data.acl_id);
		
		if(this.fileBrowseButton){
			this.fileBrowseButton.setId(remoteModelId);
		}
		
		if(this.defaultResourcesGrid){
			this.defaultResourcesGrid.setTemplateId(remoteModelId);
			this.defaultResourcesGrid.setDisabled(remoteModelId==0);
		}
		
	}

});
