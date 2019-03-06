/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: ItemsGroupDialog.js
 * @copyright Copyright Intermesh
 * @author Wilmar van Beusekom <wilmar@intermesh.nl>
 * @author Merijn Schering <mschering@intermesh.nl>
 */
 
GO.billing.ItemsGroupDialog = Ext.extend(GO.dialog.TabbedFormDialog , {
	initComponent : function(){
		
		Ext.apply(this, {
			title:t("Item group", "billing"),
			formControllerUrl: 'billing/itemGroup',
			loadOnNewModel:false,
			height:440
		});
		
		GO.billing.ItemsGroupDialog.superclass.initComponent.call(this);	
	},
	buildForm : function () {

		this.propertiesPanel = new Ext.Panel({
			cls:'go-form-panel',waitMsgTarget:true,			
			layout:'form',
			autoScroll:true,
			items:[{
				xtype: 'textfield',
			  name: 'name',
				anchor: '100%',
			  allowBlank:false,
			  fieldLabel: t("Name")
			},this.summarizeCB = new Ext.ux.form.XCheckbox({
				hideLabel: true,
				boxLabel: t("Summarize items in bills", "billing"),
				name: 'summarize'
			}),this.showIndividualCB = new Ext.ux.form.XCheckbox({
				hideLabel: true,
				boxLabel: t("Show individual item prices in this group", "billing"),
				name: 'show_individual_prices',
				checked: true
			}),{
				xtype:'hidden',
				name:'order_id'
			}]
				
		});

		this.summarizeCB.on('check',function(cb,checked){
			if (checked)
				this.showIndividualCB.setValue(true);
			this.showIndividualCB.setDisabled(checked);
		},this);

		this.addPanel(this.propertiesPanel);	
// 
//    this.addPermissionsPanel(new GO.grid.PermissionsPanel());    
	}
});
