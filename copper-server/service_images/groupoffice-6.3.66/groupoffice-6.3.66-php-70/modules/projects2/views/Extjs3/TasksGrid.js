/**
 * Copyright Intermesh
 *
 * This file is part of Group-Office. You should have received a copy of the
 * Group-Office license along with Group-Office. See the file /LICENSE.TXT
 *
 * If you have questions write an e-mail to info@intermesh.nl
 *
 * @version $Id: TasksGrid.js 23354 2018-01-31 13:11:51Z mdhart $
 * @copyright Copyright Intermesh
 * @author Merijn Schering <mschering@intermesh.nl>
 */


GO.projects2.TaskRecord = Ext.data.Record.create([
		// the "name" below matches the tag name to read, except "availDate"
		// which is mapped to the tag "availability"
		{
			name: 'id',
			type: 'int'
		},
		{
			name: 'project_id',
			type: 'int'
		},
		{
			name: 'user_id',
			type: 'int'
		},
		{
			type: 'string',
			name: 'description',
			type: 'string',
			clearCls: 'x-form-clear-left'
		},{
			name: 'parent_id',
			type: 'string'
		},{
			name: 'hours_booked',
			type: 'string'
		},{
			name: 'duration',
			type: 'string'
		},
		{
			name: 'due_date',
			mapping: 'due_date',
			type: 'date'
		}
	]);


