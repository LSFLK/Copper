/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: TypeGroupDialog.js 22937 2018-01-12 08:01:19Z mschering $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */
GO.tickets.TypeGroupDialog = Ext.extend(GO.dialog.TabbedFormDialog, {

    initComponent: function() {

        Ext.apply(this, {
            goDialogId: 'tiTypeGroup',
            layout: 'fit',
            title: t("Type group", "tickets"),
            width: 400,
            height: 140,
            resizable: false,
            formControllerUrl: 'tickets/typeGroup'
        });

        GO.tickets.TypeGroupDialog.superclass.initComponent.call(this);
    },
    buildForm: function() {

        this.formPanel = new Ext.Panel({
            cls: 'go-form-panel',
            layout: 'form',
			title: t("Properties"),
            labelWidth: 100,
            items:[{
				xtype: 'textfield',
				name: 'name',
				anchor: '-20',
				fieldLabel: t("Name"),
				allowBlank:false
			}]
        });

        this.addPanel(this.formPanel);
    }

});
