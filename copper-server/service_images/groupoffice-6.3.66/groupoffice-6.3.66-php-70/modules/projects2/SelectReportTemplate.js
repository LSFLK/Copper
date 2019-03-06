/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: SelectReportTemplate.js
 * @copyright Copyright Intermesh
 * @author Wilmar van Beusekom <wilmar@intermesh.nl>
 */

GO.projects2.SelectReportTemplate = Ext.extend(GO.form.ComboBox, {
			initComponent : function(){

				Ext.apply(this, {
					hiddenName: 'report_template_class',
					fieldLabel: t("Report template", "projects2"),
					store:new GO.data.JsonStore({
						url:GO.url("projects2/report/store"),
						fields:["class","name","display_name","date_range_supported", "status_filter_supported","selected_statuses"],
						id:"class",
						listeners:{
							load:function(){
								this.selectFirst();
							},
							scope:this
						}
					}),
					valueField:'class',
					displayField:'display_name',
					mode: 'local',
					triggerAction: 'all',
					editable: false,
					selectOnFocus:true,
					forceSelection: true
				});
			}
		});


Ext.reg('pmselectstatus', GO.projects2.SelectReportTemplate);
