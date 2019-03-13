go.form.GridField = Ext.extend(Ext.grid.EditorGridPanel, {

	autoHeight: true,
	viewConfig: {
		scrollOffset: 0,
		emptyText: t("Empty"),
		deferEmptyText: false
	},
	
	cls: 'go-grid3-hide-headers',
	clicksToEdit: 1,
	initComponent: function () {


		var actions = this.initRowActions();

		this.columns.push(actions);

		this.plugins = this.plugins || [];
		this.plugins.push(actions);
		
		this.bbar = ['->', {
			iconCls: 'ic-add',
			handler: function () {
				// access the Record constructor through the grid's store
				var Record = this.getStore().recordType;
				var p = new Record({

				});
				this.stopEditing();
				this.getStore().add(p);
				this.startEditing(this.getStore().getCount() - 1, 0);
			},
			scope: this
		}];

		go.form.GridField.superclass.initComponent.call(this);
		
		if(this.hint) {
			this.on("added", function(grid, ownerCt, index){
				ownerCt.insert(index + 1, {
					xtype:'box',
					html: this.hint,
					cls: 'x-form-helptext'
				});
			}, this);
		}
		
	},

	

	isFormField: true,

	getName: function() {
		return this.name;
	},

	_isDirty: false,

	isDirty: function () {
		return this._isDirty || this.store.getModifiedRecords().length > 0;
	},

	setValue: function (records) {

		this._isDirty = false; //todo this is not right but works for our use case

		var data = {};
		data[this.store.root] = records;
		this.store.loadData(data);
	},

	getValue: function () {
		var records = this.store.getRange(), v = [];
		for (var i = 0, l = records.length; i < l; i++) {
			v.push(records[i].data);
		}
		return v;
	},

	markInvalid: function () {

	},
	clearInvalid: function () {

	},

	validate: function () {
		return true;
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
					iconCls: 'ic-delete'
				}]
		});

		actions.on({
			action: function (grid, record, action, row, col, e, target) {
				this.store.removeAt(row);
				this._isDirty = true;
			},
			scope: this
		});

		return actions;

	}
});

Ext.reg('gridfield', go.form.GridField);
