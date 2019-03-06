GO.projects2.AdvancedSearchWindow = Ext.extend(GO.Window,{
	store: false,
	searchField:false,
	initComponent : function(){
		
		Ext.apply(this, {
			title:t("Advanced search"),
			width:800,
			height:400,
			layout:"fit",
			items:[
				this.queryPanel = new GO.query.QueryPanel({
					modelName:'GO\\Projects2\\Model\\Project',
					modelAttributesUrl:GO.url('projects2/project/attributes'),
					modelExcludeAttributes:'calendar_id,company_id,contact_id,event_id,parent_project_id,select_fee,tasklist_id'
				})
			],
			buttons:[{
				text:t("Ok"),
				handler:function(){
					this.store.baseParams.advancedQueryData=Ext.encode(this.queryPanel.getData());
					this.store.load();
					this.hide();
				},
				scope:this
			},{
				text:t("Reset"),
				handler:function(){
					delete this.store.baseParams.advancedQueryData;
					this.store.reload();
					this.hide();
				},
				scope:this				
			},{
				text:t("Close"),
				handler:function(){
					this.hide();
				},
				scope:this				
			}]
		});
		
		this.store.on('load', this.onStoreLoad, this);
		
		GO.projects2.AdvancedSearchWindow.superclass.initComponent.call(this);
	},
	
	onStoreLoad : function(){
		if(!GO.util.empty(this.store.baseParams.advancedQueryData))
		{
			this.searchField.setValue("[ "+t("Advanced search")+" ]");
			this.searchField.setDisabled(true);
		}else
		{
			if(this.searchField.getValue()=="[ "+t("Advanced search", "addressbook")+" ]")
			{
				this.searchField.setValue("");
			}
			this.searchField.setDisabled(false);
		}
	}
});
