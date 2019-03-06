GO.email.SearchDialog = function(config){

	//Ext.apply(config);

	return {
		hasSearch : false,
		show :  function(){
		
			if(!this.dialog)
			{
				
				this.formPanel = new Ext.FormPanel({
					defaults: {
						anchor: '100%'
					},
					defaultType: 'textfield',
					cls: 'go-form-panel',
					autoHeight:true,
					labelWidth:125,
			        
					items: [{
						fieldLabel: t("Subject", "email"),
						name: 'subject'
					},
					{
						fieldLabel: t("Sender", "email"),
						name: 'from'
					},
					{
						fieldLabel: t("Recipient", "email"),
						name: 'to'
					},
					{
						fieldLabel: t("Recipient (CC)", "email"),
						name: 'cc'
					},
					{
						fieldLabel: t("Body", "email"),
						name: 'body'
					},
					new Ext.form.DateField({
						fieldLabel: t("Received before", "email"),
						name: 'before',
						format: GO.settings['date_format']
					}),
					new Ext.form.DateField({
						fieldLabel: t("Received since", "email"),
						name: 'since',
						format: GO.settings['date_format']
					}),
					new Ext.form.ComboBox({
						fieldLabel: t("Flagged", "email"),
						name:'flagged',
						store: new Ext.data.SimpleStore({
							fields: ['value', 'text'],
							data : [
							['', t("N/A", "email")],
							['FLAGGED', t("Yes")],
							['UNFLAGGED', t("No")]
							]
				                    
						}),
						value:'',
						valueField:'value',
						displayField:'text',
						mode: 'local',
						triggerAction: 'all',
						editable: false,
						selectOnFocus:true,
						forceSelection: true
					}),
					new Ext.form.ComboBox({
						fieldLabel: t("Answered", "email"),
						name:'answered',
						store: new Ext.data.SimpleStore({
							fields: ['value', 'text'],
							data : [
							['', t("N/A", "email")],
							['ANSWERED', t("Yes")],
							['UNANSWERED', t("No")]
							]
				                    
						}),
						value:'',
						valueField:'value',
						displayField:'text',
						mode: 'local',
						triggerAction: 'all',
						editable: false,
						selectOnFocus:true,
						forceSelection: true
					}),
					new Ext.form.ComboBox({
						fieldLabel: t("Read", "email"),
						name:'seen',
						store: new Ext.data.SimpleStore({
							fields: ['value', 'text'],
							data : [
							['', t("N/A", "email")],
							['SEEN', t("Yes")],
							['UNSEEN', t("No")]
							]
				                    
						}),
						value:'',
						valueField:'value',
						displayField:'text',
						typeAhead: true,
						mode: 'local',
						triggerAction: 'all',
						editable: false,
						selectOnFocus:true,
						forceSelection: true
					}),{
						xtype: 'radiogroup',
						//hideLabel: true,
						name: 'searchInGroup',
						fieldLabel: t("Search in", "email"),
						itemCls: 'x-check-group-alt',
						columns: 1,
						items: [
							{
								boxLabel: t("Current folder", "email"),
								name: 'searchIn',
								inputValue: 'current',
								checked: true
							},{
								boxLabel: t("Include subfolders", "email"),
								name: 'searchIn',
								inputValue: 'recursive'
							},{
								boxLabel: t("All folders", "email"),
								name: 'searchIn',
								inputValue: 'all'
							}
						]	
					}
					]
				});
				
				
				this.dialog = new Ext.Window({
					layout: 'fit',
					title: t("Search"),
					modal:false,
					autoHeight:true,
					width:500,
					closeAction:'hide',				
					items: this.formPanel,
					buttons:[{
						text: t("Reset"),
						handler: function(){
							this.formPanel.form.reset();			
						},
						scope:this					
					},{
						text: t("Search"),
						handler: this.doSearch,
						scope:this					
					}],
					keys: [{
						key: Ext.EventObject.ENTER,
						fn: this.doSearch,
						scope:this
					}],
					focus: function(){
						this.formPanel.form.findField('subject').focus(true);
					}.createDelegate(this)
				}
				);	
				
		
			}

			this.dialog.show();

			if(GO.email.search_query)
			{
				var search_query = GO.email.search_query;
				var search_type = (GO.email.search_type) ? GO.email.search_type : GO.email.search_type_default;

				this.formPanel.form.findField('from').setValue(
					(search_type == 'from') ? search_query : '');
				this.formPanel.form.findField('subject').setValue(
					(search_type == 'subject') ? search_query : '');
				this.formPanel.form.findField('to').setValue(
					(search_type == 'to') ? search_query : '');
				this.formPanel.form.findField('cc').setValue(
					(search_type == 'cc') ? search_query : '');
                                
			}
		},
		
		doSearch : function(){

			this.hasSearch = true;
			config.store.baseParams['query']=this.buildQuery();
			config.store.baseParams['searchIn']=this.formPanel.form.findField('searchInGroup').getValue().inputValue;
			config.store.load();

			this.dialog.hide();					
		},
		
		
		buildQuery : function() {
			var query = '';

			var months=['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			
			var form = this.formPanel.form;
			
			var subject = form.findField('subject').getValue();
			var from = form.findField('from').getValue();
			var to = form.findField('to').getValue();
			var cc = form.findField('cc').getValue();
			var body = form.findField('body').getValue();
			
			var before = form.findField('before').getValue();
			var since = form.findField('since').getValue();
			
			var flagged = form.findField('flagged').getValue();
			var seen = form.findField('seen').getValue();
			var answered = form.findField('answered').getValue();
			
			if (subject != '') {
				query += 'SUBJECT "'+subject+'" ';
			}
			
			if (from != '') {
				query += 'FROM "'+from+'" ';
			}
			
			if (to != '') {
				query += 'TO "'+to+'" ';
			}
			
			if (cc != '') {
				query += 'CC "'+cc+'" ';
			}
			if (body != '') {
				query += 'BODY "'+body+'" ';
			}
			
			if(before!='')
			{
				query += 'BEFORE '+before.format('j')+'-'+months[before.format('n')-1]+'-'+before.format('Y')+' ';
			}
			
			if(since!='')
			{
				query += 'SINCE '+since.format('j')+'-'+months[since.format('n')-1]+'-'+since.format('Y');
			}
			
			if (flagged != '') {
				query += ' '+flagged;
			}
			
			if (seen != '') {
				query += ' '+seen;
			}
			
			if (answered != '') {
				query += ' '+answered;
			}

			
			return query;
		}
		
		
	}
}
