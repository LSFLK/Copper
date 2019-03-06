/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: MainPanel.js 22900 2018-01-12 08:00:42Z mschering $
 * @copyright Copyright Intermesh
 * @author Merijn Schering <mschering@intermesh.nl>
 */


GO.filesearch.MainPanel = function(config){

	config = config || {};

	// Set the screenlayout for this panel to normal (Render the editpanel on the normal place)
	var screenlayout = Ext.state.Manager.get('fs-screenlayout');
	if(screenlayout)
		config.screenlayout=screenlayout; 
	 else 
		config.screenlayout='normal'; 

	config.closeAction='hide';
	config.layout='border';
	//config.closable=true;
	config.maximizable=true;
	config.border=false;

	var formItems=[{
		anchor:'100%',
		xtype:'fieldset',
		title:t("Find documents that include...", "filesearch"),
		defaults:{
			xtype:'textfield',
			anchor:'100%'
		},
		items:[/*{
			xtype:'checkbox',
			boxLabel:t("Only search in the current folder", "filesearch"),
			hideLabel:true,
			name:'search_current_folder'
		},*/{
			name:'content_all',
			fieldLabel:t("All these words", "filesearch")
		},{
			name:'content_exact',
			fieldLabel:t("Exact wording or phrase", "filesearch")
		},{
			name:'filename',
			fieldLabel:t("Filename like", "filesearch")
		},{
			xtype:'compositefield',
			fieldLabel:t("One or more of these words", "filesearch"),
			items:[{
				flex:4,
				xtype:'textfield',
				name:'content_or1'
			},{
				flex:1,
				xtype:'box',
				html:'OR',
				style:'line-height:20px;text-align:center'
			},{
				flex:4,
				xtype:'textfield',
				name:'content_or2'
			},{
				flex:1,
				xtype:'box',
				html:'OR',
				style:'line-height:20px;text-align:center'
			},{
				flex:4,
				xtype:'textfield',
				name:'content_or3'
			}]
		},{
			xtype:'selectfolder',
			fieldLabel:t("Search a specific folder", "filesearch"),
			name:'folder_path'
		}]
	}
	/*,{
				xtype:'datefield',
				name:'modified_before',
				fieldLabel:'Modified before'
			},{
				xtype:'datefield',
				name:'modified_after',
				fieldLabel:'Modified after'
			}*/
	,{
		xtype:'fieldset',
		anchor:'100%',
		title:t("Document properties", "filesearch"),
		defaults:{
			xtype:'textfield',
			anchor:'100%'
		},
		items:[{
			border:false,
			xtype:'panel',
			items:[{
				anchor:'100%',
				xtype:'checkboxgroup',
				fieldLabel:t("Document type", "filesearch"),
				columns: 2,
				itemId:'filetype',
				items: [this.textCB = new Ext.form.Checkbox({
					boxLabel: t("Text documents", "filesearch"),
					name: 'filetype',
					inputValue: 'text'
				}),this.imageCB = new Ext.form.Checkbox({
					boxLabel: t("Images", "filesearch"),
					name: 'filetype',
					inputValue: 'image'
				}),this.spreadsheetCB = new Ext.form.Checkbox({
					boxLabel: t("Spreadsheet", "filesearch"),
					name: 'filetype',
					inputValue: 'spreadsheet'
				}),this.emailCB = new Ext.form.Checkbox({
					boxLabel: t("E-mail", "filesearch"),
					name: 'filetype',
					inputValue: 'email'
				})]
			}]
		},{
			xtype:'compositefield',
			fieldLabel:t("Modified between", "filesearch"),
			anchor:'100%',
			items:[{
				xtype:'datefield',
				name:'modified_after',
				flex:3
			},{
				flex:1,
				xtype:'box',
				html:'&',
				style:'line-height:20px;text-align:center'
			},{
				xtype:'datefield',
				name:'modified_before',
				flex:3
			}]
		},{
			xtype:'compositefield',
			fieldLabel:t("Created between", "filesearch"),
			anchor:'100%',
			items:[{
				xtype:'datefield',
				name:'created_after',
				flex:3
			},{
				flex:1,
				xtype:'box',
				html:'&',
				style:'line-height:20px;text-align:center'
			},{
				xtype:'datefield',
				name:'created_before',
				flex:3
			}]
		}/*{
				items:[{
					xtype:'radiogroup',
					fieldLabel:t("modifiedSince", "filesearch"),
					columns: 1,
					items: [{
						boxLabel: t("Anytime", "filesearch"),
						name: 'modified_since',
						inputValue: 'any',
						checked:true
					},{
						boxLabel: t("Past week", "filesearch"),
						name: 'modified_since',
						inputValue: 'week'
					},{
						boxLabel: t("Past month", "filesearch"),
						name: 'modified_since',
						inputValue: 'month'
					},{
						boxLabel: t("Past year", "filesearch"),
						name: 'modified_since',
						inputValue: 'year'
					}]
				}]
			},{
				items:[{
					xtype:'radiogroup',
					fieldLabel:t("createdSince", "filesearch"),
					columns: 1,
					items: [{
						boxLabel: t("Anytime", "filesearch"),
						name: 'created_since',
						inputValue: 'any',
						checked:true
					},{
						boxLabel: t("Past week", "filesearch"),
						name: 'created_since',
						inputValue: 'week'
					},{
						boxLabel: t("Past month", "filesearch"),
						name: 'created_since',
						inputValue: 'month'
					},{
						boxLabel: t("Past year", "filesearch"),
						name: 'created_since',
						inputValue: 'year'
					}]
				}]
			}*/
		,{
			xtype:'selectuser',
			name:'owner',
			fieldLabel:t("Owner"),
			allowBlank:true,
			startBlank:true
		},{
			name:'author',
			fieldLabel:t("Author", "filesearch")
		}]
	}];

	if(go.Modules.isAvailable("core", "customfields") && GO.customfields.types["GO\\Files\\Model\\File"])
	{
		this.insert_customfields(formItems);
	}

	GO.filesearch.searchPanel = this.searchPanel = new Ext.FormPanel({
		cls:'go-form-panel',
		title: t("Quick search", "filesearch"),
		split:true,
		autoScroll:true,
		//collapseMode:'mini',
		labelAlign:'top',
		defaults: {
			stateful: true,
			collapsible: true,
			collapsed: true
		},
		items:formItems,
		buttons:[{
			text:t("Reset"),
			handler:this.reset,
			scope:this
		},{
			text:t("Search"),
			handler:this.search,
			scope:this
		}],
		keys:[{
			scope:this,
			key: Ext.EventObject.ENTER,
			fn: this.search
		}]
	});
	
	config.focus=function(){
		this.searchPanel.form.findField('content_all').focus(true);
	}
	config.listeners={
		show:function(){
			this.searchPanel.form.findField('content_all').focus(true);
		},
		
		scope:this
	}

	this.resultsGrid = new GO.filesearch.ResultsGrid({
		region:'center',
		disabled:true,
		border:true,
		listeners:{
			rowdblclick:function(grid, rowIndex, e){
				var record = grid.store.getAt(rowIndex);
				GO.files.openFile({id:record.id});
			},
			delayedrowselect:function(grid, rowIndex, r){
				this.filePanel.loadParams.query_params=Ext.encode(this.resultsGrid.store.baseParams);
				
				if(this.screenlayout=='normal'){
					this.eastTabPanel.activeTab.load(r.id);
				} else {
					this.eastTabPanel.activeTab.load(r.id);
					this.bottomEditPanel.load(r.id);
				}

					this.resultsGrid.clickedFileId = r.id;
			},
			scope:this
		}
	});

	this.filePanel = new GO.files.FilePanel({
//		setTitle:function(){},
//		initTemplate : GO.files.FilePanel.prototype.initTemplate.createSequence(function(){
//			this.template = '<div style="margin:5px;">{name}</div>'+this.template;
//		}),
		width:450,
		title:t("Properties")
	});

	this.editPanel = new GO.filesearch.EditPanel({
		resultsGrid: this.resultsGrid
	});

	this.bottomEditPanel = new GO.filesearch.EditPanel({
		region:'east',
		split:true,
		border:true,
		//cls:'x-panel-body',
		resultsGrid: this.resultsGrid,
		filePanel: this.filePanel,
		hidden:this.screenlayout=='normal'
	});

	if(go.Modules.isAvailable("core", "customfields") && GO.customfields.types["GO\\Files\\Model\\File"])
	{
		this.insert_customfields(this.editPanel);
		this.insert_customfields(this.bottomEditPanel);
	}

	this.eastTabPanel = new Ext.TabPanel({
		region:'east',
		split:true,
		activeTab: 0,
		border: true,
		width:450,
		items: [
		this.filePanel,
		this.editPanel
		]
	});
	
	this.centerPanel = new Ext.Panel({
		layout:'border',
		region:'center',
		border:false,
		items:[
			this.resultsGrid,
			this.bottomEditPanel
		]
	});

	this.docbundlesGrid = new GO.filesearch.DocbundlesGrid({
		listeners:{
			rowdblclick : {
				scope:this,
				fn: function(grid, rowIndex){
					var record = grid.getStore().getAt(rowIndex);
					this.reset();
					this.resultsGrid.setDocumentBundle(record);
					this.setTitle(t("Document bundle", "filesearch")+': '+record.get('name'));
					//this.resultsGrid.exportTitle=record.get('description');
					this.resultsGrid.exportTitle=record.get('name');

					this.docbundlesWindow.hide();
					this.search();
				}
			}
		}
	});

	config.tbar=new Ext.Toolbar({
		cls:'go-head-tb',
		collapsible:true,
		items:[{
		xtype:'htmlcomponent',
		html:t("File search", "filesearch"),
		cls:'go-module-title-tbar'
		},{
			iconCls:'btn-folder',
			text:t("Document bundles", "filesearch"),
			handler:function(){
				if(!this.docbundlesWindow){
					this.docbundlesWindow = new GO.Window({
						title:t("Document bundles", "filesearch"),
						height:400,
						width:600,
						layout:'fit',
						closeAction:'hide',
						items:[
						this.docbundlesGrid
						]
					});
				}
				this.docbundlesWindow.show();
			},
			scope:this
		},{
			iconCls:'ic-view-compact',
			text:t("Switch position of editpanel", "filesearch"),
			handler:function(){			
				this.toggleEditPanel();
			},
			scope:this
		}]
	});

	//	GO.filesearch.advancedSearchPanel = new GO.advancedquery.AdvancedQueryPanel({
	//		title:t("Advanced search", "filesearch"),
	//		type:'filesearch',
	//		fieldsUrl:GO.settings.modules.filesearch.url+'json.php',
	//		matchDuplicates:true,
	//		listeners:{
	//			search:function(panel, query, matchDuplicates, matchFirstDuplicateOnly){
	//				this.search(query, matchDuplicates, matchFirstDuplicateOnly);
	//			},
	//			scope:this
	//		}
	//	});

	this.advancedFormPanel = new Ext.FormPanel({
		region:'south',
		height:200,
		cls:'go-form-panel',
		autoScroll:true,
		buttons:[{
			text:t("Search"),
			handler:this.search,
			scope:this
		}		
		],
		items:[
		this.matchDuplicatesCombo = new Ext.ux.form.SuperBoxSelect({
			allowAddNewData:true, //otherwise every value will be looked up at the server. We don't want that.
			xtype:'superboxselect',
			resizable: true,
			store:  new GO.data.JsonStore({
				url: GO.url('filesearch/filesearch/attributes'),
				root: 'results',
				id: 'name',
				fields: ['name','label','gotype'],
				remoteSort: true
			}),
			removeValuesFromStore : false,
			mode: 'remote',
			valueField:'name',
			displayField:'label',
			forceSelection : true,
			valueDelimiter:'|',
			hiddenName:'duplicate_fields[]',
			anchor:'-20',
			fieldLabel:t("Match duplicates"),
			hideLabel:false,
			queryDelay: 0,
			triggerAction: 'all'
		}),
		this.showFirstDuplicateOnlyCheckbox = new Ext.form.Checkbox({
			boxLabel:t("Only show first duplicate"),
			name:'show_first_duplicate_only',
			hideLabel:true
		})
		]
	});

	GO.filesearch.advancedSearchPanel = {
		layout:'border',
		title: t("Advanced search", "filesearch"),
		items:[this.queryPanel = new GO.query.QueryPanel({
			region:'center',
			modelAttributesUrl:GO.url('filesearch/filesearch/attributes'),
			modelName:'GO\\Filesearch\\Model\\Filesearch'
		}),this.advancedFormPanel]
	}
	//GO.filesearch.advancedSearchPanel.add()

	config.items=[
	this.westTabPanel = new Ext.TabPanel({
		split:true,
		region:'west',
		activeTab: 0,
		border: true,

		width:350,
		items: [
		GO.filesearch.searchPanel,
		GO.filesearch.advancedSearchPanel
		]
	}),
	this.centerPanel,
	this.eastTabPanel
	];

	GO.filesearch.MainPanel.superclass.constructor.call(this,config);
		
	this.eastTabPanel.on('render',function(){
		this.toggleEditPanel(this.screenlayout);
	},this);
	
	this.editPanel.on('save',function(){
		this.resultsGrid.store.reload();
	},this);
	
	this.bottomEditPanel.on('save',function(){
		this.resultsGrid.store.reload();
	},this);

	this.eastTabPanel.on('tabchange',function(tabpanel,tab){
		if (this.resultsGrid.clickedFileId>0) {
			tab.load(this.resultsGrid.clickedFileId,true);
		}
	},this);
}

