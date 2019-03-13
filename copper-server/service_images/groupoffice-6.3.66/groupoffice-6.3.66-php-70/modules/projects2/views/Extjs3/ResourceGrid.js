/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: ResourceGrid.js 23462 2018-03-06 11:37:47Z mschering $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */

GO.projects2.ResourceGrid = Ext.extend(GO.grid.GridPanel,{
  
	template: false, // set to true when grid/dialog is used for addming templates
  
	initComponent : function(){
		var relatedIdField = this.relatedIdField = this.template?'template_id':'project_id';
		var storeRoute = this.template?'projects2/defaultResource/store':'projects2/resource/store';
		var summary = new Ext.grid.GridSummary();
		
		var feeColumns = [	{
			header: t("User"),
			dataIndex: 'user_name'
		},{
			header: t("External fee", "projects2"),
			dataIndex: 'external_fee',			
			align:'right',
			renderer: function (v, meta, record) {
				if(record.json.externalRates == "-") {
					return "-";
				}
				var min = GO.util.unlocalizeNumber(v), max = min;
				if(record.json.externalRates) {
					for(var i = 0; i < record.json.externalRates.length; i++) {
						min = Math.min(min, record.json.externalRates[i].external_rate);
						max = Math.max(max, record.json.externalRates[i].external_rate);
					}
					if(min < max) {
						return GO.util.format.valuta(min) + ' - ' + GO.util.format.valuta(max);
					}
				}
				return GO.util.format.valuta(v);
			}
//			,
//			summaryType: 'sum',
//			summaryRenderer:function(value){
//				return GO.util.format.valuta(GO.util.unlocalizeNumber(value));
//			},
		},{
			header: t("Internal fee", "projects2"),
			dataIndex: 'internal_fee',
			renderer : function(v){
				if(v == "-") {
					return "-";
				}
				return GO.util.format.valuta(v);
			
			},
			align:'right'
//			,
//			summaryType: 'sum',
//			summaryRenderer:function(value){
//				return GO.util.format.valuta(GO.util.unlocalizeNumber(value));
//			},
		},{
			header: t("Budgeted", "projects2"),
			dataIndex: 'budgeted_units',
			renderer : function(v) { return GO.util.format.duration(GO.util.unlocalizeNumber(v)*60); },
			align:'right',
			summaryType: 'sum',
			summaryRenderer: function(v) { return GO.util.format.duration(GO.util.unlocalizeNumber(v)*60); }
			}
	];
    
		Ext.apply(this,{
			title:t("Employees", "projects2"),
			standardTbar:true,
			paging: true,
			viewConfig: {
				getRowClass : function(row, index) {	
					if (row.data.disabled == '1') {
						return 'go-grid-row-inactive';
					} 
				}
			},
			plugins:[summary],
			store: new GO.data.JsonStore({
				url: GO.url(storeRoute),
				baseParams: {
					project_id:0
				},
				fields: [relatedIdField, 'user_id','user_name', 'internal_fee', 'external_fee','budgeted_units','total_budget'],
				remoteSort: false
			}),
			relatedGridParamName: relatedIdField,
			editDialogClass: GO.projects2.ResourceDialog,
			border: false,
			listeners:{
				show:function(){
					if(!this.store.loaded)
						this.store.load();
				},
				scope:this
			},
			cm:new Ext.grid.ColumnModel({
				defaults:{
					sortable:true
				},
				columns:feeColumns
			})
		});
 
		GO.projects2.ResourceGrid.superclass.initComponent.call(this);		
	},
	setProjectId : function(project_id){
		if(this.store.baseParams[this.relatedIdField]!=project_id){
			this.store.baseParams[this.relatedIdField]=project_id;
			this.setDisabled(GO.util.empty(project_id));

			this.store.removeAll();
			this.store.loaded=false;
		}
	},
	setTemplateId : function(template_id) {
		this.setProjectId(template_id); // uses relatedIdField
	},
	showEditDialog : function(id){
		if(!this.editDialog){
			this.editDialog = new this.editDialogClass({template:this.template});

			this.editDialog.on('save', function(){   
				this.store.reload();   
				this.changed=true;
			}, this);	
		}

		this.editDialog.formPanel.baseParams[this.relatedIdField] = this.store.baseParams[this.relatedIdField];
		
		var loadParams = {user_id:id};
		loadParams[this.relatedIdField]=this.store.baseParams[this.relatedIdField];
		
		this.editDialog.show(id,{loadParams:loadParams});	  
	}
});
