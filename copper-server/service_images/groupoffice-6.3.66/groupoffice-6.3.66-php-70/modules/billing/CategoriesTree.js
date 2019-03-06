/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: CategoriesTree.js 22862 2018-01-12 08:00:03Z mschering $
 * @copyright Copyright Intermesh
 * @author Merijn Schering <mschering@intermesh.nl>
 */
 
GO.billing.CategoriesTree = function(config){
	if(!config)
	{
		config = {};
	}
	config.layout='fit';
   config.split=true;
	config.autoScroll=true;
	config.width=200;
	//config.animate=true;
	config.loader=new GO.base.tree.TreeLoader(
	{
		dataUrl: GO.url('billing/productCategory/tree'),
		baseParams:{parent_id: 0},
		preloadChildren:true
	});
	config.collapsed=config.treeCollapsed;
	config.containerScroll=true;
	config.rootVisible=true;
	//config.collapsible=true;
	config.ddAppendOnly=true;
	config.containerScroll=true;
	config.ddGroup='BsCategoriesDD';

	GO.billing.CategoriesTree.superclass.constructor.call(this, config);	
	
	// set the root node
	var rootNode = new Ext.tree.AsyncTreeNode({
		text: t("Root"),
		id:'bs-folder-0',
		draggable:false,
		iconCls : 'folder-default',
		expanded:false
	});
	this.setRootNode(rootNode);
	
	this.on('contextmenu',function(node,event){
		event.stopEvent();
		var catArr = node.id.split('-');
		this.showContextMenu(event.getXY(),catArr[2]);
	},this);
	
}

Ext.extend(GO.billing.CategoriesTree, Ext.tree.TreePanel, {
	showContextMenu : function(xy,catId) {
		if (GO.util.empty(GO.billing.categoriesTreeContextMenu)) {
			GO.billing.categoriesTreeContextMenu = new GO.billing.CategoriesTreeContextMenu();
			GO.billing.categoriesTreeContextMenu.on('categoryDeleted',function(){
				this.loader.load(this.getRootNode());
			},this);
		}

		GO.billing.categoriesTreeContextMenu.showAt(xy,catId);
	}
});
