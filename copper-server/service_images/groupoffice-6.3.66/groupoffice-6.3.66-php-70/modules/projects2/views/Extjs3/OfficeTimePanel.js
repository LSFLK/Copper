/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: OfficeTimePanel.js 22922 2018-01-12 08:01:04Z mschering $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */
GO.projects2.OfficeTimePanel = Ext.extend(Ext.Panel, {
  initComponent: function() {

    Ext.apply(this, {
		title:t("Office time", "projects2"),
		layout: 'form',
		cls:'go-form-panel',
		items:[
		  {
			xtype: 'compositefield',
			fieldLabel: '',
			items: [
			  {xtype: 'displayfield', value: t("From", "projects2")+":", width:80},
			  {xtype: 'displayfield', value: t("Till", "projects2")+":", width:80},
			  {xtype: 'displayfield', value: t("Internal overtime rate", "projects2")+":", width:140},
			  {xtype: 'displayfield', value: t("External overtime rate", "projects2")+":", width:140}
			]
		  },{
			xtype: 'compositefield',
			fieldLabel: t("full_days")[1],
			items: [
			  {xtype: 'gotimefield',name: 'tr_monday_start'},
			  {xtype: 'gotimefield',name: 'tr_monday_end'},
			  {xtype: 'numberfield',name: 'tr_monday_internal_overtime', width:120, emptyText: '1'},{xtype:'displayfield',value:'x',width: 20},
			  {xtype: 'numberfield',name: 'tr_monday_external_overtime', width:120, emptyText: '1'},{xtype:'displayfield',value:'x',width: 20}
			]
		  },{
			xtype: 'compositefield',
			fieldLabel: t("full_days")[2],
			items: [
			  {xtype: 'gotimefield',name: 'tr_tuesday_start'},
			  {xtype: 'gotimefield',name: 'tr_tuesday_end'},
			  {xtype: 'numberfield',name: 'tr_tuesday_internal_overtime', width:120, emptyText: '1'},{xtype:'displayfield',value:'x',width: 20},
			  {xtype: 'numberfield',name: 'tr_tuesday_external_overtime', width:120, emptyText: '1'},{xtype:'displayfield',value:'x',width: 20}
			]
		  },{
			xtype: 'compositefield',
			fieldLabel: t("full_days")[3],
			items: [
			  {xtype: 'gotimefield',name: 'tr_wednesday_start'},
			  {xtype: 'gotimefield',name: 'tr_wednesday_end'},
			  {xtype: 'numberfield',name: 'tr_wednesday_internal_overtime', width:120, emptyText: '1'},{xtype:'displayfield',value:'x',width: 20},
			  {xtype: 'numberfield',name: 'tr_wednesday_external_overtime', width:120, emptyText: '1'},{xtype:'displayfield',value:'x',width: 20}
			]
		  },{
			xtype: 'compositefield',
			fieldLabel: t("full_days")[4],
			items: [
			  {xtype: 'gotimefield',name: 'tr_thursday_start'},
			  {xtype: 'gotimefield',name: 'tr_thursday_end'},
			  {xtype: 'numberfield',name: 'tr_thursday_internal_overtime', width:120, emptyText: '1'},{xtype:'displayfield',value:'x',width: 20},
			  {xtype: 'numberfield',name: 'tr_thursday_external_overtime', width:120, emptyText: '1'},{xtype:'displayfield',value:'x',width: 20}
			]
		  },{
			xtype: 'compositefield',
			fieldLabel: t("full_days")[5],
			items: [
			  {xtype: 'gotimefield',name: 'tr_friday_start'},
			  {xtype: 'gotimefield',name: 'tr_friday_end'},
			  {xtype: 'numberfield',name: 'tr_friday_internal_overtime', width:120, emptyText: '1'},{xtype:'displayfield',value:'x',width: 20},
			  {xtype: 'numberfield',name: 'tr_friday_external_overtime', width:120, emptyText: '1'},{xtype:'displayfield',value:'x',width: 20}
			]
		  },{
			xtype: 'compositefield',
			fieldLabel: t("full_days")[6],
			items: [
			  {xtype: 'gotimefield',name: 'tr_saturday_start'},
			  {xtype: 'gotimefield',name: 'tr_saturday_end'},
			  {xtype: 'numberfield',name: 'tr_saturday_internal_overtime', width:120, emptyText: '1'},{xtype:'displayfield',value:'x',width: 20},
			  {xtype: 'numberfield',name: 'tr_saturday_external_overtime', width:120, emptyText: '1'},{xtype:'displayfield',value:'x',width: 20}
			]
		  },{
			xtype: 'compositefield',
			fieldLabel: t("full_days")[0],
			items: [
			  {xtype: 'gotimefield',name: 'tr_sunday_start'},
			  {xtype: 'gotimefield',name: 'tr_sunday_end'},
			  {xtype: 'numberfield',name: 'tr_sunday_internal_overtime', width:120, emptyText: '1'},{xtype:'displayfield',value:'x',width: 20},
			  {xtype: 'numberfield',name: 'tr_sunday_external_overtime', width:120, emptyText: '1'},{xtype:'displayfield',value:'x',width: 20}
			]
		  }]
	});
	
	GO.projects2.OfficeTimePanel.superclass.initComponent.call(this);
  }
});
