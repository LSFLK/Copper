/** 
 * Copyright Intermesh
 * 
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 * 
 * If you have questions write an e-mail to info@intermesh.nl
 * 
 * @copyright Copyright Intermesh
 * @version 
 * @author Merijn Schering <mschering@intermesh.nl>
 * @author Wilmar van Beusekom <wilmar@intermesh.nl>
 */


GO.tickets.SelectTicketGroup = function(config){


	config.displayField='name';
	config.valueField='id';


	var fields = {fields: ['id', 'name'], columns:[]};
	
	config.store = new GO.data.JsonStore({
			url: GO.url('ticket/ticketGroup/store'),
	    baseParams: {},
	    root: 'results',
	    id: 'id',
	    totalProperty:'total',	    
      fields: fields.fields,
	    remoteSort: true
	});
	
	config.store.setDefaultSort('name', 'asc');

	config.store.mode='remote';
	config.triggerAction='all';
	config.selectOnFocus=true;
	config.pageSize=parseInt(GO.settings['max_rows_list']);
	config.value = '1';

	config.remoteSort = true;

	GO.tickets.SelectTicketGroup.superclass.constructor.call(this,config);
	
}
Ext.extend(GO.tickets.SelectTicketGroup, GO.form.ComboBoxReset);

Ext.ComponentMgr.registerType('selectticketgroup', GO.tickets.SelectTicketGroup);
