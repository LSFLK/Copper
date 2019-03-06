Ext.ns("go.googleauthenticator");

Ext.onReady(function () {
	Ext.override(go.usersettings.AccountSettingsPanel, {
		initComponent: go.usersettings.AccountSettingsPanel.prototype.initComponent.createSequence(function () {
			this.googleAuthenticatorFieldset = new go.googleauthenticator.AuthenticatorSettingsFieldset();
			this.add(this.googleAuthenticatorFieldset);
			})
		});
	});
	
	go.googleauthenticator.AuthenticatorSettingsFieldset = Ext.extend(Ext.form.FieldSet, {
		entityStore:"User",
		currentUser: null,
		labelWidth: dp(152),
		title: t('Google authenticator', 'googleauthenticator'),
		
		onChanges : function(entityStore, added, changed, destroyed) {
			if(this.currentUser && changed[this.currentUser.id] && ("googleauthenticator" in changed[this.currentUser.id])){
				this.onLoad(changed[this.currentUser.id]);
			}
		},
		
		initComponent: function() {
			this.enableAuthenticatorBtn = new Ext.Button({
				text:t('Enable google authenticator', 'googleauthenticator'),
				hidden:false,
				handler:function(){	
					var me = this;
					me.requestSecret(me.currentUser, function(userId){						
						var enableDialog = new go.googleauthenticator.EnableAuthenticatorDialog();
						enableDialog.load(userId).show();
					});
				},
				scope: this
			});
			
			this.disableAuthenticatorBtn = new Ext.Button({
				text:t('Disable google authenticator', 'googleauthenticator'),
				hidden:true,
				handler:function(){
					var me = this;
					me.disableAuthenticator(me.currentUser, function(userId){
						// When this is called all went well and the authenticator is disabled
					});
				},
				scope: this
			});
			
			this.items = [
				this.enableAuthenticatorBtn,
				this.disableAuthenticatorBtn
			];
			
			go.googleauthenticator.AuthenticatorSettingsFieldset.superclass.initComponent.call(this);
		},
		
		onLoad : function(user){
			
			var isActive = (user.googleauthenticator && user.googleauthenticator.isEnabled);
			
			this.enableAuthenticatorBtn.setVisible(!isActive);
			this.disableAuthenticatorBtn.setVisible(isActive);
			this.currentUser = user;
		},
		
		disableAuthenticator : function(user, callback){
			var me = this;
			
			function execute(currentPassword){
				var params = {"update": {}},
					data = {
						googleauthenticator: null
					};
				if(currentPassword) {
					data.currentPassword = currentPassword;
				}
				params.update[user.id] = data;

				go.Stores.get("User").set(params, function (options, success, response) {
					if (success && !GO.util.empty(response.updated)) {
						callback.call(this,user.id);
					} else {
						// When the password is not correct, call itself again to try again
						me.disableAuthenticator(user, callback);
					}
				});
			}
			
			// If the user is an admin then no password needs to be given (Except when the admin is changing it's own account
			if (go.User.isAdmin && user.id != go.User.id) {
				execute.call(this);
				return;
			} else {
				var passwordPrompt = new go.PasswordPrompt({
					width: dp(450),
					text: t("When disabling Google autenticator this step will be removed from the login process.", 'googleauthenticator') + "<br><br>" + t("Provide your current password to disable Google authenticator.", 'googleauthenticator'),
					title: t('Disable Google authenticator', 'googleauthenticator'),
					listeners: {
						'ok': function(value){
							execute.call(this,value);
						},
						'cancel': function () {
							return false;
						},
						scope: this
					}
				});

				passwordPrompt.show();
			}
		},

		requestSecret : function(user, callback){
				var me = this;
			
				var passwordPrompt = new go.PasswordPrompt({
					width: dp(450),
					text: t("Provide your current password before you can enable Google authenticator.", 'googleauthenticator'),
					title: t('Enable Google authenticator', 'googleauthenticator'),
					iconCls: 'ic-security',
					listeners: {
						'ok': function(value){
							var params = {"update": {}};
							params.update[user.id] = {
								currentPassword: value,
								googleauthenticator: {
									requestSecret:true
								}
							};

							go.Stores.get("User").set(params, function (options, success, response) {
								if (success && !GO.util.empty(response.updated)) {
									// When password is checked successfully, then show the QR dialog
									callback.call(this,user.id);
								} else {
									// When the password is not correct, call itself again to try again
									me.requestSecret(user.id, callback);
								}
							});
						},
						'cancel': function () {
							return false;
						},
						scope: this
					}
				});
				passwordPrompt.show();
		}
	});
	