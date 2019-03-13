GO.mainLayout.onReady(function(){

	if(go.Modules.isAvailable("legacy", "email")){
		GO.email.saveAsItems = GO.email.saveAsItems || [];
		
		
		
		GO.email.saveAsItems.push({
			text: t("File to computer", "savemailas"),
			iconCls: 'btn-computer',
			handler: function(){
				var record = this.messagesGrid.selModel.getSelected();
				if(record)
				{
					var win = window.open(GO.url("email/message/source",{account_id:this.account_id,mailbox:this.mailbox,uid:record.data.uid,download:true}));
					win.focus();
				}
			}
		});
		
		GO.email.saveAsItems.push({
			text: t("File to item", "savemailas"),
			iconCls: 'btn-save',
			handler: function(){
				var record = this.messagesGrid.selModel.getSelected();
				if(record) {
					
					var e = go.Entities.getAll();
					var entities = {};
					
					//	 Remove entities that cannot handle files.
					//	 TODO: In GO6.4 this would check the entity.hasFiles boolean.
					for (entity in e) {
						if(entity == 'folder' || entity == 'file' || entity == 'linkedemail'){
							continue;
						}
						entities[entity] = e[entity];
					}
					
					var dlg = new GO.savemailas.LinkMailDialog({entities:entities});
					dlg.show(record,{account_id:this.account_id,mailbox:this.mailbox});
				}
			}
		});

		if(GO.settings.modules.files && GO.settings.modules.files.read_permission )
		{
			GO.email.saveAsItems.push({
				text: t("File in Group-Office", "savemailas"),
				iconCls: 'go-model-icon-GO_Files_Model_File',
				handler: function(item){

					//scope is the mail client
					if(!GO.files.saveAsDialog)
					{
						GO.files.saveAsDialog = new GO.files.SaveAsDialog();
					}

					var records = this.messagesGrid.getSelectionModel().getSelections();
					var r = records[0].data;

					GO.files.saveAsDialog.show({
						filename: GO.util.html_entity_decode(r.subject, 'ENT_QUOTES')+'.eml',
						handler:function(dialog, folder_id, filename){
							dialog.el.mask(t("Loading..."));
							Ext.Ajax.request({
								url: GO.url("savemailas/linkedEmail/save"),
								params:{
									uid: r.uid,
									mailbox: this.mailbox,
									account_id: this.account_id,
									folder_id: folder_id,
									filename:filename
								},
								callback: function(options, success, response)
								{
									dialog.el.unmask();
									if(!success)
									{
										alert( t("Could not connect to the server. Please check your internet connection."));
									}else
									{
										var responseParams = Ext.decode(response.responseText);
										if(!responseParams.success)
										{
											alert( responseParams.feedback);
										}else
										{
											dialog.hide();
										}
									}
								},
								scope:this
							});
						},
						scope:this
					});

				}
			});
		}

		if(GO.settings.modules.calendar && GO.settings.modules.calendar.read_permission)
		{
			GO.email.saveAsItems.push({
				text: t("Appointment", "calendar"),
				iconCls: 'go-model-icon-GO_Calendar_Model_Event',
				handler: function(item){
					var records = this.messagesGrid.getSelectionModel().getSelections();
					var r = records[0].data;

					GO.request({
						url: "email/message/view",
						params: {
							account_id: this.account_id,
							mailbox: this.mailbox,
							plaintext:1,
							create_temporary_attachments:1,
							get_contact_id:1,
							uid: r.uid
						},
						success: function(options, response, values)
						{
							values.description=values.plainbody;
							values.name=values.subject;

							var config = {
								values: values,
								tmp_files: []
							};

							for(var i=0;i<values.attachments.length;i++)
							{
								config.tmp_files.push({
									name:values.attachments[i].name,
									tmp_file:values.attachments[i].tmp_file
								});
							}

							if(values.sender_contact_id>0)
							{
								config.link_config = {
									modelNameAndId:'GO\\Addressbook\\Model\\Contact:'+values.sender_contact_id,
									text: values.contact_name
								};
							}


//							if(!GO.calendar.eventDialogListeners)
//								GO.calendar.eventDialogListeners=[];
//
//							GO.calendar.eventDialogListeners.push({
//								show:{
//									fn:function(){
//										GO.calendar.eventDialog.participantsPanel.addParticipant({
//											name: values.from,
//											email: values.sender,
//											status: values.sender == GO.settings.email ? '1' : '0'
//										});
//
//										for(var i=0;i<values.to.length;i++)
//										{
//											GO.calendar.eventDialog.participantsPanel.addParticipant({
//												name: values.to[i].name,
//												email: values.to[i].email,
//												status: values.to[i].email == GO.settings.email ? '1' : '0'
//											});
//										}
//
//										GO.calendar.eventDialog.participantsPanel.reloadAvailability();
//									},
//									scope:this,
//									single:true
//								}
//							});

							GO.calendar.showEventDialog(config);

						},
						scope: this
					});
				}
			});
		}

		if(GO.settings.modules.notes && GO.settings.modules.notes.read_permission)
		{
			GO.email.saveAsItems.push({
				text: t("Note", "notes"),
				iconCls: 'go-model-icon-GO_Notes_Model_Note',
				handler: function(item){
					var records = this.messagesGrid.getSelectionModel().getSelections();
					var r = records[0].data;

					GO.request({
						url: "email/message/view",
						params: {
							account_id: this.account_id,
							mailbox: this.mailbox,
							plaintext:1,
							create_temporary_attachments:1,
							get_contact_id:1,
							uid: r.uid
						},
						success: function(options, response, values)
						{					
							var config = {
								values: {
									"note.name": Ext.util.Format.htmlDecode(values.subject),
									"note.content": values.plainbody
								},
								tmp_files: []
							};

							for(var i=0;i<values.attachments.length;i++)
							{
								config.tmp_files.push({
									name:values.attachments[i].name,
									tmp_file:values.attachments[i].tmp_file
								});
							}

							if(values.sender_contact_id>0)
							{
								config.link_config = {
									modelNameAndId:'GO\\Addressbook\\Model\\Contact:'+values.sender_contact_id,
									text: values.contact_name
								};
							}

							GO.notes.showNoteDialog(0, config);

						},
						scope: this
					});
				}
			});
		}

		if(GO.settings.modules.tasks && GO.settings.modules.tasks.read_permission)
		{
			GO.email.saveAsItems.push({
				text: t("Task", "tasks"),
				iconCls: 'go-model-icon-GO_Tasks_Model_Task',
				handler: function(item){
					var records = this.messagesGrid.getSelectionModel().getSelections();
					var r = records[0].data;

					GO.request({
						url: "email/message/view",
						params: {
							account_id: this.account_id,
							mailbox: this.mailbox,
							plaintext:1,
							create_temporary_attachments:1,
							get_contact_id:1,
							uid: r.uid
						},
						success: function(options, response, values)
						{	
							values.description=values.plainbody;
							values.name=Ext.util.Format.htmlDecode(values.subject);

							if (values.priority<3) {
								values.priority = 2;
							} else if (values.priority>3) {
								values.priority = 0;
							} else if (values.priority==3) {
								values.priority = 1;
							}

							var config = {
								values: values,
								tmp_files:[]
							};


							for(var i=0;i<values.attachments.length;i++)
							{
								config.tmp_files.push({
									name:values.attachments[i].name,
									tmp_file:values.attachments[i].tmp_file
								});
							}

							if(values.sender_contact_id>0)
							{
								config.link_config = {
									modelNameAndId:'GO\\Addressbook\\Model\\Contact:'+values.sender_contact_id,
									text: values.contact_name
								};
							}

							
							config.emailMessage = {
								uid: r.uid,
								mailbox: this.mailbox,
								account_id: this.account_id
							};
							
							GO.tasks.showTaskDialog(config);							
						},
						scope: this
					});
				}
			});
			
			GO.tasks.tasksObservable.on('save',function(dialog, task_id, loadedStore){
				if(dialog.showConfig) {
					var emailMessage;

					if (emailMessage = dialog.showConfig.emailMessage) {
						
						var uid = emailMessage.uid;
						var account_id = emailMessage.account_id;
						var mailbox = emailMessage.mailbox;
						
						
						var params = {
							account_id: account_id,
							mailbox: mailbox,
							links: Ext.encode([{
								model_name:'GO\\Tasks\\Model\\Task',
								model_id: task_id
							}]),
							uids: Ext.encode([uid]),
							total: 1
						};
						
						var emails = {account_id:{}};
						emails.account_id[account_id] = {mailbox:{}};
						emails.account_id[account_id].mailbox[mailbox] = {uids:[]};
						emails.account_id[account_id].mailbox[mailbox].uids.push(uid);
						
						params.emails = JSON.stringify(emails);

						GO.request({
							url: "savemailas/linkedEmail/link",
							params: params,
							scope: this,
							success: function() {
								GO.mainLayout.getModulePanel('email').messagePanel.reload();
							}
						});
					}
				}
			}, this);
		}
		
		if(GO.settings.modules.projects2 && GO.settings.modules.projects2.read_permission)
		{
			GO.email.saveAsItems.push({
				text: t("Project", "projects2"),
				iconCls: 'go-model-icon-GO_Projects2_Model_Project',
				handler: function(item){
					var records = this.messagesGrid.getSelectionModel().getSelections();
					var r = records[0].data;

					GO.request({
						url: "email/message/view",
						params: {
							account_id: this.account_id,
							mailbox: this.mailbox,
							plaintext:1,
							create_temporary_attachments:1,
							get_contact_id:1,
							uid: r.uid
						},
						success: function(options, response, values)
						{	

								var win = new GO.projects2.ProjectDialog();
								win.closeAction = "close";

								win.on('show', function() {
									var def = win.nameField.getValue();
									if(def) {
										def += " ";
									}
									win.nameField.setValue(def + Ext.util.Format.htmlDecode(values.subject));

									win.contactField.setValue(values.sender_contact_id);
									win.contactField.setRemoteText(values.contact_name);

								win.on('save', function(dl, project_id) {
									console.log(project_id);
									var uid = values.uid;
									var account_id = values.account_id;
									var mailbox = values.mailbox;


									var params = {
										account_id: account_id,
										mailbox: mailbox,
										links: Ext.encode([{
											model_name:'GO\\Projects2\\Model\\Project',
											model_id: project_id
										}]),
										uids: Ext.encode([uid]),
										total: 1
									};

									var emails = {account_id:{}};
									emails.account_id[account_id] = {mailbox:{}};
									emails.account_id[account_id].mailbox[mailbox] = {uids:[]};
									emails.account_id[account_id].mailbox[mailbox].uids.push(uid);

									params.emails = JSON.stringify(emails);

									GO.request({
										url: "savemailas/linkedEmail/link",
										params: params,
										scope: this,
										success: function() {
											GO.mainLayout.getModulePanel('email').messagePanel.reload();
										}
									});
								}, this, {single: true});


							});
							win.show();

						}
					});
				}
			});
		}

		if(GO.settings.modules.tickets && GO.settings.modules.tickets.read_permission)
		{
			GO.email.saveAsItems.push({
				text: t("Ticket", "tickets"),
				iconCls: 'go-model-icon-GO_Tickets_Model_Ticket',
				handler: function(item){
					var records = this.messagesGrid.getSelectionModel().getSelections();
					var r = records[0].data;

					GO.request({
						url: "email/message/view",
						params: {
							account_id: this.account_id,
							mailbox: this.mailbox,
							plaintext:1,
							create_temporary_attachments:1,
							get_contact_id:1,
							uid: r.uid
						},
						success: function(options, response, values)
						{	
							delete values.priority;

							values.content=values.plainbody;

							values.subject = Ext.util.Format.htmlDecode(values.subject);
							
							var config = {
								values: values,
								tmp_files:[],
								loadParams:{}
							};

							if(values.sender_contact_id > 0)
							{
								config.loadParams.contact_id=values.sender_contact_id;
								
								config.link_config = {
									modelNameAndId:'GO\\Addressbook\\Model\\Contact:'+values.sender_contact_id,
									text: values.contact_name
								};
							}else
							{
								values.email=values.sender;
								values.first_name=values.from;
							}

							for(var i=0;i<values.attachments.length;i++)
							{
								config.tmp_files.push({
									name:values.attachments[i].name,
									tmp_file:values.attachments[i].tmp_file
								});
							}

							GO.tickets.showTicketDialog(0, config);

						},
						scope: this
					});
				}
			});
		}

		GO.email.saveAsItems.push({
			iconCls: 'btn-link',
			text: t("Link"),
			cls: 'x-btn-text-icon',
			multiple: true,
			handler: function(){
				if(!this.messagesGrid.selModel.selections.keys.length)
				{
					Ext.MessageBox.alert(t("Error"), t("You didn't select an item."));
				}else
				{
					
					var emailPanel = this;
					
					var searchDlg = new go.links.CreateLinkWindow({
						link: function() {
							var selections = this.grid.getSelectionModel().getSelections();
				
							var toLinks = [];

							selections.forEach(function (record) {
								var link = {
									
									model_name: record.get('entity'),
									model_id: record.get('entityId')
								}

								toLinks.push(link);
							});


								var total = 0;

								var params = {
									links: Ext.encode(toLinks),
									to_folder_id : null
//									description:this.grid.linkDescriptionField.getValue()
								};
								
								
								
								var emails = {account_id:{}};
								
								Ext.each(emailPanel.messagesGrid.getSelectionModel( ).getSelections( ), function(rec) {
									
									var uid = rec.get('uid')
									var account_id = rec.get('account_id')
									var mailbox = rec.get('mailbox')
									
									if(!emails.account_id[account_id]) {
										emails.account_id[account_id] = {mailbox:{}};
									}
									if(!emails.account_id[account_id].mailbox[mailbox]) {
										emails.account_id[account_id].mailbox[mailbox] = {uids:[]};
										
										
										
									}
									emails.account_id[account_id].mailbox[mailbox].uids.push(uid);
									total++;
								});
								
								params.emails = JSON.stringify(emails);
								params.total = total;
								
								
								Ext.MessageBox.progress(t("Copying messages...", "email"), '', '');
								Ext.MessageBox.updateProgress(0, '0%', '');
								

								var linkRequest = function(newParams){

									Ext.Ajax.request({
										url: GO.url("savemailas/linkedEmail/link"),
										params: newParams,
										callback: function(options, success, response)
										{
											if(!success)
											{
												Ext.MessageBox.alert(t("Error"), response.result.errors);
											}else
											{
												var responseParams = Ext.decode(response.responseText);
												if(!responseParams.success)
												{
													alert(responseParams.feedback);
													Ext.MessageBox.hide();
												}else if(responseParams.progress && responseParams.total > responseParams.progress )
												{
													var progress = (responseParams.total - (responseParams.total - responseParams.progress)) / responseParams.total;
											
													Ext.MessageBox.updateProgress(progress, (parseInt(progress*100))+'%', '');

													linkRequest.call(this, responseParams);
												}else {
													Ext.MessageBox.hide();
													
													GO.mainLayout.getModulePanel('email').messagesGrid.focus();
													GO.mainLayout.getModulePanel('email').messagePanel.reload();
												}
											}
										},
										scope: this
									});
								}
								this.close();
								linkRequest.call(this, params);
							}
						});
					
					searchDlg.show();
				}
			},
			scope: this
		});
	}
});




