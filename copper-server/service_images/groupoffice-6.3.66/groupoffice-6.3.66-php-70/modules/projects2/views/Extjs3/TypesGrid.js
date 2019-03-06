/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: TypesGrid.js 22922 2018-01-12 08:01:04Z mschering $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */
GO.projects2.TypesGrid = Ext.extend(GO.grid.GridPanel,{

	initComponent : function(){
		
		Ext.apply(this,{
			title:t("Permission types", "projects2"),
			standardTbar:true,
			store: new GO.data.JsonStore({
				url:GO.url("projects2/type/store"),
				fields: ['id','name','acl_id']
			}),
            editDialogClass: GO.projects2.TypeDialog,
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
					header: t("Name"), 
					dataIndex: 'name'
				}
				]
			})
		});
		
		GO.projects2.TypesGrid.superclass.initComponent.call(this);		
	}
});
