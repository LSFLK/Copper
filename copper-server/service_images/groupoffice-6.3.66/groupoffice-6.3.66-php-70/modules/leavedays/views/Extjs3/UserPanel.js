Ext.namespace('GO.leavedays');

GO.leavedays.UserPanel = function(config) {
	
	var config = config || {};
	
	config.layout = 'fit';
	config.width = 700;
	
	this.msgWindow = new Ext.Window({
		title: t("Reason why", "leavedays"),
		width: 400,
		height: 180,
		layout: 'form',
		modal: false,
		resizable: false,
		closeAction: 'hide',
		items: [
			new Ext.form.FormPanel({
				hideLabels: true,
				items: [
					this.reasonWhyMsg = new Ext.form.TextArea({
						name: 'comment',
						anchor: '100%'
					})
				]
			})
			
		],
		listeners: {
				show: function() {
					this.reasonWhyMsg.focus(true, 100);
				},
				scope: this
			},
		buttons: [
			this.msgWindowSend = new Ext.Button({
				text: 'send',
				handler: function(){
					this.msgWindow.hide();
					this.msgWindow.onSend(this)
				},
				scope: this
			}),
			this.msgWindowClose = new Ext.Button({
				text: 'close',
				handler: function(){
					this.msgWindow.hide();
					this.msgWindow.onClose(this)
				},
				scope: this
			})
		],
		onSend: function(scope) {},
		onClose: function(scope) {}
	})
	
	
	this.gridPanel = this._buildGridPanel();
	
	
	config.items = [
		new Ext.TabPanel({
			activeTab: 0,
			items: [
				this.gridPanel,
				this.summaryPanel = new Ext.Panel({
					layout: "fit",
					title: t("Year summary", "leavedays"),
					autoScroll: true
				})
			]
		})
		
		
	];
	
	 
	this.summaryPanel.on('render', function(panel) {
		this._loadYearSummary();
	}, this)
	
	GO.leavedays.UserPanel.superclass.constructor.call(this,config);
	
	this.addEvents({'leavedaySaved':true});
	
}

