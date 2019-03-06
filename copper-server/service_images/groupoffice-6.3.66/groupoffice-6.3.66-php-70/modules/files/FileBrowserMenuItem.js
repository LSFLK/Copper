GO.files.FileBrowserMenuItem = Ext.extend(Ext.menu.Item, {

	iconCls: 'ic-folder',
	text: t("Files"),

	handler: function () {
		
		var dv = this.findParentByType("detailview"), entityId, entity;
		if(!dv) {
		
			//for legacy modules
			dv = this.findParentByType("displaypanel") || this.findParentByType("tmpdetailview");

		}


		GO.request({
			url: 'files/folder/checkModelFolder',
			maskEl: dv.getEl(),
			jsonData: {},
			params: {
				mustExist: true,
				model: dv.model_name || dv.entity || dv.entityStore.entity.name,
				id: dv.data.id
			},
			success: function (response, options, result) {
				var fb = GO.files.openFolder(result.files_folder_id);
				fb.model_name = dv.model_name || dv.entity || dv.entityStore.entity.name;
				fb.model_id = dv.data.id;

				this.folderId = result.files_folder_id;

				//hack to update entity store
				var store = go.Stores.get(fb.model_name);
				if (store) {
					store.data[fb.model_id].filesFolderId = result.files_folder_id;
					store.saveState();
				}

				fb.on('hide', function () {
					fb.model_id = null;
					fb.model = null;

				}, {single: true});

				//reload display panel on close

				GO.files.fileBrowserWin.on('hide', function () {
				
					dv.reload();
				}, this, {single: true});
			},
			scope: this

		});


	}

});


Ext.reg("filebrowsermenuitem", GO.files.FileBrowserMenuItem);