GO.projects2.TasksGrid = function(config){
	if(!config)
	{
		config = {};
	}
	
	var summary = new Ext.grid.GridSummary();
	

	
	
	if(go.Modules.isAvailable("legacy", "timeregistration2")){
		var action = new Ext.ux.grid.RowActions({
			header : '&nbsp;',
			autoWidth:true,
			align : 'center',
			actions : [{
				iconCls : 'ic-alarm-add',
				qtip: t("Time entry", "projects2")
			}]
		});

		action.on({
			scope:this,
			action:function(grid, record, action, row, col) {

				grid.getSelectionModel().selectRow(row);

				switch(action){
					case 'ic-alarm-add':

						if(!this.timeEntryDialog){
							this.timeEntryDialog = new GO.projects2.TimeEntryDialog({
								id: 'pm-timeentry-dialog-grid'
							});
							this.timeEntryDialog.on('submit',function(){
									GO.request({
										url:'projects2/task/save',
										method:'POST',
										params:{
											project_id:this.project_id,
											data:Ext.encode(this.getGridData())
										},
										success:function(response, options, result){
											this.store.load();
										},
										scope:this
									});		
							}, this);
						}


						this.timeEntryDialog.show(0,{
							loadParams:{
								task_id:record.data.id,
								project_id:record.data.project_id
							}
						});
						break;

				}
			}
		}, this);


		config.plugins=[summary, action];
	}
	

	config.ddGroup='pm-tasks-dd';
	config.enableDragDrop=true;
	config.listeners={
		scope:this,
		render:function(){
			var DDtarget = new Ext.dd.DropTarget(this.getView().mainBody, 
			{
				ddGroup : 'pm-tasks-dd',
				copy:false,
				notifyDrop : this.notifyDrop.createDelegate(this)
			});
		}
	}
	
	config.layout='fit';
	config.autoScroll=true;
	config.split=true;
	
	this.selectResource = new GO.projects2.SelectResource();
	
	this.selectResource.store.on('load',function(){
		this.setDisabled(!this._tasksPanelEnabled || this.selectResource.store.getCount()==0);
	},this)

	var fields ={
		fields:['id', 'parent_description', 'project_id','user_id','percentage_complete','duration','hours_booked', 'due_date','auto_date','description','sort_order','hours_over_budget','late','parent_id','has_children'],
		columns:[{
			width:dp(112),
			header: t("Date"),
			dataIndex: 'due_date',
			editor: new Ext.form.DateField({
				format:GO.settings.date_format,
				emptyText:'Auto'
			}),
			summaryType: 'count',
			summaryRenderer:function(value){
				return value+' '+t("Jobs", "projects2");
			},
			renderer: function(value, metaData, record){
				metaData.css='';
				if(record.data.late)
					metaData.css='projects-late';
				
				if(GO.util.empty(value))
					return record.data.auto_date;
				
				
				var str=typeof(value.dateFormat)=='undefined' ? value : value.dateFormat(GO.settings.date_format);
				
				str += '<span class="pm-task-manual-date">&nbsp;[M]</span>';
				
				return str;
			}
		},{
			header: t("Description"), 
			dataIndex: 'description',
			name:'description',
			width:dp(224),
			editor:new Ext.grid.GridEditor(
				this.descriptionField = new Ext.form.TextArea({
					height:150,
					width:dp(224),
					allowBlank:true,
					fieldLabel:t("Description")
				}),{
					autoSize: false
				}),
			renderer:GO.util.nl2br,
			id:'description'
		},{
			width:dp(112),
			header: t("% complete", "projects2"),
			dataIndex: 'percentage_complete',
			summaryType:'average',
			editor: new Ext.grid.GridEditor(new GO.form.NumberField({minValue:0, maxValue:100,decimals:0})),
			renderer:function (value, meta, rec, row, col, store){
				return '<div class="pm-progressbar">'+
					'<div class="pm-progress-indicator" style="width:'+Math.ceil(GO.util.unlocalizeNumber(value))+'%"></div>'+
					'</div>';
		}
		},{
			header: t("Duration", "projects2"),
			dataIndex: 'duration',
			summaryType: 'sum',
			width:dp(64),
			editor: new Ext.grid.GridEditor(new GO.form.NumberField())
		},{
			header: t("Hours booked", "projects2"),
			dataIndex: 'hours_booked',
			width:dp(72),
			renderer:function(value, metaData, record, rowIndex, colIndex, ds){
				
				if(record.data.hours_over_budget)
					metaData.css='projects-late';
				
				return value;
			},
			summaryType: 'sum'
		},	{
			width: dp(72),
			header: t("Employee", "projects2"),
			dataIndex: 'user_id',
			renderer: this.renderResource.createDelegate(this),
			editor: new Ext.grid.GridEditor(this.selectResource)			
		},{
			header: "Group",
			hidden:true,
			hideable:false,
			dataIndex: 'parent_description',
			groupable:true
		}]
	};
	
	if(go.Modules.isAvailable("legacy", "timeregistration2")){
		fields.columns.push(action);
	}

	//config.collapseMode = 'mini';
	//config.titleCollapse = false;
	config.hideCollapseTool = true;

	fields.columns.push()

	config.store = new GO.data.JsonStore({
		url: GO.url('projects2/task/store'),
		baseParams: {
//			task: 'expenses'
			limit:0
		},
		root: 'results',
		id: 'id',
		totalProperty:'total',
		fields: fields.fields,
		remoteSort: true
	});
	
	config.store =  new Ext.data.GroupingStore({

		reader: new Ext.data.JsonReader({
			root: 'results',
			id: 'id',
			totalProperty:'total',
			fields: fields.fields
		}),
		proxy: new Ext.data.HttpProxy({
			url: GO.url('projects2/task/store')
		}),
//		groupOnSort:false,
		remoteGroup:true,
		remoteSort: true,
		groupField:'parent_description'

	});

	var columnModel =  new Ext.grid.ColumnModel({
		defaults:{
			sortable:false,
			groupable:false
		},
		columns:fields.columns
	});
	
	config.cm=columnModel;
	config.view=new Ext.grid.GroupingView({
		emptyText: t("Jobs", "projects2"), //t("No items to display"),
		hideGroupedColumn:true,
		showGroupName:false
	});
	config.sm=new Ext.grid.RowSelectionModel();
	config.loadMask=true;

	config.clicksToEdit=2;


	


	config.tbar=[{
		iconCls: 'ic-add',
		text: t("Add"),
		handler: function(){
			this.addNewRow();
		},
		scope: this
	},{
		iconCls: 'ic-delete',
		tooltip: t("Delete"),
		handler: function(){
			this.deleteSelected();
		},
		scope: this
	},'-',this.ungroupButton = new Ext.Button({
		text: t("Ungroup", "projects2"),
		disabled: true,
		handler:function(){
			this.ungroupSelection();
		},
		scope:this
	}),this.groupButton = new Ext.Button({
		text: t("Group", "projects2"),
		disabled: true,
		handler:function(){
			this.showToGroupDialog();
		},
		scope:this
	}),'->',{
		iconCls:'ic-save',
		text: t("Save"),
		handler:function(){
			this.save();
		},
		scope:this
	}];

	GO.projects2.TasksGrid.superclass.constructor.call(this, config);

	this.addEvents({
		'saved' : true
	});
	
	this.getSelectionModel().on('selectionchange',function(sm){
		this.ungroupButton.setDisabled(true);
		this.groupButton.setDisabled(true);
		
		var selections = sm.getSelections();
				
		for (var i=0; i<selections.length; i++) {
			if (selections[i].data.parent_id>0) {
				this.ungroupButton.setDisabled(false);
			} else {
				this.groupButton.setDisabled(false);
			}
		}
	},this);

};

