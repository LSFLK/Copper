GO.files.FolderPanel = Ext.extend(GO.DisplayPanel,{
	model_name : "GO\\Files\\Model\\Folder",



	noFileBrowser:true,
	
	editGoDialogId : 'folder',

	editHandler : function(){	
	},

	createTopToolbar : function(){
		var tbar = GO.files.FolderPanel.superclass.createTopToolbar.call(this);

		tbar.splice(1,1,{
			iconCls: 'btn-settings',
			text: t("Properties"),
			cls: 'x-btn-text-icon',
			handler: function(){
				GO.files.showFolderPropertiesDialog(this.link_id+"");
			},
			scope: this
		});

		return tbar;
	},

	setData : function(data)
	{
//		this.setTitle(data.name);
	
		this.topToolbar.items.items[0].setVisible(false);

		GO.files.FolderPanel.superclass.setData.call(this, data);
	},

	initComponent : function(){	
		
		this.loadUrl=('files/folder/display');
		
		this.template =

				'<table class="display-panel" cellpadding="0" cellspacing="0" border="0">'+
					'<tr>'+
						'<td colspan="2" class="display-panel-heading">'+t("Folder", "files")+': {path}</td>'+
					'</tr>'+
//					'<tr>'+
//						'<td>'+t("Type")+':</td>'+
//						'<td>{type}</td>'+
//					'</tr>'+					
					
					'<tr>'+
						'<td>'+t("Created at")+':</td>'+'<td>{ctime}</td>'+
					'</tr><tr>'+
						'<td>'+t("Created by")+':</td>'+'<td>{username}</td>'+
					'</tr><tr>'+
						'<td>'+t("Modified at")+':</td>'+'<td>{mtime}</td>'+
					'</tr><tr>'+
						'<td>'+t("Modified by")+':</td>'+'<td>'+
							'<tpl if="muser_id">{musername}</tpl>'+
							'</td>'+
					'</tr>'+
					
					'<tr>'+
						'<td>URL:</td>'+
						'<td><a target="_blank" href="{url}">'+t("Right click to copy", "files")+'</a></td>'+
					'</tr>'+

					'<tpl if="!GO.util.empty(comment)">'+
						'<tr>'+
							'<td colspan="2" class="display-panel-heading">'+t("Comments", "files")+'</td>'+
						'</tr>'+
						'<tr>'+
							'<td colspan="2">{comment}</td>'+
						'</tr>'+
					'</tpl>'+
				'</table>';

		this.template +=GO.customfields.displayPanelTemplate;
					
		if(go.Modules.isAvailable("legacy", "workflow"))
			this.template +=GO.workflow.WorkflowTemplate;
		
		
		GO.files.FolderPanel.superclass.initComponent.call(this);
	}
});
