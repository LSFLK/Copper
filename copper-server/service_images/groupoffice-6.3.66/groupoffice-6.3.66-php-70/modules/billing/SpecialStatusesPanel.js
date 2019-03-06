GO.billing.SpecialStatusesPanel = function(config){
	
	
	if(!config)
	{
		config={};
	}

        config.title=t("Special statuses", "billing");
	config.layout='form';
        config.border=false;
        config.cls='go-form-panel';
        config.labelWidth=200;
		
	config.items=[                
                this.selectBackOrderStatus = new Ext.form.ComboBox({
                        hiddenName: 'backorder_status_id',
                        fieldLabel: t("Backorder status", "billing"),
                        store: GO.billing.orderStatusSelectStore,
                        valueField:'id',
                        displayField:'name',
                        mode: 'remote',
                        triggerAction: 'all',
                        editable: false,
                        selectOnFocus:true,
                        forceSelection: true,
                        anchor:'80%'
                }),
                this.selectDeliveredStatus = new Ext.form.ComboBox({
                        hiddenName: 'delivered_status_id',
                        fieldLabel: t("Delivery status", "billing"),
                        store: GO.billing.orderStatusSelectStore,
                        valueField:'id',
                        displayField:'name',
                        mode: 'remote',
                        triggerAction: 'all',
                        editable: false,
                        selectOnFocus:true,
                        forceSelection: true,
                        anchor:'80%'
                })
//                this.selectReversalStatus = new Ext.form.ComboBox({
//                        hiddenName: 'reversal_status_id',
//                        fieldLabel: t("Reversal status", "billing"),
//                        store: GO.billing.orderStatusSelectStore,
//                        valueField:'id',
//                        displayField:'name',
//                        mode: 'remote',
//                        triggerAction: 'all',
//                        editable: false,
//                        selectOnFocus:true,
//                        forceSelection: true,
//                        anchor:'80%'
//                })
        ];
	
	GO.billing.SpecialStatusesPanel.superclass.constructor.call(this, config);

}

Ext.extend(GO.billing.SpecialStatusesPanel, Ext.Panel,{

	onShow : function()
	{
		GO.billing.SpecialStatusesPanel.superclass.onShow.call(this);
	}
});
