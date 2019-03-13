GO.customfields.EnableBlocksPanel = Ext.extend(Ext.Panel, {
	initComponent : function(){
		
		var checkColumn = new GO.grid.CheckColumn({
			header: t("Enabled", "customfields"),
			dataIndex: 'enabled',
			width: 80,
			listeners:{
				scope:this,
				change:function(record, checked){
					GO.request({
						url:"customfields/block/enable",
						params:{
							enable: checked,
							block_id:record.data.id,
							model_id:this.model_id,
							model_name:this.model_name
						},
						success:function(response, options, result){
							this.loadGridStore();
						},
						scope: this
					});
				}
			}
		});
		
		this.enableBlocksGrid= new GO.grid.GridPanel({
			region:'center',
			loadMask:true,
			store: new GO.data.JsonStore({
				url: GO.url("customfields/block/enableStore"),
				baseParams:{
					model_id:0,
					model_name:""
				},
				fields:['id','name','enabled','col_id','customfield_name','customfield_datatype','extendsModel'],
				remoteSort: true
			}),
			plugins: [checkColumn],
			paging: true,
			cm : new Ext.grid.ColumnModel({
				defaults:{
					sortable:true
				},
				columns:[checkColumn,{
					header: 'ID',
					dataIndex: 'id',
					width: 50,
					sortable: true
				},{
					header: t("Name"),
					dataIndex: 'name',
					width: 100,
					sortable: true
				},{
					header: t("Custom field ID", "customfields"),
					dataIndex: 'col_id',
					width: 80,
					sortable: true
				},{
					header: t("Listed model type", "customfields"),
					dataIndex: 'extendsModel',
					width: 150,
					sortable: true,
					renderer: function(v) {
						return t("v", "customfields");
					}
				},{
					header: t("Listed under", "customfields"),
					dataIndex: 'customfield_datatype',
					width: 150,
					sortable: true,
					renderer: function(v) {
						return t("v", "customfields");
					}
				}]
			}),
			width: 210,
			split:true,
			allowNoSelection:true
		});
		
		
		Ext.apply(this, {
			layout:'fit',		
			items:[this.enableBlocksGrid],
			listeners:{
				scope:this,
				show:function(){
					this.loadGridStore();
				}
			}			
		});		
		
		if(!this.title)
			this.title=t("Enable blocks", "customfields");
		
		GO.customfields.EnableBlocksPanel.superclass.initComponent.call(this);
	},
	
	/**
	 * Set the model to edit.
	 * 
	 * @param int model_id
	 * @param string model_name The name of the model that controls the disabled categories. eg. GO\Addressbook\Model\Addressbook controls them for GO\Addressbook\Model\Contact
	 */
	setModel : function(model_id, model_name){
		this.setDisabled(GO.util.empty(model_id) || GO.util.empty(model_name));
		this.model_id=this.enableBlocksGrid.store.baseParams.model_id=model_id;
		this.model_name=this.enableBlocksGrid.store.baseParams.model_name=model_name;
	},
	
	loadGridStore : function() {
		this.enableBlocksGrid.store.load();
	}
});
