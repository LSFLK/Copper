GO.billing.ImportDialog = Ext.extend(Ext.Window, {
	
	initComponent : function(){
		
		this.title=t("Import");
		
		this.width=500;
		this.autoHeight=true;
		this.modal=true;
		
		this.closeAction='hide';
		
		this.uploadFile = new GO.form.UploadFile({
			inputName : 'importfile',
			max:1  				
		});				
		
		this.upForm = new Ext.form.FormPanel({
			labelWidth:150,
			fileUpload:true,
			waitMsgTarget:true,
			items: [new GO.form.HtmlComponent({
				html: t("You can import products using a CSV file. The first line must contain the column names. The following fields are required for each product:<br /><br />name", "billing")+'<br /><br />'
			}),
			this.selectAddressbook = new GO.form.ComboBoxReset({
				hiddenName:'addressbook_id',
				displayField: 'name',
				valueField: 'id',
				triggerAction:'all',
				mode:'remote',
				editable: true,
				selectOnFocus:true,
				forceSelection: true,
				typeAhead: true,
				emptyText:t("Use any", "billing"),
				pageSize: parseInt(GO.settings.max_rows_list),
				fieldLabel: t("Addressbook of existing suppliers", "billing"),
				store: GO.addressbook.writableAddressbooksStore,				
				anchor:'100%'
			}),
			this.newSuppliersAddressbook = new GO.form.ComboBoxReset({
				hiddenName:'new_suppliers_addressbook_id',
				displayField: 'name',
				valueField: 'id',
				triggerAction:'all',
				mode:'remote',
				editable: true,
				selectOnFocus:true,
				forceSelection: true,
				typeAhead: true,
				emptyText:t("Use any", "billing"),
				pageSize: parseInt(GO.settings.max_rows_list),
				fieldLabel: t("Addressbook for newly imported suppliers", "billing"),
				store: GO.addressbook.writableAddressbooksStore,				
				anchor:'100%',
				allowBlank: false
			}),
			new Ext.form.TextField({
				fieldLabel: t("Delimiter"),
				name: 'delimiter',
				allowBlank: false,
				maxLength: 1,
				value: ';'
			}),
			new Ext.form.TextField({
				fieldLabel: t("Enclosure"),
				name: 'enclosure',
				allowBlank: false,
				maxLength: 1,
				value: '"'
			}),
			this.uploadFile],
			cls: 'go-form-panel'
		});
		
				
		this.items=[this.upForm];
		
		this.buttons=[
		{
			text:t("Ok"),
			handler: this.uploadHandler, 
			scope: this
		},
		{
			text:t("Close"),
			handler: function()
			{
				this.hide()
			},
			scope: this
		},{
			text:t("Download sample CSV", "billing"),
			handler: function()
			{
				window.open(GO.settings.modules.billing.url+'importsample.csv');
			},
			scope:this			
		}];
		
		this.addEvents({
			'import': true
		});
		
		GO.billing.ImportDialog.superclass.initComponent.call(this);
	},
	uploadHandler : function(){
		this.upForm.form.submit({
			waitMsg:t("Uploading..."),
			url: GO.url('billing/catalogImport/import'),//GO.settings.modules.billing.url+'action.php',
//			params: {
//				task: 'import'
//			},
			success:function(form, action){
				this.uploadFile.clearQueue();						
				this.hide();
				
				this.fireEvent('import');
				
//				var fb = action.result.feedback.replace(/BR/g,'<br />');
//				
//				Ext.MessageBox.alert(t("Success"), fb);
			},
			failure: function(form, action) {	
				if(action.failureType == 'client')
				{					
					Ext.MessageBox.alert(t("Error"), t("You have errors in your form. The invalid fields are marked."));			
				} else {
					
					var fb = action.result.feedback.replace(/BR/g,'<br />');
					
					Ext.MessageBox.alert(t("Error"), fb);
				}
			},
			scope: this
		});			
	}
});
