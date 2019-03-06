GO.billing.ImportSettingsPanel = Ext.extend(Ext.Panel,{
	title:t("Payments", "billing"),
	labelWidth:200,
	layout:'form',
	cls:'go-form-panel',
	initComponent : function(){
		this.items=[
		this.importStatusId = new GO.form.ComboBox({
			hiddenName: 'import_status_id',
			fieldLabel: t("Status paid", "billing"),
			store:new GO.data.JsonStore({
				url: GO.url('billing/status/store'),
				baseParams: {
					book_id: 0
				},
				fields: ['id','name'],
				remoteSort: true
			}),
			valueField:'id',
			displayField:'name',
			mode: 'remote',
			triggerAction: 'all',
			anchor: '-20',
			editable: false
		}),{
			xtype:'xcheckbox',
			boxLabel: t("Notify customer?", "billing"),
			labelSeparator: '',
			name: 'import_notify_customer',		
//			allowBlank: true,
			hideLabel:true
		},this.newBookField = new GO.form.ComboBoxReset({
			hiddenName: 'import_duplicate_to_book',
			fieldLabel: t("Copy to book", "billing"),
			store: GO.billing.writableBooksStore,
			emptyText:t("N/A"),
			valueField:'id',
			displayField:'name',
			typeAhead: true,
			mode: 'local',
			triggerAction: 'all',
			editable: false,
			anchor: '-20'
		})
		,
		this.duplicateStatusId = new GO.form.ComboBox({
			hiddenName: 'import_duplicate_status_id',
			fieldLabel: t("Status of copy", "billing"),
			store:new GO.data.JsonStore({
				url: GO.url('billing/status/store'),
				baseParams: {
					book_id: 0
				},
				fields: ['id','name'],
				remoteSort: true
			}),
			valueField:'id',
			displayField:'name',
			mode: 'remote',
			triggerAction: 'all',
			anchor: '-20',
			editable: false
		}),
		this.autoPaidStatus = {
			xtype:'xcheckbox',
			boxLabel: t("Automaticly add above paid status when enough payment is added", "billing"),
			labelSeparator: '',
			name: 'auto_paid_status',		
//			allowBlank: true,
			hideLabel:true
		}
	];
	
		this.newBookField.on('select', function(combo, record, index){			
			this.duplicateStatusId.store.baseParams.book_id=record.data.id;
			this.duplicateStatusId.store.removeAll();
			this.duplicateStatusId.clearLastSearch();
			
		}, this);
		
		
		GO.billing.ImportSettingsPanel.superclass.initComponent.call(this);
	},
	
	setBookId : function(book_id){
		this.importStatusId.store.baseParams.book_id=book_id;
		this.importStatusId.store.removeAll();
		this.importStatusId.clearLastSearch();
		
		this.setDisabled(book_id==0);
		
	}
				
});
