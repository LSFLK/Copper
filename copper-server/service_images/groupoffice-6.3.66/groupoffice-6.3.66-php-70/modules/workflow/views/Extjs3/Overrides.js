/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: Overrides.js 15897 2013-05-21 09:02:45Z mschering $
 * @copyright Copyright Intermesh
 * @author Wesley Smits <wsmits@intermesh.nl>
 */

GO.moduleManager.onModuleReady('files',function(){
	Ext.override(GO.files.FolderPropertiesDialog, {	
		initComponent : GO.files.FolderPropertiesDialog.prototype.initComponent.createSequence(function(){
			this.folderPanel = new GO.workflow.FolderPanel();
			this.tabPanel.insert(2,this.folderPanel);
		})
		,
		setFolderId : GO.files.FolderPropertiesDialog.prototype.setFolderId.createSequence(function(id){
			this.folderPanel.setFolderId(id);
		})
	})
});
