/**
 * 
 * A add menu button for detail views. 
 * 
 * Each detailview panel component can have a property "addMenuItems". These
 * will be added to this menu button.
 */

go.detail.addButton = Ext.extend(Ext.Button, {
	tooltip: t('Add'),
	iconCls: 'ic-add',
	menu: [],
	detailView: null,
	initComponent: function () {
		
		this.menu = this.buildMenu();
		
		go.detail.addButton.superclass.initComponent.call(this);
		
		
		if(go.Modules.isAvailable("legacy", "comments")) {
			//todo, refactor comments so this is also a linkable entity
			this.menu.add(	{
				iconCls: 'ic-comment',
				text: t("Comment"),
				scope: this,
				handler: this.addComment
			});
		}
		
		//TODO refactor
		
		if(!this.noFiles) { //noFiles is used in GO.email.LinkedMessagePanel
			if(go.Modules.isAvailable("legacy", "documenttemplates")) {

				this.menu.add(	{
					iconCls: 'ic-mail', 
					text:  t("E-mail from template","documenttemplates", "legacy"),
					scope: this,
					handler: function() {
						if(!GO.documenttemplates.emailTemplateDialog){
							GO.documenttemplates.emailTemplateDialog = new GO.documenttemplates.EmailTemplateDialog();
						}

						var dv = this.detailView;

						GO.documenttemplates.emailTemplateDialog.entity = this.getEntity();
						GO.documenttemplates.emailTemplateDialog.entityId = this.getEntityId();

						GO.documenttemplates.emailTemplateDialog.show();

						GO.documenttemplates.emailTemplateDialog.on('hide', function(){
							this.detailView.reload();
						}, this, {single: true});
					}
				});

				this.menu.add(	{
					iconCls: 'ic-mail', 
					text:  t("Document from template", "documenttemplates", "legacy"),
					scope: this,
					handler: function() {
						if(!GO.documenttemplates.templateDocumentDialog){
							GO.documenttemplates.templateDocumentDialog = new GO.documenttemplates.TemplateDocumentDialog();
						}

						var dv = this.detailView;

						GO.documenttemplates.templateDocumentDialog.entity = this.getEntity();
						GO.documenttemplates.templateDocumentDialog.entityId = this.getEntityId();

						GO.documenttemplates.templateDocumentDialog.show();//.show(this.entityId, this.entity);

						GO.documenttemplates.templateDocumentDialog.on('hide', function(){
							this.detailView.reload();
						}, this, {single: true});
					}
				});
			}
		}

		this.on("afterrender", this.onAfterRender, this);
		
	},
	
	onAfterRender : function() {
		this.detailView.on('load', function (dv) {
			this.setDisabled(dv.data.permissionLevel < GO.permissionLevels.write);
		}, this);
	},
	
	addComment : function () {
		var dv = this.detailView;
		
		var dlg = GO.comments.showCommentDialog(0, {
			link_config: {
				model_name:  dv.model_name || dv.entity || dv.entityStore.entity.name,
				model_id: this.getEntityId() //model_id is from old display panel

			}
		});

		dlg.on('hide', function(){
			this.detailView.reload();
		}, this, {single: true});
	},
			
			
	findCreateLinkButton : function(window) {
		
		var tbars = [window.getFooterToolbar(), window.getBottomToolbar(), window.getTopToolbar()];
		for(var i = 0, l = tbars.length; i < l; i++) {
			if(!tbars[i]) {
				continue;
			}
			
			var btn = tbars[i].findByType("createlinkbutton");
			if(btn[0]) {
				return btn[0];
			}			
		}
		return false;
	},

	buildMenu: function () {
		var items = [
			{
				iconCls: 'ic-link',
				text: t("Link", "links"),
				handler: function () {
					var linkWindow = new go.links.CreateLinkWindow({
						entityId: this.getEntityId(),
						entity: this.getEntity()
					}
					);
					linkWindow.show();
				},
				scope: this
			}
		];

		//TODO refactor in MASTER
		var all = [], allObj = go.Entities.getAll();

		for (var i in allObj) {
			all.push(allObj[i]);
		}

		var linkableEntitities = all.filter(function (e) {
			if (!go.Modules.isAvailable(e.package, e.module)) {
				return false;
			}

			return !!e.linkWindow;
		});

		if (!linkableEntitities.length) {
			return items;
		}

		items.push("-");

		var me = this;

		linkableEntitities.sort(function (a, b) {
			return a.title.localeCompare(b.title);
		});

		linkableEntitities.forEach(function (e) {

			items.push({
				iconCls: 'entity ' + e.name,
				text: e.title,
				handler: function () {
					var window = e.linkWindow.call(e.scope, this.getEntity(), this.getEntityId(), this.detailView.data);

					if (!window) {
						return;
					}

					//If go.form.Dialog turn off redirect to detail view.
					window.redirectOnSave = false;

					if (!window.isVisible()) {
						window.show();
					}
					
					//Windows may implement setLinkEntity() so they can do stuff on linking.
					if (window.setLinkEntity) {
						//window.on('show', function () {
							window.setLinkEntity({
								entity: this.getEntity(),
								entityId: this.getEntityId(),
								data: this.detailView.data
							});
						//}, this, {single: true});
					}
					var win = window.win || window; //for some old dialogs that have a "win" prop (TaskDialog and EventDialog)
					var createLinkButton = this.findCreateLinkButton(win);
					
					if(createLinkButton) {
						//if window has a create link button then use this. Otherwise add a save listener.
						createLinkButton.addLink(this.getEntity(), this.getEntityId());
					} else
					{
						window.on('save', function (window, entity) {

							//hack for event dialog because save event is different
							if (e.entity === "Event") {
								entity = arguments[2].result.id;
							}

							var link = {
								fromEntity: this.getEntity(),
								fromId: this.getEntityId(),
								toEntity: e.name,
								toId: null
							};

							if (!Ext.isObject(entity)) {
								//old modules just pass ID
								link.toId = entity;
							} else
							{
								//in this case it's a go.form.Dialog							
								link.toId = entity.id;
							}

							go.Stores.get("Link").set({
								create: [link]
							}, function (options, success, result) {
								if (result.notCreated) {
									throw "Could not create link";
								}
							});

						}, this, {single: true});

					}
				},
				scope: me
			});
		});

		return items;
	},
	
	getEntityId : function() {
		return this.detailView.currentId || this.detailView.model_id; //for old display panel
	},
	
	getEntity : function() {
		return this.detailView.entity || this.detailView.entityStore.entity.name; //entity must be set on old panels
	}
});

Ext.reg("detailaddbutton", go.detail.addButton);