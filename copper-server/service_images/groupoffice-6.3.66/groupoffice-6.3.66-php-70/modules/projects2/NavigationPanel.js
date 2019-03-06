GO.projects2.NavigationPanel = function(config){
	config = config || {};

	var now = new Date();

	config.store = new GO.data.JsonStore({
		url : config.url,
		baseParams : {
			task : 'get_weeks',
			year: now.format('Y')
		},
		root : 'results',
		id : 'value',
		totalProperty : 'total',
		fields : ['value', 'text', 'closed'],
		remoteSort : true
	});

	config.store.on('load',function(){
		this.rightArrow.setDisabled(this.store.baseParams.year==now.format('Y'));
	}, this);

	config.tbar=[this.leftArrow = new Ext.Button({
				iconCls : 'btn-left-arrow',
				handler : function() {
					this.store.baseParams.year--;
					this.yearPanel.body.update(this.store.baseParams.year);
					this.store.load();
				},
				scope : this
			}), this.yearPanel = new Ext.Panel({
						html : now.format('Y')+"",
						plain : true,
						border : true,
						cls : 'cal-period'
					}), this.rightArrow = new Ext.Button({
				iconCls : 'btn-right-arrow',
				handler : function() {
					this.store.baseParams.year++;
					this.yearPanel.body.update(this.store.baseParams.year);
					this.store.load();
				},
				scope : this
			})];

	config.cls='go-grid3-hide-headers';
	
	config.columns = [{
				header : t("Week"),
				dataIndex : 'text',
				renderer:function(v, meta, record){
					switch(record.get('closed')){
						
						case 1:
							meta.css='go-icon-ok';
						break;

						default:
							meta.css='go-icon-empty';
							break;
					}

					return v;
				}
			}];

	config.view = new Ext.grid.GridView({
				autoFill : true,
				forceFit : true
			});
	config.sm = new Ext.grid.RowSelectionModel({
		single:true
	});
	config.loadMask = true;

	GO.projects2.NavigationPanel.superclass.constructor.call(this, config);
}

Ext.extend(GO.projects2.NavigationPanel, GO.grid.GridPanel, {
});
