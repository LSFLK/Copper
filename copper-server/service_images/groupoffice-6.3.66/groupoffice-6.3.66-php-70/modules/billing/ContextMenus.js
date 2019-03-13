/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: ContextMenus.js
 * @copyright Copyright Intermesh
 * @author WilmarVB <wilmar@intermesh.nl>
 */

GO.billing.ItemContextMenu = function(config){

	if(!config)
	{
		config = {};
	}

	config.items=[
		this.groupItemsToNew = new Ext.menu.Item({
			iconCls: 'btn-add',
			text: t("Group selected items to new group", "billing"),
			cls: 'x-btn-text-icon',
			scope:this,		
			handler: function()
			{
				if (this.getSelectedItems().length>0) {
					//var selectedItems = this.getSelectedItems();
					this.showGroupNameDialog(0);
				}
			}
		}),
		this.groupItemsToExisting = new Ext.menu.Item({
			iconCls: 'btn-export',
			text: t("Group selected items to existing group", "billing"),
			cls: 'x-btn-text-icon',
			scope:this,		
			handler: function()
			{
				if (this.getSelectedItems().length>0) {
					this.showExistingGroupsDialog();
				}
			}
		}),
		this.ungroupItems = new Ext.menu.Item({
			iconCls: 'btn-export',
			text: t("Ungroup selected items", "billing"),
			cls: 'x-btn-text-icon',
			scope:this,		
			handler: function()
			{
				this.changeGroup(0,"");
			}
		})
	];
	GO.billing.ItemContextMenu.superclass.constructor.call(this,config);

	this.addEvents({
		'itemsRegrouped' : true
	});
	
}

Ext.extend(GO.billing.ItemContextMenu, Ext.menu.Menu, {

	event:null,
	
	itemsGrid : false,

	changeGroup : function(item_group_id, name) {
		//var item_ids = [];
		var selected_items = this.getSelectedItems();
		for (var i=0; i<selected_items.length; i++) {
			//item_ids.push(selected_items[i].data.id);
			selected_items[i].set('item_group_id', item_group_id);
			selected_items[i].set('item_group_name', "999999|"+name);
		}
		this.itemsGrid.store.sort([{
			field:'item_group_sort_order'
		},{
			field:'sort_order'
		}]);
		this.itemsGrid.view.refresh();
		this.itemsGrid.changed=true;
	},

	showGroupNameDialog : function(item_group_id) {
		if (!this.groupNameDialog) {
			this.groupNameDialog = new GO.billing.ItemsGroupDialog();
			this.groupNameDialog.on('save',function(dialog,item_group_id){
				this.changeGroup(item_group_id, this.groupNameDialog.formPanel.form.findField('name').getValue());
			}, this);
		}		
		this.groupNameDialog.show(item_group_id, {values:{order_id:this.itemsGrid.store.baseParams.order_id}});
	},
	
	showExistingGroupsDialog : function() {
		if (!this.existingGroupsDialog) {
			this.existingGroupsDialog = new GO.billing.ExistingGroupsDialog();
			this.existingGroupsDialog.on('groupSelected', function(item_group_id, name){
				this.changeGroup(item_group_id, name);
			}, this);
		}
		this.existingGroupsDialog.setManageDialog(false);
		this.existingGroupsDialog.setOrderId(this.itemsGrid.store.baseParams.order_id);
		this.existingGroupsDialog.show();
	},

//	setSelectedItems : function(records)
//	{
//		this._selectedItems = records;
//	},
	
	getSelectedItems : function() {
		return this.itemsGrid.getSelectionModel().getSelections();
	}
	
});




GO.billing.ProductsGridContextMenu = function(config){

	if(!config)
	{
		config = {};
	}

	config.items=[
		this.editCategoryItem = new Ext.menu.Item({
			iconCls: 'btn-edit',
			text: t("Edit"),
			cls: 'x-btn-text-icon',
			scope:this,		
			handler: function()
			{
				this.showProductDialog(this.prodId);
			}
		})
	];
	
	GO.billing.ProductsGridContextMenu.superclass.constructor.call(this,config);
		
}

