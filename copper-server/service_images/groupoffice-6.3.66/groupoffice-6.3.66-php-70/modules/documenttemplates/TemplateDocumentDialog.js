GO.documenttemplates.TemplateDocumentDialog = function(config){

	config=config || {};

	config.title=t("Document from template", "documenttemplates");
	config.width=600;
	config.height=600;
	config.closeAction='hide';
	//config.autoHeight=true;
	config.layout='border';
	/*config.layoutConfig={
			align : 'stretch',
			pack  : 'start',
			padding: '5'
	};*/
	config.keys=[{
			key:Ext.EventObject.ENTER,
			fn:function(key, e){
				if(e.target.id!=this.searchField.id){
					this.createFileFromTemplate();
				}
			},
			scope:this
		}];
	config.defaults={
		margins:'0 0 5 0'
		
	}


	var checkCol = new GO.grid.RadioColumn({
		header: '',
		dataIndex: 'checked',
		width: 55,
		onMouseDown : function(e, t){
		if(t.className && t.className.indexOf('x-grid3-cc-'+this.id) != -1){
				e.stopEvent();
				var index = this.grid.getView().findRowIndex(t);
				var record = this.grid.store.getAt(index);
				var disabled = this.isDisabled(record);

				if (!disabled)
				{
					if(record.get(this.dataIndex)) {
						return;
					}

					for(var i = 0, max = this.grid.store.getCount();i < max; i++) {
						var rec = this.grid.store.getAt(i);
						if(rec.get(this.dataIndex) && rec.get('model_name')==record.get('model_name')) {
							rec.set(this.dataIndex, false);
						}

					}
					record.set(this.dataIndex, true);
				}

			}
		}
	});
	var columnModel = new Ext.grid.ColumnModel({
		defaults:{
			sortable:true
		},
		columns:[
		checkCol,
		{
			header: t("Name"),
			dataIndex: 'name',
			renderer:function(v, meta, record){
				return '<div class="go-grid-icon go-model-icon-'+record.data.model_name+'">'+v+'</div>';
			}
		},
		{
			header: t("Type"),
			dataIndex: 'model_name',
			renderer: function(v, meta, record) {
				
				var entity = v.split("\\").pop();
				
				return t(entity, go.Entities.get(entity).module);
			}
		}
		]
	});

	var f;
	f = this.formPanel = new Ext.form.FormPanel({
		//title:t("filename"),
		region:'north',
		autoHeight:true,
		cls:'go-form-panel',
		items:[{
				xtype:'textfield',
				name:'name',
				fieldLabel:t("Name"),
				allowBlank:false,
				anchor:'100%'
		}]
	});

	config.focus = function(){
		f.form.findField('name').focus();
	};

	this.searchField = new GO.form.SearchField({
		store: GO.documenttemplates.ooTemplatesStore,
		width:200
  });

	this.templatesGrid = new GO.grid.GridPanel({
		region:'center',
		cls: "go-grid3-hide-headers",
		tbar: ["->", t("Search") + ':', this.searchField],
		title:t("Select document template", "documenttemplates"),
		listeners:{
			scope:this,
			delayedrowselect: function(grid, rowIndex, r){
				this.loadAmbiguousLinksGrid();
			}
		},
		viewConfig: {
			autoFill: true,
			forceFit: true,
			emptyText: t("No items to display"),
			afterRender: function(){
				this.constructor.prototype.afterRender.apply(this, arguments);
				this.grid.getSelectionModel().selectFirstRow();
			}
		},
		store:GO.documenttemplates.ooTemplatesStore,
		sm: new Ext.grid.RowSelectionModel({
			singleSelect:true
		}),
		columns:[{
			header: t("Name"),
			dataIndex: 'name',
			sortable:true
		},
		{
			header: t("Type"),
			dataIndex: 'type' ,
			renderer: this.typeRenderer.createDelegate(this),
			width: 100,
			sortable:false
		}]
	});
	
	


	this.ambiguousLinksGrid = new GO.grid.GridPanel({
		cls: "go-grid3-hide-headers",		
		region:'south',
		height:240,
		split:true,
		title:t("Select relevant resources", "documenttemplates"),
		store:new Ext.data.GroupingStore({
			url: GO.url("documenttemplates/document/getLinks"),
			reader: new Ext.data.JsonReader({
				root: 'results',
				id: 'model_name_and_id',
				fields: ['model_name_and_id','name', 'checked', 'model_name']
			}),
			groupField:'model_name',
			/*sortInfo: {
				field: 'name',
				direction: 'ASC'
			},*/
			remoteSort:true
		}),
		paging:false,
		plugins:checkCol,
		cm:columnModel,
		view:new Ext.grid.GroupingView({
			hideGroupedColumn:true,
			groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "'+t("items")+'" : "'+t("item")+'"]})',
			emptyText: t("No items to display"),
			showGroupName:false
		}),
		autoExpandColumn:1,
		loadMask:true
	});

	config.items=[this.formPanel, this.templatesGrid, this.ambiguousLinksGrid];
	config.buttons=[{
			text:t("Ok"),
			handler:function(){
				this.createFileFromTemplate();
			},
			scope:this
	}];

	this.templatesGrid.on('render', function() { 
		GO.documenttemplates.ooTemplatesStore.load();
	}, this);

	
	GO.documenttemplates.TemplateDocumentDialog.superclass.constructor.call(this, config);
}

