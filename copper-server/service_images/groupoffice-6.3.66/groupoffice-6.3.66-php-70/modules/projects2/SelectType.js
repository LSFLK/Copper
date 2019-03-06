/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: SelectType.js 22922 2018-01-12 08:01:04Z mschering $
 * @copyright Copyright Intermesh
 * @author Merijn Schering <mschering@intermesh.nl>
 */

GO.projects2.SelectType = Ext.extend(GO.form.ComboBox, {
			initComponent : function(){

				if(!this.hiddenName)
					this.hiddenName='type_id';

				Ext.apply(this, {
					fieldLabel: t("Permission type", "projects2"),					
					store:new GO.data.JsonStore({
							url: GO.url('projects2/type/store'),
							baseParams: {
								auth_type:'write',
								forEditing:true
							},
							fields: ['id','name','acl_id','acl_book'],
							remoteSort: true
					}),
					valueField:'id',
					displayField:'name',
					mode: 'remote',
					triggerAction: 'all',
					editable: true,
					selectOnFocus:true,
					forceSelection: true,
					pageSize: parseInt(GO.settings.max_rows_list),
					disabled:!GO.settings.modules.projects2.write_permission
				});

				Ext.form.TwinTriggerField.prototype.initComponent.call(this);
			},
			getTrigger : Ext.form.TwinTriggerField.prototype.getTrigger,
			initTrigger : Ext.form.TwinTriggerField.prototype.initTrigger,
			trigger1Class : 'x-form-edit-trigger',
			//hideTrigger1 : true,
			onViewClick : Ext.form.ComboBox.prototype.onViewClick.createSequence(function() {
				//this.triggers[0].setDisplayed(true);
			}),
			onTrigger2Click : function() {
				this.onTriggerClick();
			},
			onTrigger1Click : function() {
				if(!this.disabled){
					var v = this.getValue();



					if(!GO.projects2.typeDialog){
						GO.projects2.typeDialog = new GO.projects2.TypeDialog();
						GO.projects2.typeDialog.on('save', function(){
								GO.projects2.typesStore.reload();
							}, this);
					}

					GO.projects2.typeDialog.show(v);
				}
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

//				if(!GO.projects2.typesStore.loaded)
//					GO.projects2.typesStore.load();

				//this.on('resize', function(combo, adjWidth, adjHeight, rawWidth, rawHeight ){console.log(adjWidth);}, this);
			}
		});


Ext.reg('pmselecttype', GO.projects2.SelectType);
