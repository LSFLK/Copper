GO.moduleManager.onModuleReady('files',function(){
	Ext.override(GO.files.FilePanel, {

		keywords : [],

		keywordIndex : -1,

		initComponent : GO.files.FilePanel.prototype.initComponent.createInterceptor(function(){
			this.buttons=[
				this.previousKeywordButton = new Ext.Button({
					text:t("Previous keyword", "filesearch"),
					handler:function(){
						this.scrollToKeyword(true);
					},
					scope:this,
					disabled:true
				}),
				this.nextKeywordButton = new Ext.Button({
					text:t("Next keyword", "filesearch"),
					handler:function(){
						this.scrollToKeyword(false);
					},
					scope:this,
					disabled:true
			})];
		}),

		setData : GO.files.FilePanel.prototype.setData.createSequence(function(){

			var select = this.body.select('.fs-highlight');
			this.keywords = select.elements;
			this.keywordIndex = -1;

			this.updateKeywordButtons();
		}),

		updateKeywordButtons : function(){

			if(this.keywords.length==0){
				this.showBbar(true);
			}else
			{
				this.showBbar(false);
				this.nextKeywordButton.setDisabled(this.keywordIndex==(this.keywords.length-1));
				this.previousKeywordButton.setDisabled(this.keywordIndex<1);				
			}			
		},

		showBbar : function(hide){
			this.footer.setDisplayed(!hide);
			this.onResize(this.getEl().getWidth(), this.getEl().getHeight());
		},

		scrollToKeyword : function(previous){

			if(previous)
				this.keywordIndex--;
			else
				this.keywordIndex++;
			
			var el = Ext.get(this.keywords[this.keywordIndex]);
			el.scrollIntoView(this.body);

			this.updateKeywordButtons();
		},

		initTemplate : GO.files.FilePanel.prototype.initTemplate.createSequence(function(){
			this.template +=
				'<table class="display-panel" cellpadding="0" cellspacing="0" border="0">'+
					'<tr>'+
						'<td colspan="2" class="display-panel-heading">'+t("Content preview", "filesearch")+'</td>'+
					'</tr>'+

						'<tr>'+
							'<td colspan="2" class="go-html-formatted">'+
								'<tpl if="text!=\'\'">{text}</tpl>'+
								'<tpl if="text==\'\'">'+t("No preview available", "filesearch")+'</tpl>'+
							'</td>'+
						'</tr>'+
					'</tpl>'+
				'</table>';
		}).createInterceptor(function(){
			this.extraTemplateProperties=
				'<tpl if="author!=\'\'">'+
				'<tr>'+
					'<td>'+t("Author", "filesearch")+':</td>'+
					'<td>{author}</td>'+
				'</tr>'+
				'</tpl>'+
				'<tpl if="last_modified_by!=\'\'">'+
				'<tr>'+
					'<td>'+t("Last modified by", "filesearch")+':</td>'+
					'<td>{last_modified_by}</td>'+
				'</tr>'+
				'</tpl>'
				;
		})
	});

	/*Ext.override(GO.files.FileBrowser, {
		initComponent : GO.files.FileBrowser.prototype.initComponent.createInterceptor(function(){
			this.tbar.add({
				iconCls:'btn-search',
				text:t("Search"),
				handler:function(){
					if(!GO.filesearch.searchWindow)
						GO.filesearch.searchWindow = new GO.filesearch.SearchWindow();

					GO.filesearch.searchWindow.show();
					GO.filesearch.searchWindow.resultsGrid.store.baseParams.folder_id=this.folder_id;
				},
				scope:this
			});
		})
	});*/
});