Ext.extend( GO.leavedays.UserPanel, Ext.Panel, {
	
	_user_name : '',
	
	show : function(config) {
		
		GO.leavedays.UserPanel.superclass.show.call(this);
		
		if(this.gridPanel.store.baseParams['user_id'] != GO.leavedays.activeUserId || this.gridPanel.store.baseParams['year'] != GO.leavedays.activeYear){
			this.gridPanel.store.baseParams['user_id'] = GO.leavedays.activeUserId;
			this.gridPanel.store.baseParams['year'] = GO.leavedays.activeYear;
			this.gridPanel.store.load();

			this._loadYearSummary();

			this._user_name = config['user_name'];
			this.summaryPanel.setTitle(t("Year summary", "leavedays")+': '+this._user_name+' ('+GO.leavedays.activeYear+')');
		} else if (!GO.util.empty(config['empty'])) {
			this.gridPanel.store.baseParams['user_id'] = 0;
			this.gridPanel.store.load();
			this._user_name = '';
			this.summaryPanel.setTitle(t("Year summary", "leavedays"));
			this._loadYearSummary();
		}
	},
	
	_buildGridPanel : function() {
		
		
		var columns = [{
					header: t("ID", "leavedays"),
					dataIndex: 'id',
					width:20,
					hidden: true
				},{
					header: t("First date", "leavedays"),
					dataIndex: 'first_date',
					width:dp(140),
					renderer: function(value, metadata, record) {
						if (record.data.has_negative_credit)
							return '<span style="color:red;">'+value+'</span>';
						else
							return value;
					}
				},{
					header: t("Last date", "leavedays"),
					dataIndex: 'last_date',
					width:dp(140),
					renderer: function(value, metadata, record) {
						if (record.data.has_negative_credit)
							return '<span style="color:red;">'+value+'</span>';
						else
							return value;
					}
				},{
					header: t("Type", "leavedays"),
					dataIndex: 'credit_type_name',
					sortable:false,
					width:dp(70),
					align: 'right'
				},{
					header: t("Hours", "leavedays"),
					dataIndex: 'n_hours',
					width:dp(70),
					align: 'right',
					renderer: function(value, metadata, record) {
						if (record.data.has_negative_credit)
							return '<span style="color:red;">'+value+'</span>';
						else
							return value;
					}
				},{
					header: t("Hours nat. holidays", "leavedays"),
					dataIndex: 'n_nat_holiday_hours',
					width:dp(70),
					align: 'right',
					renderer: function(value, metadata, record) {
						if (record.data.has_negative_credit)
							return '<span style="color:red;">'+value+'</span>';
						else
							return value;
					}
				},{
					header: t("Description", "leavedays"),
					dataIndex: 'description',
					width:120,
					align: 'right',
					renderer: function(value, metadata, record) {
						if (record.data.has_negative_credit)
							return '<span style="color:red;">'+value+'</span>';
						else
							return value;
					}
				},{
					header: t("Created at"),
					dataIndex: 'ctime',
					width: dp(140),
					align: 'right',
					hidden: true,
					renderer: function(value, metadata, record) {
						if (record.data.has_negative_credit)
							return '<span style="color:red;">'+value+'</span>';
						else
							return value;
					}
				},{
					header: t("Modified at"),
					dataIndex: 'mtime',
					width: dp(140),
					align: 'right',
					hidden: true,
					renderer: function(value, metadata, record) {
						if (record.data.has_negative_credit)
							return '<span style="color:red;">'+value+'</span>';
						else
							return value;
					}
				}];
			
		var icons = {
			appr: '<i class="icon">check</i>',
			disa: '<i class="icon">clear</i>',
			none: '<i class="icon">warning</i>'
		};
		
		if(GO.leavedays.currentUserIsManager){
			
			var radioRenderer = function(value, meta, r, row, col) {
				if(r.get('manager_user_id') != GO.settings.user_id && !GO.settings.modules.leavedays.write_permission) {
					return '';
				}
				
				
				var id = Ext.id();
				Ext.defer(function () {
					new Ext.form.Radio({
						renderTo: id,
						name: 'ld-status-'+row,
						checked: r.get('status')==columns[col].emptyGroupText,
						width: 75,
						handler: function (me, checked) { 
							
							if(!checked) {
								this.msgWindow.switchbackRadio = me;
								return;
							}
							
							this.msgWindow.onClose = function(scope) {								
								scope.msgWindow.switchbackRadio.setValue(true);
								scope.reasonWhyMsg.setValue('')
							}
							
							this.msgWindow.onSend = function(scope) {
								
								GO.request({
									url:'leavedays/leaveday/update',
									params:{
										id:r.id,
										user_id:r.data.user_id,
										status:columns[col].emptyGroupText,
										reasonWhyMsg: scope.reasonWhyMsg.getValue()
									},
									success:function(){
										 scope.reasonWhyMsg.setValue('')
									}
								});
								
							};
							
							if(columns[col].emptyGroupText == 2) {
								this.msgWindow.show();
								
							} else {
								GO.request({
									url:'leavedays/leaveday/update',
									params:{
										id:r.id,
										user_id:r.data.user_id,
										status:columns[col].emptyGroupText
									},
									success:function(){

									}
								});
							}
							
							
						},
						scope: this
					});
				}, 50, this);
				return String.format('<div id="{0}"></div>', id);
			};
			
			
			columns.push({
				header:icons['appr'],
				width: dp(64),
				style: {
					"overflow" : "visible"
				},
				emptyGroupText: 1, //abusing this property to pass value to radio select
				sortable:false,
				hideable:false,
				menuDisabled:true,
				resizable:false,
				renderer:{
					fn: radioRenderer,
					scope: this 
				} 
			});
			columns.push({
				header:icons['disa'],
				width: dp(64),
				emptyGroupText: 2,
				sortable:false,
				hideable:false,
				menuDisabled:true,
				resizable:false,
				renderer:{
					fn: radioRenderer,
					scope: this 
				} 
			});
			columns.push({
				header:icons['none'],
				width: dp(64),
				emptyGroupText: 0,
				sortable:false,
				hideable:false,
				menuDisabled:true,
				resizable:false,
				renderer:{
					fn: radioRenderer,
					scope: this 
				} 
			});
		} else {
			columns.push({ 
				header: t("Status"), 
				//dataIndex: 'name',
				renderer:function(v, meta, record){

				  if(record.get('status')==0) {
					  return '';// icons['none'];
				  }
				  if(record.get('status')==1) {
					  return icons['appr'];
				  }
				  if(record.get('status')==2) {
					  return icons['disa'];
				  }
			  }
			});
		}
						
		var gridPanelConfig = {
			plugins: this.checkColumn ? this.checkColumn : [],
			autoScroll: true,
			layout: "fit",
			store: new GO.data.JsonStore({
				url: GO.url('leavedays/leaveday/store'),
				remoteSort:true,
				fields: ['id', 'user_id', 'first_date', 'last_date','n_hours', 'n_nat_holiday_hours', 'description','ctime','mtime', 'status', 'has_negative_credit', 'credit_type_name', 'manager_user_id'],
				listeners: {
					load: function() {
						this.enable();
					},
					scope: this
				},
				scope: this
			}),
			noDelete: !GO.settings.modules.leavedays.write_permission,
			paging: true,
			cm: new Ext.grid.ColumnModel({
				defaults:{
					sortable:true
				},
				columns:columns
			}),
			view: new Ext.grid.GridView({
				emptyText: t("No items to display")
			}),
			sm: new Ext.grid.RowSelectionModel(),
			loadMask: true,
			clicksToEdit: 1
		};
		
		
			this.addButton = new Ext.Button({
				iconCls: 'btn-add',
				text: t("Add"),
				cls: 'x-btn-text-icon',
//				disabled: true,
				handler: function(){
					GO.leavedays.showLeavedayDialog(0);
					
					if(!this.saveListenerAdded){
						this.saveListenerAdded=true;
						GO.leavedays.leavedayDialog.on('save',function(){
							this.gridPanel.store.load();
							this._loadYearSummary();
						}, this);
					}
				},
				scope: this
			});
			this.delButton = new Ext.Button({
				iconCls: 'btn-delete',
				text: t("Delete"),
				cls: 'x-btn-text-icon',
//				disabled: true,
				handler: function(){
					
//					var  selModel = this.gridPanel.getSelectionModel();
//					Ext.each(selModel.getSelections(), function (record, index) {
//						if(record.get('status') != 0 && !GO.settings.modules.leavedays.write_permission) {
//							
//							selModel.deselectRow(this.gridPanel.getStore().indexOf(record));
//						}
//							
//					}, this);
					
					this.gridPanel.deleteSelected();
				},
				scope: this
			});
			
			gridPanelConfig.tbar = [this.addButton,this.delButton];
		
		gridPanelConfig.title =  t("Holiday request", "leavedays");
		
		var gridPanel = new GO.grid.GridPanel(gridPanelConfig);
				
		gridPanel.store.on('load',function(){
			this._loadYearSummary();
		}, this);
		
		//if (GO.settings.modules.leavedays.write_permission)
			gridPanel.on('rowdblclick',function(grid,rowIndex,event){
				var record = grid.store.getAt(rowIndex);

				if(record.get('status') != 0 && !GO.settings.modules.leavedays.write_permission)
					return false;
				GO.leavedays.showLeavedayDialog(record.data['id']);
				
				if(!this.saveListenerAdded){
					this.saveListenerAdded=true;
					GO.leavedays.leavedayDialog.on('save',function(){
						this.gridPanel.store.load();
						this._loadYearSummary();
					}, this);
				}

			}, this);
				
		return gridPanel;
		
	},
	
	
	_loadYearSummary : function() {
		
			if(this.summaryPanel.rendered) {
				this.summaryPanel.load({
					url: GO.url('leavedays/user/yearInfo'),
					params: {
						'userId' : GO.leavedays.activeUserId,
						'selectedYear' : GO.leavedays.activeYear
					}
					,scope: this
					,callback: function(panel,success,action) {
						
						if(typeof(this.addButton)=='object')
							this.addButton.setDisabled(GO.util.empty(action.responseText));
						if(typeof(this.delButton)=='object')
							this.delButton.setDisabled(GO.util.empty(action.responseText));
					}
				});
			}
			
	}
	
});
