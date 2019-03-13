/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: FileFoundDialog.js 22927 2018-01-12 08:01:09Z mschering $
 * @copyright Copyright Intermesh
 * @author Wesley Smits <wsmits@intermesh.nl>
 */
 
GO.scanbox.FileFoundDialog = Ext.extend(GO.dialog.TabbedFormDialog , {
	
	customFieldType : "GO\\Scanbox\\Model\\ScannableFolder",
	filesGrid : false,
	processAction : false,
	initComponent : function(){
		
		Ext.apply(this, {
			goDialogId:'scanbox',
			title:t("New file found!", "scanbox"),
			formControllerUrl: 'scanbox/scanbox',
			loadOnNewModel : false,
			modal : true
		});
		
		GO.scanbox.FileFoundDialog.superclass.initComponent.call(this);	
	},
	
	buildForm : function () {
		
		this.filesGrid = new GO.scanbox.FilesGrid({
			region:'center',
			layout:'fit'
		});
			
		this.filesGrid.on('afteredit', function(e){
			
			Ext.Ajax.request({
				url: GO.url('scanbox/scanbox/rename'),
				params: {
					originalName: e.originalValue+'.'+e.record.data.extension,
					newName: e.value+'.'+e.record.data.extension
				},
				success: function(response, options){
					var result = Ext.decode(response.responseText);
					if(!result.success){
						e.record.reject(); // Restore record
						alert(result.feedback);
					}					
				},
				scope: this
			});
		},this);
		
		this.processAction = new Ext.form.RadioGroup({
			
			name: 'processAction',
			hiddenName: 'processAction',
			fieldLabel:t("What do you want to do with the selected file(s)?", "scanbox"),
			items:[
				{boxLabel: t("Email the file(s)", "scanbox"), name: 'action', inputValue: 'email', checked:true},
				{boxLabel: t("Move the file(s) to an item", "scanbox"), name: 'action', inputValue: 'linkitem'},
				{boxLabel: t("Save file(s)", "scanbox"), name: 'action', inputValue: 'move'},
				{boxLabel: t("Delete the file(s)", "scanbox"), name: 'action', inputValue: 'delete'}
			],
			columns:1
		});
		
		this.borderPanel = new Ext.Panel({
			title:t("Properties"),			
			layout:'border',
			items:[{
				region:'north',
				layout:'form',
				bodyStyle:'padding:5px',
				autoHeight:true,
				items:[
				{
					anchor:'100%',
					xtype:'htmlcomponent',
					html:t("File(s) found in the scan folder. <br /> Please choose what you want to do with the file(s).", "scanbox"),
					autoWith:true,
					autoHeight:true,
					style:'margin-bottom:5px'
				}]
			},
			this.filesGrid,{
				region:'south',
				layout:'form',
				labelWidth: 200,
				bodyStyle:'padding:5px',
				autoHeight:true,
				items:[this.processAction]
			}]
		})
	
		this.addPanel(this.borderPanel);
	},
	show : function() {
	
		if(!this.isVisible() ||this.filesGrid.store.getCount() < 1)
			this.reload();
			
		if(!this.isVisible())		
			GO.scanbox.FileFoundDialog.superclass.show.call(this);	
	},
	reload : function(){
		this.filesGrid.store.load({
			callback:function(){
				if(this.filesGrid.store.getCount() < 1)
					this.hide();
			},
			scope:this
		});
	},
//	beforeSubmit : function(params){
//		if(this.filesGrid.store.loaded)
//			params['files']=Ext.encode(this.filesGrid.getGridData());
//		
//		GO.scanbox.FileFoundDialog.superclass.beforeSubmit.call(this, params);	
//	},
	submitForm : function(hide) {
		var radio = this.processAction.getValue();
		if( radio.inputValue == 'email'){
			this.sendMail();
		} else if( radio.inputValue == 'linkitem'){
			this.linkToItem();
		} else if( radio.inputValue == 'delete'){
			this.deleteFiles();
		}else{
			this.moveFiles();
		}
		//GO.scanbox.FileFoundDialog.superclass.submitForm.call(this, hide);	
	},
	deleteFiles : function() {
		var files = Ext.encode(this.filesGrid.getGridData());
		
		Ext.Msg.show({
			 title:t("Delete the file(s)", "scanbox"),
			 msg: t("Are you sure that you want to delete the selected file(s)?", "scanbox"),
			 buttons: Ext.Msg.YESNOCANCEL,
			 fn: function(button) {
				 if(button == 'yes'){
					 GO.request({
						url: 'scanbox/scanbox/delete',
						params:{
							'files':files
						},
						success: function(options, response, result)
						{
							this.reload();
						},
						scope:this
					});
				 }
			 },
			 animEl: 'elId',
			 icon: Ext.MessageBox.QUESTION,
			 scope:this
		});
	},
	sendMail : function(){
		var files = this.filesGrid.getGridData();
		var filesArray = [];
		for (var i in files) {
			filesArray.push(files[i]);
		}
		
		var composer = GO.email.showComposer({			
//			loadUrl: GO.url("scanbox/scanbox/email"),
//			loadParams:{											
//				files: Ext.encode(filesArray)
//			},
//			template_id: 0
		});
		
		composer.on('dialog_ready', function(){
			
			GO.request({
				url:'scanbox/scanbox/emailAttachments',
				params:{											
					files: Ext.encode(filesArray)
				},
				success:function(response,options, result){
					//['tmp_file', 'name', 'size', 'type', 'extension', 'human_size','from_file_storage','fileName'],
					composer.emailEditor.attachmentsView.store.loadData(result);
				},
				scope:this
			});
		},this,{single:true});
		
		composer.on('hide', function(){			
			this.reload();
		},this,{single:true});
		
	},
	moveFiles : function() {
		this.files = Ext.encode(this.filesGrid.getGridData());
		
		if(GO.settings.modules.files){
			if(!this.folderSelector){
				this.folderSelector = new GO.files.SelectFolderDialog({
					scope:this,
					handler:function(fs, path){

						GO.request({
							url: 'scanbox/scanbox/move',
							params:{
								'files':this.files,
								'target':path
							},
							success: function(options, response, result)
							{
								this.reload();
							},
							scope:this
						});
					}
				});
			}
			
			this.folderSelector.show();
		}
	},
	linkToItem : function() {
		var files = Ext.encode(this.filesGrid.getGridData());
		
		var linkDialog = new GO.dialog.LinksDialog({
			linkItems:function(){
				var selectionModel = this.grid.searchGrid.getSelectionModel();
				var record = selectionModel.getSelected();
				
				GO.request({
					url: 'scanbox/scanbox/link',
					params:{
						'files':files,
						'model_name':record.get('model_name'),
						'model_id':record.get('model_id')
					},
					success: function(options, response, result)
					{
						this.hide();
					},
					scope:this
				});
			}
		});
		
		linkDialog.on('hide', function(){			
			this.reload();
		},this,{single:true});
		
		linkDialog.show();
		
	}
});
