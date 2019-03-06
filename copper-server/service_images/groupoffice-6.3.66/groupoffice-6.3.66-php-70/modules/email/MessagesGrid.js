/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: MessagesGrid.js 22437 2018-03-01 07:55:17Z michaelhart86 $
 * @copyright Copyright Intermesh
 * @author Merijn Schering <mschering@intermesh.nl>
 */

GO.email.MessagesGrid = function(config){

	config = config || {};
	config.layout='fit';
	config.autoScroll=true;
	config.paging=true;

	config.hideMode='offsets';

	if(config.region=='north')
	{
		config.cm = new Ext.grid.ColumnModel({
			defaults:{
				sortable:true
			},
			columns:[
			{
				header:"&nbsp;",
				width:dp(32),
				dataIndex: 'icon',
				renderer: this.renderIcon,
				hideable:false,
				sortable:false
			},{
				id: 'labels',
				header: t("Labels", "email"),
				width:50,
				xtype: 'templatecolumn',
				tpl: new Ext.XTemplate('<div class="em-messages-grid-labels-container"><tpl for="labels"><div ext:qtip="{name}" style="background-color: #{color}">&nbsp;</div></tpl></div>'),
				hidden:true,
				sortable:false
			},{
				header: t("From", "email"),
				dataIndex: 'from',
				renderer:{
					fn: this.renderNorthMessageRow,
					scope: this
				},
				id:'from',
				width:200
			},{
				header: t("To", "email"),
				dataIndex: 'to',
				renderer:{
					fn: this.renderNorthMessageRow,
					scope: this
				},
				id:'to',
				width:200,
				hidden: true
			},{
				header: t("Subject", "email"),
				dataIndex: 'subject',
				renderer:{
					fn: this.renderNorthMessageRow,
					scope: this
				},
				width:200
			},{
				xtype: "datecolumn",
				header: t("Date"),
				dataIndex: 'internal_udate',
					hidden:true
			},{
				xtype: "datecolumn",
				header: t("Date sent", "email"),
				dataIndex: 'udate',
			},{
				header: t("Size"),
				dataIndex: 'size',
				width:65,
				align:'right',
				hidden:true,
				renderer:Ext.util.Format.fileSize
			}]
		});

	} else {
		
		config.cm =  new Ext.grid.ColumnModel({
		defaults:{
			sortable:true
		},
		columns:[
		{
			id:'icon',
			header:"&nbsp;",
			width:dp(32),
			dataIndex: 'icon',
			renderer: this.renderIcon,
			hideable:false,
			sortable:false
		},{
			id: 'labels',
			header: t("Labels", "email"),
			width:dp(60),
			xtype: 'templatecolumn',
			tpl: new Ext.XTemplate('<div class="em-messages-grid-labels-container"><tpl for="labels"><div ext:qtip="{name}" style="background-color: #{color}">&nbsp;</div></tpl></div>'),
			hidden:true,
			sortable:false
		},{
			header: t("Message", "email"),
			dataIndex: 'from',
			renderer:{ 
				fn: this.renderMessage,
				scope: this
			},
			css: 'white-space:normal;',
			id:'message'

		},{
			id:'arrival',
			header: t("Date"),
			dataIndex:'internal_udate',
			xtype: "datecolumn",
			hidden:true
		},{
			id:'date',
			header: t("Date sent", "email"),
			dataIndex:'udate',
			xtype: "datecolumn"
		},{
			id:'size',
			header: t("Size"),
			dataIndex: 'size',
			width:80,
			align:'right',
			hidden:true,
			renderer:Ext.util.Format.fileSize
		}]
		});
		config.bbar = new Ext.PagingToolbar({
			cls: 'go-paging-tb',
			store: config.store,
			pageSize: parseInt(GO.settings['max_rows_list']),
			displayInfo: true,
			displayMsg: t("Total: {2}"),
			emptyMsg: t("No items to display")
		});
		
		config.autoExpandColumn='message';
	}

	config.view=new Ext.grid.GridView({
		holdPosition: true,
		emptyText: t("No items to display"),
		getRowClass:function(row, index) {
			return (row.data.seen == '0') ? 'ml-unseen-row' : 'ml-seen-row';
		},
		onLoad : function(){
			if (!this.holdPosition) { 
				this.scrollToTop();
			}
			this.holdPosition = false;
		}
	});

	config.sm=new Ext.grid.RowSelectionModel();
	config.loadMask=true;
	config.border=false;
	config.split= true;
	config.header=false;
	config.enableDragDrop= true;
	config.ddGroup = 'EmailDD';
	config.animCollapse=false;

	this.searchType = new GO.form.ComboBox({
		width:dp(140),
		store: new Ext.data.SimpleStore({
			fields: ['value', 'text'],
			data : [
			['any', t("Any field", "email")],
			['fts', t("Full message", "email")],
			['from', t("Sender", "email")],
			['subject', t("Subject", "email")],
			['to', t("Recipient", "email")],
			['cc', t("Recipient (CC)", "email")]
			]
		}),
		value:GO.email.search_type_default,
		valueField:'value',
		displayField:'text',
		mode:'local',
		minListWidth: dp(168),
		triggerAction:'all',
		editable:false,
		selectOnFocus:true,
		forceSelection:true
	});

	this.showUnreadButton = new Ext.Button({
		iconCls: 'ic-markunread-mailbox',
		enableToggle:true,
		toggleHandler:this.toggleUnread,
		pressed:false,
		tooltip: t("Show unread", "email")
	});
	this.showFlaggedButton = new Ext.menu.CheckItem({
		//iconCls: 'ic-flag',
		enableToggle:true,
		listeners: {checkchange: this.toggleFlagged,scope:this},
		pressed:false,
		text: t("Show flagged", "email")
	});
	
	this.searchDialog = new GO.email.SearchDialog({
		store:config.store
	});
	
	this.settingsMenu = new Ext.menu.Menu({
		items:[{
			iconCls: 'ic-account-box',
			text: t("Accounts", "email"),
			handler: function(){
				this.emailClient.showAccountsDialog();
			},
			scope: this
		}
//		,{
//			iconCls:'ic-view-compact',
//			text: t("Toggle message window position", "email"),
//			handler: function(){
//				this.emailClient.moveGrid();
//			},
//			scope: this
//		}
,
		this.showFlaggedButton
		]
	});

	if(go.Modules.isAvailable("legacy", "gnupg")) {
		this.settingsMenu.add('-');
		this.settingsMenu.add({
			iconCls:'gpg-btn-settings',
			text:t("encryptionSettings", "gnupg"),
			handler:function(){
				if(!this.securityDialog) {
					this.securityDialog = new GO.gnupg.SecurityDialog();
				}
				this.securityDialog.show();
			},
			scope:this
		});
	}
	if(!config.hideSearch)
		config.tbar = [];
	
	GO.email.MessagesGrid.superclass.constructor.call(this, config);

	if(!config.hideSearch)
		this.getTopToolbar().add({
				cls: 'go-narrow',
				iconCls: "ic-arrow-back",
				handler: function () {
					this.emailClient.treePanel.show();
				},
				scope: this
			},
		this.composerButton = new Ext.Button({
			iconCls: 'ic-drafts',
			text: t("Compose", "email"),
			handler: function(){
				GO.email.showComposer({account_id: this.account_id});
			},
			scope: this
		}),{
			iconCls: 'ic-autorenew',
			tooltip: t("Refresh"),
			handler: function(){
				this.emailClient.refresh(true);
			},
			scope: this
		},this.deleteButton = new Ext.Button({
			iconCls: 'ic-delete',
			tooltip: t("Delete"),
			handler: function(){
				this.deleteSelected();
				this.expand();
			},
			scope: this
		}),
		'->',
		this.showUnreadButton,
		this.searchField = new go.toolbar.SearchButton({
			//store: config.store,
			paramName:'search',
			hidden: config.hideSearch,
			tools: [
				this.searchType,
				{
					iconCls: 'ic-more',
					tooltip: t("Search"),
					handler: function(){
						this.searchDialog.show();
					},
					scope: this
				}
			],
			listeners: {
				search: function(me, v) {
					config.store.baseParams['search']=v;
					config.store.load();
				},
				reset: function() {
					this.searchDialog.hasSearch = false;
					delete this.store.baseParams.query;
					delete this.store.baseParams.search;
					delete this.store.baseParams.searchIn;
					this.resetSearch();
					this.store.load({params:{start:0} });
				},
				scope:this
			}
		}),{
			iconCls: 'ic-more-vert',
			tooltip:t("Settings"),
			menu: this.settingsMenu
		}
	);

	var origRefreshHandler = this.getBottomToolbar().refresh.handler;

	this.getBottomToolbar().refresh.handler=function(){
		this.store.baseParams.refresh=true;
		origRefreshHandler.call(this);
		delete this.store.baseParams.refresh;
	};

	//stop/start drag and drop when store loads when account is readOnly
	this.store.on('load', function(store, records, options) {
		if(this.getView().dragZone){
			if(store.reader.jsonData.permission_level <= GO.permissionLevels.read) {
				this.getView().dragZone.lock();
			} else {
				this.getView().dragZone.unlock();
			}
		}
	}, this);

	this.searchType.on('select', function(combo, record) {
		GO.email.search_type = record.data.value;
		
		if(localStorage){
			localStorage.email_search_type = GO.email.search_type;
		}

		if(this.searchField.getValue()) {
			GO.email.messagesGrid.store.baseParams['search'] = this.searchField.getValue();
			this.searchField.hasSearch = true;

			GO.email.messagesGrid.store.reload();
		}

	}, this);

};

