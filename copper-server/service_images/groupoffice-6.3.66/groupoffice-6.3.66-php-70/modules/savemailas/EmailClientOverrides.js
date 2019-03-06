
//console.log('load')

GO.moduleManager.onModuleReady('email',function(){
//	console.log('mail')
	Ext.override(GO.email.EmailClient, {
		
		initComponent : GO.email.EmailClient.prototype.initComponent.createSequence(function(){
			
			
			this.dateDialog = new GO.dialog.date({modal: true});
			
			this.dateDialog.on('select', function(dateDialog, valueDate){
				
					var records = this.messagesGrid.getSelectionModel().getSelections();
					var r = records[0].data;
					
					GO.request({
						url: "savemailas/LinkedEmail/followUp",
						params: {
							account_id: this.account_id,
							mailbox: this.mailbox,
							uid: r.uid,
							date: valueDate
						},
						success: function(options, response, values) {	
							this.dateDialog.reset();
							this.flagMessages('Flagged', false);
						},
						scope: this
					});
					
		}, this);
			
			
			this.contextMenuFollowUp = new Ext.menu.Item({
				text: t("Follow Up", "savemailas"),
				handler: function(item){
					
					this.dateDialog.show();
					
					this.gridContextMenu.hide();
				},
				scope:this,
				multiple:false
			});
			
			this.gridContextMenu.items.insert(4,this.contextMenuFollowUp);
		})
	});
	
	

});
