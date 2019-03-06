/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: ResourceDialog.js 23462 2018-03-06 11:37:47Z mschering $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */
GO.projects2.ResourceDialog = Ext.extend(GO.dialog.TabbedFormDialog, {

    template: false,
	
	initComponent: function() {
		var relatedIdField = this.relatedIdField = this.template?'template_id':'project_id';
		var controllerRoute = this.template?'projects2/defaultResource':'projects2/resource';
		
		Ext.apply(this, {
			//goDialogId: 'pm-resource',
			layout: 'fit',
			title: t("Resource", "projects2"),
			width: 500,
			height: this.template?320:620,
			resizable: true,
			formControllerUrl: controllerRoute
		});

		GO.projects2.ResourceDialog.superclass.initComponent.call(this);
	},
	
	afterLoad : function(remoteModelId, config, action){
		
		this.setPermissionLevel(action.result.data.permission_level);
		
		if(config.loadParams.project_id){
			this.populateExternalRates(action.result.data.externalRates || []);
			this.applyToExistingCheck.setVisible(false);
		} else {
			this.applyToExistingCheck.setVisible(true);
		}
	},
	
	setPermissionLevel : function(permissionLevel) {
		var hasFinance = permissionLevel >= GO.projects2.permissionLevelFinance;
		
		this.externalRateGrid.setVisible(hasFinance);
		this.extFeeComposite.setVisible(hasFinance);
		this.intFeeComposite.setVisible(hasFinance);
	},
	
	afterShowAndLoad : function(remoteModelId, config){
		if(this.selectTimeUser.store.baseParams[this.relatedIdField] != config.loadParams[this.relatedIdField]){
			this.selectTimeUser.store.baseParams[this.relatedIdField] = config.loadParams[this.relatedIdField];
			delete this.selectTimeUser.lastQuery;
		}
	},
	
	beforeSubmit : function(params){

		rates = [];
		this.externalRateStore.each(function(record){
			rates.push(record.data);
		},this);
		params.externalRates = Ext.encode(rates);

		GO.projects2.ResourceDialog.superclass.beforeSubmit.call(this, params);
	},
	
	populateExternalRates : function(items){
		this.externalRateStore.removeAll();
		for(var i=0; i < items.length; i++){
			
			var r = new Ext.data.Record({
				external_rate: items[i].external_rate,
				activity_id: items[i].activity_id,
				activity_name: items[i].activity_name
			});
			this.externalRateGrid.stopEditing();
			this.externalRateStore.insert(0, r);
		}
		this.filterUnused(this.unusedActivitiesStore);
	},
	
	filterUnused: function(store) {
		store.filterBy(function(record, id) {
			if(record.data.is_billable != 1){
				return false;
			}
			return this.externalRateStore.find('activity_id', id) === -1;
		},this);
	},
	
	buildForm: function() {
        
		this.externalRateStore = new Ext.data.ArrayStore({
			id: 'activity_id',
			fields: ['activity_name', 'external_rate','activity_id'],
			data : []
		});
		
		var unusedActivitiesStore = this.unusedActivitiesStore = new GO.data.JsonStore({
			url:GO.url("projects2/standardTask/store"),
			fields:['id','code','name', 'description', 'units', 'disabled','is_billable'],
			remoteSort:true
		});
		unusedActivitiesStore.on('load', function(store, records, options){
			store.filterBy(function(record, id) {
				if(record.data.is_billable != 1){
					return false;
				}
				return this.externalRateStore.find('activity_id', id) === -1;
			},this);
		},this);
		unusedActivitiesStore.load();
		
		this.externalRateGrid = new Ext.grid.EditorGridPanel({
					title: t('External rate per activity'),
					clicksToEdit: 1,
					hidden: this.template,
					height: 300,
					store: this.externalRateStore,
					viewConfig: {
						forceFit: true,
						emptyText: t('No rate per activity configured')
					},
					cm: new Ext.grid.ColumnModel({
						defaults: {
							sortable: false
						},
						columns: [{
							header: t('Activity'),
							name: 'activity_name'
						},{
							header: t('Rate'),
							align: 'right',
							dataIndex: 'external_rate',
							renderer: GO.util.format.valuta,							
							editor: new GO.form.NumberField({
								serverFormats: false
							})
						}]
					}),
					tbar: [{
						xtype:'combo',
						editable: false,
						iconCls: 'ic-add',
						displayField: 'name',
						valueField: 'id',
						triggerAction: 'all',
						width:100,
						mode: 'local',
						listWidth: 400,
						store: unusedActivitiesStore,
						value: t('Add'),
						listeners: {
							expand: function(cb) {
								this.filterUnused(cb.store);
							},
							select: function(cb, record) {

								this.externalRateGrid.stopEditing();
								this.externalRateGrid.store.insert(0, new Ext.data.Record({
									activity_id: record.data.id,
									activity_name: record.data.name,
									external_rate: ''
								}));
								this.externalRateGrid.startEditing(0, 1);
								
								cb.setValue(t('Add'));
							},
							scope: this
						},
					},' ',{
						iconCls: 'ic-delete',
						text: t('Delete'),
						handler: function () {
							var sel = this.externalRateGrid.selModel.getSelectedCell();
							if (sel) {
								this.externalRateGrid.store.removeAt(sel[0]);
								this.filterUnused(unusedActivitiesStore);
							}
						},
						scope: this
					}]
				});
		
				
		this.applyToExistingCheck = new Ext.ux.form.XCheckbox({
				boxLabel: t("Apply to all existing projects with this template.", "projects2"),
				name: 'apply_to_existing',
				value: false
			});		
				
		this.formPanel = new Ext.Panel({
			autoScroll:true,
			cls: 'go-form-panel',
			layout: 'form',
			labelWidth: 120,
			items: [
			this.selectTimeUser = new GO.form.ComboBox({
				hiddenName:'user_id',
				fieldLabel:t("Employee", "projects2"),
				//emptyText:t("Nobody", "tickets"),
				valueField:'user_id',
				displayField:'name',
				listWidth: 300,
				store:new GO.data.JsonStore({
					url:GO.url('projects2/employee/store'),
					baseParams:{
						//project_id:0 //this.showConfig.values.project_id
					},
					fields:['user_id','name','internal_fee','external_fee','externalRates']
				}),
				pageSize: parseInt(GO.settings['max_rows_list']),
				listeners:{
					scope:this,
					select:function(cb, record){
						this.formPanel.form.findField('external_fee').setValue(record.data.external_fee);
						this.formPanel.form.findField('internal_fee').setValue(record.data.internal_fee);
						this.populateExternalRates(record.data.externalRates);
					}
				},
				mode: 'remote',
				reloadOnExpand: true,
				triggerAction:'all',
				editable:true,
				selectOnFocus:true,
				allowBlank:false,
				typeAhead: true
			}),this.extFeeComposite = new Ext.form.CompositeField({
			itemId: 'extFeeCont',
			xtype: 'compositefield',
			fieldLabel: t("External fee", "projects2"),
			items: [
				{
					xtype: 'numberfield',
					width:80,
					name: 'external_fee'
				},{
					xtype: 'xcheckbox',
					boxLabel: t("Use overtime rates", "projects2"),
					name: 'apply_external_overtime'
				}
			]}),this.intFeeComposite = new Ext.form.CompositeField({
			itemId: 'intFeeCont',
			xtype: 'compositefield',
			fieldLabel: t("Internal fee", "projects2"),
			items: [
				{
					xtype: 'numberfield',
					width:80,
					name: 'internal_fee'
				},{
					xtype: 'xcheckbox',
					boxLabel: t("Use overtime rates", "projects2"),
					name: 'apply_internal_overtime'
				}
			]}),{
				xtype: 'numberfield',
				fieldLabel: t("Budgeted", "projects2"),
				name: 'budgeted_units',
				decimals: 0,
				allowBlank: false
			},
			this.applyToExistingCheck,
			this.externalRateGrid
			]
		});

		this.addPanel(this.formPanel);
	}

});
