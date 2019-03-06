/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: RatesGrid.js 22937 2018-01-12 08:01:19Z mschering $
 * @copyright Copyright Intermesh
 * @author Merijn Schering <mschering@intermesh.nl>
 */



GO.tickets.RatesGrid = function(config){
	if(!config)
	{
		config = {};
	}

	config.layout='fit';
	config.autoScroll=true;
	config.split=true;

	config.title=t("Rates", "tickets");

	if (typeof(config.objectType)=='undefined') {
		config.store=GO.tickets.ratesStore;
	} else if (config.objectType=='company') {
		config.store= GO.tickets.companyRatesStore;
	}

	config.bbar = new Ext.PagingToolbar({
		cls: 'go-paging-tb',
		store: config.store,
		pageSize: parseInt(GO.settings['max_rows_list']),
		displayInfo: true,
		displayMsg: t("Displaying items {0} - {1} of {2}"),
		emptyMsg: t("No items to display")
	});

	var columns = [	{
			header: t("Name"),
			dataIndex: 'name',
			editor: new Ext.form.TextField({
				allowBlank: false
			})
		},{
			header: t("Amount", "tickets"),
			dataIndex: 'amount',
			editor: new GO.form.NumberField({
				allowBlank: false
			}),
			align:'right'
		}];



	if(go.Modules.isAvailable("legacy", "billing")){
		
			this.costCodeCombo = new GO.form.ComboBoxReset({
					name : 'cost_code',
					hideLabel: true,
					store: new GO.data.JsonStore({
						url: GO.url('billing/costcode/store'),
						baseParams : {
							permissionLevel : GO.permissionLevels.read
						},
						fields : ['id','code'],
						root : 'results',
						id : 'id',
						totalProperty : 'total',
						setBookId : function(book_id){
							if(this.baseParams.book_id!=book_id){
								this.baseParams.book_id=book_id;
								this.reload();
							}
						}
					}),
					displayField:'code',
					valueField: 'code',
					mode:'local',
					triggerAction:'all',
					selectOnFocus:true,
					forceSelection: true,
					anchor:'-20',
					value:''
				});
		
		columns.push({
			header: t("Cost code", "billing"),
			dataIndex: 'cost_code',
			editor: this.costCodeCombo
		});
	}

	var columnModel =  new Ext.grid.ColumnModel({
		defaults:{
			sortable:true
		},
		columns: columns
	});

	config.cm=columnModel;
	config.view=new Ext.grid.GridView({
		autoFill: true,
		forceFit: true,
		emptyText: t("No items to display")
	});
	config.sm=new Ext.grid.RowSelectionModel({
	    singleSelect : true
	});
	config.loadMask=true;

	config.clicksToEdit=1;



	var recordFields = [
	{
		name: 'id',
		type: 'int'
	},
	{
		name: 'name',
		type:'string'
	},{
		name: 'amount',
		type: 'string'
	}
	];
	
	if(go.Modules.isAvailable("legacy", "billing"))
		recordFields.push({
			name: 'cost_code',
			type: 'string'
		});

	var Rate = Ext.data.Record.create(recordFields);


	config.tbar=[{
		iconCls: 'btn-add',
		text: t("Add"),
		cls: 'x-btn-text-icon',
		handler: function(){
			var e = new Rate({
				id: '0',
				name:'',
				amount: GO.util.numberFormat("0")
			});
			this.stopEditing();
			this.store.insert(0, e);
			this.startEditing(0, 0);
		},
		scope: this
	},{
		iconCls: 'btn-delete',
		text: t("Delete"),
		cls: 'x-btn-text-icon',
		handler: function(){
		    if (typeof(this.selectedIndex)!='undefined') {
					if (this.store.getAt(this.selectedIndex).data.id!='0') {
							Ext.Ajax.request({
							url : GO.url('tickets/rate/delete'),
							params : {
									'id' : this.store.getAt(this.selectedIndex).data.id
							},
							callback:function(options, success, response){
								var result = Ext.decode(response.responseText);
								if (!success || !result.success) {
									if (result.responseText.feedback) {
										Ext.MessageBox.alert(t("Error"),result.responseText.feedback);
							}
								}
						},
						scope:this
							});
					}
					this.store.removeAt(this.selectedIndex);
		    }
		},
		scope: this
	}];

	config.listeners={
		render:function(){
		    if(GO.settings.modules.tickets.write_permission && !this.store.loaded)
			this.store.load();
		},
		rowclick: function(sm,i,record) {
		    this.selectedIndex = i;
		},
		scope:this
	}

	GO.tickets.RatesGrid.superclass.constructor.call(this, config);

	this.on('show',function(){
		if (this.costCodeCombo)
			this.costCodeCombo.store.load();
	},this);

};
Ext.extend(GO.tickets.RatesGrid, Ext.grid.EditorGridPanel,{
	
	setCompanyId : function(company_id) {
	    this.store.baseParams.company_id = this.company_id = company_id;
	},
	
	getGridData : function(){

		var data = {};

		for (var i = 0; i < this.store.data.items.length;  i++)
		{
			var r = this.store.data.items[i].data;

			data[i]={};

			for(var key in r)
			{
				data[i][key]=r[key];
			}
		}

		return data;
	},
	setIds : function(ids)
	{
		for(var index in ids)
		{
			if(index!="remove")
			{
				this.store.getAt(index).set('id', ids[index]);
			}
		}
	},
	save : function(maskEl){
		if (this.company_id) {
			var params = {
				task:'rates',
				rates:Ext.encode(this.getGridData()),
				company_id: this.company_id
			}
		} else {
			var params = {
				task:'rates',
				rates:Ext.encode(this.getGridData())
			}
		}

		if(this.store.getModifiedRecords().length>0 || this.deletedRecords){

			if (!this.company_id)
				maskEl.mask(t("Saving..."));
			
			Ext.Ajax.request({
			    url : GO.url('tickets/rate/submitRates'),
			    params:params,
			    callback:function(options, success, response){
				this.store.commitChanges();
				var result = Ext.decode(response.responseText);
				if(result.new_rates)
				{
				    this.setIds(result.new_rates);
				}
				this.deletedRecords=false;
				if (!this.company_id)
				    maskEl.unmask();
			    },
			    scope:this
			});
			
		}
	}
});
