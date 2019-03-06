GO.tickets.SettingsDialog = Ext.extend(GO.dialog.TabbedFormDialog, {
	initComponent: function() {

		Ext.apply(this, {
			goDialogId: 'ticketssettings',
			title: t("Settings"),
			formControllerUrl: 'tickets/settings',
			submitAction: 'submit',
			loadAction: 'load',
			height: 620,
			width: 700
		});

		GO.tickets.SettingsDialog.superclass.initComponent.call(this);
		
		this.addEvents({
			'update_statuses' : true
		});
		
		this.addEvents({
			'update_templates' : true
		});
	},
	
	beforeSubmit : function(params){
		this.ratesGrid.save(this.getEl());
	},
	buildForm: function() {

		this.typesGrid = new GO.tickets.SettingsTypesGrid();
		this.statusesGrid = new GO.tickets.SettingsStatusesGrid();
		this.templatesGrid = new GO.tickets.SettingsTemplatesGrid();
		this.optionsPanel = new GO.tickets.SettingsOptionsPanel();
		this.ratesGrid = new GO.tickets.RatesGrid();
		this.externalPagePanel = new GO.tickets.SettingsExternalPagePanel();
		this.settingsTemplatesForm = new GO.tickets.SettingsTemplatesForm({
			title: t('E-mail notifications', 'tickets')
		});

		this.typesGrid.on('update_types', function() {
			GO.tickets.readableTypesStore.baseParams.reload = true;
			GO.tickets.readableTypesStore.load({
				callback: function()
				{
					GO.tickets.mainPanel.refresh();
				},
				scope: this
			});
		}, this);

		this.addPanel(this.typesGrid);
		this.addPanel(this.statusesGrid);
		this.addPanel(this.templatesGrid);
		this.addPanel(this.optionsPanel);
		this.addPanel(this.ratesGrid);
		this.addPanel(this.settingsTemplatesForm);
		
		if(GO.settings.has_admin_permission)
			this.addPanel(this.externalPagePanel);
	},
	
	show: function(){
		
		if(!this.typesGrid.store.loaded)
			this.typesGrid.store.load();
		
		if(!this.statusesGrid.store.loaded)
			this.statusesGrid.store.load();
		
		if(!this.templatesGrid.store.loaded)
			this.templatesGrid.store.load();
		
		this.ratesGrid.store.reload({
			params: {
				company_id: 0
			}
		});
		
		GO.tickets.SettingsDialog.superclass.show.call(this);
	},
	afterSubmit : function(action){
		
		if(action.result.success){
			// Update the GO.tickets.show_close_confirm param
			GO.tickets.show_close_confirm = this.optionsPanel.showConfirmOnCloseCheckbox.getValue();
		}
		
		GO.tickets.SettingsDialog.superclass.afterSubmit.call(this,action);
	}
});
