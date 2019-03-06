GO.projects2.ProjectPanel = Ext.extend(GO.DisplayPanel, {

	model_name: "GO\\Projects2\\Model\\Project",

//	subProjectsTemplate : '',

	stateId: 'pm-project-panel',

	editGoDialogId: 'project',

	template:
					'<table class="display-panel" cellpadding="0" cellspacing="0" border="0">' +
					'<tr>' +
					'<td colspan="2" class="display-panel-heading"><h3>{template_name}: {name}</h3></td>' +
					'</tr>' +
					'<tpl if="!GO.util.empty(description)">' +
					'<tr>' +
					'<td colspan="2" class="display-panel-description"><p class="pm-description-label">' + t("Description") + '</p>{description}</td>' +
					'</tr>' +
					'</tpl>' +
					'<tpl if="!GO.util.empty(parent_project_path)">' +
					'<tr>' +
					'<td>' + t("Parent project", "projects2") + ':</td><td><a class="pm-subproject-link" href="#project-{parent_project_id}">{parent_project_path}</a></td>' +
					'</tr>' +
					'</tpl>' +
//		'<tr>'+
//		'<td>ID:</td><td>{id}</td>'+
//		'</tr>'+

					'<tpl if="!GO.util.empty(responsible_user_name)">' +
					'<tr>' +
					'<td>' + t("Manager", "projects2") + ':</td><td>{responsible_user_name}</td>' +
					'</tr>' +
					'</tpl>' +
					'<tr>' +
					'<td>' + t("Status", "projects2") + ':</td><td>{status_name}</td>' +
					'</tr>' +
					'<tpl if="!GO.util.empty(use_reference_no) && !GO.util.empty(reference_no)">' +
					'<tr>' +
					'<td>' + t("Reference no.", "projects2") + ':</td><td>{reference_no}</td>' +
					'</tr>' +
					'</tpl>' +
					'<tpl if="!GO.util.empty(customer)">' +
					'<tr>' +
					'<td>' + t("Customer") + ':</td><td>{customer}</td>' +
					'</tr>' +
					'</tpl>' +
					'<tpl if="!GO.util.empty(ctime)">' +
					'<tr>' +
					'<td>' + t("Created at") + ':</td><td>' +
					'{ctime}' +
					'</td>' +
					'</tr>' +
					'</tpl>' +
					
					'<tpl if="!GO.util.empty(contact)">' +
					'<tr>' +
					'<td>' + t("Contact", "projects2") + ':</td><td>{contact}</td>' +
					'</tr>' +
					'</tpl>' +
					
					'<tpl if="!GO.util.empty(start_time)">' +
					'<tr>' +
					'<td>' + t("Start time", "projects2") + ':</td><td>' +
					'{start_time}' +
					'</td>' +
					'</tr>' +
					'</tpl>' +
					
					'<tpl if="!GO.util.empty(due_time)">' +
					'<tr>' +
					'<td>' + t("Due at", "projects2") + ':</td><td class="{[this.getClass(values)]}">' +
					'{due_time}' +
					'</td>' +
					'</tr>' +					
					'</tpl>' +
					
					'</table>'+
					
					'<tpl if="!GO.util.empty(is_income_enabled)">' +
					'{[this.collapsibleSectionHeader(t("Financial", "projects2"), "pm-financial-"+values.panelId, "financial")]}' +
					'</tpl>' +
					
					'<table class="display-panel" cellpadding="0" cellspacing="0" border="0" id="pm-financial-{panelId}">' +
					
					'<tpl if="!GO.util.empty(is_income_enabled)">' +

					'<tpl if="!GO.util.empty(income_type_name)">' +
					'<tr>' +
					'<td>' + t("Income type", "projects2") + ':</td><td>' +
					'{income_type_name}' +
					'</td>' +
					'</tr>' +
					'<tr>' +
					'</tpl>' +
					
					'<tpl if="!GO.util.empty(budget_sum)">' +
					'<tr><td></td><th class="line" style="text-align:right">\n\\n\
				<div style="width:15%;float:left;">' + t("Income", "projects2") + '</div>\n\
				<div style="width:20%;float:left;">' + t("Internal fees", "projects2") + '</div>\n\
				<div style="width:15%;float:left;">' + t("Expenses", "projects2") + '</div>\n\
				<div style="width:15%;float:left;">' + t("Travel costs", "projects2") + '</div>\n\
				<div style="width:20%;float:left;">' + t("Total Percentage", "projects2") + '</div>\n\
				<div style="width:15%;float:left;font-weight:600;">' + t("Total", "projects2") + '</div>\n\
				</th></tr>' +
					'<tr>' +
					'<td>' + t("Budget", "projects2") + ':</td>' +
					'<td style="text-align:right;">\n\
						<div style="width:15%;float:left">{[GO.util.format.valuta(values.budget_sum.budget)]}</div>\n\
						<div style="width:20%;float:left;">{[GO.util.format.valuta(values.budget_sum.internalFee)]}</div>\n\
						<div style="width:15%;float:left">{[GO.util.format.valuta(values.budget_sum.expenses)]}</div>\n\
						<div style="width:15%;float:left">-</div>\n\
						<div style="width:20%;float:left;">&nbsp;</div>\n\
						<div style="width:15%;float:left;font-weight:600;color:{[values.budget_sum.sum<0?"red":"green"]}">{[GO.util.format.valuta(values.budget_sum.sum)]}</div>\n\
					</td>' +
					'</tr>' +
					'<tr>' +
					'<td>' + t("Realization", "projects2") + ':</td>' +
					'<td style="text-align:right;">\n\
						<div style="width:15%;float:left">{[GO.util.format.valuta(values.real_sum.budget)]}</div>\n\
						<div style="width:20%;float:left">{[GO.util.format.valuta(values.real_sum.internalFee)]}</div>\n\
						<div style="width:15%;float:left">{[GO.util.format.valuta(values.real_sum.expenses)]}</div>\n\
						<div style="width:15%;float:left">{[GO.util.format.valuta(values.real_sum.mileage)]}</div>\n\
						<div style="width:20%;float:left;color:{[values.real_sum.sum<values.budget_sum.sum?"red":"green"]}">{[values.budget_sum.sum > 0 ? GO.util.format.number((values.real_sum.sum / values.budget_sum.sum) * 100, 0) + "%" : "-"]}</div>\
						<div style="width:15%;float:left;font-weight:600;color:{[values.real_sum.sum<0?"red":"green"]}">{[GO.util.format.valuta(values.real_sum.sum)]}</div>\n\
					</td>' +
					'</tr>' +
					
					'<tpl if="income_type!=3">' +
					'<tr>' +
					'<td>' + t("Billing progress", "projects2") + ':</td><td>' +
					'<div class="pm-progressbar"><div class="pm-progress-indicator" style="width:{[Math.round((100/values.invoicable_amount)*values.invoiced_amount)]}%"></div></div>' +
					//'{[GO.util.format.valuta(values.budget_sum - values.income_total)]}'+
					'</td>' +
					'</tr>' +
					'</tpl>' +
					
					'</tpl>' +
					'</tpl>' + // is_income_enabled
			  
					'<tpl if="!GO.util.empty(show_subproject_totals)">' +
					
//				'<td>'+t("Subprojects budget", "projects2")+':</td><td>'+
//				'{subprojects_budget_sum}'+


					'<tpl if="!GO.util.empty(subprojects_budget_sum)">' +
					'<tr><td></td><th class="line" style="text-align:right;">\n\\n\
				<div style="width:15%;float:left;">' + t("Income", "projects2") + '</div>\n\
				<div style="width:20%;float:left;">' + t("Internal fees", "projects2") + '</div>\n\
				<div style="width:15%;float:left;">' + t("Expenses", "projects2") + '</div>\n\
				<div style="width:15%;float:left;">' + t("Travel costs", "projects2") + '</div>\n\
				<div style="width:20%;float:left;">' + t("Total Percentage", "projects2") + '</div>\n\
				<div style="width:15%;float:left;font-weight:600;">' + t("Total", "projects2") + '</div>\n\
				</th></tr>' +
					'<tr>' +
					'<td>' + t("Subprojects budget", "projects2") + ':</td>' +
					'<td style="text-align:right;">\n\
						<div style="width:15%;float:left">{[GO.util.format.valuta(values.subprojects_budget_sum.budget)]}</div>\n\
						<div style="width:20%;float:left;">{[GO.util.format.valuta(values.subprojects_budget_sum.internalFee)]}</div>\n\
						<div style="width:15%;float:left">{[GO.util.format.valuta(values.subprojects_budget_sum.expenses)]}</div>\n\
						<div style="width:15%;float:left">-</div>\n\
						<div style="width:20%;float:left">&nbsp;</div>\n\
						<div style="width:15%;float:left;font-weight:600;color:{[values.subprojects_budget_sum.sum<0?"red":"green"]}">{[GO.util.format.valuta(values.subprojects_budget_sum.sum)]}</div>\n\
					</td>' +
					'</tr>' +
					'<tr>' +
					'<td>' + t("Subprojects realization", "projects2") + ':</td>' +
					'<td style="text-align:right;">\n\
						<div style="width:15%;float:left">{[GO.util.format.valuta(values.subprojects_real_sum.budget)]}</div>\n\
						<div style="width:20%;float:left">{[GO.util.format.valuta(values.subprojects_real_sum.internalFee)]}</div>\n\
						<div style="width:15%;float:left">{[GO.util.format.valuta(values.subprojects_real_sum.expenses)]}</div>\n\
						<div style="width:15%;float:left">{[GO.util.format.valuta(values.subprojects_real_sum.mileage)]}</div>\n\
\n\					<div style="width:20%;float:left;color:{[values.subprojects_real_sum.sum<values.subprojects_budget_sum.sum?"red":"green"]}">{[GO.util.format.number((values.subprojects_real_sum.sum / values.subprojects_budget_sum.sum) * 100, 0)]}%</div>\n\
						<div style="width:15%;float:left;font-weight:600;color:{[values.subprojects_real_sum.sum<0?"red":"green"]}">{[GO.util.format.valuta(values.subprojects_real_sum.sum)]}</div>\n\
					</td>' +
					'</tr>' +
					'</tpl>' +
					
					'</td>' +
					'</tr>' +
					'<tr>' +
					'<td>' + t("Number of subprojects", "projects2") + ':</td><td>' +
					'{n_subprojects}' +
					'</td>' +
					'</tr>' +
					
//				'<tr>'+
//				'<td>'+t("Subprojects realization", "projects2")+':</td><td>'+
//				'{subprojects_real_sum}'+
//				'</td>'+
//				'</tr>'+
					'</tpl>' +
					//		'</tpl>'+

					//		'<tpl if="!isNaN(values.budget_status)">'+
					//		'<tr>'+
					//		'<td>'+t("Budget status", "projects2")+':</td><td>'+
					//		'<div style="margin-top:3px;border:1px solid #000;width:8px;height:8px;border-radius:8px;background-color:<tpl if="budget_status==2">red</tpl><tpl if="budget_status==0">lime</tpl>"></div>'+
					//		'</td>'+
					//		'</tr>'+
					//		'</tpl>'+

					'</table>',

	timeEntriesTemplate:
					'<tpl if="values.timeentries">' +
					'{[this.collapsibleSectionHeader(t("Time entries", "projects2"), "pm-timeentries-"+values.panelId, "timeentries")]}' +
					'<table class="display-panel" cellpadding="0" cellspacing="0" style="border-collapse:collapse;" border="0" id="pm-timeentries-{panelId}">' +
					'<tr>' +
					'<td class="table_header_links">' + t("Username") + '</td>' +
					'<td class="table_header_links" style="text-align:right" width="15%">' + t("Booked", "projects2") + '</td>' +
					'<td class="table_header_links" style="text-align:right" width="15%">' + t("Billed", "projects2") + '</td>' +
					'<td class="table_header_links" style="text-align:right" width="15%">' + t("Billable", "projects2") + '</td>' +
					'<td class="table_header_links" style="text-align:right" width="15%">' + t("Budgeted units", "projects2") + '</td>' +
					'<td class="table_header_links" style="text-align:right" width="15%">' + t("% Total", "projects2") + '</td>' +
					'<td class="table_header_links" style="text-align:right" width="15%">' + t("Modified at") + '</td>' +
					'</tr>' +
					'<tpl for="timeentries">' +
					'<tr class="{[this.getBudgetClass(values.status)]}">' +
					'<td style="white-space:nowrap">{user_name}</td>' +
					'<td style="white-space:nowrap;text-align:right" width="15%">{units}</td>' +
					'<td style="white-space:nowrap;text-align:right" width="15%">{invoiced_units}</td>' +
					'<td style="white-space:nowrap;text-align:right" width="15%">{billable_units}</td>' +
					'<td style="white-space:nowrap;text-align:right" width="15%">{budgeted_units}</td>' +
					'<td style="white-space:nowrap;text-align:right" width="15%">{percentage_total}</td>' +
					'<td style="white-space:nowrap;text-align:right" width="15%">{mtime}</td>' +
					'</tr>' +
					'</tpl>' +
					'<tpl if="timeentries_totals">' +
					'<tr class="{[this.getBudgetClass(values.timeentries_totals.status)]} line">' +
					'<td style="white-space:nowrap">' + t("Totals", "projects2") + '</td>' +
					'<td style="white-space:nowrap;text-align:right" width="15%">{values.timeentries_totals.units}</td>' +
					'<td style="white-space:nowrap;text-align:right" width="15%">{values.timeentries_totals.invoiced_units}</td>' +
					'<td style="white-space:nowrap;text-align:right" width="15%">{values.timeentries_totals.billable_units}</td>' +
					'<td style="white-space:nowrap;text-align:right" width="15%">{values.timeentries_totals.budgeted_units}</td>' +
					'<td style="white-space:nowrap;text-align:right" width="15%">{values.timeentries_totals.percentage_total}</td>' +
					'<td style="white-space:nowrap;text-align:right" width="15%">{values.timeentries_totals.mtime}</td>' +
					'</tr>' +
					'</tpl>' +
					'<tpl if="!timeentries.length">' +
					'<tr><td colspan="4">' + t("No items to display") + '</td></tr>' +
					'</tpl>' +
					'</table>' +
					'</tpl>',

	expensesTemplate:
					'<tpl if="values.expenseBudgets">' +
					'{[this.collapsibleSectionHeader(t("Expenses", "projects2"), "pm-expenses-"+values.panelId, "expenses")]}' +
					'<table class="display-panel" cellpadding="0" cellspacing="0" border="0" id="pm-expenses-{panelId}">' +
					'<tr>' +
					'<td class="table_header_links">' + t("Expense budget", "projects2") + '</td>' +
					'<td class="table_header_links" style="text-align:right" width="15%">' + t("Budgeted", "projects2") + '</td>' +
					'<td class="table_header_links" style="text-align:right" width="15%">' + t("Actual", "projects2") + '</td>' +
					'<td class="table_header_links" style="text-align:right" width="15%">' + t("% Total", "projects2") + '</td>' +
					'<td class="table_header_links" style="text-align:right" width="15%">' + t("Modified at") + '</td>' +
					'</tr>' +
					'<tpl for="expenseBudgets">' +
					'<tr class="{[this.getBudgetClass(values.status)]}">' +
					'<td style="white-space:nowrap">{description}</td>' +
					'<td style="white-space:nowrap;text-align:right" width="15%">{nett_budget}</td>' +
					'<td style="white-space:nowrap;text-align:right" width="15%">{nett_spent}</td>' +
					'<td style="white-space:nowrap;text-align:right" width="15%">{percentage_total}</td>' +
					'<td style="white-space:nowrap;text-align:right" width="15%">{mtime}</td>' +
					'</tr>' +
					'</tpl>' +
					'<tpl if="expenseBudgets_totals">' +
					'<tr class="{[this.getBudgetClass(values.expenseBudgets_totals.status)]} line">' +
					'<td style="white-space:nowrap">' + t("Totals", "projects2") + '</td>' +
					'<td style="white-space:nowrap;text-align:right" width="15%">{values.expenseBudgets_totals.nett_budget}</td>' +
					'<td style="white-space:nowrap;text-align:right" width="15%">{values.expenseBudgets_totals.nett_spent}</td>' +
					'<td style="white-space:nowrap;text-align:right" width="15%">{values.expenseBudgets_totals.percentage_total}</td>' +
					'<td style="white-space:nowrap;text-align:right" width="15%">{values.expenseBudgets_totals.mtime}</td>' +
					'</tr>' +
					'</tpl>' +
					'<tpl if="!expenseBudgets.length">' +
					'<tr><td colspan="4">' + t("No items to display") + '</td></tr>' +
					'</tpl>' +
					'</table>' +
					'</tpl>',

	incomesTemplate:
					'<tpl if="values.incomes">' +
					'{[this.collapsibleSectionHeader(t("Income", "projects2"), "pm-incomes-"+values.panelId, "incomes")]}' +
					'<table class="display-panel" cellpadding="0" cellspacing="0" border="0" id="pm-incomes-{panelId}">' +
					'<tr>' +
					'<td class="table_header_links">' + t("Income", "projects2") + '</td>' +
					'<td class="table_header_links" style="text-align:right" width="15%">' + t("Budgeted", "projects2") + '</td>' +
					'<td class="table_header_links" style="text-align:right" width="15%">' + t("Invoice at", "projects2") + '</td>' +
					'<tpl if="values.incomes[0].open_fee">' +
					'<td class="table_header_links" style="text-align:right" width="15%">' + t("Open fee", "projects2") + '</td>' +
					'</tpl>' +
					'<td class="table_header_links" style="text-align:right" width="15%">' + t("Paid at", "projects2") + '</td>' +
					'<td class="table_header_links" style="text-align:right" width="15%">' + t("Invoice No.", "projects2") + '</td>' +
					'<td class="table_header_links" style="text-align:right" width="15%">' + t("Reference no.", "projects2") + '</td>' +
					'<td class="table_header_links" style="text-align:right" width="15%">' + t("Invoiced", "projects2") + '</td>' +
					'<tpl if="values.incomes[0].add_to_exact">' +
					'<td class="table_header_links" style="text-align:right" width="15%">' + 'Exact' + '</td>' +
					'</tpl>' +
					'</tr>' +
					'<tpl for="incomes">' +
					'<tr>' +
					'<td style="white-space:nowrap">{description}</td>' +
					'<td style="white-space:nowrap;text-align:right" width="15%">{amount}</td>' +
					'<td style="white-space:nowrap;text-align:right" width="15%">{invoice_at}</td>' +
					'<tpl if="values.open_fee">' +
					'<td style="white-space:nowrap;text-align:right" width="15%">{open_fee}</td>' +
					'</tpl>' +
					'<td style="white-space:nowrap;text-align:right" width="15%">{paid_at}</td>' +
					'<td style="white-space:nowrap;text-align:right" width="15%">{invoice_number}</td>' +
					'<td style="white-space:nowrap;text-align:right" width="15%">{reference_no}</td>' +
					'<td style="white-space:nowrap;text-align:right" width="15%">{is_invoiced}</td>' +
					'<tpl if="values.add_to_exact">' +
					'<td style="white-space:nowrap;text-align:right" width="15%">{add_to_exact}</td>' +
					'</tpl>' +
					'</tr>' +
					'</tpl>' +
					'<tpl if="values.income_total">' +
					'<tr class="line">' +
					'<td style="white-space:nowrap">' + t("Totals", "projects2") + '</td>' +
					'<td style="white-space:nowrap;text-align:right" width="15%">{values.income_total}</td>' +
					'<td colspan="5" style="white-space:nowrap;text-align:right"></td>' +
					'</tr>' +
					'</tpl>' +
					'</table>' +
					'</tpl>',

	editHandler: function () {
		GO.projects2.showProjectDialog({
			project_id: this.link_id
		});
	},

	initComponent: function () {

		this.on('afterbodyclick', function (panel, target, e, href) {
			var pos = href.indexOf('#project-');
			if (pos > -1)
			{
				var project_id = href.substr(pos + 9, href.length);

				this.load(project_id);
			}
		}, this);


		this.loadUrl = ('projects2/project/display');


//		this.subProjectsTemplate =  '<div id="projects2-subprojectsgrid"></div>';

//		'<tpl if="values.subprojects">'+
//		'{[this.collapsibleSectionHeader(t("Sub items", "projects2"), "pm-subprojects-"+values.panelId, "subprojects")]}'+
//
//		'<table class="display-panel" cellpadding="0" cellspacing="0" border="0" id="pm-subprojects2-{panelId}">'+
//
//		'<tr>'+
//		'<td class="table_header_links">' + t("Name") + '</td>'+
//		'<td class="table_header_links">' + t("Status", "projects2") + '</td>'+
//		'<td class="table_header_links">' + t("Due at", "projects2") + '</td>'+
//		'</tr>'+
//
//		'<tpl for="subprojects">'+
//		'<tr>'+
//		'<td><div class="go-grid-icon go-model-icon-GO_Projects2_Model_Project" style="width:auto;white-space:normal;margin-left:{margin}px;<tpl if="!GO.util.empty(icon)">background-image:url({icon}) !important;</tpl>"><a class="pm-subproject-link" href="#project-{id}">{name}</a></div></td>'+
//		'<td style="white-space:nowrap">{status_name}</td>'+
//		'<td style="white-space:nowrap" class="{[this.getClass(values)]}">{due_time}</td>'+
//		'</tr>'+
//		'</tpl>'+
//		'<tpl if="!subprojects.length">'+
//		'<tr><td colspan="4">'+t("No items to display")+'</td></tr>'+
//		'</tpl>'+
//		'</table>'+
//		'</tpl>';

//		if(go.Modules.isAvailable("legacy", "lists"))
//			this.template += GO.lists.ListTemplate;

		this.template += GO.customfields.displayPanelTemplate;

		this.template += this.timeEntriesTemplate +
						this.expensesTemplate +
						this.incomesTemplate
//			+
//			this.subProjectsTemplate
						;

		//if(go.Modules.isAvailable("legacy", "workflow"))
		//	this.template +=GO.workflow.WorkflowTemplate;

//		if(go.Modules.isAvailable("legacy", "tasks"))
//			this.template +=GO.tasks.TaskTemplate;
//
//		if(go.Modules.isAvailable("legacy", "calendar"))
//			this.template += GO.calendar.EventTemplate;

		//this.template +=GO.linksTemplate;


		Ext.apply(this.templateConfig, {

			getBudgetClass: function (status) {
				switch (status) {
					case 2:
						return 'pm-over-budget';
						break;

					case 1:
						return 'pm-budget-warning';
						break
					default:
						return "";

						break;
				}
			},
			getClass: function (values) {

				var cls = '';

				var now = new Date();
				var date = Date.parseDate(values.due_time, GO.settings.date_format);


				if (date < now)
				{
					cls = 'projects-late ';
				}

				if (values.completed == '1')
				{
					cls += 'projects-completed';
				}
				return cls;
			},
			getUnitsClass: function (values) {
				var cls = '';
				if (values.units_budget > 0 && values.units_booked >= values.units_budget)
				{
					cls = 'projects-late ';
				}

				return cls;
			}
		});





		GO.projects2.ProjectPanel.superclass.initComponent.call(this);

		this.subProjectsGrid = new GO.projects2.SubProjectsGrid({
			collapsible: true,
			bbar:[
				{					
					text: t("Add"),
					cls: 'x-btn-text-icon',
					handler: function(){
						if(GO.projects2.max_projects>0 && this.store.totalLength>=GO.projects2.max_projects)
						{
							Ext.Msg.alert(t("Error"), t("The maximum number of projects has been reached. Contact your hosting provider to activate unlimited usage of the projects module.", "projects2"));
						}else
						{
							GO.projects2.showProjectDialog({
								parent_project_id: this.data.id,
								values:{
									type_id:this.data.type_id
								}
								});
							GO.projects2.projectDialog.addListenerTillHide('save', function(){
								this.reload();
							}, this);
						}
					},
					scope: this
				}
			]
		});
		this.subProjectsGrid.on('rowdblclick', function (grid, rowIndex, event) {

			var record = grid.store.getAt(rowIndex);
			GO.mainLayout.getModulePanel('projects2')._switchProject(record.data.id);

		}, this);

		this.insert(1, this.subProjectsGrid);

		this._addNewMenuButtons();
	},

	_addNewMenuButtons: function () {


		this.moreButton.menu.insert(0, "-");


//		this.templatesStore = new GO.data.JsonStore({
//			url : GO.url("projects2/template/menu"),
//			baseParams : {
//				'parent_project_id':"0"
//			},
//			root : 'results',
//			totalProperty : 'total',
//			id : 'id',
//			fields : ['id', 'name','text'],
//			remoteSort : true
//		});


		this.moreButton.menu.insert(0, this.duplicateBtn = new Ext.menu.Item({
			iconCls: 'ic-file-copy',
			text: t("Duplicate", "projects2"),
			handler: function () {
				if (GO.projects2.max_projects > 0 && this.treePanel.store.totalLength >= GO.projects2.max_projects)
				{
					Ext.Msg.alert(t("Error"), t("The maximum number of projects has been reached. Contact your hosting provider to activate unlimited usage of the projects module.", "projects2"));
				} else
				{

					if (!this.duplicateProjectDialog) {
						this.duplicateProjectDialo = new GO.projects2.DuplicateProjectDialog({})

					}

					this.duplicateProjectDialo.show({
						project_id: this.link_id,
						duplicate_id: this.link_id
					});
				}
			},
			scope: this
		}));

		this.moreButton.menu.insert(0, this.manrgeBtn = new Ext.menu.Item({
			iconCls: 'ic-merge-type',
			text: t("Merge"),
			handler: function () {
				var curentProjectId = this.data.id;

				if (!this.projectMergeDialog) {
					this.projectMergeDialog = new GO.projects2.MergeDialog({});
					this.projectMergeDialog.on("hide", function () {

						this.fireEvent("fullReload", this);
//						this.reload();
					}, this);

				}

//				this.projectMergeDialog.toProjectId = curentProjectId;

				this.projectMergeDialog.show(curentProjectId);
			},
			scope: this
		}));

		this.moreButton.menu.insert(0, "-");

		this.moreButton.menu.insert(0, this.addExpenseBtn = new Ext.menu.Item({
			iconCls: 'ic-credit-card',
			text: t("Expense", "projects2"),
			handler: function () {
				if (!this.expenseDialog) {
					this.expenseDialog = new GO.projects2.ExpenseDialog();
				}
				this.expenseDialog.show(0, {
					values: {
						project_id: this.data.id
					}
				});
			},
			scope: this
		}));

		if (go.Modules.isAvailable("legacy", "timeregistration2")) {
			this.moreButton.menu.insert(0, this.addTimeEntryBtn = new Ext.menu.Item({
				iconCls: 'ic-schedule',
				text: t("Time entry", "projects2"),
				handler: function () {
					if (!this.timeEntryDialog)
						this.timeEntryDialog = new GO.projects2.TimeEntryDialog({
							id: 'pm-timeentry-dialog'
						});

					this.timeEntryDialog.show(0, {
						loadParams: {
							project_id: this.data.id
						}
					});
				},
				scope: this
			}));
		}

		this.moreButton.menu.insert(0,{
			iconCls: 'ic-euro-symbol',
			text: t('Invoice'),
			handler: function() {
				var dlg = new GO.projects2.InvoiceProjectDialog();
				dlg.show({projectId: this.data.id});
			},
			scope:this
		});
		


//		this.newMenuButton.menu.add(this.addFromTimerMenuItem = new Ext.menu.Item({
//			iconCls:'pm-time-entry',
//			hidden : true,
//			text:t("Time entry", "projects2") + ' (timer)' ,
//			handler:function(){
//				if(!this.timeEntryDialog)
//					this.timeEntryDialog = new GO.projects2.TimeEntryDialog({
//						id: 'pm-timeentry-dialog'
//					});
//
//				var hours = GO.projects2.timerButton.stopTimer();
//
//				this.timeEntryDialog.show(0,{
//					loadParams:{
//						project_id:this.data.id,
//						standardTaskDuration:(hours*60)
//					}
//				});
//
//				this.timeEntryDialog.startTime.setValue(GO.projects2.timeButton.startTime);
//				this.timeEntryDialog.setEndTime();
//
//			},
//			scope:this
//		}));




//				


		this.moreButton.menu.add('-');
		

		this.moreButton.menu.add(this.reportBtn = new Ext.menu.Item({
			iconCls: 'pm-btn-report',
			text: t("Report", "projects2"),
			cls: 'x-btn-text-icon',
			handler: function () {
				if (!this.reportDialog) {
					this.reportDialog = new GO.projects2.ReportDialog();
				}
				this.reportDialog.show(this.data.id);
			},
			scope: this
		}));
	},

	setData: function (data)
	{
		GO.projects2.ProjectPanel.superclass.setData.call(this, data);


		//set the default calendar id
//		this.newMenuButton.menu.eventShowConfig = {
//			calendar_id: data.calendar_id
//		};
//		this.newMenuButton.menu.taskShowConfig = {
//			tasklist_id: data.tasklist_id
//		};

		if (data.write_permission)
		{
			if (this.scheduleCallItem)
			{
				this.scheduleCallItem.setLinkConfig({
					name: this.data.contact,
					model_id: this.data.contact_id,
					model_name: "GO\\Addressbook\\Model\\Contact",
					callback: this.reload,
					scope: this
				});
			}
		}

		if (this.addTimeEntryBtn)
			this.addTimeEntryBtn.setDisabled(data.enabled_fields.indexOf('budget_fees') == -1);

		if (this.addExpenseBtn)
			this.addExpenseBtn.setDisabled(data.enabled_fields.indexOf('expenses') == -1);
		//this.reportBtn.setDisabled(data.project_type==0);//not for container type

		// Disable the duplicate button if parent is not writable
		if (data.parent_project_write_permission) {
			this.duplicateBtn.setDisabled(false);
		} else {
			this.duplicateBtn.setDisabled(true);
		}

		this.subProjectsGrid.store.baseParams.parent_project_id = this.data.id;
		this.subProjectsGrid.store.load({
			scope: this,
			callback: function() {
				this.subProjectsGrid.setVisible(this.subProjectsGrid.store.getCount() > 0);
			}
		});

		this.reportBtn.setDisabled(data.permission_level < GO.projects2.permissionLevelFinance);
		

	}
});


Ext.reg('projectpanel', GO.projects2.ProjectPanel);
