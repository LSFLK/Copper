/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: TicketsFilterGrid.js 23369 2018-02-05 13:30:45Z mdhart $
 * @copyright Copyright Intermesh
 * @author Michiel Schmidt <michiel@intermesh.nl>
 * @author Merijn Schering <mschering@intermesh.nl>
 */

GO.tickets.TicketsFilterGrid = function(config)
{
	if(!config)
		config = {};			
	

	config.store.on('load', function () {
		var tp = GO.mainLayout.getModulePanel("tickets");
		if (tp) {
			var agent = this.store.reader.jsonData.showForAgent;
			tp.agentField.store.load({callback: function (rs, opt, s) {
					tp.agentField.setValue(agent == 0 ? "" : agent);
				}});
		}
	}, this);

	GO.tickets.TicketsFilterGrid.superclass.constructor.call(this, config);
}

Ext.extend(GO.tickets.TicketsFilterGrid, GO.grid.MultiSelectGrid);
