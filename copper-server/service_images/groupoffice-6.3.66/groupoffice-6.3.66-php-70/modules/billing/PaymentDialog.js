/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: PaymentDialog.js 22862 2018-01-12 08:00:03Z mschering $
 * @copyright Copyright Intermesh
 * @author Wesley Smits <wsmits@intermesh.nl>
 */
 
GO.billing.PaymentDialog = Ext.extend(GO.dialog.TabbedFormDialog , {

	order_id : 0,

	initComponent : function(){
		
		Ext.apply(this, {
			updateAction: 'update',
			createAction: 'create',
			goDialogId:'bs-payment',
			title:t("Payment", "billing"),
			formControllerUrl: 'billing/payment',
			enableApplyButton : false,
			width:400,
			height:220
		});
		
		GO.billing.PaymentDialog.superclass.initComponent.call(this);	
	},
	
	buildForm : function () {
		
//		this.dateField = new GO.form.DateTime({
//			name: 'date',
//			anchor: '-20',
//			allowBlank:false,
//			fieldLabel: t("Date"),
//			maxLength: 100
//		});
		
		this.dateField = new Ext.form.DateField({
			name: 'date',
			anchor: '-20',
			allowBlank:false,
			fieldLabel: t("Date"),
			maxLength: 100
		});
		
		this.amountField = new GO.form.NumberField({
			name: 'amount',
			allowBlank:false,
			anchor: '-20',
			decimals: 2,
			fieldLabel: t("Amount", "billing"),
			maxLength: 14
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
				this.dateField,
				this.amountField,
				this.descriptionField
			]
		});

		this.addPanel(this.propertiesPanel);
	},
	
	setOrderId : function(order_id){
		this.order_id = order_id;
		this.formPanel.baseParams.order_id = order_id;
	}
});

