GO.projects2.SelectProject = function(config){
	
	var config = config || {};
	//Ext.apply(this, config);
	
	Ext.applyIf(config,{
		minHeight: 300,
		displayField: 'path',
		hiddenName:'project_id',
		valueField: 'id',
		emptyText:t("None"),
		triggerAction:'all',
		mode:'remote',
		editable: true,
		tpl: new Ext.XTemplate(
//			'{[this.currentKey = null]}' +
			'<tpl>{[this.resetCurrentKey()]}</tpl>'+
			'<tpl for=".">'+
			  '<tpl if="this.shouldShowHeader(values.path)">' +
				'<div class="menu-title">{[this.showHeader(values.path)]}</div>' +
			  '</tpl>' +
			  '<div class="x-combo-list-item">{[this.name]}</div>',
			'</tpl>',
			{
			  shouldShowHeader: function(path){
 
				var pathArr = path.split('/');
				this.name = pathArr.pop(); // remove 				
				
				
				return this.currentKey !== pathArr.join('/');
			  },
			  showHeader: function(path){
				var pathArr = path.split('/');
				pathArr.pop(); // remove project
				this.currentKey = pathArr.join('/');
				return this.currentKey;
			  },
				resetCurrentKey: function() {
					this.currentKey=null;
					return '';
				}
			}
		),
//		selectOnFocus:true,
//		forceSelection: true,
//		typeAhead: true,
		disabled:false,
		store:GO.projects2.selectProjectStore,
		fieldLabel:t("Project", "projects2"),
		pageSize: parseInt(GO.settings['max_rows_list'])
	});	
	
	
	if(config.storeBaseParams)
		config.store.baseParams = config.storeBaseParams;

	GO.projects2.SelectProject.superclass.constructor.call(this,config);
		
	this.store.setDefaultSort('path', 'asc');
	
};
Ext.extend(GO.projects2.SelectProject, GO.form.ComboBoxReset,{
	
	restrictHeight : function(){
		this.innerList.dom.style.height = '';
        var inner = this.innerList.dom,
            pad = this.list.getFrameWidth('tb') + (this.resizable ? this.handleHeight : 0) + this.assetHeight,
            h = Math.max(inner.clientHeight, inner.offsetHeight, inner.scrollHeight),
            ha = this.getPosition()[1]-Ext.getBody().getScroll().top,
            hb = Ext.lib.Dom.getViewHeight()-ha-this.getSize().height,
            space = Math.max(ha, hb, this.minHeight || 0)-this.list.shadowOffset-pad-5;

        h = Math.min(h, space, this.maxHeight);
		
		//added this because of a bug that didn't show one record with a group
		if(h<60){
			h=60;
		}

        this.innerList.setHeight(h);
        this.list.beginUpdate();
        this.list.setHeight(h+pad);
        this.list.alignTo.apply(this.list, [this.el].concat(this.listAlign));
        this.list.endUpdate();
	}
});
