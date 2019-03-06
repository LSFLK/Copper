/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: SettingsTaxRateGrid.js 22862 2018-01-12 08:00:03Z mschering $
 * @copyright Copyright Intermesh
 * @author Wesley Smits <wsmits@intermesh.nl>
 */
 
GO.billing.SettingsTaxRateGrid = Ext.extend(GO.grid.GridPanel, {
	initComponent: function () {

		this.store = new GO.data.JsonStore({
			url: GO.url('billing/taxRate/store'),
			baseParams: {
				book_id: false,
				global: false
			},
			root: 'results',
			id: 'id',
			totalProperty: 'total',
			fields: ['id','book_id','percentage','name','description'],
			remoteSort: true
		});

		Ext.apply(this, {
			title: t("Tax rates", "billing"),
			layout: 'fit',
			standardTbar:true,
			editDialogClass: GO.billing.TaxRateDialog,
			relatedGridParamName:'book_id',
			hideSearchField:true,
			autoScroll: true,
			sm: new Ext.grid.RowSelectionModel(),
			store: this.store,
			border: false,
			paging: true,
			view: new Ext.grid.GridView({
				emptyText: t("No items to display")
//				,
//				getRowClass: this.rowRenderer
			}),
			cm: new Ext.grid.ColumnModel({
				defaults: {
					sortable: true
				},
				columns: [
					{
						header: t("Name"),
						dataIndex: 'name',
						id: 'name',
						width:200,
						align:'left'
					},{
						header: t("Percentage", "billing"),
						dataIndex: 'percentage',
						align: 'left',
						id: 'percentage',
						width: 80,
						sortable: true,
						renderer : function(value){ return value+'%';}
					},{
						header: t("Description"),
						dataIndex: 'description',
						id: 'description',
						width:200,
						align:'left'
					}
				]
			})			
		});

		GO.billing.SettingsTaxRateGrid.superclass.initComponent.call(this);
	},
	afterRender : function()
	{
		GO.billing.SettingsTaxRateGrid.superclass.afterRender.call(this);
		
		if(this.isVisible())
		{
			this.onGridShow();
		}
	},
	
	onGridShow : function(){
		if(!this.store.loaded && this.rendered)
		{
			this.store.load();
		}
	},
	setBookId : function(book_id){
		if(this.store.baseParams.book_id!=book_id){
			this.store.baseParams.book_id=book_id;
			if(book_id == 0){
				this.store.baseParams.global=1;
			}else{
				this.store.baseParams.global=0;
			}
			this.store.load();
		}
	}
});
