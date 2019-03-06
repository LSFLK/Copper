
go.modules.community.imapauthenticator.ServerGrid = Ext.extend(go.grid.GridPanel, {
	viewConfig: {
		forceFit: true,
		autoFill: true,
		emptyText: 	'<p>' +t("No items to display") + '</p>'
	},

	initComponent: function () {

		var actions = this.initRowActions();

		Ext.apply(this, {	
			tbar: [
				{
					xtype:'tbtitle',
					text: t("IMAP Authenticator", "imapauthenticator")
				},
				'->',
				{
					iconCls: 'ic-add',
					handler: function() {
						var form = new go.modules.community.imapauthenticator.ServerForm();
						form.show();
					}
			}],
			
			store: new go.data.Store({
				fields: ['id', 'imapHostname'],
				entityStore: "ImapAuthServer"				
			}),
			autoHeight: true,
			plugins: [actions],
			columns: [
				{
					id: 'imapHostname',
					header: t('Hostname', 'imapauthenticator'),
					sortable: false,
					dataIndex: 'imapHostname',
					hideable: false,
					draggable: false,
					menuDisabled: true
				},
				actions
			],
			listeners : {
				render: function() {
					this.store.load();
				},
				scope: this
			}
		});

		go.modules.community.imapauthenticator.ServerGrid.superclass.initComponent.call(this);
		
		this.on("rowdblclick", function(grid, rowIndex, e) {
			var record = grid.getStore().getAt(rowIndex);
			this.edit(record.data.id);
		}, this);
	},
	
	
	//This reloads the domains combo after changes. 
	entityStore: "ImapAuthServer",	
	onChanges: function(store, added, changed, destroyed) {
		if(Object.keys(changed).length || destroyed.length) {
				GO.SystemSettingsDomainCombo.reloadDomains();
		}
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
							
							this.edit(this.moreMenu.record.data.id);
							
						},
						scope: this
					},{
						itemId: "delete",
						iconCls: 'ic-delete',
						text: t("Delete"),
						handler: function() {
							this.getSelectionModel().selectRecords([this.moreMenu.record]);
							this.deleteSelected();
						},
						scope: this
					}
					
				]
			});
		}	
		
		this.moreMenu.record = record;		
		this.moreMenu.showAt(e.getXY());
	},
	
	edit: function(id) {
		var form = new go.modules.community.imapauthenticator.ServerForm();
		form.load(id).show();
	}
});