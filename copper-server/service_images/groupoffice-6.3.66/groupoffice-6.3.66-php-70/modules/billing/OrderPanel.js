GO.billing.OrderPanel = Ext.extend(GO.DisplayPanel,{
	
	model_name : "GO\\Billing\\Model\\Order",

	stateId : 'bs-order-panel',

	editGoDialogId : 'order',
	
	editHandler : function(){
		if(this.data.read_only != '1'){
			GO.billing.showOrderDialog(this.link_id);
		}
	},
	initComponent : function(){
	
		this.loadUrl=("billing/order/display");


		this.orderStatusesStore = new GO.data.JsonStore({
			url: GO.url('billing/status/store'),
			baseParams: {
				task: 'order_statuses',
				book_id: 0
			},
			root: 'results',
			id: 'id',
			totalProperty:'total',
			fields: ['id','name', 'status_with_count', 'checked', 'ask_to_notify_customer'],
			remoteSort: true
		});
	
		this.template =
			
		'<table class="display-panel" cellpadding="0" cellspacing="0" border="0">'+
		'<tr>'+
			'<td colspan="2" class="display-panel-heading">'+t("Invoice/Quote", "billing")+': {order_id}</td>'+
		'</tr>'+
		'<tr><td valign="top">'+

		'<table class="display-panel" cellpadding="0" cellspacing="0" border="0">'+
		/*'<tr>'+
		'<td colspan="2" class="display-panel-heading">'+		
		'<tpl if="!GO.util.empty(order_id)">'+
			t("Information about", "billing")+' {order_id}</td>'+
		'</tpl>'+
		'<tpl if="!!GO.util.empty(order_id)">'+
			t("Scheduled order", "billing")+
		'</tpl>'+
		'</tr>'+*/
					
		'<tpl if="!GO.util.empty(reference)">'+
		'<tr>'+
		'<td>'+t("Reference", "billing")+':</td><td>{reference}</td>'+
		'</tr>'+
		'</tpl>'+
					
		'<tpl if="!GO.util.empty(btime)">'+
		'<tr>'+
		'<td>'+t("Date", "billing")+':</td><td>{btime}</td>'+
		'</tr>'+
		'</tpl>'+
					
					
				
		'<tr>'+
		'<td>'+t("Status", "billing")+':</td><td>{status_name}</td>'+
		'</tr>'+
					

		'<tpl if="!GO.util.empty(po_id)">'+
		'<tr>'+
		'<td>'+t("Purchase order", "billing")+':</td><td>{po_id}</td>'+
		'</tr>'+
		'</tpl>'+
		
		'<tr>'+
		'<td>'+t("Book", "billing")+':</td><td>{book_name}</td>'+
		'</tr>'+
					
					
		'<tpl if="!GO.util.empty(recur_type)">'+
		'<tr>'+
		'<td>'+t("Recur", "billing")+':</td><td>{[this.showRecurrence(values)]}</td>'+
		'</tr>'+
		'</tpl>'+


		'<tpl if="!GO.util.empty(payment_method)">'+
		'<tr>'+
		'<td>'+t("Payment method", "billing")+':</td><td>{payment_method}</td>'+
		'</tr>'+
		'</tpl>'+
					
					


		'<tr><td colspan="2">&nbsp;</td></tr>'+
		'<tr>'+
		'<td>'+t("Owner")+':</td><td>{user_name}</td>'+
		'</tr>'+
		
		'<tpl if="show_sales_agents &gt; 0">'+
		
			'<tpl if="!GO.util.empty(telesales_agent_name)">'+
				'<tr>'+
					'<td>'+t("Phone sales agent", "billing")+':</td><td>{telesales_agent_name}</td>'+
				'</tr>'+
			'</tpl>'+

			'<tpl if="!GO.util.empty(fieldsales_agent_name)">'+
				'<tr>'+
					'<td>'+t("Field sales agent", "billing")+':</td><td>{fieldsales_agent_name}</td>'+
				'</tr>'+
			'</tpl>'+
			
		'</tpl>'+
		
		'</table>'+

		'</td><td valign="top">'+

		'<table class="display-panel" cellpadding="0" cellspacing="0" border="0">'+
		'<tr>'+
		'<td colspan="2">'+
		'<tpl if="company_id &gt; 0"><a href="#company/{company_id}"></tpl>'+
		'{customer_name}'+
		'<tpl if="company_id &gt; 0"></a></tpl>'+
		'<br />'+
		'<tpl if="!GO.util.empty(customer_contact_name)">'+
			'<tpl if="contact_id &gt; 0"><a href="#contact/{contact_id}"></tpl>'+
			'{customer_contact_name}'+
			'<tpl if="contact_id &gt; 0"></a></tpl>'+
			'<br />'+
		'</tpl>'+
		'<br />'+
		
		'<tpl if="!GO.util.empty(customer_email)">'+
		'{[GO.mailTo(values.customer_email)]}'+
		'</tpl>'+
		'</td>'+
		'</tr>'+
		'<tpl if="!GO.util.empty(customer_vat_no)">'+
		'<tr>'+
		'<td>'+t("VAT no.", "billing")+':</td><td>{customer_vat_no}</td>'+
		'</tr>'+
		'</tpl>';
		
		if(go.Modules.isAvailable("legacy", "projects2")){
			this.template += '<tpl if="!GO.util.empty(project_name)">'+
			'<tr>'+
			'<td>'+t("Project", "projects2")+':</td><td><a href="#project/{project_id}">{project_name}</a></td>'+
			'</tr></tpl>';
		}
		
		this.template += '</table>'+
		'</td></tr>'+
		'</table>'+

		'<table class="display-panel" cellpadding="0" cellspacing="0" border="0">'+
			'<tr>'+
				'<td colspan="2" class="display-panel-heading">'+t("Address")+'</td>'+
			'</tr>'+
			'<tr>'+
				'<td class="table_header_links" valign="top">'+t("Customer address", "billing")+'</td><td class="table_header_links" valign="top">'+t("Shipping address", "billing")+'</td>'+
			'</tr>'+
			'<tr>'+
				'<td valign="top">'+
					
					'{customer_to}'+
					'<br />'+
					'<tpl if="!GO.util.empty(google_maps_link)">'+
						'<a href="{google_maps_link}" target="_blank">'+
					'</tpl>'+
					'{formatted_address}'+
					'<tpl if="!GO.util.empty(google_maps_link)">'+
						'</a>'+
					'</tpl>'+
					
				'</td>'+
				'<td valign="top">'+
					'<tpl if="!GO.util.empty(other_shipping_address)">'+
					
						'{shipping_to}'+
						'<br />'+
						'<tpl if="!GO.util.empty(shipping_google_maps_link)">'+
							'<a href="{shipping_google_maps_link}" target="_blank">'+
						'</tpl>'+
						'{formatted_shipping_address}'+
						'<tpl if="!GO.util.empty(shipping_google_maps_link)">'+
							'</a>'+
						'</tpl>'+	
						
					'</tpl>'+	
					
					'<tpl if="GO.util.empty(other_shipping_address)">'+
						
						'{customer_to}'+
						'<br />'+
						'<tpl if="!GO.util.empty(google_maps_link)">'+
							'<a href="{google_maps_link}" target="_blank">'+
						'</tpl>'+
						'{formatted_address}'+
						'<tpl if="!GO.util.empty(google_maps_link)">'+
							'</a>'+
						'</tpl>'+
						
					'</tpl>'+	
					
				'</td>'+
			'</tr>'+
			'<tr>'+
		'</table>'+

		'<tpl if="status_history.length">'+

		'<table class="display-panel bs-display-items" cellpadding="0" cellspacing="0" border="0">'+
		//LINK DETAILS
		'<tr>'+
		'<td colspan="4" class="display-panel-heading">'+t("Order status history", "billing")+'</td>'+
		'</tr>'+

		'<tr>'+
		'<td class="table_header_links">'+t("Status", "billing")+'</td>'+
		'<td class="table_header_links">' + t("Owner") + '</td>'+
		'<td class="table_header_links" style="width:100px">'+t("Created at")+'</td>'+
		'<td class="table_header_links" style="width:50px">'+t("Notified", "billing")+'</td>'+
		'</tr>'+

		'<tpl for="status_history">'+
		'<tr id="pm-status-history-{id}">'+
		'<td>{status_name}</td>'+
		'<td>{user_name}</div></td>'+
		'<td>{ctime}</td>'+
		'<td><tpl if="notified&gt;0"><div class="go-grid-icon btn-ok"><a onclick="GO.linkHandlers[\'GO\\\\\\\\Savemailas\\\\\\\\Model\\\\\\\\LinkedEmail\'].call(this, 0, {action:\'path\', path: \'{[Ext.util.Format.htmlEncode(values.notification_email)]}\'});"><i class="icon">mail</i></a></div></tpl></td>'+
		'</tr>'+

		'</tpl>'+
		'</table>'+

		'</tpl>'+


					
		'<tpl if="items.length">'+

		'<table class="display-panel bs-display-items" cellpadding="0" cellspacing="0" border="0">'+
		//LINK DETAILS
		'<tr>'+
		'<td colspan="7" class="display-panel-heading">'+t("Items", "billing")+'</td>'+
		'</tr>'+
						
		'<tr>'+
		'<td class="table_header_links" style="width:16px">'+t("Amount", "billing")+'</td>'+
		'<td class="table_header_links" style="width:16px">'+t("Delivered", "billing")+'</td>'+
		'<td class="table_header_links">' + t("Description") + '</td>'+
		'<td class="table_header_links">'+t("Unit price", "billing")+'</td>'+
		'<td class="table_header_links">'+t("Sub-total", "billing")+'</td>'+
//		'<td class="table_header_links">'+t("Total", "billing")+'</td>'+
//		'<td class="table_header_links">'+t("Cost code", "billing")+'</td>'+
		'</tr>'+
											
		'<tpl for="items">'+
		'<tr id="pm-item-row-{id}">'+
		'<td style="width:16px">{amount}</td>'+
		'<td style="width:16px">{amount_delivered}</td>'+
		'<td>{description}</div></td>'+
		'<td style="white-space:nowrap">{unit_price}</td>'+
		'<td style="white-space:nowrap">{subtotal}</td>'+
//		'<td style="white-space:nowrap">{total}</td>'+
//		'<td style="white-space:nowrap">{cost_code}</td>'+
		'</tr>'+
													
		'</tpl>'+
		'</table>'+
					
		'</tpl>'+
		
		
					
		'<table class="display-panel" cellpadding="0" cellspacing="0" border="0">'+
		'<tr>'+
		'<td colspan="2" class="display-panel-heading">Totals</td>'+
		'</tr>'+
		'<tr>'+
		'<td>'+t("Costs", "billing")+':</td><td>{costs}</td>'+
		'</tr>'+
		'<tr>'+
		'<td>'+t("Sub-total", "billing")+':</td><td>{subtotal}</td>'+
		'</tr>'+
		'<tr>'+
		'<td>'+t("Tax", "billing")+':</td><td>{vat}</td>'+
		'</tr>'+

		'<tr>'+
		'<td>'+t("Total", "billing")+':</td><td>{total}</td>'+
		'</tr>'+
	
		'<tpl if="frontpage_text.length && frontpage_text!=\'&lt;br&gt;\' && frontpage_text!=\'&lt;br /&gt;\'">'+
		'<tr>'+
		'<td colspan="2" class="display-panel-heading">'+t("Frontpage", "billing")+'</td>'+
		'</tr>'+
		'<tr>'+
		'<td colspan="2">{frontpage_text}</td>'+
		'</tr>'+
		'</tpl>'+

		'</table>'+
	
		'<table class="display-panel bs-display-payments" cellpadding="0" cellspacing="0" border="0">'+
		'<tr>'+
		'<td colspan="2" class="display-panel-heading">'+t("Payments", "billing")+'</td>'+
		'</tr>'+
		'<tr>'+
		'<td class="table_header_links" style="width:16px">'+t("Date")+'</td>'+
		'<td class="table_header_links" style="width:16px">'+t("Amount", "billing")+'</td>'+
		'</tr>'+
		'<tpl if="payments.length">'+
		'<tpl for="payments">'+
		'<tr id="pm-payment-row-{id}">'+
		'<td style="width:16px">{date}</td>'+
		'<td style="width:16px">{amount}</td>'+
		'</tr>'+
		'</tpl>'+
		'</tpl>'+
		'<tr style="border-top: 1px solid black;">'+
		'<td>'+t("Total paid", "billing")+':</td><td>{total_paid}</td>'+
		'</tr>'+
		'<tr>'+
		'<td>'+t("Total outstanding", "billing")+':</td><td>{total_outstanding}</td>'+
		'</tr>'+
		'<tr><td colspan="2"><a class="display-panel-browse" onclick="GO.billing.addPayment({id});">'+t("Add Payment", "billing")+'</a></td></tr>'+
		
		'</table>';
		
		this.template +=GO.customfields.displayPanelTemplate;
		

		if(go.Modules.isAvailable("legacy", "workflow")){
			this.template +=GO.workflow.WorkflowTemplate;
		}

		if(go.Modules.isAvailable("legacy", "lists"))
			this.template += GO.lists.ListTemplate;

		Ext.apply(this.templateConfig,{
	  	
			showRecurrence : function(values)
			{
				var order_id = values.recurred_order_id;
				var d = values.recur_number+' ';
				switch(values.recur_type){
					case 'W':
						d+=t("Weeks");
						break;
					case 'M':
						d+=t("months");
						break;
					case 'Y':
						d+=t("Years");
						break;
				}
	  		
				return '<a href="#order/'+order_id+'">'+d+'</a>';
			}
		});
						
		GO.billing.OrderPanel.superclass.initComponent.call(this);
		
		
	},
	
	reset : function(){
		
		this.getTopToolbar().setDisabled(true);
		GO.billing.OrderPanel.superclass.reset.call(this);
	},

	getFile : function(order_id, is_pdf, status_id)
	{
		if(!status_id)
			status_id = 0;
		
		if(is_pdf){
			window.open(GO.url('billing/order/pdf',{id:order_id,status_id:status_id}));
		}else{
			GO.request({
				params:{
					id: order_id,
					status_id : status_id
				},
				url:"billing/order/odf",
				success: function(response, options, result){
					GO.files.openFile({id: result.file_id});															
				},
				scope:this
			});
		}		
	},
	
	createTopToolbar : function(){

		if (GO.util.empty(this.extraMenuItems)) // used in MainPanel.js of order planning module
			this.extraMenuItems = new Array();

		var tbar = GO.billing.OrderPanel.superclass.createTopToolbar.call(this);

		var menuItems = [{
					iconCls: 'filetype-pdf',
					text: 'PDF',
					handler: function()
					{
//						if(GO.billing.isPurchaseOrderBook)
//						{
//							this.createPurchaseOrders(1, this.data.id);
//						}else
//						{
							if(this.data.status_id>0)
							{
								this.getFile(this.data.id, true);
							}else
							{
								this.showOrderStatusSelect(true);
							}
//						}
					},
					scope: this
				},{
					iconCls: 'filetype-doc',
					text: 'Document',
					handler: function()
					{
						if(!GO.util.empty(this.data.is_purchase_order_book))
						{
							if(this.data.status_id>0)
								this.createPurchaseOrders(0, this.data.id);
							else
								alert("Please assign a status to the order first");
						}else
						{
							if(this.data.status_id>0)
							{
								this.getFile(this.data.id);
							}else
							{
								this.showOrderStatusSelect(false);
							}
						}
					},
					scope: this
				},{
					iconCls: 'bs-send-email',
					text: t("E-mail"),
					cls: 'x-btn-text-icon',
					handler: function(){
						if(!GO.settings.modules.email)
						{
							GO.errorDialog.show(t("E-mail module is not installed.", "billing"));
						}else
						{
							if(this.data.status_id>0)
							{
								GO.email.showComposer({
									link_config:this.newMenuButton.menu.link_config,
									loadUrl: GO.url("billing/order/send"),
									loadParams:{
										id: this.data.id
									},
									template_id: 0,									
									disableTemplates:true
								});
							}else
							{
								this.showOrderStatusSelect(true, true);
							}
						}
						
					},
					scope:this
				},{
					iconCls: 'bs-duplicate',
					text: t("Duplicate", "billing"),
					cls: 'x-btn-text-icon',
					handler: function(){
						
						GO.mainLayout.tabPanel.setActiveTab('go-module-panel-billing');
						
						GO.billing.duplicateDialog.show(this.data.id, this.data.book_id);
					},
					scope:this
				},this.deliveryButton = new Ext.menu.Item({
					iconCls: 'bs-duplicate',
					text: t("Delivery", "billing"),
					cls: 'x-btn-text-icon',
					handler: function(){                       
						if(!GO.billing.deliveryDialog)
						{
							GO.billing.deliveryDialog = new GO.billing.DeliveryDialog();
						}

						GO.billing.deliveryDialog.show(this.data.id);
                        
					},
					scope:this
				}),{
					iconCls: 'bs-duplicate', //  <- NOT DUPLICATE  CHANGE STATUS!!!
					text: t("Change status", "billing"),
					cls: 'x-btn-text-icon',
					menu: this.statusMenu = new Ext.menu.Menu({
						/*items: [
							{
								text: 'Aero Glass',
								checked: true,
								group: 'theme',
								checkHandler: onItemCheck
							}, {
								text: 'Vista Black',
								checked: false,
								group: 'theme',
								checkHandler: onItemCheck
							}, {
								text: 'Gray Theme',
								checked: false,
								group: 'theme',
								checkHandler: onItemCheck
							}, {
								text: 'Default Theme',
								checked: false,
								group: 'theme',
								checkHandler: onItemCheck
							}
						]*/
						})
				}];

		for (var i=0; i<this.extraMenuItems.length; i++) {
			menuItems.push(this.extraMenuItems[i]);
		}
		
		
		this.actionsButton = new Ext.menu.Item({
			iconCls: 'btn-actions',
			text: t("Actions"),
			menu: new Ext.menu.Menu({
				items: menuItems
			})
		});
		
		this.moreButton.menu.items.removeAt(0); // Remove printer button

		this.moreButton.menu.add(menuItems);

		return tbar;
	},    
	
	showOrderStatusSelect : function(pdf, email){
		this.is_pdf=pdf;
		this.email=email
		if(!this.orderStatusWindow)
		{
			this.orderStatusWindow = new GO.billing.OrderStatusWindow({
				scope:this,
				handler:function(status_id){
					if(this.email){
						GO.email.showComposer({
							link_config:this.newMenuButton.menu.link_config,
							loadUrl: GO.url("billing/order/send"),
							loadParams:{
								id: this.data.id,
								status_id: status_id
							},
							template_id: 0
						});
					}else
					{
						this.getFile(this.data.id, this.is_pdf, status_id);
					}
				}
			});
		}	
		
		this.orderStatusWindow.show();
	},    
    
	createPurchaseOrders : function(is_pdf, order_id)
	{
		GO.request({
			url:"billing/order/createPurchaseOrderDocuments",
			params:{			
				id:order_id,
				is_pdf: is_pdf
			},
			success: function(response, options, result){
				this.reload();
				Ext.Msg.alert(t("Success"), result.feedback);
			},
			scope:this
		});
	},
	
	
	getLinkName : function(){

		if(!this.data.order_id){
			return t("Scheduled order", "billing");
		} else {
			return this.data.order_id;
		}
	},

	setStatusMenu : function(refresh){

		if(this.orderStatusesStore.baseParams.book_id!=this.data.book_id || refresh){
			this.orderStatusesStore.baseParams.book_id=this.data.book_id;
			this.orderStatusesStore.load({
				callback:function(){
					this.statusMenu.removeAll();
					this.suppressCheck=true;
					this.orderStatusesStore.each(function(r)
					{
						this.statusMenu.add({
							text:r.data.name,
							status_id:r.data.id,
							group:'status-'+this.getId(),
							checked:this.data.status_id==r.data.id,
							checkHandler:function(i){
								if(!this.suppressCheck){

									var changeStatus = function(id, status, notify) {
										GO.request({

												maskEl:Ext.getBody(),
												url:"billing/order/submit",
												params:{                                                    
													id: id,
													status_id:status,
													notify_customer: notify
												},
												success:function(options, response, data){

                                                    
													if(!data.success)
													{
														GO.errorDialog.show(data.feedback);
                                                                                                                
														this.suppressCheck=true;
														this.statusMenu.items.each(function(i){
															i.setChecked(i.status_id==this.data.status_id, true);
														}, this);
														this.suppressCheck=false;
													}else
													{
														this.reload();
														//check if it's not a popup

														var billing = GO.mainLayout.getModulePanel('billing');

														if(billing.centerPanel.store.baseParams.book_id==this.data.book_id){
															billing.centerPanel.store.reload();
														}
														if (!GO.util.empty(data.showTaskId)) {
															go.Router.goto("task/" + data.showTaskId);
														}
													}
												},
												scope:this
											});
									}.createDelegate(this);
									
									if(r.data.ask_to_notify_customer) {
										Ext.Msg.show({
											modal:false,
											title:t("Notify customer?", "billing"),
											msg: t("Do you want to send an e-mail to the customer about this status change?", "billing"),
											buttons: Ext.Msg.YESNOCANCEL,
											fn: function(btn){
												if(btn=='cancel'){

													//reset the checked item
													this.suppressCheck=true;
													this.statusMenu.items.each(function(i){
														i.setChecked(i.status_id==this.data.status_id, true);
													}, this);
													this.suppressCheck=false;

													return false;
												}
												changeStatus(this.data.id, i.status_id, btn=='yes' ? 1 : 0);
											},
											scope:this,
											icon: Ext.MessageBox.QUESTION
										});
									} else {
										changeStatus(this.data.id, i.status_id, 0);
									}
								}
							},
							scope:this
						});
					}, this);
					this.suppressCheck=false;
				},
				scope:this
			});
			
		}else
		{
			this.suppressCheck=true;
			this.statusMenu.items.each(function(i){
				i.setChecked(i.status_id==this.data.status_id, true);
			}, this);
			this.suppressCheck=false;
		}
	},
	
	setData : function(data)
	{
		GO.billing.OrderPanel.superclass.setData.call(this, data);

//		var title = !GO.util.empty(data.order_id) ? t("Information about", "billing")+' '+data.order_id : t("Scheduled order", "billing");
//		this.setTitle(title);
		
		this.setStatusMenu();
		
		this.getTopToolbar().setDisabled(!data.write_permission);
		if(this.data.read_only == '1')
			this.editButton.disable();

		this.deliveryButton.setVisible(data.is_purchase_order_book);
        
		if(data.write_permission)
		{
			if(this.scheduleCallItem)
			{
				this.scheduleCallItem.setLinkConfig({
					name: this.data.customer_contact_name,
					model_id: this.data.contact_id,
					model_name:"GO\\Addressbook\\Model\\Contact",
					callback:this.reload,
					scope: this
				});
			}
		}
	}
});

/**
 * Show a dialog to add payments to the given order
 * 
 * @param int orderId
 * @returns {undefined}
 */
GO.billing.addPayment = function(orderId) {
	
	if(!this.paymentDialog){
		this.paymentDialog = new GO.billing.PaymentDialog();
	}
		
	this.paymentDialog.setOrderId(orderId);
	this.paymentDialog.show();		
};
