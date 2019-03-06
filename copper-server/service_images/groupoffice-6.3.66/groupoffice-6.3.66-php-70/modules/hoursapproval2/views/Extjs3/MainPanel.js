
GO.hoursapproval2.MainPanel = function(config){

	config = config || {};
	
	var now = new Date();

	config.layout='border';
	config.border=false;
 
	this.navPanel = new GO.hoursapproval2.WeekGrid({
		title: '',

		region:'west',
		listeners: {
			delayedrowselect: function(sm, i, record) {
				this.approvalGrid.setWeek(this.navPanel.getYear(), record.data.weeknb);
			},
			scope:this
		},
		split:true,
		width: 200
	});

	this.approvalGrid = new GO.hoursapproval2.ApprovalGrid({
		region:'center',
		weekgrid: this.navPanel
	});

	config.items=[this.approvalGrid,this.navPanel];


	GO.hoursapproval2.MainPanel.superclass.constructor.call(this, config);
};


Ext.extend(GO.hoursapproval2.MainPanel, Ext.Panel, {

	afterRender : function(){
		this.navPanel.store.load();
		GO.hoursapproval2.MainPanel.superclass.afterRender.call(this);
	}

});


GO.moduleManager.addModule('hoursapproval2', GO.hoursapproval2.MainPanel, {
	title : t("Approve timeregistration", "hoursapproval2"),
	iconCls : 'go-tab-icon-hoursapproval2'
});
