/* global Ext, GO, go */

go.login.UsernamePanel = Ext.extend(go.login.BaseLoginPanel, {

	initComponent: function () {


		this.usernameField = new Ext.form.TextField({
			itemId: 'username',
			fieldLabel: t("Username"),
			name: 'username',
			allowBlank: false,
			anchor: '100%'
		});

		this.passwordField = new Ext.form.TextField({
			itemId: 'password',
			fieldLabel: t("Password"),
			name: 'password',
			inputType: 'password',
			allowBlank: false,
			anchor: '100%'
		});


		var items = [

			this.usernameField,
			this.passwordField,
			{
				hideLabel: true,
				xtype: "xcheckbox",
				name: "remind",
				value: false,
				boxLabel: t("Remember my login on this computer until I press logout"),
				listeners: {
					check: function (checked) {
						go.AuthenticationManager.rememberLogin = checked;
					}
				}
			}
		];


		if (GO.authenticationDomains.length) {
			this.domainCombo = new go.login.DomainCombo({			
				value: localStorage.getItem("authentication-domain") || GO.authenticationDomainDefault				
			});
			
			items.splice(0, 0, this.domainCombo);
		}

		//nested panel is required so that submit button is inside form. 
		//Otherwise firefox won't prompt to save password and all browsers won't handle "enter" to submit
		var panel = new Ext.Panel({
			id: 'usernameCheck',
			bbar: [
				this.forgotBtn = new Ext.Button({
					text: t("Forgot username?"),
					handler: this.showForgot,
					scope: this
				}),
				'->',
				this.nextButton = new Ext.Button({
					type: "submit",
					text: t("Next"),
					handler: this.submit,
					scope: this
				})
			],
			items: [{
					xtype: "fieldset",
					items: items
				}
			]
		});

		this.items = [panel];
		this.layout = "fit";

		go.login.UsernamePanel.superclass.initComponent.call(this);
	},

	setErrors: function (errors) {

		for (var key in errors) {
			if (key === "password") {
				switch (parseInt(errors[key].code)) {
					case 1:
						this.passwordField.markInvalid(t('Password is required'));
						break;
					case 5:
						this.passwordField.markInvalid(t('Not found'));
						break;
					case 10:
					default:
						this.passwordField.markInvalid(t('Invalid password'));
						break;
				}
			} else
			{
				this.usernameField.markInvalid(t("Bad username or password"));
			}
		}
	},

	showForgot: function () {
		var forgotDlg = new go.login.ForgotDialog();
		forgotDlg.show();
	},

	submit: function () {

		if (!this.getForm().isValid()) {
			return;
		}

		this.getEl().mask();
		
		var username = this.usernameField.getValue(), domain = this.domainCombo ? this.domainCombo.getValue() : "";
		
		if(domain) {
			username += '@' + domain;
		}
		
		localStorage.setItem("authentication-domain", domain);

		go.AuthenticationManager.getAvailableMethods(username, this.passwordField.getValue(), function (authMan, success, result) {
			this.getEl().unmask();
			if (success) {
				this.onSuccess();
			} else {
				this.setErrors(result.errors);
			}
		}, this);
	},
	focus : function() {
		this.usernameField.focus();
	}
});
