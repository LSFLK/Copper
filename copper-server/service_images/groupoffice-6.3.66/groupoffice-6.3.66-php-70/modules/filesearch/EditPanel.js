GO.filesearch.EditPanel = function (config) {

	if(!config)
		config={};

	config.title = t("Edit", "filesearch");
	config.width = 450;
	config.waitMsgTarget=true;
	config.autoScroll=true;
	config.bodyStyle='padding:5px;';
	config.items= [
		{
			xtype:'fieldset',
			anchor:'100%',
			title:t("Properties"),
			items:[
				{
					xtype: 'textfield',
					fieldLabel: t("Name"),
					name: 'name',
					anchor: '100%'
//					validator:function(v){
//						return !v.match(/[\/:\*\"<>|\\]/);
//					}
				}, new Ext.form.TextArea({
					name: 'comment',
					fieldLabel: '',
					hideLabel: true,
					anchor:'100% 100%'
				})
			],
			autoHeight:true
		}
	];
	
	
	this.saveButton = new Ext.Button({
		text:t("Save", "filesearch"),
		disabled:true,
		handler: function(){
			this.save();
		},
		scope: this
	});
	
	this.saveNextButton = new Ext.Button({
		text:t("Save and Next", "filesearch"),
		disabled:true,
		handler: function(){
			this.save(true);
		},
		scope: this
	});
	
	config.buttons = [
		this.saveButton,
		this.saveNextButton
//	{
//		text:t("Save", "filesearch"),
//		handler: function(){
//			this.save();
//		},
//		scope: this
//	},{
//		text:t("Save and Next", "filesearch"),
//		handler: function(){
//			this.save(true);
//		},
//		scope: this
//	}
	]

	GO.filesearch.EditPanel.superclass.constructor.call(this,config);

	this.addEvents({
		'save':true
	});
}


Ext.extend(GO.filesearch.EditPanel, Ext.form.FormPanel, {
	load : function(file_id,config)
	{
		config = config || {};

		this.setFileID(file_id);

		this.saveButton.setDisabled(false);
		this.saveNextButton.setDisabled(false);

		if(!this.rendered)
			this.render(Ext.getBody());

		this.form.reset();

		var params = {
			id: file_id
		};

		if(config.loadParams)
		{
			Ext.apply(params, config.loadParams);
		}

		this.form.load({
			url: GO.url("files/file/load"),
			params: params,
			success: function(form, action) {
				this.setWritePermission(action.result.data.write_permission);

				if(action.result.data.id)
				{
					this.setFileID(action.result.data.id);
				}
				
				if(action.result.customfields) {
					this.disableFieldsets(action.result.customfields);
				}

				this.folder_id=action.result.data.folder_id;

				GO.filesearch.EditPanel.superclass.show.call(this);
			},
			failure: function(form, action) {
				Ext.MessageBox.alert(t("Error"), action.result.feedback);
			},
			scope: this
		});
	},
	
	/**
	 * Show and hide the customfields fieldset in the edit panel
	 * @param {object} cfs data from response
	 */
	disableFieldsets : function(cfs) {

		for (var i=0; i<this.items.items.length; i++) {

			var panel = this.items.items[i];

			if (typeof(panel.category_id)!='undefined') {

				if(!cfs.disable_categories){
					panel.setVisible(true);
					panel.setDisabled(false);
				}else
				{
					if(cfs.enabled_categories.indexOf(panel.category_id)>-1){
						panel.setVisible(true);
						panel.setDisabled(false);
					}else{	
						panel.setVisible(false);
						panel.setDisabled(true);
					}
				}
			}
		}	
	},

	setWritePermission : function(writePermission)
	{
		this.form.findField('name').setDisabled(!writePermission);
	},

	setFileID : function(file_id)
	{
		this.file_id = file_id;
	},
	
	save : function(next)
	{
		this.form.submit({

			url:GO.url("files/file/submit"),
			params: {
				id: this.file_id				
			},
			waitMsg:t("Saving..."),
			
			success:function(form, action){
				this.fireEvent('save', this, this.file_id, this.folder_id);
				if(next)
					this.next();
			},
			failure: function(form, action) {
				var error = '';
				if(action.failureType=='client')
				{
					error = t("You have errors in your form. The invalid fields are marked.");
				}else
				{task: 'file_properties'
					error = action.result.feedback;
				}

				Ext.MessageBox.alert(t("Error"), error);
			},
			scope:this
		});
	},
	next : function() {
		var sm = this.resultsGrid.getSelectionModel();
		sm.selectNext(false);
		this.load(sm.getSelected().id);
		if(this.filePanel)
			this.filePanel.load(sm.getSelected().id);
	},
	reset : function() {
		this.form.reset();
		this.saveButton.setDisabled(true);
		this.saveNextButton.setDisabled(true);
	}
	
});
