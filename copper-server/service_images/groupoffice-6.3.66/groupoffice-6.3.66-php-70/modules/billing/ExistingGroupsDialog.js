/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: ExistingGroupsDialog.js
 * @copyright Copyright Intermesh
 * @author Wilmar van Beusekom <wilmar@intermesh.nl>
 */

GO.billing.ExistingGroupsDialog = function(config){
	
	
	if(!config)
	{
		config={};
	}

	this.groupsGrid = new GO.grid.GridPanel({
		tbar:[{
				itemId:'delete',
				iconCls: 'btn-delete',
				text: t("Delete"),
				cls: 'x-btn-text-icon',
				handler: function(){
					this.groupsGrid.deleteSelected();
				},
				scope: this
			}		
		],
		width: '100%',
		height: '100%',
		store: new GO.data.JsonStore({
			url: GO.url('billing/itemGroup/store'),
			baseParams: {
				order_id : 0
			},
			root: 'results',
			id: 'id',
			totalProperty: 'total',
			fields: ['id','name']
		}),
		cm : new Ext.grid.ColumnModel({
			defaults: {
				sortable: false
			},
			columns:[{
				header: t("Name"), 
				dataIndex: 'name'
			}]
		}),
		paging: true,
		sm : new Ext.grid.RowSelectionModel(),
		view : new Ext.grid.GridView({
			autoFill: true,
			forceFit: true,
			emptyText: t("No items to display")		
		}),
		enableDragDrop:true,
		ddGroup:'bs-item-groups-dd',
		notifyDropSubmitUrl: 'billing/itemGroup/submitMultiple',
		listeners:{
			render:function(grid){
					//enable row sorting
				var DDtarget = new Ext.dd.DropTarget(grid.getView().mainBody, 
				{
					ddGroup : grid.ddGroup,
					copy:false,
					notifyDrop : GO.grid.notifyDrop
				});
			}
		}
	});
	
	this.groupsGrid.on('rowdblclick',function(grid,rowId,e){
		var row = this.groupsGrid.store.getAt(rowId);
		if (this.isManageDialog) {
			this.showItemsGroupDialog(row.data.id);
		} else {
			this.fireEvent('groupSelected',row.data.id, row.data.name);
			this.hide();
		}
	},this);

	config.layout='fit';
	config.modal=false;
	config.resizable=true;
	config.maximizable=true;
	config.width=500;
	config.height=400;
	config.closeAction='hide';
	config.title= t("Select a group where you want to put the selected items.", "billing");
	config.items=[this.groupsGrid];

	
	GO.billing.ExistingGroupsDialog.superclass.constructor.call(this, config);
	
	this.addEvents({'groupSelected' : true});	
}

Ext.extend(GO.billing.ExistingGroupsDialog, GO.Window,{
	
	
	setOrderId : function(order_id) {
		this.order_id = order_id;
		this.groupsGrid.store.baseParams['order_id'] = order_id;
	},
	show : function() {
		GO.billing.ExistingGroupsDialog.superclass.show.call(this);
		this.groupsGrid.store.load();
	},
	setManageDialog : function(use_for_admin) {
		this.isManageDialog = use_for_admin;
		if (use_for_admin) {
			this.setTitle(t("Item groups management", "billing"));
		} else {
			this.setTitle(t("Select a group where you want to put the selected items.", "billing"));
		}
	},
	showItemsGroupDialog : function(item_group_id) {
		if (!GO.billing.itemsGroupDialog) {
			GO.billing.itemsGroupDialog = new GO.billing.ItemsGroupDialog();
			GO.billing.itemsGroupDialog.on('hide', function(){
				this.groupsGrid.store.load();
			}, this);
		}
		GO.billing.itemsGroupDialog.show(item_group_id);
	}
});
