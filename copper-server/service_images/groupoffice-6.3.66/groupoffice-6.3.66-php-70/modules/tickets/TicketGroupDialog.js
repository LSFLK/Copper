/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version
 * @copyright Copyright Intermesh
 * @author Wilmar van Beusekom <wilmar@intermesh.nl>
 */

GO.tickets.TicketGroupDialog = Ext.extend(GO.dialog.TabbedFormDialog , {

	initComponent : function(){

		Ext.apply(this, {
			goDialogId: 'ticketgroup',
			title: t("Ticket group", "tickets"),
			formControllerUrl: 'tickets/ticketGroup',
			height:600
		});

		GO.tickets.TicketGroupDialog.superclass.initComponent.call(this);
	},
	afterLoad : function(ticketId,config,action){
		if (ticketId>0) {
			this.permissionsPanel.setAcl(action.result.data.acl_id);
		} else {			
			this.permissionsPanel.setAcl(0);	
		}
		this.permissionsPanel.loadAcl();
	},
	afterSubmit : function(action) {
			this.permissionsPanel.setAcl(action.result.acl_id);
	},

	buildForm : function () {

		this.setSize(this.width,550);
		this.addPanel(
			this.propertiesPanel = new Ext.Panel({
				layout:'border',
				items:[{
					region:'north',
					layout:'form',
					height:35,
					cls:'go-form-panel',					
					items:[this.nameField = new Ext.form.TextField({
						name: 'name',
						width: 300,
						anchor: '100%',
						maxLength: 100,
						allowBlank:false,
						fieldLabel: t("Name")
					})]
				},			
				this.permissionsPanel = new GO.grid.PermissionsPanel({
					region:'center',
					hideLevel:true,
					title:t("Permissions"),
					border: true
				})]
			}));
	},
	setCompanyId : function(company_id) {
		this.companyId = company_id;
		this.formPanel.form.baseParams['company_id'] = company_id;
	}
});
