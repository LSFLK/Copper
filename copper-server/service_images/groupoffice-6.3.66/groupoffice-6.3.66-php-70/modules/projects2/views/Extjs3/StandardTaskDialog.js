/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: StandardTaskDialog.js 22922 2018-01-12 08:01:04Z mschering $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */

/**
 * This is the dialog for create and update the Standard tasks / Activities
 * It is also used in the settings dialog of the time registration module
 */
GO.projects2.StandardTaskDialog = Ext.extend(GO.dialog.TabbedFormDialog, {

	initComponent: function() {

		Ext.apply(this, {
			goDialogId: 'pm-standardTask',
			layout: 'fit',
			title: t("Activity type", "projects2"),
			width: dp(700),
			height: dp(500),
			resizable: false,
			formControllerUrl: 'projects2/standardTask'
		});

		GO.projects2.StandardTaskDialog.superclass.initComponent.call(this);
	},
	buildForm: function() {

		this.formPanel = new Ext.Panel({
			cls: 'go-form-panel',
			layout: 'form',
			labelWidth: 150,
			items: [
			{
				name: 'code',
				xtype: 'textfield',
				fieldLabel: t("Code", "projects2"),
				width: 100,
				allowBlank:false
			},{
				name: 'name',
				xtype: 'textfield',
				fieldLabel: t("Name"),
				anchor: '100%',
				allowBlank:false
			},{
				xtype: 'compositefield',
				fieldLabel: t("Default duration", "projects2"),
				items: [
				{
					name: 'units',
					xtype: 'numberfield',
					width: 100,
					allowBlank:false
				},
				{
					xtype:'htmlcomponent',
					html: t("Hours", "timeregistration2")
				}
				]
			},{
				name: 'description',
				xtype: 'textarea',
				fieldLabel: t("Description"),
				anchor: '100%',
				allowBlank:true
			},{
				name: 'disabled',
				xtype: 'xcheckbox',
				boxLabel: t("Disabled"),
				hideLabel: true
			},this.billableCheckbox = new Ext.ux.form.XCheckbox({
				name: 'is_billable',
				xtype: 'xcheckbox',
				boxLabel: t("Hours are billable", "timeregistration2"),
				hideLabel: true
			}),this.alwaysBillableCheckbox = new Ext.ux.form.XCheckbox({
				name: 'is_always_billable',
				xtype: 'xcheckbox',
				boxLabel: t("Hours also billable for projects with income type Contract Price or Not Billable", "projects2"),
				hideLabel: true,
				disabled: true
			})
			]
		});

		this.addPanel(this.formPanel);
		
		this.billableCheckbox.on('check',function(checkbox,checked){
			this.alwaysBillableCheckbox.setDisabled(!checked);
		}, this);
	},
	
	afterLoad: function(remoteModelId,config,action) {
		
		this.alwaysBillableCheckbox.setDisabled(!action.result.data.is_billable);
		
	}

});