Ext.extend(GO.projects2.TasksGrid, GO.grid.EditorGridPanel,{
	project_id:0,
	disabled:true,
	_recordsDeleted : false,
	_tasksPanelEnabled : false,
	
	notifyDrop : function(dd, e, data)
	{
		var sm=this.getSelectionModel();
		var rows=sm.getSelections();
		var dragData = dd.getDragData(e);
		var cindex=dragData.rowIndex;
		if(cindex=='undefined')
		{
			cindex=this.store.data.length-1;
		}	
		
		var copyParentRecord;
		if(cindex>0){
			copyParentRecord = this.store.getAt(cindex)
		}else
		{
			copyParentRecord = this.store.getAt(0);
		}
				
		var parent_id = copyParentRecord ? copyParentRecord.data.parent_id: 0;
		var parent_description = copyParentRecord ? copyParentRecord.data.parent_description : t("Ungrouped", "projects2");
		
		for(var i = rows.length-1; i > -1; i--) 
		{								
			var rowData=this.store.getById(rows[i].id);
			
			rowData.data.parent_id=parent_id;
			rowData.data.parent_description=parent_description;
			
			if(!this.copy){
				this.store.remove(this.store.getById(rows[i].id));
			}
			
			this.store.insert(cindex,rowData);
		}

		this.save();
		
	},
	
	showToGroupDialog : function() {
		
		if (!this.toGroupDialog) {
			this.toGroupDialog = new GO.projects2.ToGroupDialog();
			this.toGroupDialog.on('group_name', function(groupName){
				this.groupSelection(groupName);
			}, this);
		}
		this.toGroupDialog.show();
		
	},
	
	groupSelection : function(groupName){
		var selectedRows = this.selModel.getSelections();
		
		var parentTaskIndex = -1;
		
		// Find a subtask grouped under groupName
		var groupedRecordIndex = this.store.findBy(function(record,id){
			return record.data['parent_description'].toLowerCase() == groupName.toLowerCase();
		}, this);
		
		if (groupedRecordIndex!=-1) {
			// Subtask found under groupName. Use the subtask's parent id.
			var groupedRecord = this.store.getAt(groupedRecordIndex);
			if (typeof(groupedRecord)!='undefined') {
				parentTaskIndex = groupedRecord.data['parent_id'];
			}			
		} else {
			// If the there is currently no task grouped under groupName, find groupName's task itself.
			var groupRecordIndex = this.store.findBy(function(record,id){
				return record.data['description'].toLowerCase() == groupName.toLowerCase();
			}, this);
			var groupRecord = this.store.getAt(groupRecordIndex);
			if (typeof(groupRecord)!='undefined') {
				parentTaskIndex = groupRecord.data['id'];
			}
		}
		
		if (parentTaskIndex==-1) {
			var newGroupStoreIndex = this.addNewRow(groupName);
			var newGroupRecord = this.store.getAt(newGroupStoreIndex);
			parentTaskIndex = newGroupRecord.data.id;
		}
		
		if (parentTaskIndex!=-1) {
			// GroupName's task exists. Now group the selected tasks under it.
			for (var i=0; i<selectedRows.length; i++) {
				selectedRows[i].set('parent_id',parentTaskIndex);
			}
			this.save();
			this.ungroupButton.setDisabled(false);
			this.groupButton.setDisabled(true);
		} 
//		else {
//			// GroupName's task does not exist. Create it and put the selected tasks under it.
//			var groupRecordIndex = this.addNewRow(groupName);
//			
//			// The new task does not have a db ID yet, so we must save before we can use its ID.
//			GO.request({
//				maskEl:this.getEl(),
//				maskText:t("Saving..."),
//				url:'projects2/task/save',
//				method:'POST',
//				params:{
//					project_id:this.project_id,
//					data:Ext.encode(this.getGridData())
//				},
//				success:function(response, options, result){
//
//					this.store.loadData(result);
////					this._recordsDeleted = false;
////					var groupRecord = this.store.getAt(groupRecordIndex);
////
////					for (var i=0; i<selectedRows.length; i++) {
////						this.store.getById(selectedRows[i].data.id).set('parent_id',groupRecord.data.id);
////					}
////
////					this.save();
//					this.ungroupButton.setDisabled(false);
//					this.groupButton.setDisabled(true);
//				},
//				scope:this
//			});		
//
//		}
		
	},
	
	ungroupSelection : function(){
		var selectedRows = this.selModel.getSelections();

		for(var i=0;i<selectedRows.length;i++){		
			selectedRows[i].set('parent_id', 0);			
		}
		
		this.save();
		this.ungroupButton.setDisabled(true);
		this.groupButton.setDisabled(false);
	},
	
	save : function(newProjectId){
		
		// See MainPanel.js where this argument is passed.
		var newProjectId = newProjectId || -1;
		
		GO.request({
			maskEl:this.getEl(),
			maskText:t("Saving..."),
			url:'projects2/task/save',
			method:'POST',
			params:{
				project_id:this.project_id,
				data:Ext.encode(this.getGridData())
//				create:addNewRo
			},
			success:function(response, options, result){
				
//				var lastRecord = this.store.getAt(this.store.getCount()-1);
//				
//				if(lastRecord){
//					result.data.due_date=lastRecord.data.due_date;
//				}

				this.store.loadData(result);
				
				this.fireEvent('saved',newProjectId);
				
				this._recordsDeleted = false;
				
//				if(result.data){
//					var e = new GO.projects2.TaskRecord(result.data);
//					this.stopEditing();
//					var index = this.store.getCount();
//					this.store.insert(index, e);
//
//					var colIndex = this.getColumnModel().getIndexById('description');
//
//					this.startEditing(index, colIndex);
//				}
			},
			scope:this
		});		
	},
	
	deleteSelected : function(){
			var selectedRows = this.selModel.getSelections();
			for(var i=0;i<selectedRows.length;i++)
			{
				selectedRows[i].commit();
				this.store.remove(selectedRows[i]);
			}
		this._recordsDeleted = true;
	},
	
	addNewRow : function(groupName){	
//		this.save(true);
		
		var description = groupName || "";
		
		this.stopEditing();
		
		var index = this.store.getCount();
		
		var sm=this.getSelectionModel();
		var rows=sm.getSelections();
		var parent_id=0;
		var parent_description=t("Ungrouped", "projects2");
		
		if(rows.length){
			
			index = this.store.indexOf(rows[rows.length-1])+1;			
		}
		
		if (description)
			index = 0; // If there is a description, then this is a group task.
		
		var user_id;
		var previousRecord = this.store.getAt(index-1);
		if(previousRecord){
			parent_id=previousRecord.data.parent_id;
			parent_description=previousRecord.data.parent_description;
			user_id=previousRecord.data.user_id;
		}else
		{
			user_id = GO.settings.user_id;
			
			var resource = this.selectResource.store.find('user_id', user_id);
			if(resource===-1)
			{
				var firstRecord = this.selectResource.store.getAt(0);				
				user_id=firstRecord.data.id;
			}
		}
		
		var e = new GO.projects2.TaskRecord({
			id: 'new_'+parent_id+'_'+this.store.getCount(),
			description: description,
			due_date: "",
			duration: GO.util.numberFormat(1),
			hours_booked: GO.util.numberFormat(0),
			percentage_complete: 0,
			project_id: this.project_id,
			user_id: user_id,
			parent_id:parent_id,
			parent_description:parent_description
		});
		
		this.store.insert(index, e);

		var colIndex = this.getColumnModel().getIndexById('description');

		sm.selectRow(index);
		this.startEditing(index, colIndex);
		
		return index;
		
	},
	
	/*
	 * Overide ext method because there's no way to capture afteredit when there's no change.
	 * We need this because we format /unformat numbers before and after edit.
	 */
	onEditComplete : function(ed, value, startValue){
  	
		GO.projects2.TasksGrid.superclass.onEditComplete.call(this, ed, value, startValue);
		if(ed.col==5 && ed.row==this.store.getCount()-1)
			this.addNewRow();
	},
	
	setProjectId : function(project_id, tasksPanelEnabled){
		this.project_id=this.store.baseParams.project_id=project_id;			

		this._tasksPanelEnabled = tasksPanelEnabled;

		this.selectResource.setProjectId(this.project_id);
		
		this.setDisabled(!this._tasksPanelEnabled || !this.project_id || this.selectResource.store.getCount()==0);
		if (this._tasksPanelEnabled)
			this.expand();
		else
			this.collapse();
		
		if(project_id)
			this.store.load();
		else
			this.store.removeAll();
		
		this._recordsDeleted = false;
	},
	
	renderResource: function(value, p, record, rowIndex, colIndex, ds) {
		var cm = this.getColumnModel();
		var ce = cm.getCellEditor(colIndex, rowIndex);

		var val = '';
		
		var record = ce.field.store.getById(value);
		if (record !== undefined) {
			val = record.get("user_name");
		}
		return val;
	}
	
	,
	isDirty: function() {
		var dirtyRecordIndex = this.getStore().findBy(function(record,id){
			return record.dirty;
		}, this);
		
		return !this.disabled && (dirtyRecordIndex!=-1 || this._recordsDeleted);
	}
	
});
