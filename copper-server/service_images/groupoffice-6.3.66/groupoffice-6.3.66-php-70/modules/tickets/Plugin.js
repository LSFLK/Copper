GO.moduleManager.onModuleReady('addressbook',function(){
	Ext.override(GO.addressbook.CompanyDialog, {
		show : GO.addressbook.CompanyDialog.prototype.show.createInterceptor(function(company_id){
			if (GO.settings.modules.tickets.write_permission) {
				this.ratesGrid.setCompanyId(company_id);
				this.ratesGrid.store.load();
			}
			if (GO.settings.modules.tickets.write_permission && GO.settings.modules.addressbook.write_permission)
			{
				this.settingsGroupsGrid.setCompanyId(company_id);
				this.settingsGroupsGrid.store.load();
			}
		}),
		initComponent : GO.addressbook.CompanyDialog.prototype.initComponent.createInterceptor(function(){
			
			if (GO.settings.modules.tickets.write_permission) {
				this.ratesGrid = new GO.tickets.RatesGrid({
					objectType: 'company'
				});
				this.tabPanel.add(this.ratesGrid);
				
				this.ratesGrid.store.on('beforeload',function(store,options){
					store.baseParams['company_id'] = this.ratesGrid.company_id;
				},this);
				this.ratesGrid.store.on('beforesave',function(store,data){
					store.baseParams['company_id'] = this.ratesGrid.company_id;
				},this);
				this.on('save',function(dialog,company_id){
					this.ratesGrid.company_id = company_id;
					this.ratesGrid.save();
				},this);
			}
			
			if (GO.settings.modules.tickets.write_permission && GO.settings.modules.addressbook.write_permission)
			{
				this.settingsGroupsGrid = new GO.tickets.SettingsGroupsGrid();
				this.tabPanel.add(this.settingsGroupsGrid);
			}
			
		})
	});
});

GO.moduleManager.onModuleReady('addressbook',function(){
	Ext.override(GO.tickets.TicketDialog, {
		show : GO.tickets.TicketDialog.prototype.show.createSequence(function(){
			
		})
	})
});
