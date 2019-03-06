GO.projects2.ProjectsTree = function(config){
	
	if(!config)
	{
		config = {};
	}

	this.treeLoader = new GO.base.tree.TreeLoader(
	{
//		dataUrl : GO.settings.modules.projects2.url+'json.php',
		dataUrl: GO.url('projects2/project/tree'),
//		baseParams:{task: 'projects_tree'},
		preloadChildren:true
	});

	this.treeLoader.on('beforeload', function(){
		var el =this.getEl();
		if(el)
			el.mask(t("Loading..."));
	}, this);

	this.treeLoader.on('load', function(){
		var el =this.getEl();
		if(el)
			el.unmask();
		
				
		this.updateState();
		
	}, this);
	
	this.treeLoader.on('load', function(){		
			this.getSelectionModel().select(this.getRootNode());
		
	}, this, {single: true});

	config.autoScroll=true;
	config.animate=true;
	config.loader=this.treeLoader;
	config.rootVisible=true;
	config.containerScroll=true;
	config.collapsible=false;
	config.ddAppendOnly=true;
	config.containerScroll=true;
	config.ddGroup='ProjectsDD';
	config.enableDD=true;

//	this.contextMenu = new Ext.menu.Menu({
//		items:[{
//				text:t("Add project", "projects2"),
//				scope:this,
//				handler:function(){
//					if(GO.projects2.max_projects>0 && this.store.totalLength>=GO.projects2.max_projects)
//					{
//						Ext.Msg.alert(t("Error"), t("The maximum number of projects has been reached. Contact your hosting provider to activate unlimited usage of the projects module.", "projects2"));
//					}else
//					{
//						GO.projects2.showProjectDialog({
//							parent_project_id: this.selectedNode.id/*,
//							values:{
//								type_id:this.parentProject ? this.parentProject.type_id : null
//							}*/
//						});
//					}
//				}
//		},{
//				text:t("Duplicate", "projects2"),
//				scope:this,
//				handler:function(){
//					if(GO.projects2.max_projects>0 && this.store.totalLength>=GO.projects2.max_projects)
//					{
//						Ext.Msg.alert(t("Error"), t("The maximum number of projects has been reached. Contact your hosting provider to activate unlimited usage of the projects module.", "projects2"));
//					}else
//					{
//						GO.projects2.showProjectDialog({
//							project_id: this.selectedNode.id,
//							duplicate_id: this.selectedNode.id/*,
//							values:{
//								type_id:this.parentProject ? this.parentProject.type_id : null
//							}*/
//						});
//					}
//				}
//		},{
//				text:t("Delete"),
//				scope:this,
//				handler:function(){
//					if(confirm(t("Are you sure you want to delete '{item}'?").replace('{item}',this.selectedNode.text))){
//						GO.request({
//							url:'projects2/project/delete',
//							params:{id:this.selectedNode.id},
//							scope:this,
//							success:function(){
//								
//								this.selectedNode = this.selectedNode.parentNode;
//								this.selectedNode.select();
//								this.selectedNode.reload();
//								
//								
//								this.fireEvent('click', this.selectedNode);
//							}
//						});
//					}
//				}
//		}]
//	});

	this.contextMenu = new GO.projects2.TreeContextMenu({treePanel:this});
	
	GO.projects2.ProjectsTree.superclass.constructor.call(this, config);
	
	this.rootNode = new Ext.tree.AsyncTreeNode({
		draggable:false,
		id:'root',
		expanded:true,
		iconCls:'folder-default',
		text:t("Root folder", "projects2")
	});
	
	this.rootNode.on("beforeload", function(){
		//stop state saving when loading entire tree
		this.disableStateSave();
	}, this);

	this.setRootNode(this.rootNode);
	
	this.on('collapsenode', function(node)
	{		
		if(this.saveTreeState && node.childNodes.length)
			this.updateState();		
	},this);

	this.on('expandnode', function(node)
	{		
		if(node.id!="root" && this.saveTreeState && node.childNodes.length)
			this.updateState();
		
		
		//if root node is expanded then we are done loading the entire tree. After that we must start saving states
		if(node.id=="root"){			
			this.enableStateSave();
		}
	},this);
	
	this.on('contextmenu', function(node, e){
		e.preventDefault();

		var selModel = this.getSelectionModel();

		if(!selModel.isSelected(node))
		{
			selModel.clearSelections();
			selModel.select(node);
		}
		
		var coords = e.getXY();

		this.selectedNode=node;
		this.contextMenu.showAt([coords[0], coords[1]]);

	}, this);
	
	this.on('click', function(node)
	{
		if(node.id=='root')
			this.project_id=0;
		else
			this.project_id=node.id;
	}, this);
	
	this.addEvents({selectproject:true})
	
//	this.setRootNode(this.rootNode);
	
	this.on('beforenodedrop', function(e)
	{	
		if(e.data.selections)
		{
			var selections = e.data.selections;
		}else
		{
			var record = {};
			record.data={};
			record.data['id']=e.data.node.id;
			var selections = [record];
		}
		
		this.moveProject(e.target.id, selections);
	},
	this);
	
	this.on('nodedragover', function(dragEvent)
	{
		if(!dragEvent.dropNode)
		{
			if(dragEvent.target.attributes.readonly)
			{
				return false;
			}

			var drag_allowed = true;
			for(var i=0;i<dragEvent.data.selections.length; i++)
			{				
				var moveid = dragEvent.data.selections[i].data.id;
				var targetid = dragEvent.target.id;					
				if(moveid==targetid)
				{
					drag_allowed = false;
				}					
				
				var dragNode = this.getNodeById(moveid);
				if(dragNode){
					if(dragEvent.target.isAncestor(dragNode))
					{
						drag_allowed = false;
					}

					var parentId = dragNode.parentNode.id;
					if(parentId == dragEvent.target.id)
					{
						drag_allowed = false;
					}
				}
				
				if(!drag_allowed)
				{
					return false;
				}				
			}
			return true;			
		}else
		{
			var parentId = this.getNodeById(dragEvent.dropNode.id).parentNode.id;					
			if(parentId == dragEvent.target.id)
			{
				return false
			}
		
			return true;		
		}
	}, this);
				
}

