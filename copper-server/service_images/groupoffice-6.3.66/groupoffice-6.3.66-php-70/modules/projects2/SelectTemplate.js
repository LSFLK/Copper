/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: SelectTemplate.js
 * @copyright Copyright Intermesh
 * @author Wilmar van Beusekom <wilmar@intermesh.nl>
 */

GO.projects2.SelectTemplate = Ext.extend(GO.form.ComboBox, {
			initComponent : function(){

				if(!this.hiddenName)
					this.hiddenName='template_id';

				Ext.apply(this, {
					fieldLabel: t("Template", "projects2"),
					store:GO.projects2.templatesStore,
					valueField:'id',
					displayField:'name',
					mode: 'local',
					triggerAction: 'all',
					editable: false,
					selectOnFocus:true,
					forceSelection: true,					
					disabled: !GO.settings.modules.projects2.write_permission
				});
			},
			setValue : function(v){
				GO.form.ComboBox.superclass.setValue.call(this, v);
				if(this.rendered)
				{
					//this.triggers[0].setDisplayed(v!='');
				}
			},
			afterRender:function(){
				GO.form.ComboBox.superclass.afterRender.call(this);
				if(Ext.isIE8)this.el.setTop(1);

				if(!GO.projects2.templatesStore.loaded)
					GO.projects2.templatesStore.load();

				//this.on('resize', function(combo, adjWidth, adjHeight, rawWidth, rawHeight ){console.log(adjWidth);}, this);
			}
		});


Ext.reg('pmselecttemplate', GO.projects2.SelectTemplate);
