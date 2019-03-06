/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: AddressContextMenu.js 22112 2018-01-12 07:59:41Z mschering $
 * @copyright Copyright Intermesh
 * @author Merijn Schering <mschering@intermesh.nl>
 */

GO.email.AddressContextMenu = function(config)
{
	if(!config)
	{
		config = {};
	}
	config['shadow']='frame';
	config['minWidth']=180;
	
	
				
	this.composeButton = new Ext.menu.Item({
		iconCls: 'btn-compose',
		text: t("Compose", "email"),
		cls: 'x-btn-text-icon',
		handler: function(){

			var values = {
				to: this.address
				};
			this.queryString = decodeURI(this.queryString);
			var pairs = this.queryString.split('&');
			var pair;
			for(var i=0;i<pairs.length;i++){
				pair = pairs[i].split('=');
							
				if(pair.length==2){
					values[pair[0]]=pair[1];
				}
			}
			
			var composerConfig = {
				values : values
			};
			
			//if we're on the e-mail panel use the currently active account.			
			var ep = GO.mainLayout.getModulePanel("email");			
			if(ep && ep.isVisible())
				composerConfig.account_id=ep.account_id;			

			GO.email.showComposer(composerConfig);
		},
		scope: this
	});
	this.searchButton = new Ext.menu.Item({
		iconCls: 'btn-search',
		text: t("Search through Group-Office", "email").replace('{product_name}', GO.settings.config.product_name),
		cls: 'x-btn-text-icon',
		handler: function(){
			
			go.util.search(this.address);
			
		},
		scope: this
	});
				
	this.searchMessagesButton = new Ext.menu.Item({
		iconCls: 'btn-search',
		text: t("Show messages in current folder", "email"),
		cls: 'x-btn-text-icon',
		handler: function(){
			GO.email.searchSender(this.address);
		},
		scope: this
	});
				
	config.items=[this.composeButton,
	this.searchButton,
	this.searchMessagesButton];
	
	if(go.Modules.isAvailable("legacy", "addressbook"))
	{
		this.lookUpButton = new Ext.menu.Item({
			iconCls: 'btn-addressbook',
			text: t("Lookup in address book", "addressbook"),
			cls: 'x-btn-text-icon',
			handler: function(){
				GO.addressbook.searchSender(this.address, this.personal);
			},
			scope: this
		});
	
		config.items.push(this.lookUpButton);
	}

					
	GO.email.AddressContextMenu.superclass.constructor.call(this, config);	
}

Ext.extend(GO.email.AddressContextMenu, Ext.menu.Menu,{
	personal : '',
	address : '',
	showAt : function(xy, address, personal, queryString)
	{
		this.queryString=queryString || '';
		this.address = address || '';
		this.personal= personal || '';
		
		GO.email.AddressContextMenu.superclass.showAt.call(this, xy);
	}	
});
