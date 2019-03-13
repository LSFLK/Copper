/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * This is the dialog that shows up when double clicking a template
 * Was converted to a TabbedFormDialog at Nov 14 2012
 *
 * @version $Id: SettingsDialog.js 22939 2018-01-12 08:01:21Z mschering $
 * @copyright Copyright Intermesh
 * @author Michael de Hart <mdhart@intermesh.nl>
 */
GO.timeregistration2.SettingsDialog = Ext.extend(GO.dialog.TabbedFormDialog, {
  initComponent: function() {

    Ext.apply(this, {
      goDialogId: 'tr-settings-dialog',
      layout: 'fit',
      title: t("Administration"),
      width: 700,
      height: 500,
      resizable: false,
      formControllerUrl: 'timeregistration2/settings'
    });

    GO.timeregistration2.SettingsDialog.superclass.initComponent.call(this);
  },
  
  buildForm: function() {
	
	this.propertiesPanel = new Ext.Panel({
		title:t("Settings"),
		layout: 'form',
		cls:'go-form-panel',
		items:[new Ext.form.ComboBox({
			fieldLabel : t("Round time input to every", "timeregistration2"),
			hiddenName : 'tr_roundMinutes',
			triggerAction : 'all',
			editable : false,
			selectOnFocus : true,
			width : 148,
			forceSelection : true,
			mode : 'local',
			value : GO.timeregistration2.roundMinutes,
			valueField : 'value',
			displayField : 'text',
			store : new Ext.data.SimpleStore({
				fields : ['value', 'text'],
				data : [ [0, t("no rounding", "timeregistration2")],
				[5, '5 '+t("Minutes", "timeregistration2")],
				[6, '6 '+t("Minutes", "timeregistration2")],
				[10, '10 '+t("Minutes", "timeregistration2")],
				[15, '15 '+t("Minutes", "timeregistration2")],
				[20, '20 '+t("Minutes", "timeregistration2")],
				[30, '30 '+t("Minutes", "timeregistration2")] ]
			})
		}),{
			hideLabel:true,
			xtype:'checkbox',
			boxLabel: t("Always round up", "timeregistration2"),
			checked:GO.timeregistration2.roundUp=='1',
			name:'tr_roundUp'
		},{
		  xtype: 'fieldset',
		  title: t("Notification options", "timeregistration2"),
		  labelWidth: 200,
		  items: [
			{ 
			  xtype: 'compositefield', 
			  fieldLabel: t("Time to finish a month", "timeregistration2"),
			  items: [
				{xtype: 'numberfield', decimals: 0, width: 40, name: 'tr_daysToFinishMonth'},
				{xtype: 'displayfield', value: t("Days", "timeregistration2")}
			  ]
			},{ 
			  xtype: 'compositefield', 
			  fieldLabel: t("Daily worktime limit", "timeregistration2"),
			  items: [
				{xtype: 'numberfield', decimals: 0, width: 40, name: 'tr_dailyHourLimit'},
				{xtype: 'displayfield', value: t("Hours", "timeregistration2")}
			  ]
			},{ 
			  xtype: 'compositefield', 
			  fieldLabel: t("Weekly worktime limit", "timeregistration2"),
			  items: [
				{xtype: 'numberfield', decimals: 0, width: 40, name: 'tr_weeklyOvertime'},
				{xtype: 'displayfield', value: '%'}
			  ]
			},{ 
			  xtype: 'compositefield', 
			  fieldLabel: t("Max. working hours till break", "timeregistration2"),
			  items: [
				{xtype: 'numberfield', decimals: 0, width: 40, name: 'tr_maxHoursTillBreak'},
				{xtype: 'displayfield', value: t("Hours", "timeregistration2")}
			  ]
			},{ 
			  xtype: 'compositefield', 
			  fieldLabel: t("Minimun breaktime", "timeregistration2"),
			  items: [
				{xtype: 'numberfield', decimals: 0, width: 40, name: 'tr_minBreakTime'},
				{xtype: 'displayfield', value: t("Minutes", "timeregistration2")}
			  ]
			}
		  ]
		}]
	});
	

    this.addPanel(this.propertiesPanel);
//	this.addPanel(new GO.projects2.StandardTaskGrid());
	
//	this.addPanel(new GO.timeregistration2.EmployeeGrid());
//	this.addPanel(new GO.timeregistration2.NonBusinessDaysGrid());
    
  }

});
