GO.calendar.ContextMenu = function(config){

	if(!config)
	{
		config = {};
	}

	config.items=[
	this.actionInfo = new Ext.menu.Item({
		iconCls: 'ic-info',
		text:t("Details", "calendar"),
		scope:this,
		handler: function()
		{
			this.showEventInfoDialog();
		}
	}),new Ext.menu.Separator(),
	this.actionCopy = new Ext.menu.Item({
		iconCls: 'ic-content-copy',
		text: t("Copy"),
		scope:this,		
		disabled:false,
		handler: function()
		{
			this.showSelectDateDialog(true, false);
		}
	}),
	this.actionCut = new Ext.menu.Item({
		iconCls: 'ic-content-cut',
		text: t("Move", "calendar"),
		scope:this,
		disabled:true,
		handler: function()
		{
			if(this.event.repeats)
			{
				this.menuHandler();
			}else
			{
				this.showSelectDateDialog(false, false);
			}
		}
	}),new Ext.menu.Separator(),
	this.actionDelete = new Ext.menu.Item({
		iconCls: 'ic-delete',
		text: t("Delete"),
		scope:this,
		disabled:true,
		handler: function()
		{
			this.fireEvent("deleteEvent", this);
		}
	}),'-',
	this.newMenuItem = new GO.NewMenuItem(),
	'-',
	this.actionExportAsIcs = new Ext.menu.Item({
		iconCls: 'ic-import-export',
		text: t("Export as ICS", "calendar"),
		scope:this,
		handler: function()
		{
			if (!GO.util.empty(this.event) && this.event.event_id>0)
			window.open(GO.url('calendar/event/exportEventAsIcs')+'&event_id='+this.event.event_id);
		}
	})
	]

	if(go.Modules.isAvailable("legacy", "email")) {
		this.actionCreateMail = new Ext.menu.Item({
			iconCls: 'ic-email',
			text:t("Create email for participants", "calendar"),
			scope:this,
			handler: function()
			{
				this.showCreateMailDialog();
			}
		});
		config.items.splice(1,0,this.actionCreateMail);
	}

	if(go.Modules.isAvailable("legacy", "timeregistration"))
	{
		this.actionAddTimeRegistration = new Ext.menu.Item({
			text: t("Import into timeregistration", "calendar"),
			iconCls: 'go-menu-icon-timeregistration',
			scope:this,
			handler: function()
			{
				this.showAddTimeRegistrationDialog();
			}
		});

		config.items.splice(1,0,this.actionAddTimeRegistration);
	}

/*
	this.selectDateDialog = new GO.calendar.SelectDateDialog();
	this.selectDateDialog.on('updateEvent', function(event, isCopy, repeats, offset, new_event_id)
	{
		this.fireEvent('updateEvent', this, event, isCopy, repeats, offset, new_event_id);
	}, this);			
	*/
	GO.calendar.ContextMenu.superclass.constructor.call(this,config);

	this.addEvents({
		'updateEvent' : true
	});

}

Ext.extend(GO.calendar.ContextMenu, Ext.menu.Menu, {

	event:null,
	view_id: 0,
	
	initComponent: function() {
		
		Ext.applyIf(this,{
			listeners: {
				beforeshow: function() {
//					console.log(this.event);
					if(this.event && !!this.event.is_virtual) {
						return false; // don't show menu for virtual items
					}
				},
				scope: this
			}
		});
		
		GO.calendar.ContextMenu.superclass.initComponent.call(this);
	},
	
	setEvent : function(event, view_id)
	{
		this.event = event;
		
		var isEvent = event.model_name == "GO\\Calendar\\Model\\Event";

		this.view_id = (view_id) ? view_id : 0;
		
		var isOrganizer = typeof(this.event.is_organizer)!='undefined' && this.event.is_organizer;

//		this.actionCopy.setDisabled(this.event.read_only);
		this.actionCut.setDisabled(this.event.read_only);
		
		if(go.Modules.isAvailable("legacy", "email")) {
		// Disable "Create email for participants" when it's a private event and it's not yours
			if(this.event.private && this.event.user_id != GO.settings.user_id){
				this.actionCreateMail.setDisabled(true);
			}	else {
				this.actionCreateMail.setDisabled(false);
			}
		}
		
		if(this.event.private && this.event.user_id != GO.settings.user_id){
			this.actionCopy.setDisabled(true);
			this.actionInfo.setDisabled(true);
		} else {
			this.actionCopy.setDisabled(!isOrganizer);
			this.actionInfo.setDisabled(false);
		}
		
		var deleteEnabled=false;
//		if(isOrganizer){
//			deleteEnabled=true;
//		} else{ 
//			deleteEnabled=!this.event.read_only;
//		}
		
		if(this.event && isEvent && this.event.permission_level >= GO.permissionLevels.writeAndDelete){
				deleteEnabled=true;
		}
		
		this.actionDelete.setDisabled(!deleteEnabled);
		
//		this.actionInfo.setDisabled(!event.event_id);
		
		if(this.actionAddTimeRegistration)
			this.actionAddTimeRegistration.setDisabled(!event.event_id);
		

//		if(go.Modules.isAvailable("legacy", "email"))
//			this.actionCreateMail.setDisabled(event.has_other_participants==0);

		this.newMenuItem.setLinkConfig({
			model_name:"GO\\Calendar\\Model\\Event",
			model_id:event.event_id,
			text:event.name
		});
	},
	
	showCreateMailDialog : function() {
		if(go.Modules.isAvailable("legacy", "email")) {
			GO.request({
				url: 'calendar/event/participantEmailRecipients',
				params : {
					'event_id': this.event.event_id
				},
				success : function(response,options, result) {
					GO.email.showComposer({
						account_id: GO.moduleManager.getPanel('email').account_id,
						values:{
							to:result.to
						}
					});

				},
				scope : this
			});
		}
	},
	showAddTimeRegistrationDialog : function()
	{
		if(!this.addTimeRegistrationDialog)
		{
			this.addTimeRegistrationDialog = new GO.timeregistration.addTimeRegistrationDialog();
		}
		this.addTimeRegistrationDialog.show(this.event);
	},
	showSelectDateDialog : function(isCopy, repeat)
	{
		if(!this.selectDateDialog)
		{
			this.selectDateDialog = new GO.calendar.SelectDateDialog();


			this.selectDateDialog.on('updateEvent', function(obj, new_event_id, is_visible)
			{
				this.fireEvent('updateEvent', obj, new_event_id, is_visible);
			}, this);
		}
	
		this.selectDateDialog.show(this.event, isCopy, repeat, this.view_id);
	},
	showEventInfoDialog : function()
	{
		GO.calendar.showInfo(this.event.event_id);
	},
	menuHandler : function()
	{
		if(!this.menuRecurrenceDialog)
		{
			this.menuRecurrenceDialog = new GO.calendar.RecurrenceDialog();

			this.menuRecurrenceDialog.on('single', function()
			{
				this.showSelectDateDialog(false, false);
				this.menuRecurrenceDialog.hide();
			},this)

			this.menuRecurrenceDialog.on('entire', function()
			{
				this.showSelectDateDialog(false, true);
				this.menuRecurrenceDialog.hide();
			},this)

			this.menuRecurrenceDialog.on('cancel', function()
			{
				this.menuRecurrenceDialog.hide();
			},this)
		}
		this.menuRecurrenceDialog.show();
	}
});
