/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @version $Id: ExpenseDialog.js 22922 2018-01-12 08:01:04Z mschering $
 * @copyright Copyright Intermesh
 * @author Merijn Schering <mschering@intermesh.nl>
 * @author WilmarVB <wilmar@intermesh.nl>
 * @author Michael de Hart <mdhart@intermesh.nl>
 */
 
GO.projects2.ExpenseDialog = Ext.extend(GO.dialog.TabbedFormDialog , {
		
	initComponent : function(){
		
		Ext.apply(this, {
			titleField:'description',
			goDialogId:'expense',
			title:t("Expense", "projects2"),
			height: 340,
			formControllerUrl: 'projects2/expense'
		});
		
		GO.projects2.ExpenseDialog.superclass.initComponent.call(this);	
	},
	buildForm : function () {

		this.propertiesPanel = new Ext.Panel({
			title:t("Properties"),
			cls:'go-form-panel',
			layout:'form',
			items:[
			{
				xtype:'hidden',
				name:'project_id'
			},
			{				
				xtype: 'datefield',
				name: 'date',
				//width:300,
				anchor: '100%',
				maxLength: 50,
				allowBlank:false,
				fieldLabel: t("Date"),
				value: new Date()
			},{				
				xtype: 'textfield',
				name: 'invoice_id',
				//width:300,
				anchor: '100%',
				maxLength: 50,
				//allowBlank:false,
				fieldLabel: t("Invoice No.", "projects2")
			},{				
				xtype: 'textfield',
				name: 'description',
				width:300,
				anchor: '100%',
				maxLength: 250,				
				fieldLabel: t("Description")
			},
			this.selectExpenseBudget = new GO.projects2.SelectExpenseBudget(),
			
			this.nettField = new GO.form.NumberField({
				fieldLabel:t("Total Nett", "projects2"),
				name:'nett'
			}),
			this.vatField = new GO.form.NumberField({
				fieldLabel:t("VAT (%)", "projects2"),
				name:'vat'
			})
//			this.fileBrowseButton = new GO.files.FileBrowserButton({
//				model_name:'GO_Projects2_Model_Expense',
//				fieldLabel : t("Attachements", "projects2")
//			})
			]				
		});

		this.addPanel(this.propertiesPanel);
	},
	
	afterLoad : function(remoteModelId, config, action){
		this.selectExpenseBudget.lastQuery = null;
		this.selectExpenseBudget.setProjectId(this.formPanel.form.findField('project_id').getValue());
//		this.fileBrowseButton.setId(remoteModelId);
	}

	
});
