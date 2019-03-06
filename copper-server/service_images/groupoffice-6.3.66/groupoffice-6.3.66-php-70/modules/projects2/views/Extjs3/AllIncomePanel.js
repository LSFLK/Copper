GO.projects2.AllIncomePanel = function(config) {
	
	var config = config || {};
	
	
	this.title = t("Income", "projects2");
	this.layout = 'border';
	
	this.allIncomeGrid = new GO.projects2.AllIncomeGrid({
			id:"pr2_all_income",
			region: 'center'
		});
	
	this.typesMultiSelect = new GO.grid.MultiSelectGrid({
			region:'west',
			width: 250,
			id:'pr2_all_incomes_types',
			title:t("Project type", "projects2"),
			loadMask:true,
			store: new GO.data.JsonStore({
				url: GO.url('projects2/type/store'),
				baseParams: {
					permission_level: GO.projects2.permissionLevelFinance
				},
				root: 'results',
				id: 'id',
				totalProperty:'total',
				fields: ['id','name','acl_id','acl_book','checked'],
				remoteSort: true
			}),
			split:true,
			allowNoSelection:true,
			relatedStore: this.allIncomeGrid.store,
			tbar: [this.showScheduledField = new Ext.form.Checkbox({
				boxLabel: t("Show invoiced projects", "projects2"),
				labelSeparator: '',
				name: 'show_invoiced',		
				allowBlank: true,
//				ctCls:'bs-scheduled-cb',
				listeners: {
					'check': function(checkbox, checked) { 
						this.allIncomeGrid.store.baseParams['show_invoiced'] = checked;
						this.allIncomeGrid.store.reload();
					},
					scope: this
				}
			})]
		});
	
	this.items = [
		this.typesMultiSelect,
		this.allIncomeGrid
	];
	
	GO.projects2.AllIncomePanel.superclass.constructor.call(this,config);
	
	
	this.allIncomeGrid.store.on('beforeload',function(store){
		store.baseParams['pr2_all_incomes_types'] = Ext.encode(this.typesMultiSelect.getSelected());
	}, this);
	
}

Ext.extend(GO.projects2.AllIncomePanel, Ext.Panel, {
	
	load: function () {
		this.typesMultiSelect.store.load();
		
		GO.request({
				url: 'projects2/income/getDateSettings',
				success: function(response,options,result) {
					if (result.start_date > 0) {
						this.allIncomeGrid.from.setValue(new Date(result.start_date * 1000));
						this.allIncomeGrid.store.baseParams['start_date'] = result.start_date;
					}
					if (result.end > 0) {
						this.allIncomeGrid.till.setValue(new Date(result.end * 1000));
						this.allIncomeGrid.store.baseParams['end'] = result.end;
					}
				},
				scope: this
			});
	}
	
});