Ext.extend(GO.filesearch.MainPanel, Ext.Panel, {
	search : function(){
		//checkbox values are only returned when ticked
		delete this.resultsGrid.store.baseParams.search_current_folder;

		if (this.westTabPanel.getActiveTab()==GO.filesearch.searchPanel) {
			delete this.resultsGrid.store.baseParams.query;
			var formValues = this.searchPanel.form.getValues();

			var fileTypes = new Array();
			if(this.textCB.getValue())
				fileTypes.push('text');
			if(this.imageCB.getValue())
				fileTypes.push('image');
			if(this.spreadsheetCB.getValue())
				fileTypes.push('spreadsheet');
			if(this.emailCB.getValue())
				fileTypes.push('email');

			formValues.filetype = fileTypes.join(',');

//			if(typeof(formValues.filetype)=='object')
//				formValues.filetype=formValues.filetype.join(',');
//			else
//				formValues.filetype="";
	
			Ext.apply(this.resultsGrid.store.baseParams, formValues);
		} else {
			Ext.apply(this.resultsGrid.store.baseParams,{
				'advancedQueryData':Ext.encode(this.queryPanel.getData()), 
				'markDuplicateFields' : this.matchDuplicatesCombo.getValue(), 
				'showFirstDuplicateOnly' : this.showFirstDuplicateOnlyCheckbox.getValue() ? '1' : '0'
				});
		}

		this.filePanel.reset();
		
		this.resultsGrid.store.load();
		this.resultsGrid.setDisabled(false);

	//this.tabPanel.setActiveTab(1);
	},
	reset : function(){
		this.searchPanel.form.reset();		
		this.resultsGrid.setDocumentBundle(false);
		this.resultsGrid.store.removeAll();
		this.resultsGrid.setDisabled(true);
		this.setTitle(t("Search files", "filesearch"));
		this.resultsGrid.exportTitle=t("Search");
		this.filePanel.reset();
		this.bottomEditPanel.reset();
		this.searchPanel.form.findField('content_all').focus(true);

	},

	insert_customfields : function(container) {
		var cfFS, formField;
		for(var i=0;i<GO.customfields.types["GO\\Files\\Model\\File"].panels.length;i++)
		{
			var cfPanel = GO.customfields.types["GO\\Files\\Model\\File"].panels[i];

			cfFS = {
				xtype:'fieldset',
				anchor:'100%',
				title:cfPanel.title,
				category_id:cfPanel.category_id,
				items:[],
				autoHeight:true
			};
			for(var n=0;n<cfPanel.customfields.length;n++)
			{
				formField = GO.customfields.getFormField(cfPanel.customfields[n]);
				formField.anchor='100%';
				cfFS.items.push(formField);
			}

			if (typeof(container.push)=='function')
				container.push(cfFS);
			else
				container.add(cfFS);
		}
	},
	
	toggleEditPanel : function(screenLayout){

		if(!screenLayout)
			screenLayout=this.screenlayout=='edit' ? 'normal' : 'edit';
		
		this.screenlayout=screenLayout;

		if(this.screenlayout=='edit'){
			this.bottomEditPanel.show();
			this.eastTabPanel.hideTabStripItem(this.editPanel);
			this.eastTabPanel.setActiveTab(0);
		}else{			
			this.bottomEditPanel.hide();
			this.eastTabPanel.unhideTabStripItem(this.editPanel);
//			this.eastTabPanel.setActiveTab(1);
		}

		Ext.state.Manager.set('fs-screenlayout', this.screenlayout);
		this.centerPanel.doLayout();
	}
	
});

GO.moduleManager.addModule('filesearch', GO.filesearch.MainPanel, {
	title : t("Search files", "filesearch"),
	iconCls : 'go-tab-icon-files'
});
