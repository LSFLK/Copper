/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: StandardTaskGrid.js 23462 2018-03-06 11:37:47Z mschering $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */
GO.projects2.StandardTaskGrid = Ext.extend(GO.grid.GridPanel,{

	initComponent : function(){
		
		Ext.apply(this,{
			title:t("Activities", "projects2"),
			standardTbar:true,
//			view: new Ext.grid.GroupingView({
//				showGroupName: false,
//				enableNoGroups:false, // REQUIRED!
//				hideGroupedColumn: true,
//				emptyText: 'empty',
//				autoFill: true, 
//				forceFit: true ,
//				getRowClass : function(row, index) {	
//					if (row.data.disabled == '1') {
//						return 'go-grid-row-inactive';
//					} 
//				}
//			}),
			store: GO.projects2.standardTaskStore,
			editDialogClass: GO.projects2.StandardTaskDialog,
			border: false,
			paging:true,
			listeners:{
				show:function(){
					this.store.load();
				},
				scope:this
			},
			cm:new Ext.grid.ColumnModel({
				defaults:{
					sortable:true
				},
				columns:[
				{
					header: t("Code", "projects2"),
					dataIndex: 'code',
					width: 40
				},{
					header: t("Name"),
					dataIndex: 'name'
				},{
					header: t("Description"),
					dataIndex: 'description',
					renderer: function(value){
						return value.replace(/<br[^>]*>/gi," "); //hide those newlines in the grid
					}
				},{
					header: t("Default duration", "projects2"),
					dataIndex: 'units',
					width: 40,
					align:'right'
				},{
					header: t("Billable", "projects2"),
					dataIndex: 'is_billable',
					width: 40,
					renderer: function(value) {
						return value ? t("Yes") : t("No");
					}
				}
				]
			})
		});
		
		GO.projects2.StandardTaskGrid.superclass.initComponent.call(this);		
	}
});
