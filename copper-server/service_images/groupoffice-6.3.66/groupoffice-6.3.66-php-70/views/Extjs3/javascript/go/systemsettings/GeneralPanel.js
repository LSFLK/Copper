go.systemsettings.GeneralPanel = Ext.extend(Ext.form.FormPanel, {
	initComponent: function () {
		Ext.apply(this, {
			title: t('General'),
			autoScroll: true,
			iconCls: 'ic-description',
			items: [{
					xtype: "fieldset",
					defaults: {
						width: dp(240)
					},
					items: [
						{
							xtype: 'textfield',
							name: 'title',
							fieldLabel: t('Title'),
							hint: t("Used as page title and sender name for notifications")
						},
						{
							xtype: "compositefield",
							items: [
								this.languageCombo = new Ext.form.ComboBox({
									flex: 1,
									fieldLabel: t('Language'),
									name: 'language',
									store: new Ext.data.SimpleStore({
										fields: ['id', 'language'],
										data: GO.Languages
									}),
									displayField: 'language',
									valueField: 'id',
									hiddenName: 'language',
									mode: 'local',
									triggerAction: 'all',
									editable: false,
									selectOnFocus: true,
									forceSelection: true,
									hint: t("The language is automatically detected from the browser. If the language is not available then this language will be used.")
								})
								,{
									xtype: "button",
									iconCls: "ic-cloud-download",
									tooltip: t("Download spreadsheet to translate"),
									scope: this,
									handler: this.onExportLanguage
								}
							]
						}, {
							xtype: 'textfield',
							name: 'URL',
							fieldLabel: t('URL'),
							hint: t("The full URL to GroupOffice.")
						}
					]
				}, {
					xtype: "fieldset",
					items: [
						{
							xtype: 'xcheckbox',
							name: 'maintenanceMode',
							hideLabel: true,
							boxLabel: t('Enable maintenance mode'),
							hint: t("When maintenance mode is enabled only administrators can login")
						},
						{
							xtype: 'xcheckbox',
							name: 'loginMessageEnabled',
							hideLabel: true,
							boxLabel: t('Enable login message'),	
							listeners: {
								check: function(cb, checked) {
									this.form.findField('loginMessage').setDisabled(!checked);
								},
								scope: this								
							}
						}, 
						{
							xtype: "xhtmleditor",
							anchor: "100%",
							height: dp(200),
							name: 'loginMessage',
							disabled: true,
							fieldLabel: t("Login message"),
							hint: t("This message will show on the login screen")
						}
					]
				}]
		});

		go.systemsettings.NotificationsPanel.superclass.initComponent.call(this);

		this.on('render', function () {
			go.Jmap.request({
				method: "core/core/Settings/get",
				callback: function (options, success, response) {
					this.getForm().setValues(response);
				},
				scope: this
			});
		}, this);
	},

	onExportLanguage: function () {
		this.getEl().mask(t("Exporting..."));
		//var win = window.open("about:blank");
		go.Jmap.request({
			method: "community/dev/Language/export",
			params: {
				language: this.languageCombo.getValue()
			},
			callback: function (options, success, response) {
				this.getEl().unmask();
				if(success) {
					document.location = go.Jmap.downloadUrl(response.blobId);
				}
			},
			scope: this
		});
	},

	onSubmit: function (cb, scope) {
		go.Jmap.request({
			method: "core/core/Settings/set",
			params: this.getForm().getFieldValues(),
			callback: function (options, success, response) {
				cb.call(scope, this, success);
			},
			scop: scope
		});
	}


});

