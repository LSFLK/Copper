/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: StatusDialog.js 22922 2018-01-12 08:01:04Z mschering $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */

/**
 * The status dialog is for adding/changing project statusses
 * Since new projects module statuses have a permissions tab
 */
GO.projects2.StatusDialog = Ext.extend(GO.dialog.TabbedFormDialog, {

	initComponent: function() {

		Ext.apply(this, {
			goDialogId: 'pm-statusDialog',
			layout: 'fit',
			title: t("Status", "projects2"),
			width: 520,
			autoheight: true,
			closeAction: 'hide',
			enableApplyButton: false,
			formControllerUrl: 'projects2/status'
		});

		GO.projects2.StatusDialog.superclass.initComponent.call(this);
	},
	buildForm: function() {

		this.formPanel = new Ext.Panel({
			cls: 'go-form-panel',
			layout: 'form',
			labelWidth: 100,
			title: t("Status", "projects2"),
			waitMsgTarget:true,
			border: false,
			autoHeight:true,
			layout: 'form',
			cls:'go-form-panel',
			
			items:[{
				xtype: 'textfield',
				name: 'name',
				anchor: '100%',
				fieldLabel: t("Name")
			},{
				xtype: 'xcheckbox',
				name: 'complete',
				anchor: '100%',
				hideLabel:true,
				checked:true,
				boxLabel: t("Projects with this status are finished (adding time entries becomes unavailable)", "projects2")
			},{
				xtype:'xcheckbox',
				name:'show_in_tree',
				hideLabel: true,
				boxLabel:t("Show in tree", "projects2"),
				listeners: {
					check: function(cb, value) {
						if(!value)
							this.cbFilterable.setValue(value);
						this.cbFilterable.setDisabled(!value);
					},
					scope: this
				}
			},this.cbFilterable = new Ext.ux.form.XCheckbox({
				name: 'filterable',
				anchor: '100%',
				hideLabel:true,
				checked:true,
				boxLabel: t("Show in status filter", "projects2")
			}),{
				xtype:'xcheckbox',
				name:'not_for_postcalculation',
				hideLabel: true,
				boxLabel:t("Do not show or use projects with this status in Invoice>Post-Calculation.", "projects2")
			}]
		});

		this.addPanel(this.formPanel);
		this.addPermissionsPanel(new GO.grid.PermissionsPanel());
	}

});
