

GO.moduleManager.onModuleReady('billing',function(){
	Ext.override(GO.billing.MainPanel,{		

		initComponent : GO.billing.MainPanel.prototype.initComponent.createInterceptor(function(){
			
			this.exportMenu.menu.add({
				text:'Exact Online',
				scope:this,
				handler:function(){
					if(!this.goExportOrdersDialog){
						
						var now = new Date();
						var lastMonth = now.add(Date.MONTH, -1);
						var startOfLastMonth = lastMonth.getFirstDateOfMonth();
						var endOfLastMonth = lastMonth.getLastDateOfMonth();

						var startDate = new Ext.form.DateField({
							name: 'start_time',
							format: GO.settings['date_format'],
							allowBlank:true,
							fieldLabel: t("Start"),
							value: startOfLastMonth.format(GO.settings.date_format)
						});

						var endDate = new Ext.form.DateField({
							name: 'end_time',
							format: GO.settings['date_format'],
							allowBlank:true,
							fieldLabel: t("End"),
							value: endOfLastMonth.format(GO.settings.date_format)
						});
						
						this.goExportOrdersDialog = new GO.dialog.ExportDialog({
							title:'Exact Online',
							exportController:'exactonline/exactExport',
							formItems:[
							startDate,
							endDate,
							new GO.billing.SelectBook({
									store:GO.billing.readableBooksStore
								})					
							]
						});
					}
					
					this.goExportOrdersDialog.show();				
				}
			});
			
		
			
		})
	});
}, this);
