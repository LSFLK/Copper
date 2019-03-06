/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: ContextMenu.js 22112 2018-01-12 07:59:41Z mschering $
 * @copyright Copyright Intermesh
 * @author Merijn Schering <mschering@intermesh.nl>
 */

GO.files.FilesContextMenu = function(config)
{
	if(!config)
	{
		config = {};
	}
	config['shadow']='frame';
	config['minWidth']=180;
	
	this.openButton = new Ext.menu.Item({
		text: t("Open", "files"),
		iconCls: 'btn-edit',
		cls: 'x-btn-text-icon',
		handler: function(){
//			GO.files.openFile({
//				id:this.records[0].data.id
//			});

			this.records[0].data.handler.call(this);
		},
		scope: this
	});

	this.downloadButton = new Ext.menu.Item({
		iconCls: 'btn-save',
		text: t("Download"),
		cls: 'x-btn-text-icon',
		handler: function(){
			window.open(GO.url("files/file/download",{id:this.records[0].data.id,inline:false}));
		},
		scope: this
	});
	
	this.openWithButton = new Ext.menu.Item({
		text: t("Open with", "files"),
		iconCls: 'btn-edit',
		cls: 'x-btn-text-icon',
		handler: function(){
			GO.files.openFile({
				id:this.records[0].data.id,
				all:'1'
			});
		},
		scope: this
	});



	/*this.pasteButton = new Ext.menu.Item({
					iconCls: 'btn-paste',
					text: 'Paste',
					cls: 'x-btn-text-icon',
					handler: function(){
						this.fireEvent('paste', this);
					},
					scope: this
				});*/

	this.deleteButton = new Ext.menu.Item({
		iconCls: 'btn-delete',
		text: t("Delete"),
		cls: 'x-btn-text-icon',
		handler: function(){
			this.fireEvent('delete', this, this.records, this.clickedAt);
		},
		scope: this
	});
	
	this.batchEditButton = new Ext.menu.Item({
		iconCls: 'btn-edit',
		text: t("Edit selection", "files"),
		cls: 'x-btn-text-icon',
		handler: function(){
			this.fireEvent('batchEdit', this, this.records, this.clickedAt);
		},
		scope: this
	});

	this.cutButton= new Ext.menu.Item({
		iconCls: 'btn-cut',
		text: t("Cut"),
		cls: 'x-btn-text-icon',
		handler: function(){
			this.fireEvent('cut', this, this.records, this.clickedAt);
		},
		scope: this
	});
	this.copyButton = new Ext.menu.Item({
		iconCls: 'btn-copy',
		text: t("Copy"),
		cls: 'x-btn-text-icon',
		handler: function(){
			this.fireEvent('copy', this, this.records, this.clickedAt);
		},
		scope: this
	});


	this.lockButton = new Ext.menu.Item({
		iconCls: 'btn-lock',
		text: t("Lock", "files"),
		cls: 'x-btn-text-icon',
		scope:this,
		handler: function(){
			GO.request({
				url:'files/file/submit',
				params:{
					id:this.records[0].data.id,
					locked_user_id:GO.settings.user_id
				},
				success:function(action, response, result){

					var filesModulePanel = GO.mainLayout.getModulePanel('files');
					if(filesModulePanel && filesModulePanel.folder_id==this.records[0].data.folder_id) {
						filesModulePanel.getActiveGridStore().load();
						filesModulePanel.folderPanel.setVisible(false);
						filesModulePanel.filePanel.setVisible(true);
						filesModulePanel.filePanel.load(this.records[0].json.id,true);
					}

					if (!GO.util.empty(GO.files.fileBrowser))
						GO.files.fileBrowser.gridStore.load();
					if (!GO.util.empty(GO.selectFileBrowser))
						GO.selectFileBrowser.gridStore.load();
				},
				scope:this
			})
		}
	})

	this.unlockButton = new Ext.menu.Item({
		iconCls: 'btn-unlock',
		text: t("Unlock", "files"),
		cls: 'x-btn-text-icon',
		scope:this,
		handler: function(){
			GO.request({
				url:'files/file/submit',
				params:{
					id:this.records[0].data.id,
					locked_user_id:0
				},
				success:function(action, response, result){
					var filesModulePanel = GO.mainLayout.getModulePanel('files');
					if(filesModulePanel && filesModulePanel.folder_id==this.records[0].data.folder_id) {
						filesModulePanel.getActiveGridStore().load();
						filesModulePanel.folderPanel.setVisible(false);
						filesModulePanel.filePanel.setVisible(true);
						filesModulePanel.filePanel.load(this.records[0].json.id,true);
					}
					if (!GO.util.empty(GO.files.fileBrowser))
						GO.files.fileBrowser.gridStore.load();
					if (!GO.util.empty(GO.selectFileBrowser))
						GO.selectFileBrowser.gridStore.load();
				},
				scope:this
			})
		}
	})

	this.bookmarkButton = new Ext.menu.Item({
		iconCls: 'btn-copy',
		text: t("Add to favorites", "files"),
		cls: 'x-btn-text-icon',
		scope:this,
		handler: function(){
			GO.request({
				url:'files/bookmark/submit',
				params:{
					folder_id: this.records[0].data.id
				},
				success:function(action, response, result){
					this.fireEvent('addBookmark',this,this.records[0].data.id);
				},
				scope:this
			})
		}
	})


	this.compressButton = new Ext.menu.Item({
		iconCls: 'btn-compress',
		text: t("Compress"),
		cls: 'x-btn-text-icon',
		handler: function(){
			this.fireEvent('compress', this, this.records, this.clickedAt);
		},
		scope: this
	});
	this.decompressButton = new Ext.menu.Item({
		iconCls: 'btn-decompress',
		text: t("Decompress"),
		cls: 'x-btn-text-icon',
		handler: function(){
			this.fireEvent('decompress', this, this.records, this.clickedAt);
		},
		scope: this
	});

	config['items']=[this.openButton, this.openWithButton, this.downloadButton,'-'];

	config['items'].push(this.lockButton);
	config['items'].push(this.unlockButton);


	config['items'].push({
		iconCls: 'btn-properties',
		text: t("Properties"),
		handler: function(){
			this.fireEvent('properties', this, this.records);
		},
		scope:this
	});

	config['items'].push(this.bookmarkButton);

	config['items'].push(this.cutSeparator = new Ext.menu.Separator());
	config['items'].push(this.cutButton);
	config['items'].push(this.copyButton);
	//this.pasteButton,
	config['items'].push(this.deleteSeparator = new Ext.menu.Separator());
	config['items'].push(this.deleteButton);
	config['items'].push(this.batchEditButton);
	config['items'].push(this.compressSeparator = new Ext.menu.Separator());
	config['items'].push(this.compressButton);
	config['items'].push(this.decompressButton);

	this.createDownloadLinkButton = new Ext.menu.Item({
		iconCls: 'btn-save',
		text: t("Create download link", "files"),
		cls: 'x-btn-text-icon',
		handler: function(){
			this.fireEvent('download_link', this, this.records, this.clickedAt, false);
		},
		scope: this
	});
	config['items'].push(this.createDownloadLinkButton);

	if(go.Modules.isAvailable("legacy", "email")) {
		this.downloadLinkButton = new Ext.menu.Item({
			iconCls: 'btn-email',
			text: t("Email download link", "files"),
			cls: 'x-btn-text-icon',
			handler: function(){
				this.fireEvent('download_link', this, this.records, this.clickedAt, true);
			},
			scope: this
		});
		config['items'].push(this.downloadLinkButton);

		this.emailFilesButton = new Ext.menu.Item({
			iconCls: 'em-btn-email-files',
			text: t("Email files", "email"),
			cls: 'x-btn-text-icon',
			handler: function(){
				this.fireEvent('email_files', this, this.records);
			},
			scope: this
		});
		config['items'].push(this.emailFilesButton);
	}
	
	// Download selected (As Zip)
	this.downloadSelectedFilesButton = new Ext.menu.Item({
			iconCls: 'filetype-zip',
			text: t("Download selected", "files"),
			cls: 'x-btn-text-icon',
			handler: function(){
				this.fireEvent('download_selected', this, this.records, this.clickedAt);
			},
			scope: this
		});
		config['items'].push(this.downloadSelectedFilesButton);
	

	GO.files.FilesContextMenu.superclass.constructor.call(this, config);

	this.addEvents({

		'properties' : true,
		'paste' : true,
		'cut' : true,
		'copy' : true,
		'delete' : true,
		'compress' : true,
		'decompress' : true,
		'download_link' : true,
		'email_files' : true,
		'addBookmark' : true,
		'download_selected': true

	});

}

