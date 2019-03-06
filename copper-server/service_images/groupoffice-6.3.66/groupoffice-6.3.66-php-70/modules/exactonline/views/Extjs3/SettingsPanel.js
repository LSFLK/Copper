
Ext.namespace('GO.exactonline');

GO.exactonline.SettingsPanel = Ext.extend(Ext.Panel, {
	
	constructor: function() {
		
		
		this.apiParamsFieldSet = new Ext.form.FieldSet({
			title: 'API',
//			title:t("Exact Online", "exactonline"),
			items:[
				new Ext.Container({
					html: t("Fill out the form and click 'Connect'.", "exactonline") +"<hr/>"
				}),
				this.exactOnlineApi = new Ext.Panel({
					labelWidth: 200,
					layout: 'form',
					items: [
						
						this.clientIdField = new Ext.form.TextField({
							name : 'clientId',
							allowBlank : true,
							fieldLabel : t("Client id", "exactonline"),
							anchor:'100%'
						}),

						this.clientSecretField = new Ext.form.TextField({
							name : 'clientSecret',
							allowBlank : true,
							fieldLabel : t("Client secret", "exactonline"),
							anchor:'100%'
						}),
						
						this.usernameField = new Ext.form.TextField({
							name : 'username',
							allowBlank : true,
							fieldLabel : t("Username / E-mail", "exactonline"),
							anchor:'100%'
						}),
						this.productsIdField = new Ext.form.TextField({
							name : 'productsId',
							allowBlank : true,
							fieldLabel : t("Products id", "exactonline"),
							anchor:'100%'
						}),
						
						this.productsIdField = new Ext.form.TextField({
							name : 'journal',
							allowBlank : true,
							fieldLabel : t("Journal", "exactonline"),
							anchor:'100%'
						}),
						
						this.expiresInField = new Ext.form.DisplayField({
//							name : 'expirationtoken',
							name : 'expiresIn',
							allowBlank : true,
							fieldLabel : t("Expiration token", "exactonline"),
							anchor:'100%'
						})
						
						
					],
					buttons: [
						this.connect = new Ext.Button({
							text: t("Connect", "exactonline"),
							handler: function() {
//								GO.request({
//									url:'exactonline/oauth/getAccessToken',
//									params:{
//										
//									},
//									scope:this
//								});
//reset: true
								window.open(GO.url('exactonline/oauth/getAccessToken',{}));
							},
							scope:this
						})
					]
				})
				
			]
		});
		
		
		
		
//		this.add(this.apiParamsFieldSet);

	Ext.apply(this, {
//			cls : 'go-form-panel',
			border : false,
//			layout:'form',
			title: t("Exact Online", "exactonline"),
			items:[
				this.apiParamsFieldSet
			]
		});
		
		GO.exactonline.SettingsPanel.superclass.constructor.call(this);
	}

	
	
})



