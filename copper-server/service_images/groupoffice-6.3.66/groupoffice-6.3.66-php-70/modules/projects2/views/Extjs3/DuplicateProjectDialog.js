//duplicateProjectDialog


//GO.projects2.ProjectDialog 

GO.projects2.DuplicateProjectDialog = Ext.extend(GO.projects2.ProjectDialog, {
		
		initComponent : function(){
			
			this.id = Ext.id();
			
			GO.request({
				url: 'core/multiRequest',
				maskEl:this.getEl(),
				params:{
					requests:Ext.encode({
						//templates:{r:'projects2/template/store'},
						types:{
							r:'projects2/type/store'
						},
						statuses:{
							r:'projects2/status/store',
							forEditing:true
						}
					})
				},
				success: function(options, response, result) 	{
					//GO.projects2.templatesStore.loadData(result.templates);
					GO.projects2.typesStore.loadData(result.types);
					GO.projects2.statusesStore.loadData(result.statuses);

					
                    
					if(GO.util.empty(this.selectType.getValue()))
						this.selectType.selectFirst();

				},
				scope:this
			});
			
			GO.projects2.DuplicateProjectDialog.superclass.initComponent.call(this);	
			
			
		},
		
	
		show : function (config) {
			config = config || {};
			
			this.duplicate_id = config.project_id;
			
			if(!this.rendered)
				this.render(Ext.getBody());
			
			this.formPanel.form.reset();
			
//			this.parent_project_id=this.formPanel.baseParams.parent_project_id=config.parent_project_id;
		
		
		this.formPanel.form.reset();
		this.selectType.setDisabled(!GO.settings.modules.projects2.write_permission);
		this.templateSelect.setDisabled(!GO.settings.modules.projects2.write_permission);
		
		this.formPanel.baseParams.company_id=0;		
		this.formPanel.baseParams.contact_id=0;		
		
		this.parent_project_id=this.formPanel.baseParams.parent_project_id=config.parent_project_id;
			
			
			this.propertiesPanel.show();	
			
		this.setProjectId(config.project_id);
			
			
			
			
//			config.project_id
			this.load(config);
		},
		
		
		load: function(config){
			
			this.formPanel.load({
					url : GO.url('projects2/project/loadDuplicate'),
					params:config,
					success:function(form, action) {
						
							if(this.permissionsPanel)
											this.permissionsPanel.setAcl(action.result.data[this.permissionsPanel.fieldName]);
							this.setWritePermission(action.result.data.write_permission);

							this.formPanel.baseParams.company_id=action.result.data.company_id;
							this.formPanel.baseParams.contact_id=action.result.data.contact_id;
							this.parent_project_id=this.formPanel.baseParams.parent_project_id=action.result.data.parent_project_id;

							this.selectType.setDisabled(action.result.data.permission_level<GO.permissionLevels.writeAndDelete );
							this.templateSelect.setDisabled(action.result.data.permission_level<GO.permissionLevels.writeAndDelete );

							this.applyTemplate(action.result.data.template);
							this.setTitle(this.title + ": " + action.result.data.name);

							//applytemplate might have rendered new form fields
							var v = Ext.apply(action.result.data, config.values);
							this.setValues(v);

							this.selectUser.setRemoteText(action.result.remoteComboTexts.responsible_user_id);
							this.selectType.setRemoteText(action.result.remoteComboTexts.type_id);

							//Remove the disabled customer field tabs
							if(go.Modules.isAvailable("core", "customfields"))
											GO.customfields.disableTabs(this.tabPanel, action.result);
										
							this.setProjectId(0);

							GO.projects2.ProjectDialog.superclass.show.call(this);
					},
					failure:function(form, action)
					{
							GO.errorDialog.show(action.result.feedback)
					},
					scope: this

			});
		},
		
		
		submitForm : function(hide){

		var params={};
		if(this.expensesPanel.store.loaded){
			params['expenses']=Ext.encode(this.expensesPanel.getGridData());
		}
		
		if(!GO.settings.modules.projects2.write_permission)
			params.type_id=this.selectType.getValue();

			if(this.duplicate_id && !params.id) {
				params.id = this.duplicate_id;
			}

		var submitUrl = (!this.duplicate_id) ? 
			GO.url('projects2/project/submit') : 
			GO.url('projects2/project/duplicate');
		this.formPanel.form.submit(
		{
			url:submitUrl,
			params: params,
			waitMsg:t("Saving..."),
			success:function(form, action){
				
				this.duplicate_id = false;
				this.project_id = action.result.id

				if(action.result.parent_project_id)
				{
					this.parent_project_id = action.result.parent_project_id;
				}
				//console.log(action.result[this.permissionsPanel.fieldName]);
				if (this.permissionsPanel && action.result[this.permissionsPanel.fieldName]) {
					this.permissionsPanel.setAcl(action.result[this.permissionsPanel.fieldName]);
				}
				if(action.result.id)
				{	
					this.nameField.setValue(this.nameField.getValue().replace('{autoid}',action.result.id));

					this.setProjectId(action.result.id, true);
				}

				if(action.result.type_id){					
					this.selectType.store.reload({
						callback:function(){
							this.selectType.setValue(action.result.type_id);
						},
						scope:this
					});
				}

				if (this.link_config && this.link_config.callback) {
					this.link_config.callback.call(this);
				}

				if(this.feesPanel)
					this.feesPanel.store.commitChanges();
				
				this.fireEvent('save', this, this.project_id, this.parent_project_id);	
				
				GO.dialog.TabbedFormDialog.prototype.refreshActiveDisplayPanels.call(this);
				
				if(hide)
				{
					this.hide();	
				}
			},		
			failure: function(form, action) {
				if(action.failureType == 'client')
				{					
					Ext.MessageBox.alert(t("Error"), t("You have errors in your form. The invalid fields are marked."));			
				} else {
					Ext.MessageBox.alert(t("Error"), action.result.feedback);
				}
			},
			scope: this
		});		
	},
	
	
})