Ext.extend(GO.billing.ProductsGridContextMenu, Ext.menu.Menu, {
	
	prodId : false,

	showAt : function(xy,prodId) {
		if (prodId<0)
			Ext.MessageBox.alert(t("strErr"), t("Context menu being used, but the passed product id is invalid. Please notify the administrator if this persists.", "billing"), Ext.emptyFn, this);
		this.prodId = prodId;
		GO.billing.ProductsGridContextMenu.superclass.showAt.call(this,xy);
	},

	// Force showing only using showAt, because this contextmenu component assumes
	// that the (master) component that uses this one has correctly identified
	// and passed the category id to this component.
	show : function() {
	},

	showProductDialog : function(prodId) {
		if (!GO.util.empty(GO.billing.productDialog))
			GO.billing.productDialog = new GO.billing.ProductDialog();
		GO.billing.productDialog.show(prodId);
	}
	
});



GO.billing.CategoriesTreeContextMenu = function(config){

	if(!config)
	{
		config = {};
	}

	config.items=[
		this.editCategoryItem = new Ext.menu.Item({
			iconCls: 'btn-edit',
			text: t("Edit"),
			cls: 'x-btn-text-icon',
			scope:this,		
			handler: function()
			{
				this.showCategoryDialog();
			}
		}),
		this.deleteCategoryItem = new Ext.menu.Item({
			iconCls: 'btn-delete',
			text: t("Delete"),
			cls: 'x-btn-text-icon',
			scope:this,		
			handler: function()
			{
				Ext.Msg.show({
					title: t("Delete category", "billing"),
					msg: t("Are you sure you want to delete the selected category and everything in it?", "billing") ,
					buttons: Ext.Msg.YESNO,
					fn: function(btn) {
						if (btn=='yes') {
							Ext.Ajax.request({
								// url: GO.url('billing/productCategory/pasteSelections'),
								url: GO.url('billing/productCategory/delete'),
								params: {
									id: this.catId
								},
								callback: function(options, success, response)
								{
									if(!success)
									{
										Ext.MessageBox.alert(t("Error"), t("Could not connect to the server. Please check your internet connection."));
									}else
									{
										var responseParams = Ext.decode(response.responseText);
										if(!responseParams.success)
										{
											Ext.MessageBox.alert(t("Error"), responseParams.feedback);
										}else
										{
											this.fireEvent('categoryDeleted');
										}
									}
								},
								scope:this
							});
						}
					},
					animEl: 'elId',
					icon: Ext.MessageBox.QUESTION,
					scope: this
				});
			}
		})
	];
	
	GO.billing.CategoriesTreeContextMenu.superclass.constructor.call(this,config);

	this.addEvents({
		'categoryDeleted': true
	})

}

Ext.extend(GO.billing.CategoriesTreeContextMenu, Ext.menu.Menu, {
	
	catId : false,
	
	showAt : function(xy,categoryId) {
		if (categoryId<0)
			Ext.MessageBox.alert(t("strErr"), t("Context menu being used, but the passed category id is invalid. Please notify the administrator if this persists.", "billing"), Ext.emptyFn, this);
		this.catId = categoryId;
		GO.billing.CategoriesTreeContextMenu.superclass.showAt.call(this,xy);
	},
	
	// Force showing only using showAt, because this contextmenu component assumes
	// that the (master) component that uses this one has correctly identified
	// and passed the category id to this component.
	show : function() {
	},
	
	// Calling categoryDialog only makes sense if the category id is set.
	showCategoryDialog : function() {
		if (!GO.util.empty(GO.billing.categoryDialog))
			GO.billing.categoryDialog = new GO.billing.CategoryDialog();
		
		GO.billing.categoryDialog.show(this.catId);
	}
	
});
