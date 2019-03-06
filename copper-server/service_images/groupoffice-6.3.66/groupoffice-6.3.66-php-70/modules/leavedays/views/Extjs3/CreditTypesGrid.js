//CreditTypes


GO.leavedays.CreditTypesGrid = Ext.extend(GO.grid.GridPanel,{
	initComponent: function() {
		
		
		Ext.apply(this, {
			noDelete: true,
			standardTbar:true,
			loadMask: true,
			ddGroup:  Ext.id(),
			enableDragDrop: true,
			editDialogClass: GO.leavedays.CreditTypeDialog,
			
			store: new GO.data.JsonStore({
				url:GO.url("leavedays/creditType/store"),
				fields:['id','name', 'description'],
				remoteSort:true
			}),
			autoLoadStore: true,
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
		
		GO.leavedays.CreditTypesGrid.superclass.initComponent.call(this);		
	},
	
	afterRender : function(){
		
		GO.leavedays.CreditTypesGrid.superclass.afterRender.call(this);
		//enable row sorting
		var DDtarget = new Ext.dd.DropTarget(this.getView().mainBody, 
		{
			ddGroup : this.ddGroup,
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
		var dropRowData = this.store.getAt(cindex);
		
		
		for(i = 0; i < rows.length; i++) 
		{								
			var rowData=this.store.getById(rows[i].id);
			
			//set new group field
			rowData.set(this.store.groupField, dropRowData.get(this.store.groupField));
			
			
		
			if(!this.copy){
				this.store.remove(this.store.getById(rows[i].id));
			}
			
			this.store.insert(cindex,rowData);
		}
		
		//save sort order							
		var records = [];

  	for (var i = 0; i < this.store.data.items.length;  i++)
  	{			    	
			records.push({id: this.store.data.items[i].get('id'), sort_index : i, category_id: this.store.data.items[i].get('category_id')});
  	}
		
		GO.request({
			url:'leavedays/CreditType/saveSort',
			params:{
				fields:Ext.encode(records)
			}
		})
		
//		Ext.Ajax.request({
//			url: GO.settings.modules.customfields.url+'action.php',
//			params: {
//				task: 'save_fields_sort_order',
//				fields: Ext.encode(records)
//			}
//		});
//					
		
	},
});
