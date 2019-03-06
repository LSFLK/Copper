GO.billing.OrderShippingPanel = Ext.extend(Ext.Panel,{
	
	title:t("Shipping", "billing"),
	layout:'column',
	autoScroll:true,
	border: false,
	labelwidth: dp(140),
	
	initComponent : function(config){
		
		this.useOtherShippingAddress = new Ext.ux.form.XCheckbox({
			name: 'other_shipping_address',
			boxLabel: t("Use other Shipping address", "billing"),
			listeners:{
				check: function(cbx, check){
					this.disableFields(check);
				},
				scope:this
			}
		});
		
		this.txtShippingTo = new Ext.form.TextArea({
			name: 'shipping_to',
			anchor: '-20',
			allowBlank:true,
			fieldLabel: t("Recipient", "billing"),
			height: 36
		});
	
		this.shippingSalutation = new Ext.form.TextField({
			name: 'shipping_salutation',
			anchor: '-20',
			allowBlank:true,
			fieldLabel: t("Salutation"),
			value: t("Dear sir/madam", "billing")
		});		
					
		this.shippingAddressField = new Ext.form.TextArea({
			name: 'shipping_address',
			anchor: '-20',
			allowBlank:true,
			fieldLabel: t("Address"),
			height: 50,
			maxLength: 255
		});
		
		this.shippingAddressNoField = new Ext.form.TextField({
			name: 'shipping_address_no',
			anchor: '-20',
			allowBlank:true,
			fieldLabel: t("No.")
		});
		
		this.shippingZipField = new Ext.form.TextField({
			name: 'shipping_zip',
			anchor: '-20',
			allowBlank:true,
			fieldLabel: t("ZIP/Postal")
		});
		
		this.shippingCityField = new Ext.form.TextField({
			name: 'shipping_city',
			anchor: '-20',
			allowBlank:true,
			fieldLabel: t("City")
		});
		
		this.shippingStateField = new Ext.form.TextField({
			xtype: 'textfield',
			name: 'shipping_state',
			allowBlank:true,
			anchor: '-20',
			fieldLabel: t("State")
		});
		
		this.shippingSelectCountry = new GO.form.SelectCountry({
			name: 'shipping_country_name',
			anchor: '-20',
			allowBlank:true,
			fieldLabel: t("Country"),
			hiddenName: 'shipping_country'
		});
		
		this.shippingExtra = new Ext.form.TextArea({
			name: 'shipping_extra',
			anchor: '-20',
			allowBlank:true,
			fieldLabel: t("Extra", "billing"),
			height: 80,
			maxLength: 255
		});
		
		this.shippingAddressFieldSet = new Ext.form.FieldSet({
			title: t("Address"),
			items: [
				this.useOtherShippingAddress,
				this.txtShippingTo,
				this.shippingSalutation,
				this.shippingAddressField,
				this.shippingAddressNoField,
				this.shippingZipField,
				this.shippingCityField,
				this.shippingStateField,
				this.shippingSelectCountry,
				this.shippingExtra
			]
		});
		
		this.items = [
			{
				border:false,
				cls:'go-form-panel',
				layout:'form',
				columnWidth:.5,
				items:[
					this.shippingAddressFieldSet
				]
			},
			{
				border:false,
				cls:'go-form-panel',
				layout:'form',
				columnWidth:.5,
				items:[]
			}
		];

		GO.billing.OrderShippingPanel.superclass.initComponent.call(this,config);
	},
	
	disableFields : function(check){
		this.txtShippingTo.setDisabled(!check);
		this.shippingSalutation.setDisabled(!check);
		this.shippingAddressField.setDisabled(!check);
		this.shippingAddressNoField.setDisabled(!check);
		this.shippingZipField.setDisabled(!check);
		this.shippingCityField.setDisabled(!check);
		this.shippingStateField.setDisabled(!check);
		this.shippingSelectCountry.setDisabled(!check);
		this.shippingExtra.setDisabled(!check);
//		this.shippingAddressFieldSet.setDisabled(!check);
	}
	
//	setData : function(data){
//
//	},
//	
//	show: function(){
//		GO.billing.OrderShippingPanel.superclass.show.call(this);
//	}

});
