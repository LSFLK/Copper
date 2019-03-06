/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @copyright Copyright Intermesh
 * @version $Id: TemplateDialog.js 22862 2018-01-12 08:00:03Z mschering $
 * @author Merijn Schering <mschering@intermesh.nl>
 */


GO.billing.TemplateDialog = function(config){


	if(!config)
	{
		config={};
	}


	this.buildForm();

	var focusFirstField = function(){
		this.propertiesPanel.items.items[0].focus();
	};

	config.border=false;
	config.maximizable=true;
	config.layout='fit';
	config.modal=false;
	config.resizable=false;
	config.width=700;
	config.height=500;
	config.closeAction='hide';
	config.title= t("Template", "billing");
	config.items= this.formPanel;
	config.focus= focusFirstField.createDelegate(this);
	config.buttons=[{
		text: t("Ok"),
		handler: function(){
			this.submitForm(true);
		},
		scope: this
	},{
		text: t("Apply"),
		handler: function(){
			this.submitForm();
		},
		scope:this
	},{
		text: t("Close"),
		handler: function(){
			this.hide();
		},
		scope:this
	}
	];

	GO.billing.TemplateDialog.superclass.constructor.call(this, config);
	this.addEvents({
		'save' : true
	});
}
Ext.extend(GO.billing.TemplateDialog, Ext.Window,{

	show : function (template_id) {

		delete this.formPanel.baseParams.book_id;

		if(!this.rendered)
		{
			this.render(Ext.getBody());
		}

		if(!template_id)
		{
			template_id=0;
		}

		this.tabPanel.setActiveTab(0);
		this.setTemplateId(template_id);

		if(this.template_id>0)
		{
			this.formPanel.load({
				url : GO.url('billing/template/load'),

				success:function(form, action)
				{
					this.formPanel.baseParams.book_id=action.result.data.book_id;

					this.setLogo(action.result.data.logo);

//                                        this.toggleHtmlTable(this.useHtmlTable.getValue());

					GO.billing.TemplateDialog.superclass.show.call(this);
				},
				failure:function(form, action)
				{
					GO.errorDialog.show(action.result.feedback)
				},
				scope: this

			});
		}else
		{

			this.formPanel.form.reset();
			this.logoComponent.setSrc("");
			this.deleteLogoCB.setDisabled(true);

			GO.billing.TemplateDialog.superclass.show.call(this);
		}
	},
//
//        toggleHtmlTable : function(visible)
//        {
//                this.showProductId.setDisabled(visible);
//                this.showAmounts.setDisabled(visible);
//                this.showUnitPrices.setDisabled(visible);
//                this.showProdPrices.setDisabled(visible);
//                this.showTax.setDisabled(visible);
//                this.showTotalPrices.setDisabled();
//                
//                if(visible)
//                {
//                        this.tabPanel.unhideTabStripItem('bs-html-table');                        
//                }else
//                {
//                        this.tabPanel.hideTabStripItem('bs-html-table');                        
//                }
//        },


	setTemplateId : function(template_id)
	{
		this.formPanel.baseParams['id']=template_id;
		this.template_id=template_id;

	},
	setLogo : function(src)
	{
		if(!src)
			src="";
		//for iframe file upload. It encodes it with htmlspecialchars
		src = src.replace(/&amp;/g,"&");
		
		if(GO.util.empty(src))
		{
			src=Ext.BLANK_IMAGE_URL;
		}else
		{
			var now = new Date();
			src+='&'+now.getTime()
		}
		
//		console.log(src);

		this.logoComponent.setSrc(src);
		this.deleteLogoCB.setValue(false);
		this.deleteLogoCB.setDisabled(src=='');
	},

	submitForm : function(hide){
		this.formPanel.form.submit(
		{
			url:GO.url('billing/template/submit'),
			waitMsg:t("Saving..."),
			success:function(form, action){

				this.fireEvent('save', this);
				this.uploadFile.clearQueue();
				if(hide)
				{
					this.hide();
				}else
				{

					if(action.result.id)
					{
						this.setTemplateId(action.result.id);
					}
//					if(action.result.logo)
//					{
						this.setLogo(action.result.logo);
//					}
				}
			},
			failure: function(form, action) {
				if(action.failureType == 'client')
				{
					Ext.MessageBox.alert(t("Error"), t("You have errors in your form. The invalid fields are marked."));
				} else {
					Ext.MessageBox.alert(t("Error"), action.result.feedback);
				}
			},
			scope: this
		});

	},


	buildForm : function () {

		var formatData = [

		["A3", "A3 (841.89,1190.55)"],
		["A4", "A4 (595.28,841.89)"],
		["A4-L", "A4 Landscape (841.89,595.28)"],
		["A5", "A5 (419.53,595.28)"],
		["LETTER", "US Letter (612,792)"],
		["LEGAL", "US Legal (612,1008)"]
		];
		

		this.propertiesPanel = new Ext.Panel({
			cls:'go-form-panel',
			layout:'form',
			title: t("Properties"),
			autoScroll:true,
			border:false,
			items:[{
				xtype: 'textfield',
				name: 'name',
				anchor: '-20',
				allowBlank:false,
				fieldLabel: t("Name")
			},{
				xtype: 'textfield',
				name: 'title',
				anchor: '-20',
				allowBlank:true,
				fieldLabel: t("Title", "billing"),
				value: t("Invoice", "billing")
			},
			new Ext.Panel({
				layout: 'column',
				border:false,
				bodyStyle:'padding:0 19px 0 0',
				defaults: {
					border:false,
					columnWidth:.5,
					layout:'form'					
				},
				items:[
				{
					bodyStyle:'padding:0px',
					items:[
					this.leftCol = new Ext.form.TextArea({
						name:'left_col',
						anchor:'100%',
						height:140,
						allowBlank:true,
						fieldLabel: t("Left column", "billing"),
						value: "%customer_name%\n%customer_address% %customer_address_no%\n%customer_zip% %customer_city%\n%customer_country%\n%customer_vat_no%\n\n%order_data%"
					})]
				},{
					bodyStyle:'padding: 0 0 0 15px',
					items:[
					this.rightCol = new Ext.form.TextArea({
						name: 'right_col',
						anchor:'100%',
						height: 140,
						allowBlank:true,
						fieldLabel: t("Right column", "billing"),
						value: t("Example company\nSome street 123\n1234 AB Some city", "billing")
					})]
				}]
			}),{
				xtype: 'textfield',
				name: 'number_name',
				anchor: '-20',
				allowBlank:false,
				fieldLabel: t("Number name", "billing"),
				value: t("Invoice no.", "billing")
			},{
				xtype: 'textfield',
				name: 'reference_name',
				anchor: '-20',
				allowBlank:false,
				fieldLabel: t("Reference name", "billing"),
				value: t("Reference", "billing")
			},{
				xtype: 'textfield',
				name: 'date_name',
				anchor: '-20',
				allowBlank:false,
				fieldLabel: t("Date name", "billing"),
				value: t("Invoice date", "billing")
			},new Ext.Panel({
				layout: 'column',
				border:false,
				defaults: {
					border:false,
					columnWidth:.5
				},
				items:[
				{
					items:[
					this.createCostInvoice = new Ext.ux.form.XCheckbox({
						boxLabel: t("Create purchase invoice of costs", "billing"),
						labelSeparator: '',
						name: 'show_unit_cost',
//						allowBlank: true,
						hideLabel:true,
						checked:false
					}),
					this.showUnitPrices = new Ext.ux.form.XCheckbox({
						boxLabel: t("Show nett price per line", "billing"),
						labelSeparator: '',
						name: 'show_nett_unit_price',
//						allowBlank: true,
						hideLabel:true,
						checked:true
					}),
					this.showNetUnitPrice = new Ext.ux.form.XCheckbox({
						boxLabel: t("Show gross unit price per line", "billing"),
						labelSeparator: '',
						name: 'show_gross_unit_price',
//						allowBlank: true,
						hideLabel:true,
						checked:false
					}),
					this.showProdPrices = new Ext.ux.form.XCheckbox({
						boxLabel: t("Show total prices excl. VAT", "billing"),
						labelSeparator: '',
						name: 'show_nett_total_price',
//						allowBlank: true,
						hideLabel:true,
						checked:true
					}),
					this.showNetTotalPrice = new Ext.ux.form.XCheckbox({
						boxLabel: t("Show gross total price per line", "billing"),
						labelSeparator: '',
						name: 'show_gross_total_price',
//						allowBlank: true,
						hideLabel:true,
						checked:false
					}),
					this.showTotalPrices = new Ext.ux.form.XCheckbox({
						boxLabel: t("Show end total prices", "billing"),
						labelSeparator: '',
						name: 'show_summary_totals',
						allowBlank: true,
						hideLabel:true,
						checked:true
					}),
					this.showPageNrs = new Ext.ux.form.XCheckbox({
						boxLabel: t("Show page numbers", "billing"),
						labelSeparator: '',
						name: 'show_page_numbers',
//						allowBlank: true,
						hideLabel:true,
						checked:true
					}),
					this.showAmounts = new Ext.ux.form.XCheckbox({
						boxLabel: t("Show product number", "billing"),
						labelSeparator: '',
						name: 'show_product_number',
//						allowBlank: true,
						hideLabel:true,
						checked:true
					}),
					this.showItemId = new Ext.ux.form.XCheckbox({
						boxLabel: t("Show item ID", "billing"),
						labelSeparator: '',
						name: 'show_item_id',
//						allowBlank: true,
						hideLabel:true,
						checked:true
					}),
					this.showCostCode = new Ext.ux.form.XCheckbox({
						boxLabel: t("Show cost code", "billing"),
						labelSeparator: '',
						name: 'show_cost_code',
//						allowBlank: true,
						hideLabel:true,
						checked:true
					})
//					,
//					this.useHtmlTable = new Ext.ux.form.XCheckbox({
//						boxLabel: t("Use HTML table", "billing"),
//						labelSeparator: '',
//						name: 'use_html_table',
//						allowBlank: true,
//						hideLabel:true
//					})
					]
				},{
					items:[
					this.showProductId = new Ext.ux.form.XCheckbox({
						boxLabel: t("Show supplier product ID", "billing"),
						labelSeparator: '',
						name: 'show_supplier_product_id',
//						allowBlank: true,
						hideLabel:true,
						disabled: true
					}),
					this.showAmounts = new Ext.ux.form.XCheckbox({
						boxLabel: t("Show amounts", "billing"),
						labelSeparator: '',
						name: 'show_amounts',
//						allowBlank: true,
						hideLabel:true,
						checked:true
					}),
					this.showUnits = new Ext.ux.form.XCheckbox({
						boxLabel: t("Show unit names", "billing"),
						labelSeparator: '',
						name: 'show_units',
//						allowBlank: true,
						hideLabel:true,
						checked:false
					}),
					this.showTax = new Ext.ux.form.XCheckbox({
						boxLabel: t("Show tax percentage per line", "billing"),
						labelSeparator: '',
						name: 'show_vat',
//						allowBlank: true,
						hideLabel:true,
						checked:false
					}),
					this.repeatHeader = new Ext.ux.form.XCheckbox({
						boxLabel: t("Repeat header at top of every page", "billing"),
						labelSeparator: '',
						name: 'repeat_header',
//						allowBlank: true,
						hideLabel:true,
						checked:false
					}),
					this.showDateSent = new Ext.ux.form.XCheckbox({
						boxLabel: t("Show date sent", "billing"),
						labelSeparator: '',
						name: 'show_date_sent',
//						allowBlank: true,
						hideLabel:true,
						checked:false
					}),
					this.showTotalPaid = new Ext.ux.form.XCheckbox({
						boxLabel: t("Show sum total paid", "billing"),
						labelSeparator: '',
						name: 'show_total_paid',
//						allowBlank: true,
						hideLabel:true,
						value: 0,
						checked:true
					}),
					this.showReference = new Ext.ux.form.XCheckbox({
						boxLabel: t("Show reference", "billing"),
						labelSeparator: '',
						name: 'show_reference',
//						allowBlank: true,
						hideLabel:true,
						checked:true
					})
					]
				}]
			})]
		});


		this.createCostInvoice.on('check',function(checkbox,checked){
			if (!checked)
				this.showProductId.setValue(false);
			this.showProductId.setDisabled(!checked);
		}, this);

//                this.useHtmlTable.on('check', function(cb, checked)
//                {
//                        this.toggleHtmlTable(checked);
//                },this)


		var pagePanel = new Ext.Panel({
			cls:'go-form-panel',
			layout:'form',
			title: t("Page settings", "billing"),
			autoScroll:true,
			border:false,
			items:[new Ext.form.ComboBox({
				hiddenName: 'page_format',
				fieldLabel: t("Page format", "billing"),
				store: new Ext.data.SimpleStore({
					fields: ['format', 'display'],
					data : formatData
				}),
				value:'A4',
				valueField:'format',
				displayField:'display',
				mode: 'local',
				triggerAction: 'all',
				editable: false,
				selectOnFocus:true,
				forceSelection: true,
				anchor: '-20'
			}),{
				xtype: 'numberfield',
				name: 'margin_top',
				anchor: '-20',
				allowBlank:false,
				fieldLabel: t("Margin top", "billing"),
				value:30
			},{
				xtype: 'numberfield',
				name: 'margin_bottom',
				anchor: '-20',
				allowBlank:false,
				fieldLabel: t("Margin bottom", "billing"),
				value:30
			},{
				xtype: 'numberfield',
				name: 'margin_left',
				anchor: '-20',
				allowBlank:false,
				fieldLabel: t("Margin left", "billing"),
				value:30
			},{
				xtype: 'numberfield',
				name: 'margin_right',
				anchor: '-20',
				allowBlank:false,
				fieldLabel: t("Margin right", "billing"),
				value:30
			},{
				xtype:'fieldset',
				title:t("Left column coordinates", "billing"),
				autoHeight:true,
				items:[{
					xtype: 'numberfield',
					name: 'left_col_top',
					anchor: '-20',
					allowBlank:false,
					fieldLabel: t("Top", "billing"),
					value:0
				},{
					xtype: 'numberfield',
					name: 'left_col_left',
					anchor: '-20',
					allowBlank:false,
					fieldLabel: t("Left", "billing"),
					value:0
				}]
			},{
				xtype:'fieldset',
				title:t("Right column coordinates", "billing"),
				autoHeight:true,
				items:[
				{
					xtype: 'numberfield',
					name: 'right_col_top',
					anchor: '-20',
					allowBlank:false,
					fieldLabel: t("Top", "billing"),
					value:0
				},{
					xtype: 'numberfield',
					name: 'right_col_left',
					anchor: '-20',
					allowBlank:false,
					fieldLabel: t("Left", "billing"),
					value:0
				}]
			}
			]
		});
		
		if(go.Modules.isAvailable("legacy", "files")) {
			pagePanel.insert( 1,{
			  xtype: 'selectfile',
			  name: 'stationery_paper',
			  anchor: '-20',
			  fieldLabel: t("Stationery Paper", "billing"),
			  root_folder_id: GO.billing.stationeryPaperFolderId
			});
		}

		GO.billing.LogoComponent = Ext.extend(Ext.BoxComponent, {
			onRender : function(ct, position){
				this.el = ct.createChild({
					tag: 'img'
				});
				this.setVisible(false);
			},
			setSrc : function(src)
			{
				this.el.set({
					src: src
				});
				this.setVisible(true);
			}
		});

		this.logoComponent = new GO.billing.LogoComponent();

		this.deleteLogoCB = new Ext.ux.form.XCheckbox({
			boxLabel: t("Delete logo", "billing"),
			labelSeparator: '',
			name: 'delete_logo',
//			allowBlank: true,
			hideLabel:true,
			disabled:true
		});

		this.logoOnlyFirstPageCB = new Ext.ux.form.XCheckbox({
			boxLabel: t("Only show logo on the first page", "billing"),
			labelSeparator: '',
			name: 'logo_only_first_page',
//			allowBlank: true,
			hideLabel:true
		});



		var logoPanel = new Ext.Panel({
			cls:'go-form-panel',
			layout:'form',
			title: t("Logo", "billing"),
			autoScroll:true,
			border:false,
			items:[
			{
				xtype:'htmlcomponent',
				html:t("The logo can also be a full page background image. Leave the width and height at zero to make it stretch to the full page size. Look at the page settings to see the page measurements. For the best print results, it is recommended that you use an image that is twice the size that you will set here.", "billing"),
				style:'margin-bottom:15px;'
			},{
				xtype: 'numberfield',
				name: 'logo_width',
				anchor: '-20',
				allowBlank:true,
				fieldLabel: t("Logo width", "billing")
			},{
				xtype: 'numberfield',
				name: 'logo_height',
				anchor: '-20',
				allowBlank:true,
				fieldLabel: t("Logo height", "billing")
			},{
				xtype: 'numberfield',
				name: 'logo_top',
				anchor: '-20',
				allowBlank:false,
				fieldLabel: t("Top", "billing"),
				value:0
			},{
				xtype: 'numberfield',
				name: 'logo_left',
				anchor: '-20',
				allowBlank:false,
				fieldLabel: t("Left", "billing"),
				value:0
			},
			this.logoOnlyFirstPageCB,
			this.uploadFile = new GO.form.UploadFile({
				inputName : 'logo',
				max: 1
			}),{
				autoScroll:true,
				height:160,
				border:true,
				items:this.logoComponent
			},
			this.deleteLogoCB]
		});

		var textsPanel = new Ext.Panel({
			hideMode: 'offsets',
			cls:'go-form-panel',
			layout:'form',
			title: t("Texts"),
			autoScroll:true,
			border:false,
			items:[{
				xtype: 'textarea',
				name: 'footer',
				anchor: '-20',
				height: 100,
				fieldLabel: t("Footer", "billing")
			},new Ext.form.HtmlEditor({
				name: 'closing',
				anchor: '-20',
				enableFont:false,
				height: 175,
				fieldLabel: t("Closing", "billing")
			})]
		});

//                this.htmlTablePanel = new Ext.Panel({
//			hideMode: 'offsets',
//			cls:'go-form-panel',
//			layout:'form',
//                        id:'bs-html-table',
//			title: t("HTML table", "billing"),
//			autoScroll:true,
//			border:false,
//                        hidden:true,
//			items:[{
//                                xtype: 'textarea',
//				name: 'html_table',
//				anchor: '100% -75',
//				hideLabel:true,
//				plugins:new GO.plugins.InsertAtCursorTextareaPlugin()
//			}]
//		});


		this.tabPanel = new Ext.TabPanel({
			items:[
			this.propertiesPanel,
			pagePanel,
			logoPanel,
			textsPanel
//                        this.htmlTablePanel
			],
			deferredRender: false,
			anchor:'100% 100%'
		});

		this.formPanel = new Ext.form.FormPanel({
			waitMsgTarget:true,
			url: GO.settings.modules.billing.url+'action.php',
			border: false,
			fileUpload: true,
			baseParams: {
				task: 'template',
				book_id: 0
			},
			items:this.tabPanel
		});
	}
	
//	
//	,_setCostInvoice: function( isCostInvoice ) {
//		this.showUnitPrices.setDisabled(isCostInvoice);
//		this.showNetUnitPrice.setDisabled(isCostInvoice);
//		this.showProdPrices.setDisabled(isCostInvoice);
//		this.showNetTotalPrice.setDisabled(isCostInvoice);
//		this.showTotalPrices.setDisabled(isCostInvoice);
//	}
});
