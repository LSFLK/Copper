/* 
 * There is no mainpanel this will just add a button the the ProjectPanel new Menu
 */

go.Modules.register("legacy", "pr2analyzer");

GO.moduleManager.onModuleReady('projects2', function () {
	Ext.override(GO.projects2.MainPanel, {

		initComponent: GO.projects2.MainPanel.prototype.initComponent.createSequence(function () {

			if(!go.Modules.isAvailable("legacy", "pr2analyzer")) {
				return;
			}
			
			//add survey view to nav
			var btnAnalizer = new Ext.Button({
				cls: 'x-btn-text-icon',
				iconCls: 'ic-timeline',
				text: t("Analyze", "pr2analyzer"),
				handler: function () {
					this.analizeDialog.show();
				},
				scope: this
			});
			this.getTopToolbar().add(btnAnalizer);


			this.reportGrid = new GO.pr2analyzer.ReportGrid({
				border: false,
				id: this.id + '-survey',
				region: 'center'
			});


			this.typesMultiSelect = new GO.grid.MultiSelectGrid({
				region: 'west',
				width: 180,
				id: 'pr2_analyze_select_type',
				title: t("Project type", "projects2"),
				loadMask: true,
				store: GO.projects2.typesStore2,
				split: true,
				allowNoSelection: true,
				relatedStore: this.reportGrid.store
			});


			this.analizeDialog = new GO.Window({
				title: t("Analyze", "pr2analyzer"),
				maximizable: true,
				height: dp(800),
				width: dp(1000),
				layout: 'border',
				listeners: {
					show: function () {
						GO.projects2.typesStore2.load();
						this.reportGrid.store.reload();
					},
					scope: this
				},
				scope: this,
				items: [
					this.typesMultiSelect,
					this.reportGrid
				]
			});

		})

	});
});
