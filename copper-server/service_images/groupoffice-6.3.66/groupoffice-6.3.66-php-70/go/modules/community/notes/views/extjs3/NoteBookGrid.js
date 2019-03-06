go.modules.community.notes.NoteBookGrid = Ext.extend(go.grid.GridPanel, {
	viewConfig: {
		forceFit: true,
		autoFill: true
	},

	constructor: function (config) {

		var actions = this.initRowActions();

		var selModel = new Ext.grid.CheckboxSelectionModel();
		
		var tbar = {
			xtype: "container",
			items:[
				{
					items: config.tbar, 
					xtype: 'toolbar'
				},
				new Ext.Toolbar({
					items:[{xtype: "selectallcheckbox"}]
				})
			]
		};

		Ext.apply(config, {
			
			tbar: tbar,
			
			store: new go.data.Store({
				fields: ['id', 'name', 'aclId', "permissionLevel"],
				entityStore: "NoteBook"
			}),
			selModel: selModel,
			plugins: [actions],
			columns: [
				selModel,
				{
					id: 'name',
					header: t('Name'),
					sortable: false,
					dataIndex: 'name',
					hideable: false,
					draggable: false,
					menuDisabled: true
				},
				actions
			],

//			stateful: true,
			stateId: 'note-books-grid'
		});

		go.modules.community.notes.NoteBookGrid.superclass.constructor.call(this, config);
	},

	initRowActions: function () {

		var actions = new Ext.ux.grid.RowActions({
			menuDisabled: true,
			hideable: false,
			draggable: false,
			fixed: true,
			header: '',
			hideMode: 'display',
			keepSelection: true,

			actions: [{
					iconCls: 'ic-more-vert'
				}]
		});

		actions.on({
			action: function (grid, record, action, row, col, e, target) {
				this.showMoreMenu(record, e);
			},
			scope: this
		});

		return actions;

	},
	
	
	showMoreMenu : function(record, e) {
		if(!this.moreMenu) {
			this.moreMenu = new Ext.menu.Menu({
				items: [
					{
						itemId: "edit",
						iconCls: 'ic-edit',
						text: t("Edit"),
						handler: function() {
							var noteBookForm = new go.modules.community.notes.NoteBookForm();
							noteBookForm.load(this.moreMenu.record.id).show();
						},
						scope: this						
					},{
						itemId: "delete",
						iconCls: 'ic-delete',
						text: t("Delete"),
						handler: function() {
							Ext.MessageBox.confirm(t("Confirm delete"), t("Are you sure you want to delete this item?"), function (btn) {
								if (btn != "yes") {
									return;
								}
								go.Stores.get("NoteBook").set({destroy: [this.moreMenu.record.id]});
							}, this);
						},
						scope: this						
					},{
						itemId:"share",
						iconCls: 'ic-share',
						text: t("Share"),
						handler: function() {
							var shareWindow = new go.acl.ShareWindow({
								animateTarget: e.target,
								title: this.moreMenu.record.get('name')
							});
							
							shareWindow.load(this.moreMenu.record.get('aclId')).show();
						},
						scope: this						
					},
				]
			})
		}
		
		this.moreMenu.getComponent("edit").setDisabled(record.get("permissionLevel") < GO.permissionLevels.manage);
		this.moreMenu.getComponent("share").setDisabled(record.get("permissionLevel") < GO.permissionLevels.manage);
		this.moreMenu.getComponent("delete").setDisabled(record.get("permissionLevel") < GO.permissionLevels.manage);
		
		this.moreMenu.record = record;
		
		this.moreMenu.showAt(e.getXY());
	}
});