GO.linkHandlers["GO\\Savemailas\\Model\\LinkedEmail"] = function(id, remoteMessage){

	
	if(!GO.email.linkedMessagePanel){
		GO.email.linkedMessagePanel = new GO.email.LinkedMessagePanel({
			attachmentContextMenu: new GO.email.AttachmentContextMenu({removeSaveButton:true})
		});

		GO.email.linkedMessageWin = new GO.Window({
			maximizable:true,
			collapsible:true,
			stateId:'em-linked-message-panel',
			title: t("E-mail message", "email"),
			height: 500,
			width: 800,
			closeAction:'hide',
			layout:'fit',
			items: GO.email.linkedMessagePanel
		});
		
		GO.email.linkedMessageWin.on('hide', function() {
			go.Router.setPath(go.Router.previousPath);
		});
	}	
	
	if(!remoteMessage)
		remoteMessage={};
	
	GO.email.linkedMessagePanel.remoteMessage=remoteMessage;
	
	GO.email.linkedMessageWin.show();
	GO.email.linkedMessagePanel.load(id, remoteMessage);
	return GO.email.linkedMessageWin;
}

//GO.linkPreviewPanels["GO\\Savemailas\\Model\\LinkedEmail"]=function(config){
//	config = config || {};
//	return new GO.email.LinkedMessagePanel(config);
//}


go.Router.add(/linkedemail\/([0-9]+)/, function(id) {
	GO.linkHandlers["GO\\Savemailas\\Model\\LinkedEmail"](id);
});


go.Modules.register("legacy", "savemailas",{
	entities: [{
			name: "LinkedEmail",			
			linkWindow: function(entity, entityId, data) {
				var to = "";
				if(entity == "Contact") {
					//go.Stores.get('contact').get([entityId])[0].
					to = GO.addressbook.contactDetail.data.email;
				}

				if(entity == "Company") {
					//go.Stores.get('contact').get([entityId])[0].
					to = GO.addressbook.companyDetail.data.email;
				}

				var win = new GO.email.EmailComposer({
//					link: {
//						entity: entity,
//						entityId: entityId
//					}
				});
				win.closeAction = "close";
				
				win.setLinkEntity({
					entity: entity,
					entityId: entityId,
					data: data
				});

				win.show({
					values:{
						to: to
					}
				});
			},
			linkDetail: function() {
				return new GO.email.LinkedMessagePanel();
			}	
	}]
})