Ext.extend(GO.projects2.ProjectsTree, Ext.tree.TreePanel,{
	project_id : 0,
	
	saveTreeState : false,
	loadingDone : false,
	
	reloadActiveNode : function()
	{		
		if(this.project_id==-1)
			this.project_id=0;
		
		var activeNode = this.getNodeById(this.project_id);
		
		if(activeNode && activeNode.parentNode)
		{
			delete activeNode.parentNode.attributes.children;
			activeNode.parentNode.reload();
		}else
		{
			this.getRootNode().reload();
		}
	},
	
	getActiveGridStore : function() {
		return this.grid.store;
	},
	
	moveProject : function(destination, records)
	{
		var move_sources = Array();
		for(var i=0; i<records.length; i++)
		{
			move_sources.push(records[i].data['id']);
		}
		
		Ext.Ajax.request({
			url: GO.url('projects2/project/move'),
			params:{
				task:'move_project',
				move_sources:Ext.encode(move_sources),
				move_destination:destination
			},
			callback: function(options, success, response)
			{			
				var responseParams = Ext.decode(response.responseText);					
				if(!responseParams.success)
				{
					Ext.MessageBox.alert(t("Error"), responseParams.feedback);
					this.rootNode.reload();
				}else
				{
					var store = this.getActiveGridStore();
					if(!destination || destination == this.project_id)
					{
						store.reload();
					}else if(move_sources)
					{
						for(var i=0; i<move_sources.length; i++)
						{										
							var record = store.getById(move_sources[i]);
							if(record)
							{
								store.reload();
								break;
							}
						}
					}	

					var destinationNode = this.getNodeById(destination);
					if(destinationNode)
					{
						delete destinationNode.attributes.children;							
						destinationNode.reload();
					}
					
					if(move_sources)
					{
						for(var i=0; i<move_sources.length; i++)
						{
							var node = this.getNodeById(move_sources[i]);
							if(node)
							{
								node.remove();
							}
						}	
					}						
				}											
			},
			scope: this		
		});
	},
//	
//	
//	getRootNode: function(){
//		return this.rootNode;
//	},
	
	getExpandedNodes : function(){
		var expanded = new Array();
		this.getRootNode().cascade(function(n){
			if(n.expanded){
			expanded.push(n.attributes.id);
			}
		});
		
		return expanded;
	},
					
	enableStateSave : function(){
		if(Ext.Ajax.isLoading(this.getLoader().transId)){
			this.enableStateSave.defer(100, this);
			this.loadingDone=false;
		}else
		{
			if(!this.loadingDone){
				this.loadingDone=true;
				this.enableStateSave.defer(100, this);
			}else{
				this.saveTreeState=true;
			}
		}
	},
	
	disableStateSave : function(){
		this.loadingDone=false;
		this.saveTreeState=false;
	},
	
	updateState : function(){
		GO.request({
			url:"projects2/project/saveTreeState",
			params:{
				expandedNodes:Ext.encode(this.getExpandedNodes())
			}
		});
	}
	
});
