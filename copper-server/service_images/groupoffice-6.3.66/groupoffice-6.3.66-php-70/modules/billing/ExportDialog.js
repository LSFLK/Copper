/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: ExportDialog.js 22862 2018-01-12 08:00:03Z mschering $
 * @copyright Copyright Intermesh
 * @author Merijn Schering <mschering@intermesh.nl>
 */
 
GO.billing.ExportDialog = Ext.extend(GO.ExportQueryDialog,{

	initComponent : function(){
		
		var now = new Date();
		var lastMonth = now.add(Date.MONTH, -1);
		var startOfLastMonth = lastMonth.getFirstDateOfMonth();
		var endOfLastMonth = lastMonth.getLastDateOfMonth();
		
		this.startDate = new Ext.form.DateField({
			name: 'start_date',
			format: GO.settings['date_format'],
			allowBlank:true,
			fieldLabel: t("Start"),
			value: startOfLastMonth.format(GO.settings.date_format)
		});

		this.endDate = new Ext.form.DateField({
			name: 'end_date',
			format: GO.settings['date_format'],
			allowBlank:true,
			fieldLabel: t("End"),
			value: endOfLastMonth.format(GO.settings.date_format)
		});
		
		
		var panel1 = {
				layout:'table',
				border:false,
				defaults:{
					border:false,
					layout:'form'
				},
				items:[
				{
					items:this.startDate
				},{
					bodyStyle:'padding-left:5px',
					items:new Ext.Button({
						text: t("Previous"),
						handler: function(){
							this.changeMonth(-1);
						},
						scope:this
					})
				}]
			};
			
		var panel2 = {
				layout:'table',
				border:false,
				defaults:{
					border:false,
					layout:'form'
				},
				items:[
				{
					items:this.endDate
				},{
					bodyStyle:'padding-left:5px',
					items:new Ext.Button({
						text: t("Next"),
						handler: function(){
							this.changeMonth(1);
						},
						scope:this
					})
				}]
			};
		
		
		this.formPanelItems.push(panel1, panel2);
		
		this.formPanelItems.push({
			xtype:'checkbox',
			name:'include_cost_codes',
			hideLabel:true,
			boxLabel:t("Include totals for cost codes", "billing")
		});
		
		
		GO.billing.ExportDialog.superclass.initComponent.call(this);
	},
	
	changeMonth : function(increment)
	{
		var date = this.startDate.getValue();
		date = date.add(Date.MONTH, increment);
		this.startDate.setValue(date.getFirstDateOfMonth().format(GO.settings.date_format));
		this.endDate.setValue(date.getLastDateOfMonth().format(GO.settings.date_format));
	},
	
	beforeRequest : function(){
		
		GO.billing.ExportDialog.superclass.beforeRequest.call(this);
		
		this.loadParams.text = '';
		var sd=this.startDate.getValue();
		if(!GO.util.empty(sd))
		{
			this.loadParams.start_date=sd.format('U');	
			this.loadParams.text += this.startDate.fieldLabel+': '+this.startDate.getRawValue()+"\n";
		}else
		{
			delete this.loadParams.start_date;
		}
			
		var ed=this.endDate.getValue();
		if(!GO.util.empty(ed))
		{
			this.loadParams.end_date=ed.format('U');
			this.loadParams.text += this.endDate.fieldLabel+': '+this.endDate.getRawValue()+"\n";
		}else
		{
			delete this.loadParams.end_date;
		}
		
		if(!GO.util.empty(this.searchQuery))
		{
			this.loadParams.subtitle=t("search query")+': '+this.searchQuery;
		}
		
		
	}
});