Ext.extend(GO.documenttemplates.TemplateDocumentDialog, GO.Window,{

	entityId:0,
	entity:0,
	
	show : function(){
	
		
		if(this.rendered){
			this.loadAmbiguousLinksGrid();
		}
		
		GO.documenttemplates.TemplateDocumentDialog.superclass.show.call(this);

//		if(!this.templatesGrid.getSelectionModel().getSelected())
//			this.templatesGrid.getSelectionModel().selectFirstRow();
		
		this.formPanel.form.reset();
	},

	templateType : {
		'0' : 'E-mail',
		'1' : t("Document template", "documenttemplates")
	},

	typeRenderer : function(val, meta, record)
	{
		var type = this.templateType[val];

		if(val=='1'){
			type+=' ('+record.get('extension')+')';
		}

		return type;
	},
	
	loadAmbiguousLinksGrid : function(){
		var record = this.templatesGrid.getSelectionModel().getSelected();
		if(!record) {
			return;
		}
		var params = {
			template_id: record.id,
			model_name:this.entity,
			model_id:this.entityId
		};
		
		this.ambiguousLinksGrid.store.load({
			callback:function(){
				this.ambiguousLinksGrid.setDisabled(false);
			},
			scope:this,
			params:params
		});
	},
	createFileFromTemplate : function(){
		
		
						
		var params = {
			template_id: this.templatesGrid.getSelectionModel().getSelected().id,
			model_name:this.entity,
			model_id:this.entityId,
			filename:this.formPanel.form.findField('name').getValue().trim()
		};
		
		if(params.filename==''){
			this.formPanel.form.findField('name').focus();
			return;
		}

		var records = this.ambiguousLinksGrid.store.getRange();
		var links=[];
		for(var i=0,max=records.length;i<max;i++){
			if(!GO.util.empty(records[i].get('checked'))){
				links.push(records[i].get('model_name_and_id'));
			}
		}
		params.selectedLinks=Ext.encode(links);
		
		GO.request({
			params:params,
			url:'documenttemplates/document/create',
			success: function(response, options, result){
				
				GO.files.openFile({id: result.file_id});
				
				this.hide();
				//this.fireEvent('create', this, responseParams.new_path);
				//defer was necessary for chrome. Otherwise it the reloading of the panel gave a connection error.
				this.fireEvent.defer(300,this,['create', this, result.file_id]);
				
			},
			scope:this
		})
	}
});
