GO.projects2.CsvImportDialog = function(config) {
	
	var config = config || {};
	
	this._buildForm();
	
	var config = config || {};
	
	config.title = t("Import");
	config.layout = 'form';
	config.defaults = {anchor:'100%'};
	config.border = false;
	config.labelWidth = 150;
	config.cls = 'go-form-panel';
	config.width = 400;
	config.items = [
		this.formPanel
	];
	
	GO.projects2.CsvImportDialog.superclass.constructor.call(this,config);
	
	this.addEvents({
		'import' : true
	});
	
	this.on('show',function() {
		this.fileSelector.reset();
	}, this);
}

Ext.extend( GO.projects2.CsvImportDialog, GO.Window, {

	_buildForm : function() {

		this.fileSelector = new GO.form.UploadFile({
			inputName: 'files',
			fieldLabel: t("Upload"),
			max:1
		});
		
		this.downloadExampleButton = new Ext.Button({
			text: t("Download example file", "projects2"),
			handler: function() {
				window.open(GO.url('projects2/project/downloadExampleCsv'));
			}
		})
		
		this.formPanel = new Ext.form.FormPanel({
			fileUpload : true,
			items: [
				{
					xtype: 'plainfield',
					hideLabel: true,
					value: t("This is to import projects from a CSV file into Group-Office. Make sure that:<br />1) the first row of the file contains the database names of the columns,<br />2) that all the parent projects of the projects are accounted for, and<br />3) that every imported project has a valid project type.", "projects2")
				},
				this.fileSelector,
				this.downloadExampleButton
			],
			buttons: [{
				text: t("Import"),
				width: '20%',
				handler: function(){
					this._submitForm();
				},
				scope: this
			},{
				text:t("Close"),
				handler:function(){
					this.hide();
				},
				scope:this				
			}]
		});
		
	},
	
	_submitForm : function() {
		if (!this._loadMask)
			this._loadMask = new Ext.LoadMask(Ext.getBody(), {msg: t("Importing", "projects2")+'...'});
		this._loadMask.show();

		this.formPanel.getForm().submit({
			url : GO.url('projects2/project/importCsv'),
			success : function( form, action ) {
				var errorsText = '';
				var result = Ext.decode(action.response.responseText);
				if (!GO.util.empty(result.summarylog)) {
					for (var i=0; i<result.summarylog.errors.length; i++) {
						if (i==0)
							errorsText = '<br />' + t("Failed import items") + ':<br />';
						errorsText = errorsText + t("item") + ' ' + result.summarylog.errors[i].name + ': ' +
													result.summarylog.errors[i].message + '<br />';
					}
					//Ext.MessageBox.alert(t("Error"),errorsText);
				}

				if (!result.success) {
					Ext.MessageBox.alert(t("Error"),result.feedback);
				} else {
					if (result.totalCount){
						if(result.totalCount != result.successCount){
							GO.errorDialog.show(
								errorsText,
								t("Records imported successfully", "projects2")+': '+result.successCount+'/'+result.totalCount
							);
						} else {
							Ext.MessageBox.alert(
								'',
								t("Records imported successfully", "projects2")+': '+result.successCount+'/'+result.totalCount
								+ errorsText
							);
						}
					}else{
						Ext.MessageBox.alert(
							'',
							t("Records imported successfully", "addressbook")
							+ errorsText
						);
					}
						
					this.fireEvent('import');
						
				}
				this._loadMask.hide();
			},
			failure : function ( form, action ) {
				var result = Ext.decode(action.response.responseText);
				if (!GO.util.empty(result.summarylog)) {
					var messageText = '';
					for (var i=0; i<result.summarylog.errors.length; i++)
						messageText = messageText + result.summarylog.errors[i].message + '<br />';
					Ext.MessageBox.alert(t("Error"),messageText);
				} else if (!GO.util.empty(result.feedback)) {
					Ext.MessageBox.alert(t("Error"),result.feedback);
				}
				this._loadMask.hide();
			},
			scope: this
		});
	}
	
});
