/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: TypeDialog.js 23462 2018-03-06 11:37:47Z mschering $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */
GO.projects2.TypeDialog = Ext.extend(GO.dialog.TabbedFormDialog, {

    initComponent: function() {

        Ext.apply(this, {
            goDialogId: 'expenseType',
            layout: 'fit',
            title: t("Permission type", "projects2"),
            width: 700,
            height: 500,
            resizable: false,
            formControllerUrl: 'projects2/type'
        });

        GO.projects2.TypeDialog.superclass.initComponent.call(this);
    },
	afterLoad : function(remoteModelId, config){
	  this.formPanel.form.baseParams['id']=remoteModelId;
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
		this.addPermissionsPanel(new GO.grid.PermissionsPanel({
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
		}));
    }
  

});
