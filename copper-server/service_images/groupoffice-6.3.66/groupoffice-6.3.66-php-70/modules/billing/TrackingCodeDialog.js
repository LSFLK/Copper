/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: TrackingCodeDialog.js 22862 2018-01-12 08:00:03Z mschering $
 * @copyright Copyright Intermesh
 * @author Wesley Smits <wsmits@intermesh.nl>
 */
 
GO.billing.TrackingCodeDialog = Ext.extend(GO.dialog.TabbedFormDialog , {

	costcode_id : 0,

	initComponent : function(){
		
		Ext.apply(this, {
			updateAction: 'update',
			createAction: 'create',
			goDialogId:'bs-trackingcode',
			title:t("Tracking code", "billing"),
			formControllerUrl: 'billing/trackingCode',
			enableApplyButton:false,
			width:400,
			height:250
		});
		
		GO.billing.TrackingCodeDialog.superclass.initComponent.call(this);	
	},
	
	buildForm : function () {
		
		this.nameField = new Ext.form.TextField({
			name: 'name',
			anchor: '-20',
			allowBlank:true,
			fieldLabel: t("Name"),
			maxLength: 100
		});
		
		this.codeField = new Ext.form.TextField({
			name: 'code',
			anchor: '-20',
			allowBlank:true,
			fieldLabel: t("Tracking code", "billing"),
			maxLength: 255
		});
		
		this.descriptionField = new Ext.form.TextArea({
			name: 'description',
			anchor: '-20',
			allowBlank:true,
			fieldLabel: t("Description")
		});
		
		this.propertiesPanel = new Ext.Panel({
			title:t("Properties"),			
			cls:'go-form-panel',
			layout:'form',
			items:[
				this.nameField,
				this.codeField,
				this.descriptionField
			]
		});

		this.addPanel(this.propertiesPanel);
	},
	setCostcode : function(costcode_id){
		this.costcode_id = costcode_id;
		this.formPanel.baseParams.costcode_id = costcode_id;
	}
});

