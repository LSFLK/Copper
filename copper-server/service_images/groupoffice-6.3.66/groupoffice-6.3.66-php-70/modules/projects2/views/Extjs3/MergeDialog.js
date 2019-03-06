GO.projects2.MergeDialog = Ext.extend(GO.Window, {
	
	fromProjectId: false,
	toProjectId: false,
	
	initComponent : function(){
		
		this.grid = new GO.projects2.ProjectGrid({
			region: 'center',
			sm: new Ext.grid.RowSelectionModel({singleSelect:true})
		});
		
		//selectionchange
		this.grid.getSelectionModel().on("rowselect", function(sm, rowIndex, record ){
			
			this.toProjectId = record.get("id");
			
			this.okeyBtm.enable();
			
		}, this);
		
		this.searchField = new GO.form.SearchField({
			region: 'north',
			store: this.grid.getStore(),
			width:320
		});
		
		
		Ext.apply(this, {
			layout: "border",
			title: t("Merge"),
			width:900,
			height:600,
			items: [
				this.searchField,
				this.grid
			],
			buttons: [this.okeyBtm = new Ext.Button({
					disabled: true,
					text: t("Ok"),
					handler: function(){							
						this.merge();
					},
					scope:this
				}),
				{
					text: t("Close"),
					handler: function(){
						this.hide();
					},
					scope: this
				}
			]
			
		});
		
		GO.projects2.MergeDialog.superclass.initComponent.call(this);	
	},
	
	show : function(ProjectId){
		
		this.fromProjectId = ProjectId;
		
		GO.projects2.MergeDialog.superclass.show.call(this);
		
	},
	
	
	merge: function(){
		
		
		var params = {};
		params.fromProjectId = this.fromProjectId;
		params.toProjectId = this.toProjectId;
		
		
		if(confirm("Are you sure you want to do this?")){
			GO.request({
				url:'projects2/project/merge',
				params:params,
				success:function(){
					
					this.close();
					
				},
				scope:this
			});
		}
		
	}
	
	
})
