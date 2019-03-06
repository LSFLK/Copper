GO.billing.ImportItemsWindow = function(config) {
	
	var config = config || {};
	
	this.buildForm();
	
	config.items=[
		this.formPanel
	];
	
	config.layout='fit';
	config.modal=false;
	config.resizable=true;
	config.maximizable=true;
	config.width=500;
	config.height=200;
	config.closeAction='hide';
	config.title= t("Import items from file", "billing");
	
	GO.billing.ImportItemsWindow.superclass.constructor.call(this, config);
	
	this.addEvents({'import':true});
	
};

Ext.extend(GO.billing.ImportItemsWindow,GO.Window,{
	
	show : function(orderId) {
		this._orderId = orderId;
		GO.billing.ImportItemsWindow.superclass.show.call(this);
	},
	
	buildForm: function() {
		this.formPanel = new Ext.form.FormPanel({
			title:t("Import"),
			layout: 'form',
			items: [],
			defaults: {anchor:'100%'},
			border: false,
			labelWidth: 150,
			toolbars: [],
			cls:'go-form-panel',
			items: [
				this.fileTypeCB = new GO.form.ComboBox({
					hiddenName: 'fileType',
					fieldLabel: t("Import file type"),
					store: new Ext.data.ArrayStore({
						storeId: 'fileTypeStore',
						idIndex: 0,
						fields:['value','label'],
						data: [
							['CSV','CSV (Comma Separated Values)'],
							['XLS','XLS(X)']
						]
					}),
					valueField:'value',
					displayField:'label',
					mode:'local',
					allowBlank: false,
					triggerAction: 'all',
					value: 'CSV'
				}),
//				this.controllerNameCB = new GO.form.ComboBox({
//					hiddenName: 'controller',
//					fieldLabel: t("Import"),
//					store: new Ext.data.ArrayStore({
//						storeId: 'controllersStore',
//						idIndex: 0,
//						fields:['value','label'],
//						data: [
//							['GO_Addressbook_Controller_Contact',t("Contacts", "addressbook")],
//							['GO_Addressbook_Controller_Company',t("Companies", "addressbook")]
//						]
//					}),
//					valueField:'value',
//					displayField:'label',
//					mode:'local',
//					allowBlank: false,
//					triggerAction: 'all',
//					value: 'GO_Addressbook_Controller_Company'
//				}),
				new Ext.Panel({
					layout: 'form',
					border: false,
					items: [
						new Ext.Button({
							text: t("Continue"),
							width: '20%',
							handler: function(){
								var fileType = this.fileTypeCB.getValue();
								if (!GO.util.empty(fileType)) {
									if ( !this.importDialogs )
										this.importDialogs = {};
									if ( !this.importDialogs[fileType] ) {
											this.importDialogs[fileType] = new GO.base.model.ImportDialog({
												importBaseParams : { order_id : this._orderId },
												controllerName : 'GO\\Billing\\Controller\\Item',
												fileType: fileType,
												excludedAttributes : ['order_id','product_id','order_at_supplier', 'order_at_supplier_company_id','item_group_id','extra_cost_status_id'],
												modelContainerIdName : 'order_id'
											});
											this.importDialogs[fileType].on('import',function(){
												this.fireEvent('import');
											},this);
										}
									this.importDialogs[fileType].show(this._orderId);
								}
							},
							scope: this
						})
					]
				})
			]
		})
	}
});
