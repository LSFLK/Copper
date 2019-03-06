/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: TaxRateDialog.js 22862 2018-01-12 08:00:03Z mschering $
 * @copyright Copyright Intermesh
 * @author Wesley Smits <wsmits@intermesh.nl>
 */
 
GO.billing.TaxRateDialog = Ext.extend(GO.dialog.TabbedFormDialog , {

	initComponent : function(){
		
		Ext.apply(this, {
			updateAction: 'update',
			createAction: 'create',
			goDialogId:'bs-taxrate',
			title:t("Tax rate", "billing"),
			formControllerUrl: 'billing/taxRate',
			enableApplyButton : false,
			width:400,
			height:220
		});
		
		GO.billing.TaxRateDialog.superclass.initComponent.call(this);	
	},
	
	buildForm : function () {
		
		this.nameField = new Ext.form.TextField({
			name: 'name',
			anchor: '-20',
			allowBlank:false,
			fieldLabel: t("Name"),
			maxLength: 100
		});
		
		this.percentageField = new GO.form.NumberField({
			name: 'percentage',
			allowBlank:false,
			decimals: 2,
			fieldLabel: t("Percentage", "billing"),
			maxLength: 10
		});
		
		this.percentageLabel = new Ext.form.Label({
			text : '%'
		});
		
		this.percentageFieldComp = new Ext.form.CompositeField({
			anchor: '-20',
			items:[
				this.percentageField,
				this.percentageLabel
			]
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
				this.percentageFieldComp,
				this.descriptionField
			]
		});

		this.addPanel(this.propertiesPanel);
	},
	setBookId : function(book_id){
		this.formPanel.form.baseParams.book_id=book_id;
	}
});

