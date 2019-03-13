/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: TypesGrid.js 22937 2018-01-12 08:01:19Z mschering $
 * @copyright Copyright Intermesh
 * @author Michiel Schmidt <michiel@intermesh.nl>
 * @author Merijn Schering <mschering@intermesh.nl>
 */
GO.tickets.TypesGrid = Ext.extend(GO.grid.MultiSelectGrid,{
	
	initComponent : function(){
		
		Ext.apply(this,{
			id:'ti-types-grid',
			height:200,
			title:t("Types", "tickets"),
			view : new Ext.grid.GroupingView({
				showGroupName: false,
				enableNoGroups:false, // REQUIRED!
				hideGroupedColumn: true,
				emptyText: t("General", "tickets")
			}),
			store: GO.tickets.readableTypesStore, 
			autoLoadRelatedStore:false,
			loadMask:true,
			allowNoSelection:true,
			split: true
		});
		
		GO.tickets.TypesGrid.superclass.initComponent.call(this);		
	},
	// this will add a description label when the column is hovered
	getColumns : function(){
		var columns = GO.tickets.TypesGrid.superclass.getColumns.call(this);
		
		columns[1].renderer = function(value, p, record){
			if(!GO.util.empty(record.data.description))
				p.attr = 'ext:qtip="'+Ext.util.Format.htmlEncode(record.data.description)+'"';
			return value;
		}
		columns.push({
			header: t("Type group", "tickets"), 
			dataIndex: 'group_name'
		});
		
		return columns;
	}
});
