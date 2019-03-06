GO.projects2.TreeContextMenu = Ext.extend(Ext.menu.Menu,{
	
	treePanel: false,
	
	initComponent : function(){
		
		this.treePanel = this.initialConfig.treePanel;
		
		this.addProjectBtn = new Ext.menu.Item({
			iconCls: 'ic-add',
			text:t("Add project", "projects2"),
			handler:function(){
				if(GO.projects2.max_projects>0 && this.treePanel.store.totalLength>=GO.projects2.max_projects)
				{
					Ext.Msg.alert(t("Error"), t("The maximum number of projects has been reached. Contact your hosting provider to activate unlimited usage of the projects module.", "projects2"));
				}else
				{
					GO.projects2.showProjectDialog({
						parent_project_id: this.treePanel.selectedNode.id/*,
						values:{
							type_id:this.parentProject ? this.parentProject.type_id : null
						}*/
					});
				}
			},
			scope:this
		});
		
		this.duplicateProjectBtn = new Ext.menu.Item({
			iconCls: 'ic-content-copy',
			text:t("Duplicate", "projects2"),
			handler:function(){
				if(GO.projects2.max_projects>0 && this.treePanel.store.totalLength>=GO.projects2.max_projects)
				{
					Ext.Msg.alert(t("Error"), t("The maximum number of projects has been reached. Contact your hosting provider to activate unlimited usage of the projects module.", "projects2"));
				}else
				{
					if(!this.duplicateProjectDialog) {
						this.duplicateProjectDialo = new GO.projects2.DuplicateProjectDialog({})
						
					}
					
					this.duplicateProjectDialo.show({
						project_id: this.treePanel.selectedNode.id,
						duplicate_id: this.treePanel.selectedNode.id
					});
					
//					GO.projects2.showProjectDialog({
//						project_id: this.treePanel.selectedNode.id,
//						duplicate_id: this.treePanel.selectedNode.id/*,
//						values:{
//							type_id:this.parentProject ? this.parentProject.type_id : null
//						}*/
//					});
				}
			},
			scope:this
		});
		
		this.editProjectBtn = new Ext.menu.Item({
			iconCls: 'ic-edit',
			text: t("Edit"),
			handler: function(){
				if(this.treePanel.selectedNode.id !== 'root')
				GO.projects2.showProjectDialog({
					project_id: this.treePanel.selectedNode.id
				});
			},
			scope: this
		});
		
		this.deleteProjectBtn = new Ext.menu.Item({
			iconCls: 'ic-delete',
			text:t("Delete"),
			handler:function(){
				if(confirm(t("Are you sure you want to delete '{item}'?").replace('{item}',this.treePanel.selectedNode.text))){
					GO.request({
						url:'projects2/project/delete',
						params:{id:this.treePanel.selectedNode.id},
						scope:this,
						success:function(){
							
							var parent =  this.treePanel.selectedNode.parentNode;
							this.treePanel.selectedNode.destroy();
							this.treePanel.selectedNode = parent;
							this.treePanel.selectedNode.select();


							this.treePanel.fireEvent('click', this.treePanel.selectedNode);
						}
					});
				}
			},
			scope:this
		});
		
		this.items=[
			this.addProjectBtn,
			this.editProjectBtn,
			this.duplicateProjectBtn,
			this.deleteProjectBtn
		];

		GO.projects2.TreeContextMenu.superclass.initComponent.call(this);
	},
	
	/**
	 * Enable and disable the correct items in the context menu based on the user's permissions
	 * 
	 * @param int x
	 * @param int y
	 * @returns {undefined}
	 */
	showAt : function(x,y){

		if(this.treePanel.selectedNode.id == 'root'){
			
			if(!GO.settings.modules.projects2.write_permission){
				this.addProjectBtn.setDisabled(true);
			} else {
				this.addProjectBtn.setDisabled(false);
			}
			
			this.editProjectBtn.setDisabled(true);
			this.duplicateProjectBtn.setDisabled(true);
			this.deleteProjectBtn.setDisabled(true);
		} else {
			
			if(this.treePanel.selectedNode.attributes.disabled || (this.treePanel.selectedNode.id && !this.treePanel.selectedNode.attributes.write_permission)){
				this.addProjectBtn.setDisabled(true);
				this.editProjectBtn.setDisabled(true);
				this.deleteProjectBtn.setDisabled(true);
			} else {
				this.addProjectBtn.setDisabled(false);
				this.editProjectBtn.setDisabled(false);
				this.deleteProjectBtn.setDisabled(false);
			}		
		}
		
		// Check if the parent node has write permission, if it hasn't, then disable the duplicate menu item
		if(this.treePanel.selectedNode.parentNode && this.treePanel.selectedNode.parentNode.id == 'root' && GO.settings.modules.projects2.write_permission){
			this.duplicateProjectBtn.setDisabled(false);
		} else if(this.treePanel.selectedNode.parentNode && this.treePanel.selectedNode.parentNode.attributes.write_permission){
			this.duplicateProjectBtn.setDisabled(false);
		} else {
			this.duplicateProjectBtn.setDisabled(true);
		}	
		
		GO.projects2.TreeContextMenu.superclass.showAt.call(this,x,y);
	}
}
);
