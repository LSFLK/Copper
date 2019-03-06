/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: ResultsGrid.js 22900 2018-01-12 08:00:42Z mschering $
 * @copyright Copyright Intermesh
 * @author Merijn Schering <mschering@intermesh.nl>
 */

GO.filesearch.ResultsGrid = function(config){

	config = config || {};


	var fields ={
		fields:['id','name','type', 'size','folder_id','path', 'mtime','ctime', 'extension','preview_text','advanced_search', 'subject','to','content_expire_date'],
		columns:[{
			id:'name',
			header:t("Name"),
			dataIndex: 'name',
			renderer:function(v, meta, r){
				var cls = r.get('acl_id')>0 ? 'folder-shared' : 'filetype filetype-'+r.get('extension');
				return '<div class="go-grid-icon '+cls+'">'+v+'</div>';
			}
		},{
			header:t("Type"),
			dataIndex: 'type',
			sortable:false,
			hidden:true,
			width:150
		},{
			header:t("Modified at"),
			dataIndex: 'mtime',
			width: dp(140)
		},{
			header:t("Created at"),
			dataIndex: 'ctime',
			width: dp(140),
			hidden:true
		},{
			header:t("Subject", "filesearch"),
			dataIndex: 'subject',
			width:100,
			hidden:true
		},{
			header:t("To", "filesearch"),
			dataIndex: 'to',
			width:100,
			hidden:true
		}]
	};

	if(go.Modules.isAvailable("core", "customfields"))
	{
		GO.customfields.addColumns("GO\\Files\\Model\\File", fields);
	}

	Ext.apply(config, {
		id:'fs-searchresults-grid',
		exportTitle : t("Search"),
		cls:'fs-searchresults-grid',
		title:t("Search results", "filesearch"),
		split:true,
		paging:25,
		store: new GO.data.JsonStore({
			url: GO.url("filesearch/filesearch/store"),
			baseParams: {
				folder_id : 0
			},
			fields:fields.fields,
			remoteSort:true
		}),
		cm:new Ext.grid.ColumnModel({
			defaults:{
				sortable:true
			},
			columns:fields.columns
		}),
		autoExpandColumn:'name',
		view:new Ext.grid.GridView({
			emptyText:t("No items to display"),
			enableRowBody:true,
			getRowClass : function(record, rowIndex, p, store){
				p.body = '<div class="go-links-panel-description">'+record.data.preview_text+'</div>';
				
				var clsString = 'x-grid3-row-expanded';
				if(GO.files.isContentExpired(record.data.content_expire_date)){
					clsString += ' content-expired';
				}	
				return clsString;
			}
		}),
		deleteConfig:{
			extraWarning: t("The file will only be removed from the docbundle and not actually deleted.", "filesearch")+" "
		},
		sm: new Ext.grid.RowSelectionModel(),
		loadMask: true		
	});

	config.tbar = [{
			itemId:'save-docbundle',
			iconCls:'btn-save',
			text:t("Save as new bundle", "filesearch"),
			scope:this,
			handler:function(){

				var keywords='';
				var p = this.store.baseParams;

				if(!GO.util.empty(p.filename)){
					keywords += p.filename+', ';
				}
				if(!GO.util.empty(p.content_all)){
					keywords += p.content_all.replace(/ /g,', ')+', ';
				}
				if(p.content_exact!=''){
					keywords += p.content_exact+', ';
				}
				if(!GO.util.empty(p.content_or1))
					keywords += p.content_or1+', ';
				if(!GO.util.empty(p.content_or2))
					keywords += p.content_or2+', ';
				if(!GO.util.empty(p.content_or3))
					keywords += p.content_or3+', ';

				keywords = keywords.substring(0, keywords.length-2);

				GO.filesearch.showDocbundleDialog(0, {
					files:this.getSelectionModel().selections.keys,
					values:{keywords:keywords}
				});
			}
		},{
			itemId:'add-to-docbundle',
			iconCls:'btn-add',
			text:t("Add to bundle", "filesearch"),
			scope:this,
			handler:function(){
				if(!this.selectDocbundleDialog)
					this.selectDocbundleDialog = new GO.filesearch.SelectDocbundleDialog();

				this.selectDocbundleDialog.show({
					files:this.getSelectionModel().selections.keys
				});
			}
		},{
			itemId:'delete-docbundle',
			iconCls:'btn-delete',
			text:t("Remove from bundle", "filesearch"),
			scope:this,
			hidden:true,
			handler:function(){
				this.deleteSelected();
			}
		},
		'-',
		{
			iconCls: 'btn-export',
			text: t("Export"),
			cls: 'x-btn-text-icon',
			handler:function(){
				
				if(!this.exportDialog)
				{
					this.exportDialog = new GO.ExportGridDialog({
						url: 'filesearch/filesearch/export',
						name: 'filesearch',
						exportClassPath:'modules/filesearch/export',
						documentTitle:this.exportTitle,
						colModel: this.getColumnModel()
					});
				}
				this.exportDialog.documentTitle=this.exportTitle;
				this.exportDialog.params={filesearchParams:this.store.baseParams};
				
				this.exportDialog.show();

			},
			scope: this
		}
		];

	

//	if(go.Modules.isAvailable("core", "customfields")) {
//		config.tbar.push(
//			'-'
//		);
//		config.tbar.push({
//			iconCls: 'btn-edit',
//			text: t("Edit selection", "customfields"),
//			cls: 'x-btn-text-icon',
//			handler:function(){
//				if (this.selModel.getSelections().length > 0 ) {
//					if (!GO.customfields.bulkEditDialog)
//						GO.customfields.bulkEditDialog = new GO.customfields.BulkEditDialog();
//					GO.customfields.bulkEditDialog.show(this.selModel.getSelections());
//				} else {
//					Ext.MessageBox.alert(t("Error"), t("No files have been selected. First select a number of files.", "customfields"));
//				}
//			},
//			scope: this
//		});
//	}

	GO.filesearch.ResultsGrid.superclass.constructor.call(this, config);

//	if(go.Modules.isAvailable("core", "customfields")) {
//		this.on('rowcontextmenu', function(grid,rowIndex,e) {
//			this.onRowContextMenu(grid,rowIndex,e);
//		},this);
//	}
	
	this.on('rowcontextmenu', function(grid,rowIndex,e) {		
			this.onRowContextMenu(grid,rowIndex,e);
		},this);
	
	//make sure files panel is constructed to attach context menu events
	//	GO.moduleManager.getPanel('files');
	

//	this.getFilesContextMenu().addMenuItem({
//		iconCls: 'btn-edit',
//		text: t("Edit selection", "filesearch"),
//		cls: 'x-btn-text-icon',
//		handler:function(){
//			console.log('getFilesContextMenu ## editSelection')
//			var ids = [];
//			if(this.selModel.getSelections().length > 0 ) {
//				var selected = this.selModel.getSelections();
//				for (var i = 0; i < selected.length; i++) {
//					if (!GO.util.empty(selected[i].data.id))
//						ids.push(selected[i].data.id);
//				}
//				console.log('getFilesContextMenu ## editSelection')
//				console.log(ids)
//				GO.base.model.showBatchEditModelDialog('GO\\Files\\Model\\File', ids, 'id',{},'id,status_id,folder_id,size,muser_id,locked_user_id,delete_when_expired,name,user_id,extension,expire_time,random_code',t("Edit selection", "filesearch")).on('submit', function () {
//					this.grid.getStore().reload();
//				}, this);
//			} else {
//				Ext.MessageBox.alert(t("Error"), t("No files have been selected. First select a number of files.", "customfields"));
//			}
//
//		},
//		scope: this
//	});

}

