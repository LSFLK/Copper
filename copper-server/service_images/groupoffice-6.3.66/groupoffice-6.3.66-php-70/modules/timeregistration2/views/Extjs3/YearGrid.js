/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: YearGrid.js 22939 2018-01-12 08:01:21Z mschering $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */
GO.timeregistration2.YearGrid = Ext.extend(GO.grid.GridPanel,{

  overviewGrid: false, //thestore to reload when a year is selected

	initComponent : function(){
		
		Ext.apply(this,{
			title: t("Year"),
			region:'west',
			store: new GO.data.JsonStore({
			  url: GO.url('timeregistration2/year/store'),		
			  fields:['id', 'year']
			}),
			listeners:{
				show:function(){
					this.store.load();
				},
				scope:this
			},
			cm:new Ext.grid.ColumnModel({
				columns:[
				 // { header: 'ID', dataIndex: 'id' },
				  { header: t("Year"), dataIndex: 'year'}
				]
			})
		});
		
		GO.timeregistration2.YearGrid.superclass.initComponent.call(this);		

		this.on('delayedrowselect', function(sm, i, record){
		  if(this.mainPanel){
			this.mainPanel.cardPanel.getLayout().setActiveItem(1); //yeaPanel
		    this.mainPanel.yearOverview.loadEntries(record.get('year'));
		  }
		}, this);
	}
});
