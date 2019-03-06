/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: CostCodeDialog.js 22862 2018-01-12 08:00:03Z mschering $
 * @copyright Copyright Intermesh
 * @author Wesley Smits <wsmits@intermesh.nl>
 */
 
GO.billing.CostCodeDialog = Ext.extend(GO.dialog.TabbedFormDialog , {

	initComponent : function(){
		
		Ext.apply(this, {
			updateAction: 'update',
			createAction: 'create',
			goDialogId:'bs-costcode',
			title:t("Cost code", "billing"),
			formControllerUrl: 'billing/costcode',
			width:700,
			height:450
		});
		
		GO.billing.CostCodeDialog.superclass.initComponent.call(this);	
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
			fieldLabel: t("Cost code", "billing"),
			maxLength: 10
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

		this.trackingCodeGrid = new GO.billing.TrackingCodeGrid();

		this.addPanel(this.propertiesPanel);
		this.addPanel(this.trackingCodeGrid);
	},
	setRemoteModelId : function(remoteModelId)
	{
		if(remoteModelId > 0){
			this.trackingCodeGrid.setDisabled(false);
			this.trackingCodeGrid.setCostcode(remoteModelId);
		} else {
			this.trackingCodeGrid.setDisabled(true);
			this.trackingCodeGrid.setCostcode(remoteModelId);
		}
		
		GO.billing.CostCodeDialog.superclass.setRemoteModelId.call(this, remoteModelId);
	},
	setBookId : function(book_id){
		this.formPanel.form.baseParams.book_id=book_id;
	}
});