Ext.extend(GO.files.FilesContextMenu, Ext.menu.Menu,{
	/*tree or grid */

	clickedAt : 'grid',

	records : [],

	showAt : function(xy, records, clickedAt, forFileSearchModule)
	{
		this.records = records;
		forFileSearchModule = forFileSearchModule || false;
		
		if(forFileSearchModule){	
			this.decompressButton.setVisible(!forFileSearchModule);
			this.openButton.setVisible(!forFileSearchModule);
			this.cutSeparator.setVisible(!forFileSearchModule);
			this.cutButton.setVisible(!forFileSearchModule);
			this.copyButton.setVisible(!forFileSearchModule);
			this.lockButton.setVisible(!forFileSearchModule);
			this.unlockButton.setVisible(!forFileSearchModule);
			this.downloadSelectedFilesButton.setVisible(!forFileSearchModule);
			this.compressButton.setVisible(!forFileSearchModule);
			
		} else {
		
			if(clickedAt)
				this.clickedAt = clickedAt;

			var extension = '';
			
			if(records.length=='1')
			{
				extension = records[0].data.extension;

				switch(extension)
				{
					case 'zip':
					case 'tar':
					case 'tgz':
					case 'gz':
						this.downloadButton.show();
						this.openButton.show();
						this.openWithButton.show(); 

						this.decompressButton.show();
						this.compressButton.hide();
						if(this.downloadLinkButton)
							this.downloadLinkButton.show();
						this.createDownloadLinkButton.show();

						if(this.emailFilesButton)
							this.emailFilesButton.show();

						this.bookmarkButton.hide();

						break;

	//				case '':
	//					
	//					this.downloadButton.show();
	//
	//					this.decompressButton.show();
	//					this.compressButton.hide();
	//					if(this.downloadLinkButton)
	//						this.downloadLinkButton.show();
	//					this.createDownloadLinkButton.show();
	//
	//					if(this.emailFilesButton)
	//						this.emailFilesButton.show();
	//
	//					
	//					this.bookmarkButton.hide();
	//					
	//					break;
					case 'folder':

						this.lockButton.hide();
						this.unlockButton.setVisible(false);
						this.downloadButton.hide();
						this.openWithButton.hide();
						this.openButton.hide();

						this.decompressButton.hide();
						clickedAt == 'tree' || records[0].store.reader.jsonData['permission_level']<GO.permissionLevels['create'] ? this.compressButton.hide() : this.compressButton.show();

						if(this.downloadLinkButton)
							this.downloadLinkButton.hide();
						
						this.batchEditButton.hide();

						this.createDownloadLinkButton.hide();

						if(this.emailFilesButton)
							this.emailFilesButton.hide();

						this.bookmarkButton.show();

						break;

					default:
						this.lockButton.show();


						this.lockButton.setDisabled(this.records[0].data.locked_user_id>0);
						this.unlockButton.setVisible(this.records[0].data.locked_user_id>0);
						this.unlockButton.setDisabled(!this.records[0].data.unlock_allowed);


						this.downloadButton.show();
						this.openWithButton.show();
						this.openButton.show();

						clickedAt == 'tree' ? this.compressButton.hide() : this.compressButton.show();
						this.decompressButton.hide();

						if(this.downloadLinkButton)
							this.downloadLinkButton.show();
						
						this.batchEditButton.show();
						
						this.createDownloadLinkButton.show();

						if(this.emailFilesButton)
							this.emailFilesButton.show();

						this.bookmarkButton.hide();

						break;
				}
			}else
			{

				clickedAt == 'tree' ? this.compressButton.hide() : this.compressButton.show();
				this.decompressButton.hide();
				this.downloadButton.hide();
				this.openWithButton.hide();
				this.openButton.hide();

				this.createDownloadLinkButton.hide();

				if(this.emailFilesButton)
					this.emailFilesButton.show();

				Ext.each(this.records, function(record) {
					if (record.data.extension == 'folder') {

						if(this.emailFilesButton)
							this.emailFilesButton.hide();

						return false;
					}
				}, this);

			}

		}

		GO.files.FilesContextMenu.superclass.showAt.call(this, xy);
	}
});
