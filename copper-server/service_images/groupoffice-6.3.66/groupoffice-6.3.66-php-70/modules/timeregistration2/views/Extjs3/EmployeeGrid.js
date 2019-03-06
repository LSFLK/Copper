/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: EmployeeGrid.js 22939 2018-01-12 08:01:21Z mschering $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */
GO.timeregistration2.EmployeeGrid = Ext.extend(GO.grid.GridPanel,{

	initComponent : function(){
		
		Ext.apply(this,{
			title:t("Employees", "timeregistration2"),
			noDelete: true,
			standardTbar:false,
			store: new GO.data.JsonStore({
				url:GO.url("timeregistration2/employee/store"),
				fields:['id','name', 'closed_entries_time']
			}),
            editDialogClass: GO.timeregistration2.EmployeeDialog,
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
                    hidden: true,
					header: 'id', 
					dataIndex: 'id'
				},{
					header: t("Name"), 
					dataIndex: 'name'
				},{
					header: t("Timeentries closed till", "timeregistration2"), 
					dataIndex: 'closed_entries_time'
				}
				]
			})
		});
		
		GO.timeregistration2.EmployeeGrid.superclass.initComponent.call(this);		
	}
});
