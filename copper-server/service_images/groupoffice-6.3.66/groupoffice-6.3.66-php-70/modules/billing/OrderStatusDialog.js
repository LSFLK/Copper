/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @copyright Copyright Intermesh
 * @version $Id: OrderStatusDialog.js 23462 2018-03-06 11:37:47Z mschering $
 * @author Merijn Schering <mschering@intermesh.nl>
 */

GO.billing.OrderStatusDialog = function(config) {

	if (!config) {
		config = {};
	}

	this.buildForm();

	var focusFirstField = function() {
		this.formPanel.items.items[0].focus();
	};

	config.maximizable = true;
	config.layout = 'fit';
	config.modal = false;
	config.resizable = true;
	config.id = 'bs-order-status-dialog';
	config.width = 800;
	config.height = 600;
	//config.autoHeight = true;
	config.closeAction = 'hide';
	config.title = t("Order status", "billing");
	config.items = this.formPanel;
	config.focus = focusFirstField.createDelegate(this);
	config.buttons = [{
			text: t("Ok"),
			handler: function() {
				this.submitForm(true);
			},
			scope: this
		}, {
			text: t("Apply"),
			handler: function() {
				this.submitForm();
			},
			scope: this
		}, {
			text: t("Close"),
			handler: function() {
				this.hide();
			},
			scope: this
		}];

	GO.billing.OrderStatusDialog.superclass.constructor.call(this, config);
	this.addEvents({
		'save': true
	});
}
Ext.extend(GO.billing.OrderStatusDialog, Ext.Window, {
	show: function(order_status_id) {
		if (!this.rendered) {
			this.render(Ext.getBody());
		}

		if (!order_status_id) {
			order_status_id = 0;
		}

		this.tabPanel.setActiveTab(0);

		this.setOrderStatusId(order_status_id);

		if (this.order_status_id > 0) {
			this.formPanel.load({
				url : GO.url('billing/status/load'),
				success: function(form, action) {
					this.formPanel.baseParams.book_id = action.result.data.book_id;
					this.requiredStatusStore.baseParams.book_id = action.result.data.book_id;

					this.readPermissionsTab.setAcl(action.result.data.acl_id);

					this._enableExtraCostFields(!GO.util.empty(action.result.data.apply_extra_cost));

					GO.billing.OrderStatusDialog.superclass.show.call(this);
				},
				failure: function(form, action) {
					GO.errorDialog.show(action.result.feedback)
				},
				scope: this

			});
		} else {
			this.formPanel.form.reset();

			this.readPermissionsTab.setAcl(0);

			GO.billing.OrderStatusDialog.superclass.show.call(this);
		}
	},
	setOrderStatusId: function(order_status_id) {
		this.formPanel.form.baseParams['id'] = order_status_id;
		this.order_status_id = order_status_id;

	},
	submitForm: function(hide) {
		this.formPanel.form.submit({
			url: GO.url('billing/status/submit'),
			waitMsg: t("Saving..."),
			success: function(form, action) {

				this.fireEvent('save', this);

				if (hide) {
					this.hide();
				} else {
					if (action.result.id) {
						this.setOrderStatusId(action.result.id);

						this.readPermissionsTab.setAcl(action.result.acl_id);
					}
				}
			},
			failure: function(form, action) {
				if (action.failureType == 'client') {
					Ext.MessageBox.alert(t("Error"),
									t("You have errors in your form. The invalid fields are marked."));
				} else {
					Ext.MessageBox.alert(t("Error"),
									action.result.feedback);
				}
			},
			scope: this
		});
	},
	buildForm: function() {

		var records = GO.billing.languagesStore.getRange();

		var propItems = [];

		for (var i = 0; i < records.length; i++) {
			
			var firstCompositeItems = [];

			var textfield = new Ext.form.TextField({
				fieldLabel: t("Name") + ' ('
								+ records[i].get("name") + ')',
				name: "name_" + records[i].get("id"),
				width: 210,
				allowBlank: false
			});
			
			var emailButton = new Ext.Button({
				text: t("E-mail template", "billing"),
				scope: this,
				language_id: records[i].get("id"),
				handler: function(button, test) {

					if (this.order_status_id > 0)
					{
						if (!this.emailTemplateDialog) {
							this.emailTemplateDialog = new GO.billing.EmailTemplateDialog();
						}
						this.emailTemplateDialog.show(
										this.order_status_id,
										button.language_id);
					} else
					{
						alert(t("Please save first by clicking 'Apply'"));
					}
				}
			});
			
			firstCompositeItems.push(textfield);
			firstCompositeItems.push(emailButton);

			if(go.Modules.isAvailable("legacy", "webshop")) {
				
				var webshopButton = new Ext.Button({
					text: t("Screen template", "webshop"),
					scope: this,
					language_id: records[i].get("id"),
					handler: function(button, test) {
						if (this.order_status_id > 0)
						{
							if (!this.screenTemplateDialog) {
								this.screenTemplateDialog = new GO.webshop.ScreenTemplateDialog();
							}
							this.screenTemplateDialog.show(this.order_status_id, button.language_id);
						} else
						{
							alert(t("Please save first by clicking 'Apply'"));
						}
					}
				});
				
				firstCompositeItems.push(webshopButton);
			}
			
			var firstCompField = new Ext.form.CompositeField({
				fieldLabel: t("Name")+' ('+records[i].get("name")+')',
				items:firstCompositeItems
			});

			var pdfTemplateSelect = new GO.form.ComboBoxReset({
				mode: 'local',
				hiddenName: "template_" + records[i].get("id"),
				width: 210,
				fieldLabel: t("PDF template", "billing"),
				triggerAction: 'all',
				editable: false,
				displayField: 'name',
				valueField: 'id',
				store: GO.billing.templatesStore,
				emptyText: t("Don't generate a PDF", "billing"),
			});
			
			var docTemplateSelect = new GO.form.ComboBoxReset({
				mode: 'local',
					hiddenName: "doc_template_" + records[i].get("id"),
					width: 210,
					fieldLabel: t("Document template", "billing"),
					triggerAction: 'all',
					editable: false,
					displayField: 'name',
					valueField: 'id',
					store: GO.billing.docTemplatesStore,
					emptyText: t("noGenerateDOC", "billing")
			});

			var secondCompField = new Ext.form.CompositeField({
				fieldLabel: t("PDF template", "billing"),
				items:[
					pdfTemplateSelect,
					{
						xtype: 'displayfield',
						value: t("Document template", "billing")+':',
						width:180
					},
					docTemplateSelect]
			});

			var panel = new Ext.Panel({
				border: false,
				layout: 'form',
				bodyStyle: 'padding:0 0 20px 0',
				items: [
					firstCompField,
					secondCompField
				]
			});

			propItems.push(panel);
		}

		this.requiredStatusStore = new GO.data.JsonStore({
			url: GO.url('billing/status/store'),
			baseParams: {book_id: 1},
			id: 'id',
			fields: ['id', 'name']
		});

		propItems.push(new GO.form.ComboBox({
			hiddenName: 'required_status_id',
			width: 210,
			fieldLabel: t("Required status", "billing"),
			triggerAction: 'all',
			editable: false,
			displayField: 'name',
			valueField: 'id',
			reloadOnExpand: false,
			listeners:{
				expand:function(field){
					field.store.load();
				},
				scope:this
			},
			store: this.requiredStatusStore
		}));
		propItems.push({
			xtype: 'combo',
			name: 'max_age_text',
			allowBlank: false,
			width: 210,
			fieldLabel: t("Max order age", "billing"),
			hiddenName: 'max_age',
			store: new Ext.data.SimpleStore({
				fields: ['value', 'text'],
				data: [
					['0', t("N/A")],
					[(1 * 604800), '1 ' + t("Week")],
					[(2 * 604800), '2 ' + t("Weeks")],
					[(3 * 604800), '3 ' + t("Weeks")],
					[(4 * 604800), '4 ' + t("Weeks")],
					[(5 * 604800), '5 ' + t("Weeks")],
					[(6 * 604800), '6 ' + t("Weeks")],
					[(7 * 604800), '7 ' + t("Weeks")],
					[(8 * 604800), '8 ' + t("Weeks")],
					[(9 * 604800), '9 ' + t("Weeks")],
					[(10 * 604800),
						'10 ' + t("Weeks")],
					[(11 * 604800),
						'11 ' + t("Weeks")],
					[(12 * 604800),
						'12 ' + t("Weeks")]]
			}),
			value: '0',
			valueField: 'value',
			displayField: 'text',
			mode: 'local',
			triggerAction: 'all',
			editable: false,
			selectOnFocus: true,
			forceSelection: true
		});
		propItems.push(new Ext.ux.form.XCheckbox({
			boxLabel: t("Order is not paid in this status", "billing"),
			labelSeparator: '',
			name: 'payment_required',
//			allowBlank: true,
			hideLabel: true
		}));
		propItems.push(new Ext.ux.form.XCheckbox({

			boxLabel: t("Ask to notify customer", "billing"),
			labelSeparator: '',
			name: 'ask_to_notify_customer',
			hideLabel: true
		}));
		propItems.push(new Ext.ux.form.XCheckbox({
			boxLabel: t("Remove from stock", "billing"),
			labelSeparator: '',
			name: 'remove_from_stock',
//			allowBlank: true,
			hideLabel: true
		}));
		propItems.push(new Ext.ux.form.XCheckbox({
			boxLabel: t("Make order read only", "billing"),
			labelSeparator: '',
			name: 'read_only',
//			allowBlank: true,
			hideLabel: true
		}));

		propItems.push(this.colorField = new GO.form.ColorField({
			fieldLabel: t("Color"),
			value: 'FFFFFF',
			name: 'color',
			colors: [
				'EBF1E2',
				'95C5D3',
				'FFFF99',
				'A68340',
				'82BA80',
				'F0AE67',
				'66FF99',
				'CC0099',
				'CC99FF',
				'996600',
				'999900',
				'FF0000',
				'FF6600',
				'FFFF00',
				'FF9966',
				'FF9900',
				/* Line 1 */
				'FB0467',
				'D52A6F',
				'CC3370',
				'C43B72',
				'BB4474',
				'B34D75',
				'AA5577',
				'A25E79',
				/* Line 2 */
				'FF00CC',
				'D52AB3',
				'CC33AD',
				'C43BA8',
				'BB44A3',
				'B34D9E',
				'AA5599',
				'A25E94',
				/* Line 3 */
				'CC00FF',
				'B32AD5',
				'AD33CC',
				'A83BC4',
				'A344BB',
				'9E4DB3',
				'9955AA',
				'945EA2',
				/* Line 4 */
				'6704FB',
				'6E26D9',
				'7033CC',
				'723BC4',
				'7444BB',
				'754DB3',
				'7755AA',
				'795EA2',
				/* Line 5 */
				'0404FB',
				'2626D9',
				'3333CC',
				'3B3BC4',
				'4444BB',
				'4D4DB3',
				'5555AA',
				'5E5EA2',
				/* Line 6 */
				'0066FF',
				'2A6ED5',
				'3370CC',
				'3B72C4',
				'4474BB',
				'4D75B3',
				'5577AA',
				'5E79A2',
				/* Line 7 */
				'00CCFF',
				'2AB2D5',
				'33ADCC',
				'3BA8C4',
				'44A3BB',
				'4D9EB3',
				'5599AA',
				'5E94A2',
				/* Line 8 */
				'00FFCC',
				'2AD5B2',
				'33CCAD',
				'3BC4A8',
				'44BBA3',
				'4DB39E',
				'55AA99',
				'5EA294',
				/* Line 9 */
				'00FF66',
				'2AD56F',
				'33CC70',
				'3BC472',
				'44BB74',
				'4DB375',
				'55AA77',
				'5EA279',
				/* Line 10 */
				'00FF00', '2AD52A',
				'33CC33',
				'3BC43B',
				'44BB44',
				'4DB34D',
				'55AA55',
				'5EA25E',
				/* Line 11 */
				'66FF00', '6ED52A', '70CC33',
				'72C43B',
				'74BB44',
				'75B34D',
				'77AA55',
				'79A25E',
				/* Line 12 */
				'CCFF00', 'B2D52A', 'ADCC33', 'A8C43B',
				'A3BB44',
				'9EB34D',
				'99AA55',
				'94A25E',
				/* Line 13 */
				'FFCC00', 'D5B32A', 'CCAD33', 'C4A83B',
				'BBA344', 'B39E4D',
				'AA9955',
				'A2945E',
				/* Line 14 */
				'FF6600', 'D56F2A', 'CC7033', 'C4723B',
				'BB7444', 'B3754D', 'AA7755',
				'A2795E',
				/* Line 15 */
				'FB0404', 'D52A2A', 'CC3333', 'C43B3B',
				'BB4444', 'B34D4D', 'AA5555', 'A25E5E',
				/* Line 16 */
				'FFFFFF', '949494', '808080', '6B6B6B',
				'545454', '404040', '292929', '000000']
		}));

		this.extraCostItems = [];

		this.extraCostItems.push(
						this.extraCostCheckbox = new Ext.ux.form.XCheckbox({
							boxLabel: t("Bill extra cost item to billing order with this status and remove any of this order's previous extra cost item", "billing"),
							labelSeparator: '',
							name: 'apply_extra_cost',
							hideLabel: true
						})
						);
		this.extraCostItems.push(
						this.extraCostPercentage = new GO.form.NumberField({
							name: 'extra_cost_percentage',
//						anchor: '-20',
							width: '210',
							allowBlank: true,
							fieldLabel: t("Extra cost is by default this percentage of the order's total price (excluding VAT)", "billing"),
//							disabled: true,
							decimals: 0
						})
						);
		this.extraCostItems.push(
						this.extraCostMinValue = new GO.form.NumberField({
							name: 'extra_cost_min_value',
//						anchor: '-20',
							width: '210',
							allowBlank: true,
							fieldLabel: t("Extra cost item must have at least this price", "billing"),
//							disabled: true,
							decimals: 2
						})
						);

		for (var i = 0; i < records.length; i++) {
			var textArea = new Ext.form.TextArea({
				fieldLabel: t("Order item text for extra cost", "billing") + ' ('
								+ records[i].get("name") + ')',
				name: "extra_cost_item_text_" + records[i].get("id"),
				width: 210,
				height: 40,
				allowBlank: false
			});
			this.extraCostItems.push(textArea);
		}

		this.extraCostCheckbox.on('check', function(cb, checked) {
			this._enableExtraCostFields(checked);
		}, this);

		this.emailBCCField = new Ext.form.TextField({
			name: 'email_bcc',
			anchor: '-20',
			maxLength: 100,
			allowBlank:true,
			fieldLabel: t("BCC", "billing")
		});
		
		this.emailOwnerCheckbox = new Ext.ux.form.XCheckbox({
			boxLabel: t("Send a notification to the owner", "billing"),
			labelSeparator: '',
			name: 'email_owner',
			hideLabel: true
		});

		this.emailFieldSet = new Ext.form.FieldSet({
			style: 'margin:20px 0 0 0',
			title: t("Notification email", "billing"),
			items:[
				this.emailBCCField,
				this.emailOwnerCheckbox
			]
		});

		this.propertiesPanel = new Ext.Panel({
			border: false,
			title: t("Properties"),
			cls: 'go-form-panel',
			waitMsgTarget: true,
			labelWidth: 130,
			layout: 'form',
			autoHeight: true,
			autoScroll: true,
			style: {overflowX: 'hidden'},
			items: [
				propItems, 
				this.extraCostItems,
				this.emailFieldSet
			]
		});

		this.readPermissionsTab = new GO.grid.PermissionsPanel({
			hideLevel: true,
			addLevel:GO.permissionLevels.manage
		});

		var items = [this.propertiesPanel, this.readPermissionsTab];

		this.tabPanel = new Ext.TabPanel({
			activeTab: 0,
			deferredRender: false,
			border: false,
			items: items,
			anchor: '100% 100%',
			autoScroll: true
		});

		this.formPanel = new Ext.form.FormPanel({
			waitMsgTarget: true,
			url: GO.settings.modules.billing.url + 'action.php',
			border: false,
			baseParams: {
				task: 'order_status',
				'book_id': 0
			},
			items: this.tabPanel
		});


	},
	_enableExtraCostFields: function(enable) {
		for (var i = 1; i < this.extraCostItems.length; i++) {
			this.extraCostItems[i].allowBlank=!enable;
			this.extraCostItems[i].setVisible(enable);
		}
	}
});
