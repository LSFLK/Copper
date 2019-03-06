/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: WeekGrid.js 22906 2018-01-12 08:00:48Z mschering $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */
GO.hoursapproval2.WeekGrid = Ext.extend(GO.grid.GridPanel, {
	mainPanel: false, //thestore to reload when a week is selected

	selectedRecord : false,

	getYear: function() {
		return this.store.baseParams.year;
	},
	initComponent: function() {

		var now = new Date();

		var toolbar = [this.leftArrow = new Ext.Button({
				iconCls: 'ic-keyboard-arrow-left',
				handler: function() {
					this.store.baseParams.year--;
					this.yearPanel.body.update(this.store.baseParams.year);
					this.store.load();
				},
				scope: this
			}), this.yearPanel = new Ext.Panel({
				html: now.format('Y') + "",
				plain: true,
				border: true,
				cls: 'cal-period'
			}), this.rightArrow = new Ext.Button({
				iconCls: 'ic-keyboard-arrow-right',
				handler: function() {
					this.store.baseParams.year++;
					this.yearPanel.body.update(this.store.baseParams.year);
					this.store.load();
				},
				scope: this
			})]



		Ext.applyIf(this, {
			title: t("Week"),
			region: 'west',
			tbar: toolbar,
			sm: new Ext.grid.RowSelectionModel({singleSelect: true}),
			store: new GO.data.JsonStore({
				url: GO.url('hoursapproval2/approve/weeks'),
				fields: ['weeknb', 'closed', 'name', 'start_time'],
				baseParams: {year: now.format('Y')},
				listeners: {
					load: function(records, operation, success) {
						var onejan = new Date((new Date()).getFullYear(), 0, 1);
						var weeknb = Math.ceil((((new Date() - onejan) / 86400000) + onejan.getDay() + 1) / 7);
						if(this.selectedRecord) {
							weeknb = this.selectedRecord.data.weeknb;
						}
						var index = this.store.findBy(function(record) {
							return record.data.weeknb == weeknb;
						});

						this.getSelectionModel().selectRow(index, true);
						this.getView().focusRow(index);
					},
					scope: this
				}
			}),
			cm: new Ext.grid.ColumnModel({
				columns: [
					{
						header: t("Week"),
						dataIndex: 'name',
						renderer: function(v, meta, record) {
							switch (record.get('closed')) {

								case 1:
								case "1":
									meta.css = 'go-icon-ok';
									break;
								case 2:
								case "2":
									meta.css = 'go-icon-cross';
									break;
								default:
									meta.css = 'go-icon-empty';
									break;
							}

							return v;
						}
					}
				]
			})
		});

		GO.hoursapproval2.WeekGrid.superclass.initComponent.call(this);

		this.on('delayedrowselect', function(sm, i, record) {
			if (this.mainPanel) {
				this.mainPanel.timeEntryGrid.startTime = record.get('start_time');
				this.mainPanel.cardPanel.layout.setActiveItem(0);
				this.mainPanel.timeEntryGrid.setTitle(record.get('name'));
				this.mainPanel.timeEntryGrid.loadEntries('week', record.get('weeknb'), this.store.baseParams.year);
			}
		}, this);
	}
});