Ext.extend(GO.email.MessagesGrid, GO.grid.GridPanel,{
	
	show : function()
	{
		if(GO.email.messagesGrid.store.baseParams['unread'] === 1 || GO.email.messagesGrid.store.baseParams['unread'] === true){
			this.showUnreadButton.pressed=true;
		} else {
			this.showUnreadButton.pressed=false;
		}

		if(!GO.email.search_type)
		{
			GO.email.search_type = GO.email.search_type_default;
		}
		if(!this.hideSearch) {
			this.setSearchFields(GO.email.search_type, GO.email.search_query);
		}

		GO.email.MessagesGrid.superclass.show.call(this);
	},
	resetSearch : function()
	{
		GO.email.search_type = GO.email.search_type_default;
		GO.email.search_query = '';

		this.setSearchFields(GO.email.search_type, GO.email.search_query);
	},
	setSearchFields : function(type, query)
	{
		this.searchType.setValue(type);
		this.searchField.setValue(query);

		this.searchField.hasSearch = (query) ? true : false;
	},
	toggleUnread : function(item, pressed)
	{
		this.setIconClass(pressed ? 'ic-email' : 'ic-markunread-mailbox');
		this.setTooltip(pressed ? t("Show all", "email") : t("Show unread", "email"));
		GO.email.messagesGrid.store.baseParams['unread']=pressed ? 1 : 0;

		GO.email.messagesGrid.store.load();
	},
	toggleFlagged : function(item, pressed)
	{
		GO.email.messagesGrid.store.baseParams['flagged']=pressed ? 1 : 0;
		
		GO.email.messagesGrid.store.load();
	},

	renderNorthMessageRow : function(value, p, record){
		if(record.data['seen']=='0')
			return String.format('<div id="sbj_'+record.data['uid']+'" '+this.createQtipTemplate(record)+' class="ml-unseen-mail">{0}</div>', value);
		else
			return String.format('<div id="sbj_'+record.data['uid']+'" '+this.createQtipTemplate(record)+' class="ml-seen-mail">{0}</div>', value);
	},

	renderMessageSmallRes : function(value, p, record){

		if(record.data['seen']=='0')
		{
			return String.format('<div id="sbj_'+record.data['uid']+'" '+this.createQtipTemplate(record)+' class="ml-unseen-from">{0}</div><div class="ml-unseen-subject">{1}</div>', value, record.data['subject']);
		}else
		{
			return String.format('<div id="sbj_'+record.data['uid']+'" '+this.createQtipTemplate(record)+' class="ml-seen-from">{0}</div><div class="ml-seen-subject">{1}</div>', value, record.data['subject']);
		}
	},

	createQtipTemplate: function(record){
		var qtipTemplate = '';
		
		if(this.getStore().baseParams.query){
			qtipTemplate = 'ext:qtitle="'+t('folder','email')+'" ext:qtip="' + record.data['mailbox'] + '"';
		}
		
		return qtipTemplate;
	},

	renderMessage : function(value, p, record){
		
		var deletedCls = record.data.deleted ? 'ml-deleted' : '';
		
		if(record.data['seen']=='0'){
			return String.format('<div id="sbj_'+record.data['uid']+'" '+this.createQtipTemplate(record)+' class="ml-unseen-from '+deletedCls+'">{0}</div><div class="ml-unseen-subject '+deletedCls+'">{1}</div>', value, record.data['subject']);
		}else
		{
			return String.format('<div id="sbj_'+record.data['uid']+'" '+this.createQtipTemplate(record)+' class="ml-seen-from '+deletedCls+'">{0}</div><div class="ml-seen-subject '+deletedCls+'">{1}</div>', value, record.data['subject']);
		}
	},

	renderIcon : function(src, p, record){
		var icons = [];
		var unseen = '';
		if(record.data.answered) {
			icons.push('reply');
		}
		if(record.data.forwarded!=0){
			icons.push('forward');
		}
		if(!record.data.seen) {
			var unseen = '<div class="ml-unseen-dot"></div>';
		}
		if(record.data['has_attachments']=='1') {
			icons.push('attachment');
		}
		var priority = record.data['x_priority'];
		if(priority && priority < 3) {
			icons.push('high_priority');
		}
		if(priority && priority > 3) {
			icons.push('low_priority');
		}
		if(record.data['flagged'] == 1){
			icons.push('flag');
		}
		return unseen + '<i class="icon">'+icons.join('</i><i class="icon">')+'</i>';
		
	},

	renderFlagged : function(value, p, record){

		var str = '';

		if(record.data['flagged']==1)
		{
			//str += '<img src=\"' + GOimages['flag'] +' \" style="display:block" />';
			str += '<div class="go-icon btn-flag"></div>';
		}
		if(record.data['attachments'])
		{
			str += '<div class="go-icon btn-attach"></div>';
		//str += '<img src=\"' + GOimages['attach'] +' \" style="display:block" />';
		}
		return str;

	}
});
