GO.projects2.ToGroupDialog = Ext.extend(GO.Window,{
	
	initComponent : function(){

		Ext.apply(this, {
			title: t("Group", "projects2"),
			layout:'fit',
			closable:true,
			closeAction:'hide',
			modal:false,
			height:140,
			width:350,
			items: [this.formPanel = new Ext.form.FormPanel({
				items: [
					this.groupNameField = new Ext.form.TextField({
						name : 'group_name',
						fieldLabel : t("Group name", "projects2"),
						value: ''
					})
				],
				autoScroll:true,
				cls: 'go-form-panel'
			}) ],
			buttons: [{
				text: t("Ok"),
				handler: function(){
					this.fireEvent('group_name',this.groupNameField.getValue());
					this.hide();
				},
				scope: this
			},{
				text: t("Close"),
				handler: function(){
					this.hide();
				},
				scope:this
			}]
		});

		GO.projects2.SelectTemplateWindow.superclass.initComponent.call(this);
		
		this.addEvents({
			'group_name' : true
		},this);
	},

	show : function(config){

		GO.projects2.ToGroupDialog.superclass.show.call(this,config);
		this.groupNameField.setValue('');

//		if(!this.rendered)
//			this.render(Ext.getBody());
//
//		this.showConfig = config || {};
		
	}
	
});
