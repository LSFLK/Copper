// billing Overrides
// projects2 Overrides


GO.moduleManager.onModuleReady('addressbook',function(){
	
	//GO.projects2.SettingsDialog 
	 
	Ext.override(GO.addressbook.CompanyReadPanel, {
		
		modifyTemplate : GO.addressbook.CompanyReadPanel.prototype.modifyTemplate.createSequence(function(){
			
			this.template = 
							
							'<tpl if="values.exact_divisions.length">{[this.collapsibleSectionHeader("Exact Online", "companypanel2-"+values.panelId, "exact")]}'+
							'<div class="go-html-formatted"><p>Dit bedrijf staat in de volgende Exact Online divisions:<p>'+
				'<ul>'+

				'<tpl for="values.exact_divisions">'+
				'<li>{name}</li>'+
				'</tpl>'+
				
				'</ul></div></tpl>'

							
							+ this.template;

		})
		
	});
	
	
});


