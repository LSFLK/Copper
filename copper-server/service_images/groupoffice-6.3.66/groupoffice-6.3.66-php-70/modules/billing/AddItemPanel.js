/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: AddItemPanel.js 22862 2018-01-12 08:00:03Z mschering $
 * @copyright Copyright Intermesh
 * @author Merijn Schering <mschering@intermesh.nl>
 */
 
GO.billing.AddItemPanel = function(config){
	
	
	if(!config)
	{
		config={};
	}
	

	this.productFields = new GO.billing.SelectProduct({
					anchor: '100%',
					hiddenName: 'product_id',
				  allowBlank:true,
				  fieldLabel:t("Product", "billing"),
				  emptyText: t("Product catalog search", "billing")
				});
				
	this.productFields.on('select', function(combo, record){
		this.priceField.setValue();
		
		this.costField.setValue(GO.util.numberFormat(record.data.cost_price));
		this.unformattedExclPrice = record.data.list_price;
		this.vatField.setValue(GO.util.numberFormat(record.data.vat));
  	
  	this.listField.setValue(GO.util.numberFormat(this.unformattedExclPrice));
  	this.priceField.setValue(GO.util.numberFormat(this.unformattedExclPrice));
  	this.calculateInclusivePrice();
  	
  	this.descriptionField.setValue(record.data.name+"\n\n"+record.data.description);
  	
	}, this);
	

	config.layout='column',
	//config.border=false;
	config.cls='go-form-panel';
	//config.autoHeight=true;
	config.defaults={'border':false};
  config.items=[{
	  	layout: 'form',
	  	columnWidth:1,
	  	items:[this.productFields]
  	},{
	  	layout: 'form',
	  	columnWidth:.25,
	  	items:[
	  	this.amountField = new GO.form.NumberField({
				anchor: '100%',
			  fieldLabel: t("Amount", "billing"),
			  value: GO.util.numberFormat("1")
			}),this.vatField = new GO.form.NumberField({
				anchor: '100%',
			  fieldLabel: t("Tax", "billing"),
			  value: 19
			})
    	]
  	},{
	  	layout: 'form',
	  	columnWidth:.25,
	  	items:[
	  	this.priceField = new GO.form.NumberField({
				anchor: '100%',
			  fieldLabel: t("Unit price", "billing"),
			  value: GO.util.numberFormat("0")
			}),this.listField = new GO.form.NumberField({
				anchor: '100%',
			  fieldLabel: t("Unit list", "billing"),
			  value: GO.util.numberFormat("0")
			})
    	]
  	},{
	  	layout: 'form',
	  	columnWidth:.25,
	  	items:[
	  		this.costField = new GO.form.NumberField({
				anchor: '100%',
			  fieldLabel: t("Unit cost", "billing"),
			  value: GO.util.numberFormat("0")
			}),this.discountField = new GO.form.NumberField({
				anchor: '100%',
			  fieldLabel: t("Discount", "billing"),
			  value: GO.util.numberFormat("0")
			})
    	]
  	},{
	  	layout: 'form',
	  	columnWidth:.25,
	  	items:[
	  		this.totalField = new GO.form.NumberField({
				anchor: '100%',
			  fieldLabel: t("Unit total", "billing"),
			  value: GO.util.numberFormat("0")
			})
    	]
  	},{
	  	layout: 'form',
	  	columnWidth:1,
	  	items:[
	  		this.descriptionField = new Ext.form.TextArea({
					anchor: '100%',
				  allowBlank:true,
				  fieldLabel:t("Description")
				}),
				new Ext.Button({
					text: t("Add"),
					scope: this,
					handler: function(){
						var params = {
							task: 'save_item',
							order_id: this.order_id,
							amount : this.amountField.getValue(),
							vat : this.vatField.getValue(),
							unit_price : this.unformattedExclPrice,
							unit_list : this.listField.getValue(),
							unit_cost : this.costField.getValue(),
							discount : this.discountField.getValue(),
							unit_total : this.unformattedInclPrice,
							description : this.descriptionField.getValue()
						};
						
						Ext.Ajax.request({
								url: GO.settings.modules.billing.url+'action.php',
								params: params,
								scope: this,
								callback: function(options, success, response)
								{	
									if(!success)
									{
										Ext.MessageBox.alert(t("Error"), t("Could not connect to the server. Please check your internet connection."));
									}else
									{
										this.fireEvent('save');
										this.reset();
									}
								}				
							});
						}
					})
    	]
  	}   	
    ];
    
  this.priceField.on('blur', this.calculateInclusivePrice,this);
  this.vatField.on('blur', this.calculateInclusivePrice,this);
  this.totalField.on('blur', this.calculateExclusivePrice,this);
  this.discountField.on('blur', function(){
  	var discount = parseFloat(GO.util.unlocalizeNumber(this.discountField.getValue()));
  	if(discount==0)
  	{
  		return;
  	}
  	
  	if(discount>0)
  	{
  		var number = parseFloat(GO.util.unlocalizeNumber(this.listField.getValue()));
  	}else
  	{
  		var number = parseFloat(GO.util.unlocalizeNumber(this.costField.getValue()));
  	} 	
  	
  	this.unformattedExclPrice = number*((100-discount)/100);  	
  	
  	this.priceField.setValue(GO.util.numberFormat(this.unformattedExclPrice ));
  	this.calculateInclusivePrice();
  }, this);
  
	config.waitMsgTarget=true;
	
	GO.billing.AddItemPanel.superclass.constructor.call(this, config);
	
	this.addEvents({'save' : true});	
}

Ext.extend(GO.billing.AddItemPanel, Ext.Panel,{
	
	order_id : 0,
	
	unformattedInclPrice : 0,
	
	unformattedExclPrice : 0,
	
	calculateInclusivePrice : function(){  	
  	this.unformattedExclPrice = GO.util.unlocalizeNumber(this.priceField.getValue());
  	var vat = GO.util.unlocalizeNumber(this.vatField.getValue());  	
  	this.unformattedInclPrice = this.unformattedExclPrice*(1+(vat/100));  	
  	this.totalField.setValue(GO.util.numberFormat(this.unformattedInclPrice));
  },
  
  calculateExclusivePrice : function(){  	
  	this.unformattedInclPrice = GO.util.unlocalizeNumber(this.totalField.getValue());
  	var vat = GO.util.unlocalizeNumber(this.vatField.getValue());  	
  	this.unformattedExclPrice = this.unformattedInclPrice / (1+(vat/100));  	
  	this.priceField.setValue(GO.util.numberFormat(this.unformattedExclPrice ));
  },
	
	reset : function(){
		
		this.productField.reset();
		this.amountField.reset();
		this.vatField.reset();
		this.priceField.reset();
		this.listField.reset();
		this.costField.reset();
		this.discountField.reset();
		this.totalField.reset();
		this.descriptionField.reset();
	}
});