Ext.extend(GO.filesearch.ResultsGrid, GO.grid.GridPanel, {
	
	getFilesContextMenu : function(){
		
		if(!this.filesContextMenu){
			this.filesContextMenu = new GO.files.FilesContextMenu();
			
			this.filesContextMenu.on('properties', function(menu, records){
				GO.files.showFilePropertiesDialog(records[0].id);
			}, this);

			this.filesContextMenu.on('delete', function(menu, records, clickedAt){
						
				if(this.selModel.getSelections().length > 0 ) {
					var selected = this.selModel.getSelections();

					GO.deleteItems({
						url:GO.url('files/file/delete'),
						params:{
							id: selected[0].data.id
						},
						count:1,
						callback:function(responseParams){
							if(responseParams.success){
								this.store.reload();
							}
						},
						scope:this
					});
				}
			}, this);

			this.filesContextMenu.on('download_link', function(menu, records, clickedAt, email){
				GO.files.createDownloadLink(records,email);
			}, this);

			this.filesContextMenu.on('email_files', function(menu, records){
				var files = new Array();
				Ext.each(records, function(record) {
					var folderId = record.data.folder_id;
					var id = record.data.id;

					if (!Ext.isEmpty(folderId)) {
						files.push(record.data.path);
					} else {
						GO.email.openFolderTree(id);
					}
				});
				GO.email.emailFiles(files);
			}, this);

			this.filesContextMenu.on('addBookmark', function(menu, folderId){
				this.bookmarksGrid.store.load();
			}, this);	
			
			this.filesContextMenu.on('batchEdit', function(menu, records, clickedAt){
				var ids = [];
				Ext.each(records, function (selected) {
					
					if(selected.get('locked')) {
						// error
						Ext.MessageBox.alert(t("Error"), t("File is locked", "files") + " :: " + selected.get('name'));
						return false;
					} else if(selected.get('type') == 'Folder') {
						// error
						Ext.MessageBox.alert(t("Error"), t("You can't edit this folder", "files") + " :: " + selected.get('name'));
						return false;
					} else {
						ids.push(selected.get('id'));
					}
				});

				if(ids.length > 0) {


					GO.base.model.showBatchEditModelDialog('GO\\Files\\Model\\File', ids, 'id',{}, 'id,folder_id,type_id,type,size,unlock_allowed,timestamp,thumb_url,readonly,permission_level,path,mtime,locked_user_id,locked,handler,extension,acl_id,name,status_id,muser_id,user_id,expire_time,random_code,delete_when_expired' ,t("Edit selection", "files"));
				}

			}, this);
			
		}
		return this.filesContextMenu;
	},
	
	onRowContextMenu: function(grid, rowIndex, e) {
		var selections = grid.getSelectionModel().getSelections();
		
		var coords = e.getXY();
		this.getFilesContextMenu().showAt(coords, selections, 'grid', true);
	},

	setDocumentBundle : function(docbundleRecord){

		var tbItems = this.getTopToolbar().items;

		if(docbundleRecord){
			this.store.baseParams.docbundle_id=docbundleRecord.id;
			this.store.baseParams.keywords=docbundleRecord.get('keywords');
			tbItems.get('save-docbundle').hide();
			//tbItems.get('add-to-docbundle').hide();
			tbItems.get('delete-docbundle').show();
		}else
		{
			delete this.store.baseParams.docbundle_id;
			delete this.store.baseParams.keywords;
			tbItems.get('save-docbundle').show();
			//tbItems.get('add-to-docbundle').show();
			tbItems.get('delete-docbundle').hide();
		}
	}
});
