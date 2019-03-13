// billing Overrides
// projects2 Overrides


GO.moduleManager.onModuleReady('projects2',function(){
	
	//GO.projects2.SettingsDialog 
	 
	Ext.override(GO.projects2.SettingsDialog, {
		
		buildForm : GO.projects2.SettingsDialog.prototype.buildForm.createSequence(function(){
			
//			if(GO.settings.has_admin_permission){
				this.settingsPanel = new GO.exactonline.SettingsPanel();
				
				this.addPanel(this.settingsPanel);
//			}
		})
		
	})
	
	
	
	Ext.override(GO.projects2.IncomeGrid, {
		
		initComponent : GO.projects2.IncomeGrid.prototype.initComponent.createInterceptor(function(){
			
			
			this.fields.push('add_to_exact');
			
			this.store = new GO.data.JsonStore({
				url: this.store.url,
				fields: this.fields,
				baseParams: this.store.baseParams
			});
			
			this.columns.push({
				dataIndex: 'add_to_exact',
				header: 'Exact',
				width: dp(140),
				sortable:false
			});
		})
	});
	
	
	Ext.override(GO.projects2.AllIncomeGrid, {
		
		initComponent : GO.projects2.AllIncomeGrid.prototype.initComponent.createInterceptor(function(){
			
			
			this.fields.push('add_to_exact');
			
			
			this.store = new GO.data.JsonStore({
				url: this.store.url,
				fields: this.fields,
				baseParams: this.store.baseParams
			});
			
			this.SearchField.store = this.store;
			
			this.columns.push({
				dataIndex: 'add_to_exact',
				header: 'Exact',
				width: dp(140),
				sortable:false
			});
		})
	});
});


