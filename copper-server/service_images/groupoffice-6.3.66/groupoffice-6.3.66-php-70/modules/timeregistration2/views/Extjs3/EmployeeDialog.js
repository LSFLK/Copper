/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: EmployeeDialog.js 22939 2018-01-12 08:01:21Z mschering $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */
GO.timeregistration2.EmployeeDialog = Ext.extend(GO.dialog.TabbedFormDialog, {

    initComponent: function() {

        Ext.apply(this, {
            layout: 'fit',
            title: t("Employee", "timeregistration2"),
            width: 400,
            height: 150,
            resizable: false,
            formControllerUrl: 'timeregistration2/employee'
        });

        GO.timeregistration2.EmployeeDialog.superclass.initComponent.call(this);
    },
    buildForm: function() {

        this.formPanel = new Ext.Panel({
            cls: 'go-form-panel',
            layout: 'form',
            labelWidth: 140,
            items: [
                {
                    xtype: 'textfield',
					disabled: true,
                    fieldLabel: t("Name"),
                    name: 'name',
                    allowBlank: false
                },{
                    xtype: 'datetime',
                    fieldLabel: t("Timeentries closed till", "timeregistration2"),
                    name: 'closed_entries_time',
                    allowBlank: false
                }
            ]
        });
        this.addPanel(this.formPanel);
    }
});
