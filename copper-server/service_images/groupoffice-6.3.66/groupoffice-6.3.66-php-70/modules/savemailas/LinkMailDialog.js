GO.savemailas.LinkMailDialog = Ext.extend(go.links.CreateLinkWindow,{

	mailRecord : null, // If this is set to null, then it saves all attachments of the message.
	accountId: null,
	mailbox: null,
	
	constructor : function(config){
		
		config = config || {};
		
		Ext.apply(config, {
			title:t('Mail to item','savemailas'),
			singleSelect:true,
			filesupport:true
		});

		GO.savemailas.LinkMailDialog.superclass.constructor.call(this,config);
	},
	
	link : function()	{
		
		var record = this.grid.getSelectionModel().getSelected();

		GO.request({
			url:'files/folder/checkModelFolder',
			params:{								
				mustExist:true,
				model:record.data.entity,
				id:record.data.entityId
			},
			success:function(response, options, result){
				this.saveToItem(record, result.files_folder_id);
			},
			scope:this
		});
	},
	
	show : function(mailRecord, options){
		this.mailRecord = mailRecord;
		this.accountId = options.account_id;
		this.mailbox = options.mailbox;
		
		GO.savemailas.LinkMailDialog.superclass.show.call(this);
	},

	saveToItem : function(record,files_folder_id){
		
		if(!GO.files.saveAsDialog){
			GO.files.saveAsDialog = new GO.files.SaveAsDialog();
		}

		GO.files.saveAsDialog.show({
			folder_id : files_folder_id,
			filename: this.mailRecord.data.subject+'.eml',
			handler:function(dialog, folder_id, filename){

				GO.request({
					maskEl:dialog.el,
					url: 'savemailas/linkedEmail/save',
					params:{
						uid: this.mailRecord.data.uid,
						mailbox: this.mailbox,
						account_id: this.accountId,
						folder_id: folder_id,
						filename: filename,
						sender:this.mailRecord.data.sender,
						filepath:this.mailRecord.data.path//smime message are cached on disk
					},
					success: function(options, response, result)
					{
						dialog.hide();
						this.hide();
					},
					scope:this
				});
			},
			scope:this
		});
	}

});
