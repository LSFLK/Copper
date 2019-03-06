/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: SettingsDialog.js 23354 2018-01-31 13:11:51Z mdhart $
 * @copyright Copyright Intermesh
 * @author Merijn Schering <mschering@intermesh.nl>
 */


GO.projects2.SettingsDialog = Ext.extend(GO.dialog.TabbedFormDialog, {
  initComponent: function() {

    Ext.apply(this, {
      goDialogId: 'pm-settings-dialog',
      layout: 'fit',
      title: t("Administration"),
      width: 870,
      height: 600,
      resizable: false,
      formControllerUrl: 'projects2/settings'
    });

    GO.projects2.SettingsDialog.superclass.initComponent.call(this);
  },
  	
  buildForm: function() {

		this.statusesPanel = new GO.projects2.StatusesGrid({
			title:t("Statuses", "projects2"),
			layout:'fit'
		});
		
		this.typesPanel = new GO.projects2.TypesGrid({
			title:t("Permission types", "projects2"),
			layout:'fit'
		});
		
		this.templatesPanel = new GO.projects2.TemplatesGrid({
			title:t("Templates", "projects2"),
			layout:'fit'
		});

		this.useStatusFilterForSearchChk = new Ext.ux.form.XCheckbox({
			name: 'useStatusFilterSearch',
			fieldLabel: t("Apply Status filter for project search", "projects2"),
			labelStyle:'margin:5px'
		});
		
		this.enableFollowNumberChk = new Ext.ux.form.XCheckbox({
			name: 'chkCustomId',
			fieldLabel: t("Enable automatic sequence number", "projects2"),
			labelStyle:'margin:5px'
		});

		this.followNumberFormatField = new Ext.form.TextField({
			name: 'customId',
			fieldLabel: t("Sequence number format", "projects2"),
			labelStyle:'margin:5px'
		});
								
		this.followNumberPanel = new Ext.Panel({
			layout:'form',
			labelWidth:200,
			title: t("Settings"),
			waitMsgTarget:true,
			style:'margin:5px',
			bodyStyle:'padding:5px',
			defaults: {anchor:'100%'},
			items:[
				{
					xtype:'fieldset',
					title:t("Project numbering", "projects2"),
					border:true,
					layout:'form',
					autoHeight:true,
					items:[
						this.enableFollowNumberChk, 
						this.followNumberFormatField
					]
				},
				{
					xtype:'fieldset',
					title:t("Search", "projects2"),
					border:true,
					layout:'form',
					autoHeight:true,
					items:[
						this.useStatusFilterForSearchChk
					]
				}
			]
		});

		this.standardTaskGrid = new GO.projects2.StandardTaskGrid();
    
		this.employeesGrid = new GO.projects2.EmployeeGrid();
	
		this.officeTimePanel = new GO.projects2.OfficeTimePanel();
		
	
		this.addPanel(this.followNumberPanel);
		this.addPanel(this.typesPanel);
		this.addPanel(this.officeTimePanel);
		this.addPanel(this.templatesPanel);
		this.addPanel(this.statusesPanel);
		this.addPanel(this.standardTaskGrid);
		this.addPanel(this.employeesGrid);
		
		this.financePermissionsPanel = new GO.grid.PermissionsPanel({
			title: t("Finance permissions", "projects2"),
			fieldName:'finance_acl',
			hideLevel:true
		});
		
		this.addPermissionsPanel(this.financePermissionsPanel);
	},
	
	afterSubmit : function(action){
		GO.projects2.nameTemplate = action.result.new_name_template;
		GO.projects2.useNameTemplate = action.result.use_name_template;
	}
});
