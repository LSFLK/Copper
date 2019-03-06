GO.billing.MVCExportDialog = Ext.extend(GO.ExportGridDialog , {
	changeMonth : function(increment)
	{
		var date = this.startDate.getValue();
		date = date.add(Date.MONTH, increment);
		this.startDate.setValue(date.getFirstDateOfMonth().format(GO.settings.date_format));
		this.endDate.setValue(date.getLastDateOfMonth().format(GO.settings.date_format));
	},	
	initComponent : function(){
		GO.billing.MVCExportDialog.superclass.initComponent.call(this);
		
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
		/*
		this.includeCostCode = new Ext.form.Checkbox({
			name:'include_cost_codes',
			//hideLabel:true,
			fieldLabel:t("Include totals for cost codes", "billing")
		});
		*/
		this.addFormElement(panel1);
		this.addFormElement(panel2);
		//this.addFormElement(this.includeCostCode);
	},
	submitForm : function(hide) {

		var sd=this.startDate.getValue();
		if(!GO.util.empty(sd))
		{
			this.formPanel.baseParams.start_date=sd.format('U');	
			this.formPanel.baseParams.text += this.startDate.fieldLabel+': '+this.startDate.getRawValue()+"\n";
		}else
		{
			delete this.formPanel.baseParams.start_date;
		}
			
		var ed=this.endDate.getValue();
		if(!GO.util.empty(ed))
		{
			this.formPanel.baseParams.end_date=ed.format('U');
			this.formPanel.baseParams.text += this.endDate.fieldLabel+': '+this.endDate.getRawValue()+"\n";
		}else
		{
			delete this.formPanel.baseParams.end_date;
		}
		
		GO.billing.MVCExportDialog.superclass.submitForm.call(this);
	}
});/* 
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */


