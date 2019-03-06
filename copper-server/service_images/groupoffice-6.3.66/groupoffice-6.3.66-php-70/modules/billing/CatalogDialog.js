/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: CatalogDialog.js 22862 2018-01-12 08:00:03Z mschering $
 * @copyright Copyright Intermesh
 * @author Merijn Schering <mschering@intermesh.nl>
 */
 
 
GO.billing.CatalogDialog = function(config){
	
	
	if(!config)
	{
		config={};
	}

	this.catalogPanel = new GO.billing.CatalogPanel();

	config.layout='fit';
	config.modal=false;
	config.resizable=true;
	config.maximizable=true;
	config.width=dp(840);
	config.height=dp(840);
	config.closeAction='hide';
	config.title= t("Product catalog", "billing");					
	config.items=this.catalogPanel;
	config.stateId='bs-catalog';
	
	GO.billing.CatalogDialog.superclass.constructor.call(this, config);
	
	this.addEvents({'save' : true});	
}

Ext.extend(GO.billing.CatalogDialog, Ext.Window,{


});

