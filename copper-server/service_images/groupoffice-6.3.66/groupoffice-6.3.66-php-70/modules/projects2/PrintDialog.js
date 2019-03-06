GO.projects2.PrintDialog = function(config) {

	if (!config) {
		config = {};
	}

	this.buildForm();

	config.layout = 'fit';
	config.title = t("Print");
	config.modal = false;
	config.width = 300;
	config.height = 150;
	config.resizable = false;
	config.closeAction = 'hide';
	config.items = this.formPanel;
	config.buttons = [{
				text : t("Ok"),
				handler : function() {
					this.submitForm(true);
				},
				scope : this
			}, {
				text : t("Close"),
				handler : function() {
					this.hide();
				},
				scope : this
			}];

	GO.projects2.PrintDialog.superclass.constructor.call(this, config);

	this.addEvents({
				'save' : true
			});
}
Ext.extend(GO.projects2.PrintDialog, Ext.Window, {

	show : function(group_by, user_id, start_date, end_date, cm) {
		if (!this.rendered) {
			this.render(Ext.getBody());
		}

		this.setValues(group_by, user_id, start_date, end_date, cm);

		this.formPanel.form.reset();

		this.printUsers.setDisabled(group_by != 'project_id');

		GO.projects2.PrintDialog.superclass.show.call(this);
	},
	setValues : function(group_by, user_id, start_date, end_date, cm) {
		this.group_by = group_by;
		this.user_id = user_id;
		this.start_date = start_date;
		this.end_date = end_date;
		this.cm=cm;
	},
	submitForm : function(hide) {
	
		var columns = '';
		Ext.each(this.cm.config, function(col, idx) {
					if (!this.cm.isHidden(idx)) {
						if (idx > 0) {
							columns += ';';
						}
						columns += this.cm.getColumnId(idx);
					}
				}, this);

		var print_months = (this.printMonths.getValue()) ? 1 : 0;
		var print_users = (this.printUsers.getValue()) ? 1 : 0;

		var win = window.open(GO.settings.modules.projects2.url
				+ 'print.php?group_by=' + this.group_by + '&user_id='
				+ this.user_id + '&start_date=' + this.start_date
				+ '&end_date=' + this.end_date + '&print_months='
				+ print_months + '&print_users=' + print_users + '&columns='
				+ columns)
		win.focus();

		this.hide();
	},
	buildForm : function() {
		this.formPanel = new Ext.form.FormPanel({
					waitMsgTarget : true,
					anchor : '95% 95%',
					border : false,
					cls : 'go-form-panel',
					layout : 'form',
					autoScroll : true,
					items : [
							this.printMonths = new Ext.form.Checkbox({
										name : 'print_months',
										hideLabel : true,
										anchor : '100%',
										boxLabel : t("Print months", "projects2"),
										checked : false
									}),
							this.printUsers = new Ext.form.Checkbox({
										name : 'print_employees',
										hideLabel : true,
										anchor : '100%',
										boxLabel : t("Print users", "projects2"),
										checked : false,
										disabled : true
									})]
				});
	}
});
