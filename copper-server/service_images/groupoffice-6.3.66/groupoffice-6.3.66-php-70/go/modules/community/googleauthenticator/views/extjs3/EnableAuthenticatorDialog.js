go.googleauthenticator.EnableAuthenticatorDialog = Ext.extend(go.form.Dialog, {
	title:t('Enable Google authenticator', 'googleauthenticator'),
	iconCls: 'ic-security',
	modal:true,
	entityStore:"User",
	width: 400,
	height: 500,

	initFormItems: function () {
		
		this.QRcomponent = new go.QRCodeComponent({
			name:'googleauthenticator.qrBlobId',
			cls: "googleauthenticator-qr",
			width: 200,
			height: 200
		});
		
		this.secretField = new GO.form.PlainField({
			name:'googleauthenticator.secret',
			fieldLabel: t('Secret', 'googleauthenticator'),
			hint: t('Secret key for manual input', 'googleauthenticator')
		});
		
		this.verifyField = new Ext.form.TextField({
			fieldLabel: t('Verify','googleauthenticator'),
			name: 'googleauthenticator.verify',
			allowBlank:false
		});
		
		var items = [{
				xtype: 'fieldset',
				autoHeight: true,
				labelWidth: dp(64),
				items: [
					new Ext.Container({
						html: t('Scan the QR code below with the Google authenticator app on your mobile device, after that fill in the field below with the code generated in the app.', 'googleauthenticator')
					}),
					this.QRcomponent,
					this.secretField,
					this.verifyField
				]
		}];

		return items;
	},
	onLoad : function() {
		this.QRcomponent.setQrBlobId(this.formPanel.entity.googleauthenticator.qrBlobId);
		go.googleauthenticator.EnableAuthenticatorDialog.superclass.onLoad.call(this);
	}
});
