/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @copyright Copyright Intermesh
 * @version $Id: ReportDialog.js 23432 2018-02-16 10:02:11Z mschering $
 * @author Merijn Schering <mschering@intermesh.nl>
 */


GO.billing.ReportDialog = function(config) {


	if (!config)
	{
		config = {};
	}

	this.yearField = new Ext.form.DisplayField({
		name: 'year',
		hideLabel: true
	})


	this.previousButton = new Ext.Button({
		text: t("Previous"),
		handler: function() {
			this.yearField.setValue(parseInt(this.yearField.getValue()) - 1);

			var thisYear = parseInt(this.yearField.getValue());
			var first_day_year = new Date(thisYear, 0, 1);
			var last_day_year = new Date(thisYear + 1, 0, 0);
			this.startDate.setValue(first_day_year.format(GO.settings.date_format));
			this.endDate.setValue(last_day_year.format(GO.settings.date_format));
			this.changeDate(this.startDate);
		},
		scope: this
	});

	this.nextButton = new Ext.Button({
		text: t("Next"),
		handler: function() {
			this.yearField.setValue(parseInt(this.yearField.getValue()) + 1);

			var thisYear = parseInt(this.yearField.getValue());
			var first_day_year = new Date(thisYear, 0, 1);
			var last_day_year = new Date(thisYear + 1, 0, 0);
			this.startDate.setValue(first_day_year.format(GO.settings.date_format));
			this.endDate.setValue(last_day_year.format(GO.settings.date_format));
			this.changeDate(this.startDate);
		},
		scope: this
	});

	var booksCheckColumn = new GO.grid.CheckColumn({
		header: '&nbsp;',
		dataIndex: 'report_checked',
		width: 30
	});

	var booksPanel = new GO.grid.GridPanel({
		region: "center",		
		store: GO.billing.readableBooksStore,
		columns: [
			booksCheckColumn,
			{
				header: t("Name"),
				dataIndex: 'name'
			}
		],
		title: t("Books", "billing"),
		plugins: booksCheckColumn,
		cls: 'go-grid3-hide-headers',
		loadMask: true
	});



	var expenseBooksCheckColumn = new GO.grid.CheckColumn({
		header: '&nbsp;',
		dataIndex: 'report_checked',
		width: 30
	});

	this.expenseBooksPanel = new GO.grid.GridPanel({
		region:"south",
		split: true,
		store: GO.billing.readableExpenseBooksStore,
		columns: [
			expenseBooksCheckColumn,
			{
				header: t("Name"),
				dataIndex: 'name'
			}
		],
		title: t("Expense books", "billing"),
		plugins: expenseBooksCheckColumn,
		height: dp(200),
		cls: 'go-grid3-hide-headers',
		loadMask: true
	});

	var applyButton = new Ext.Button({
		text: t("Apply"),
		handler: function() {

			var books = [];
			
			console.log(GO.billing.readableBooksStore.data.items);

			for (var i = 0; i < GO.billing.readableBooksStore.data.items.length; i++)
			{
				var checked = GO.billing.readableBooksStore.data.items[i].get('report_checked');
				console.log(checked);
				if (checked)
				{
					books.push(GO.billing.readableBooksStore.data.items[i].get('id'));
				}
			}
			GO.billing.writableBooksStore.commitChanges();

			var expense_books = [];

			for (var i = 0; i < GO.billing.readableExpenseBooksStore.data.items.length; i++)
			{
				var checked = GO.billing.readableExpenseBooksStore.data.items[i].get('report_checked');
				if (checked)
				{
					expense_books.push(GO.billing.readableExpenseBooksStore.data.items[i].get('id'));
				}
			}

			GO.billing.readableExpenseBooksStore.commitChanges();

			this.reportGrid.store.baseParams.books = Ext.encode(books);
			this.reportGrid.store.baseParams.expense_books = Ext.encode(expense_books);
			this.reportGrid.store.load();
			delete this.reportGrid.store.baseParams.books;
			delete this.reportGrid.store.baseParams.expense_books;

			this.customerReportGrid.store.baseParams.books = Ext.encode(books);
			this.customerReportGrid.store.baseParams.expense_books = Ext.encode(expense_books);
			this.customerReportGrid.store.load();
			delete this.customerReportGrid.store.baseParams.books;
			delete this.customerReportGrid.store.baseParams.expense_books;

		},
		scope: this
	});

	var now = new Date();
	var thisYear = parseInt(now.format("Y"));
	var first_day_year = new Date(thisYear, 0, 1);
	var last_day_year = new Date(thisYear + 1, 0, 0);
	this.startDate = new Ext.form.DateField({
		width: 130,
		name: 'start_date',
		format: GO.settings['date_format'],
		allowBlank: true,
		fieldLabel: t("Start"),
		listeners: {
			change: {
				fn: this.changeDate,
				scope: this
			}
		}
	});

	this.endDate = new Ext.form.DateField({
		width: 130,
		name: 'end_date',
		format: GO.settings['date_format'],
		allowBlank: true,
		fieldLabel: t("End"),
		value: last_day_year,
		listeners: {
			change: {
				fn: this.changeDate,
				scope: this
			}
		}
	});

	this.formPanel = new Ext.Panel({
		region: 'west',
		layout: 'border',
		buttons:[applyButton],
		width: 230,
		split: true,
		border: true,		
		defaults: {border: false},
		items: [{
				xtype:'fieldset',
				region: "north",
				layout:"form",
				autoHeight: 50,
				labelWidth: 50,
				items:[{
					xtype: 'compositefield',
					hideLabel: true,
					items: [this.previousButton, this.yearField, this.nextButton]
				},this.startDate, this.endDate],
			},			
			booksPanel,
			this.expenseBooksPanel
		]
	});


	this.reportGrid = new GO.billing.ReportGrid({
		region: 'center',
		title: t("Year report", "billing")
	});

	this.reportGrid.on('show', function() {
		this.expenseBooksPanel.setVisible(true);
		//this.datePanel.setVisible(false);
	}, this);

	this.customerReportGrid = new GO.billing.CustomerReportGrid({
		region: 'center',
		title: t("Customer report", "billing")
	});

	this.customerReportGrid.on('show', function() {
		this.expenseBooksPanel.setVisible(false);
		//this.datePanel.setVisible(true);
	}, this);

	this.reportTab = new Ext.TabPanel({
		region: 'center',
		items: [this.reportGrid, this.customerReportGrid],
		activeTab: 0
	});



	var focusFirstField = function() {
		this.formPanel.items.items[0].focus();
	};

	config.collapsible = true;
	config.maximizable = true;
	config.layout = 'border';
	config.modal = false;
	config.resizable = true;
	config.border = false;
	config.width = 1000;
	config.height = 750;
	config.closeAction = 'hide';
	config.title = t("Report", "billing");
	config.items = [this.formPanel, this.reportTab];
	config.focus = focusFirstField.createDelegate(this);

	GO.billing.ReportDialog.superclass.constructor.call(this, config);
	this.addEvents({'save': true});
}
Ext.extend(GO.billing.ReportDialog, GO.Window, {
	changeDate: function(field)
	{
		if (this.startDate.getValue() > this.endDate.getValue())
		{
			if (field.name == 'end_date')
			{
				this.startDate.setValue(this.endDate.getValue());
			} else
			{
				this.endDate.setValue(this.startDate.getValue());
			}
		}
		this.reportGrid.store.baseParams.start_date = this.startDate.getValue().format(GO.settings.date_format);
		this.reportGrid.store.baseParams.end_date = this.endDate.getValue().format(GO.settings.date_format);
		this.reportGrid.store.load();
		this.customerReportGrid.store.baseParams.start_date = this.startDate.getValue().format(GO.settings.date_format);
		this.customerReportGrid.store.baseParams.end_date = this.endDate.getValue().format(GO.settings.date_format);
		this.customerReportGrid.store.load();
	},
	show: function(book_id) {
		if (!this.rendered)
		{
			this.render(Ext.getBody());
		}

		if (!GO.billing.readableExpenseBooksStore.loaded)
			GO.billing.readableExpenseBooksStore.load();

		var now = new Date();
		var thisYear = parseInt(now.format("Y"));
		var first_day_year = new Date(thisYear, 0, 1);
		var last_day_year = new Date(thisYear + 1, 0, 0);
		this.reportGrid.store.baseParams.start_date = first_day_year.format(GO.settings.date_format);
		this.reportGrid.store.baseParams.end_date = last_day_year.format(GO.settings.date_format);
		this.customerReportGrid.store.baseParams.start_date = first_day_year.format(GO.settings.date_format);
		this.customerReportGrid.store.baseParams.end_date = last_day_year.format(GO.settings.date_format);
		this.startDate.setValue(this.reportGrid.store.baseParams.start_date);
		this.endDate.setValue(this.reportGrid.store.baseParams.end_date);
		this.yearField.setValue(thisYear);
		this.reportGrid.store.load();
		this.customerReportGrid.store.load();

		GO.billing.ReportDialog.superclass.show.call(this);

}
//	submitForm: function() {
//
//		this.formPanel.form.submit(
//		{
//			ursubmitForml: GO.url('billing/report/yearReport'),
//			params: {'task': 'report'},
//			waitMsg: t("Saving..."),
//			success: function(form, action) {
//
//
//			},
//			failure: function(form, action) {
//				if (action.failureType == 'client')
//				{
//					Ext.MessageBox.alert(t("Error"), t("You have errors in your form. The invalid fields are marked."));
//				} else {
//					Ext.MessageBox.alert(t("Error"), action.result.feedback);
//				}
//			},
//			scope: this
//		});
//
//	}
});
