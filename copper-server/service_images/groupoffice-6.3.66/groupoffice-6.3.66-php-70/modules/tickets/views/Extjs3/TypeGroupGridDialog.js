/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @copyright Copyright Intermesh
 * @version $Id: TypeGroupGridDialog.js 22937 2018-01-12 08:01:19Z mschering $
 * @author Michael de Hart <mdhart@intermesh.nl>
 */
GO.tickets.TypeGroupGridDialog = Ext.extend(GO.grid.GridPanel, {
	changed : false,
	initComponent : function(){
		
		Ext.apply(this, {
            goDialogId: 'expenseType',
            layout: 'fit',
            //title: t("Type group", "tickets"),
            width: 700,
            height: 500,
            resizable: false,
            formControllerUrl: 'projects/type',
			standardTbar: true,
			editDialogClass: GO.tickets.TypeGroupDialog,
			paging: true,
			store: new GO.data.JsonStore({
				url:GO.url("tickets/typeGroup/store"),
				fields: ['id','name']
			}),
			view : new Ext.grid.GridView({
				autoFill:true,
				forceFit:true		    
			}),
			columns: [{
				header:t("Name"),
				dataIndex: 'name'
			}],
			ddGroup:'tiTypeGroupsDD',
			enableDragDrop:true
        });
		
		GO.tickets.TypeGroupGridDialog.superclass.initComponent.call(this);
	},
	
	afterRender : function(){
		
		GO.tickets.TypeGroupGridDialog.superclass.afterRender.call(this);
		//enable row sorting
		var DDtarget = new Ext.dd.DropTarget(this.getView().mainBody, 
		{
			ddGroup : 'tiTypeGroupsDD',
			copy:false,
			notifyDrop : this.notifyDrop.createDelegate(this)
		});
	},
	
	notifyDrop : function(dd, e, data)
	{
		var sm=this.getSelectionModel();
		var rows=sm.getSelections();
		var dragData = dd.getDragData(e);
		var cindex=dragData.rowIndex;
		if(cindex=='undefined')
		{
			cindex=this.store.data.length-1;
		}	
		
		for(i = 0; i < rows.length; i++) 
		{								
			var rowData=this.store.getById(rows[i].id);
			
			if(!this.copy){
				this.store.remove(this.store.getById(rows[i].id));
			}
			
			this.store.insert(cindex,rowData);
		}
		
		//save sort order							
		var records = [];
		for (var i = 0; i < this.store.data.items.length;  i++)
		{			    	
			records.push({
				id: this.store.data.items[i].get('id'), 
				sort_index : i
			});
		}
  	
		this.changed=true;

		GO.request({
			url:'tickets/typeGroup/saveSort',
			params:{
				groups:Ext.encode(records)
			}
		})
		
	}
	
});
