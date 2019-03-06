GO.documenttemplates.NewOODocumentMenuItem = Ext.extend(Ext.menu.Item,{

	
	fb: null,
	
	initComponent : function(){

		GO.documenttemplates.ooTemplatesStore.on('load', function(){
			this.setDisabled(GO.documenttemplates.ooTemplatesStore.getCount() == 0);
		}, this);

		this.iconCls= 'go-icon filetype-odt';
		this.text= t("Document from template", "documenttemplates");
		this.cls='x-btn-text-icon';
		this.disabled= GO.documenttemplates.ooTemplatesStore.getCount() == 0;
		this.handler= function()
		{
			if(!GO.documenttemplates.templateDocumentDialog){
				GO.documenttemplates.templateDocumentDialog = new GO.documenttemplates.TemplateDocumentDialog();
			}

			GO.documenttemplates.templateDocumentDialog.on('create', function(){
				this.fireEvent('create', this);
			}, this)

			GO.documenttemplates.templateDocumentDialog.show(this.fb.model_id, this.fb.model_name);
		};
		
		this.addEvents({create:true});
		
		GO.documenttemplates.NewOODocumentMenuItem.superclass.initComponent.call(this);
		
		this.on('render',function(){
			if(GO.documenttemplates && !GO.documenttemplates.ooTemplatesStore.loaded)
				GO.documenttemplates.ooTemplatesStore.load();
		}, this);
	}	
});
