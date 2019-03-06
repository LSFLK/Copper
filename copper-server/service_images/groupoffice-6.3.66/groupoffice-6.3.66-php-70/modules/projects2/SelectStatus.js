/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: SelectStatus.js
 * @copyright Copyright Intermesh
 * @author Wilmar van Beusekom <wilmar@intermesh.nl>
 */

GO.projects2.SelectStatus = Ext.extend(GO.form.ComboBox, {
			initComponent : function(){

				if(!this.hiddenName)
					this.hiddenName='status_id';

				Ext.apply(this, {
					fieldLabel: t("Status", "projects2"),
					store:GO.projects2.statusesStore,
					valueField:'id',
					displayField:'name',
					mode: 'local',
					triggerAction: 'all',
					editable: false,
					selectOnFocus:true,
					forceSelection: true
				});
			},
			setValue : function(v){
				GO.form.ComboBoxReset.superclass.setValue.call(this, v);
				if(this.rendered)
				{
					//this.triggers[0].setDisplayed(v!='');
				}
			},
			afterRender:function(){
				GO.form.ComboBoxReset.superclass.afterRender.call(this);
				if(Ext.isIE8)this.el.setTop(1);
				
				if(!GO.projects2.statusesStore.loaded)
					GO.projects2.statusesStore.load();

				if(!GO.projects2.templatesStore.loaded)
					GO.projects2.templatesStore.load();

				//this.on('resize', function(combo, adjWidth, adjHeight, rawWidth, rawHeight ){console.log(adjWidth);}, this);
			}
		});


Ext.reg('pmselectstatus', GO.projects2.SelectStatus);
