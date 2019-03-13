/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @copyright Copyright Intermesh
 * @version $Id: 
 * @author Wilmar van Beusekom <wilmar@intermesh.nl>
 */

GO.billing.CostCodesGrid = function(config){
	
	config = config || {};

	config.title = t("Cost codes", "billing");
	config.layout='fit';
	config.autoScroll=true;
	config.split=true;		
	config.store = new GO.data.JsonStore({
		url : GO.url('billing/costcode/store'),
		baseParams : {
			book_id:0
		},
		fields : ['id','code','name','description'],
		root : 'results',
		id : 'id',
		totalProperty : 'total'
	});
	config.paging=true;
	config.cm=new Ext.grid.ColumnModel({
		defaults:{sortable:true},
		columns:[{
			header: t("Cost code", "billing"),
			dataIndex: 'code',
			width:100,	
			align:"left",
			editor:this.codeField = new Ext.form.TextField({
				fieldLabel: t("Cost code", "billing"),
				name:'code'
			})
		},{
			header: t("Name"),
			dataIndex: 'name',
			width:200,
			align:"left",
			editor:this.nameField = new Ext.form.TextField({
				header: t("Name"),
				name:'name'
			})
		},{
			header: t("Description"),
			dataIndex: 'description',
			width:350,
			align:"left",
			editor:this.nameField = new Ext.form.TextArea({
				header: t("Description"),
				name:'description'
			})
		}]
	});
	//config.autoExpandColumn='description';
	config.view=new Ext.grid.GridView({
		emptyText: t("No items to display")
	});
	config.sm=new Ext.grid.RowSelectionModel();
	config.loadMask=true;
	config.clicksToEdit=1;

	var Option = Ext.data.Record.create([{
		name: 'id',
		type: 'int'
	},{
		name: 'book_id',
		type: 'int'
	},{
		name: 'code',
		type: 'string'
	},{
		name: 'name',
		type: 'string'
	},{
		name: 'description',
		type: 'string'
	}]);

	config.tbar=[{
		iconCls: 'btn-add',
		text: t("Add"),
		cls: 'x-btn-text-icon',
		handler: function(){
			var e = new Option({
				id: '0',
				book_id: this.store.baseParams.book_id,
				code:'',
				name:'',
				description:''
			});
			this.stopEditing();
			var rowIndex = this.store.getCount();
			this.store.insert(rowIndex, e);
			this.startEditing(rowIndex, 0);
		},
		scope: this
	},{
		iconCls: 'btn-delete',
		text: t("Delete"),
		cls: 'x-btn-text-icon',
		handler: function(){
			this.deleteSelected();
		},
		scope: this
	}];

	GO.billing.CostCodesGrid.superclass.constructor.call(this, config);

	this.on('afteredit', function(e){

		
		var url = GO.url('billing/costcode/update');
		// Change the url when updating an existing one
		if(e.record.data.id == 0){
			url = GO.url('billing/costcode/create');
		}

		// Only submit when at least the name and the code are filled.
		if(!GO.util.empty(e.record.data.name) && !GO.util.empty(e.record.data.code)){
		
			Ext.Ajax.request({
				url: url,
				params : {
					id : e.record.data.id,
					book_id:this.store.baseParams.book_id,
					code : e.record.data.code,
					name : e.record.data.name,
					description : e.record.data.description
				},
				scope : this,
				callback : function (options, success,response) {
					var responseParams = Ext.decode(response.responseText);

					if (!responseParams.success) {
						GO.errorDialog.show(responseParams.feedback);
					}else{
						if(responseParams.id){
							e.record.set('id', responseParams.id);
						}
						e.record.commit();
					}
				}
			});

		}
	}, this);
};

Ext.extend(GO.billing.CostCodesGrid, GO.grid.EditorGridPanel,{

	setBookId : function(book_id){
		if(this.store.baseParams.book_id!=book_id){
			this.store.baseParams.book_id=book_id;
			this.setDisabled(book_id==0);
			if(book_id>0){
				this.store.reload();
			}else
			{
				this.store.removeAll();
			}
		}
	}
	
	
});
