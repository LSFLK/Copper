GO.documenttemplates.EmailTemplateDialog = Ext.extend(GO.Window,{
	
	item:0,
	
	initComponent: function(){
		
		this.checkCol = new GO.grid.RadioColumn({
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
		
		this.columnModel = new Ext.grid.ColumnModel({
			defaults:{
				sortable:true
			},
			columns:[
				this.checkCol,
				{
					header: t("Name"),
					dataIndex: 'name',
					renderer:function(v, meta, record){
						return '<div class="go-grid-icon go-model-icon-'+record.data.model_name+'">'+v+'</div>';
					}
				},{
					header: t("Type"),
					dataIndex: 'model_name',
					renderer: function(v, meta, record) {

						var entity = v.split("\\").pop();

						return t(entity, go.Entities.get(entity).module);
					}
				}
			]
		});
		
		this.searchField = new GO.form.SearchField({
			store: GO.documenttemplates.emailTemplatesStore,
			width:200
		});
		
		this.templatesGrid = new GO.grid.GridPanel({
			region:'center',
			cls: "go-grid3-hide-headers",
			tbar: ["->", t("Search") + ':', this.searchField],
			title:t("Select email template", "documenttemplates"),
			listeners:{
				scope:this,
				delayedrowselect: function(grid, rowIndex, r){
					var selectedArray = this.templatesGrid.getSelectionModel().getSelections();
					
					if(selectedArray.length > 0){
						this.loadAmbiguousLinksGrid();
					}
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
			store:GO.documenttemplates.emailTemplatesStore,
			sm: new Ext.grid.RowSelectionModel({
				singleSelect:true
			}),
			columns:[{
				header: t("Name"),
				dataIndex: 'name',
				sortable:true
			}]
		});
		
		this.ambiguousLinksGrid = new GO.grid.GridPanel({
			
			region:'south',
			cls: "go-grid3-hide-headers",
			height:240,
			split:true,
			title:t("Select relevant resources", "documenttemplates"),
			store:new Ext.data.GroupingStore({
				url: GO.url("documenttemplates/EmailTemplate/getLinks"),
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
			plugins:this.checkCol,
			cm:this.columnModel,
			view:new Ext.grid.GroupingView({
				hideGroupedColumn:true,
				groupTextTpl: '{text} ({[values.rs.length]} {[values.rs.length > 1 ? "'+t("items")+'" : "'+t("item")+'"]})',
				emptyText: t("No items to display"),
				showGroupName:false
			}),
			autoExpandColumn:1,
			loadMask:true
		});
		
		
		Ext.applyIf(this,{
			title:t("Email from template", "documenttemplates"),
			width:600,
			height:600,
			closeAction:'hide',
			layout:'border',
			keys:[{
				key:Ext.EventObject.ENTER, fn:function(key, e){
					if(e.target.id!=this.searchField.id){
						this.createFileFromTemplate();
					}
				},
				scope:this
			}],
			defaults:{
				margins:'0 0 5 0'
			},
			focus:function(){
				this.searchField.focus();
			},
			items:[
				this.templatesGrid, 
				this.ambiguousLinksGrid
			],
			buttons:[{
				text:t("Ok"),
				handler:function(){
					this.composeEmailFromTemplate();
				},
				scope:this
			}]
		});
		
	
		GO.documenttemplates.EmailTemplateDialog.superclass.initComponent.call(this);
	},
	
	show : function(){
		
		
		if(this.rendered){
		
			var selectedArray = this.templatesGrid.getSelectionModel().getSelections();
			if(selectedArray.length > 0){
				this.loadAmbiguousLinksGrid();
			}
		} else {
			this.templatesGrid.store.load();
		}
		
		GO.documenttemplates.EmailTemplateDialog.superclass.show.call(this);

	},

	loadAmbiguousLinksGrid : function(){

		var params = {
			template_id: this.templatesGrid.getSelectionModel().getSelected().id,
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
	
	composeEmailFromTemplate : function(){
	
		var composerParams = {
			loadUrl:GO.url("documenttemplates/emailTemplate/emailcomposer"),
			template_id:this.templatesGrid.getSelectionModel().getSelected().id,
			disableTemplates: true,
		};
	
		var records = this.ambiguousLinksGrid.store.getRange();
		var links=[];
		
		for(var i=0,max=records.length;i<max;i++){
			if(!GO.util.empty(records[i].get('checked'))){
				links.push(records[i].get('model_name_and_id'));
			}
		}

		composerParams.loadParams = {
			selected_links: Ext.encode(links)
		};						

		if (Ext.isDefined(this.item)) {
			composerParams.values={};

			composerParams.link = this.entity + ":" + this.entityId;
			
		}

		var win = GO.email.showComposer(composerParams);
		
		win.setLinkEntity({
			entity: this.entity,
			entityId: this.entityId
		});
		
		this.hide();
	}
	
});
