GO.projects2.SelectTemplateWindow = Ext.extend(GO.Window, {

	initComponent : function(){

		this.list = new GO.grid.SimpleSelectList(
		{
			store: new GO.data.JsonStore({
				fields:['id','name'],
				url:GO.url("projects2/template/select"),
				baseParams:{
					limit:0,
					start:0
				}
				
			})
			}
		);			

		this.list.on('click', function(dataview, index){
			this.showConfig.template_id= dataview.store.data.items[index].id;
            this.showConfig.customfields = dataview.store.data.items[index].json.customfields;
			this.list.clearSelections();
			this.projectDialog.show(this.showConfig);
			this.hide();
		},this);

		Ext.apply(this, {
			title: t("Select template", "projects2"),
			layout:'fit',
			closable:true,
			closeAction:'hide',
			modal:false,
			height:400,
			width:600,
			items: new Ext.Panel({
				items: this.list,
				autoScroll:true,
				cls: 'go-form-panel'
			})
		});


		GO.projects2.SelectTemplateWindow.superclass.initComponent.call(this);
	},

	show : function(config){

		if(!this.rendered)
			this.render(Ext.getBody());

		this.showConfig = config || {};

//		this.list.store.baseParams.parent_project_id=config.parent_project_id;
		GO.request({
			url:"projects2/template/select",
			params:{
				parent_project_id: config.parent_project_id,
				limit:0,
				start:0
			},
			scope:this,
			success:function(response,options, result){
				
				this.list.store.loadData(result);
		
				if(!this.list.store.getCount()){
					this.showConfig.template_id=0;
					this.projectDialog.show(this.showConfig);
				}else if(this.list.store.getCount()==1)
				{
					var records = this.list.store.getRange(0,1);
					this.showConfig.template_id=records[0].get('id');
                    this.showConfig.customfields = records[0].json.customfields;
					this.projectDialog.show(this.showConfig);				
				}else
				{
					GO.projects2.SelectTemplateWindow.superclass.show.call(this);
				}
			}
		});
		
	}

});
