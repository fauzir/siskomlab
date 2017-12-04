'use strict';

BX.namespace('Tasks.Component');

(function(){

	if (typeof BX.Tasks.Component.TaskView != 'undefined')
	{
		return;
	}

	BX.Tasks.Component.TaskView = function(parameters)
	{
		this.parameters = parameters || {};
		this.taskId = this.parameters.taskId;
		this.stageId = parseInt(this.parameters.stageId);
		this.stages = this.parameters.stages || {};
		this.layout = {
			favorite: BX("task-detail-favorite"),
			switcher: BX("task-switcher"),
			switcherTabs: [],
			elapsedTime: BX("task-switcher-elapsed-time"),
			createButton: BX("task-detail-create-button"),
			importantButton: BX("task-detail-important-button"),
			stagesWrap: BX("tasksStagesWrap"),
			stages: BX("tasksStages")
		};

		this.messages = this.parameters.messages || {};
		for (var key in this.messages)
		{
			BX.message[key] = this.messages[key];
		}

		this.paths = this.parameters.paths || {};
		this.createButtonMenu = [];

		this.query = new BX.Tasks.Util.Query();
		this.query.bindEvent("executed", BX.proxy(this.onQueryExecuted, this));

		BX.addCustomEvent(
			window, 
			"tasksTaskEvent", 
			this.onTaskEvent.bind(this)
		);

		BX.addCustomEvent(
			window, 
			"onChangeProjectLink", 
			BX.delegate(this.onChangeProjectLink, this)
		);

		this.initFavorite();
		this.initCreateButton();
		this.initSwitcher();
		this.initViewer();
		this.initAjaxErrorHandler();
		this.initImportantButton();
		this.initStages();

		this.fireTaskEvent();

		this.temporalCommentFix();
	};

	// todo: remove when forum stops calling the same page for comment.add()
	BX.Tasks.Component.TaskView.prototype.temporalCommentFix = function()
	{
		BX.addCustomEvent(window, 'OnUCFormResponse', function(id, id1, obj){
			if (BX.type.isNotEmptyString(id) && id.indexOf("TASK_") === 0 && BX.proxy_context && BX.proxy_context.jsonFailure === true)
			{
				if (obj && obj["handler"] && obj.handler["oEditor"] && obj.handler.oEditor["DenyBeforeUnloadHandler"])
				{
					obj.handler.oEditor.DenyBeforeUnloadHandler();
				}
				BX.reload();
			}
		});
	};

	BX.Tasks.Component.TaskView.prototype.fireTaskEvent = function()
	{
		if(this.parameters.eventTaskUgly != null)
		{
			BX.Tasks.Util.fireGlobalTaskEvent(this.parameters.componentData.EVENT_TYPE, {ID: this.parameters.eventTaskUgly.id}, {STAY_AT_PAGE: true}, this.parameters.eventTaskUgly);
		}
	};

	BX.Tasks.Component.TaskView.prototype.initImportantButton = function()
	{
		if(this.parameters.can.TASK.ACTION.EDIT)
		{
			BX.bind(this.layout.importantButton, "click", BX.Tasks.passCtx(this.onImportantButtonClick, this));
		}
	};

	/**
	 * Draw stages block.
	 * @returns {void}
	 */
	BX.Tasks.Component.TaskView.prototype.initStages = function()
	{
		if (this.layout.stages && this.stages)
		{
			var canChange = this.parameters.can.TASK.ACTION.SORT;
			var stagesShowed = this.stages.length > 0;
			
			BX.cleanNode(this.layout.stages);
			
			for (var i=0, c=this.stages.length; i<c; i++)
			{
				this.layout.stages.appendChild(BX.create("div", {
					props: {
						className: "task-section-status-step"
					},
					children: [
						BX.create("div", {
							props: {
								className: "task-section-status-step-item"
							},
							children: [
								this.stages[i].TEXT_LAYOUT = BX.create("div", {
									attrs: {
										"data-stageId": this.stages[i].ID
									},
									props: {
										className: "task-section-status-step-item-text"
									},
									text: this.stages[i].TITLE,
									events: 
										canChange
										? {
											click: BX.delegate(this.setStageHadnler, this)
										}
										: null,
									style: 
										!canChange
										? {
											cursor: "default"
										}
										: null
								})
							]
						})
					]
				}));
			}

			if (stagesShowed)
			{
				BX.show(this.layout.stagesWrap);
				
				if (this.stageId > 0)
				{
					this.setStage(this.stageId);
				}
				else
				{
					this.setStage(this.stages[0].ID);
				}
			}
			else
			{
				BX.hide(this.layout.stagesWrap);
			}
		}
	};
	
	/**
	 * Handler on change task group.
	 * @param {int} groupId
	 * @param {int} taskId
	 * @returns {void}
	 */
	BX.Tasks.Component.TaskView.prototype.onChangeProjectLink = function(groupId, taskId)
	{
		groupId = parseInt(groupId);
		
		// stage id is nulled after group change
		this.stageId = 0;
		
		// get new stages and redraw block
		if (groupId === 0)
		{
			this.stages = [];
			this.initStages();
		}
		else
		{
			var data = {
				entityId: groupId,
				entityType: "G"
			};
			this.query.run("task.stages.canmovetask", data).then(function(result){
				if (result.isSuccess())
				{
					this.parameters.can.TASK.ACTION.SORT = result.data === true;
				}
			}.bind(this));
			
			var data = {
				entityId: groupId,
				numeric: true
			};
			this.query.run("task.stages.get", data).then(function(result){
				if (result.isSuccess())
				{
					this.stages = result.data;
					this.initStages();
				}
			}.bind(this));
			
			this.query.execute();
		}
	};
	
	/**
	 * Get data of the stage.
	 * @param {int} stageId
	 * @returns {Object|null}
	 */
	BX.Tasks.Component.TaskView.prototype.getStageData = function(stageId)
	{
		stageId = parseInt(stageId);
		
		if (this.stages)
		{
			for (var id in this.stages)
			{
				if (parseInt(this.stages[id].ID) === stageId)
				{
					return this.stages[id];
				}
			}
		}
		
		return null;
	};

	/**
	 * Handler for click by task stage.
	 * @returns {void}
	 */
	BX.Tasks.Component.TaskView.prototype.setStageHadnler = function()
	{
		var stageId = BX.data(BX.proxy_context, "stageId");
		this.setStage(stageId);
		this.saveStage(stageId);
	};

	/**
	 * Server-side set stage of task.
	 * @param {int} stageId
	 * @returns {void}
	 */
	BX.Tasks.Component.TaskView.prototype.saveStage = function(stageId)
	{
		stageId = parseInt(stageId);
		if (stageId === this.stageId)
		{
			return;
		}
		this.stageId = stageId;
		var data = {
			id: this.taskId,
			stageId: stageId
		};
		this.query.run("task.stages.movetask", data).then(function(result){
			if (result.isSuccess())
			{
				BX.Tasks.Util.fireGlobalTaskEvent(
					"UPDATE_STAGE", 
					{ID: data.id, STAGE_ID: data.stageId}, 
					{STAY_AT_PAGE: true}, 
					{id: data.id}
				);
			}
		}.bind(this));
		this.query.execute();
	};

	/**
	 * Visual set stage of task.
	 * @param {int} stageId
	 * @returns {void}
	 */
	BX.Tasks.Component.TaskView.prototype.setStage = function(stageId)
	{
		var stage = this.getStageData(stageId);
		stageId = parseInt(stageId);
		
		if (this.stages && stage)
		{
			var color = "#" + stage["COLOR"];
			var clearAll = true;
			var layout;
			for (var i=0, c=this.stages.length; i<c; i++)
			{
				layout = this.stages[i].TEXT_LAYOUT;
				if (clearAll)
				{
					layout.style.color = this.calculateTextColor(color);
					layout.style.backgroundColor = color;
					layout.style.borderBottomColor = color;
				}
				else
				{
					layout.style.backgroundColor = "";
					layout.style.borderBottomColor = "#" + this.stages[i].COLOR;
				}
				if (parseInt(this.stages[i].ID) === stageId)
				{
					clearAll = false;
				}
			}
		}
	};

	/**
	 * Calculate text color - black or white.
	 * @param {String} baseColor
	 * @returns {String}
	 */
	BX.Tasks.Component.TaskView.prototype.calculateTextColor = function(baseColor)
	{
		var defaultColors = [
			"00c4fb",
			"47d1e2",
			"75d900",
			"ffab00",
			"ff5752",
			"468ee5",
			"1eae43"
		];
		var r, g, b;

		if (BX.util.in_array(baseColor.toLowerCase(), defaultColors))
		{
			return "#fff";
		}
		else
		{
			var c = baseColor.split("");
			if (c.length== 3){
				c= [c[0], c[0], c[1], c[1], c[2], c[2]];
			}
			c = "0x" + c.join("");
			r = ( c >> 16 ) & 255;
			g = ( c >> 8 ) & 255;
			b =  c & 255;
		}

		var y = 0.21 * r + 0.72 * g + 0.07 * b;
		return ( y < 145 ) ? "#fff" : "#333";
	};

	BX.Tasks.Component.TaskView.prototype.initCreateButton = function()
	{
		BX.bind(this.layout.createButton, "click", this.onCreateButtonClick.bind(this));

		var paths = this.paths;
		var self = this;

		this.createButtonMenu = [
			{
				text : this.messages.addTask,
				className : "menu-popup-item menu-popup-no-icon",
				href: this.paths.newTask
			},
			{
				text : this.messages.addTaskByTemplate,
				className : "menu-popup-item menu-popup-no-icon menu-popup-item-submenu",
				events:
				{
					onSubMenuShow: function()
					{
						if (this.subMenuLoaded)
						{
							return;
						}

						var query = new BX.Tasks.Util.Query({
							autoExec: true
						});

						var submenu = this.getSubMenu();
						submenu.removeMenuItem("loading");

						query.add('task.template.find', { parameters: { select: ['ID', 'TITLE'] } }, {}, BX.delegate(function(errors, data)
						{
							this.subMenuLoaded = true;

							if (!errors.checkHasErrors())
							{

								var tasksTemplateUrlTemplate = paths.newTask
									+ (
										paths.newTask.indexOf('?') !== -1
										? '&' : '?'
									)
								+ 'TEMPLATE=';

								var subMenu = [];
								if (data.RESULT.DATA.length > 0)
								{
									BX.Tasks.each(data.RESULT.DATA, function(item, k)
									{
										subMenu.push({
											text: BX.util.htmlspecialchars(item.TITLE),
											href: tasksTemplateUrlTemplate + item.ID
										});
									}.bind(this));
								}
								else
								{
									subMenu.push({ text: self.messages.tasksAjaxEmpty });
								}
								this.addSubMenu(subMenu);
								this.showSubMenu();
							}
							else
							{
								this.addSubMenu([
									{ text: self.messages.tasksAjaxErrorLoad }
								]);

								this.showSubMenu();
							}

						}, this));
					}
				},
				items: [
					{
						id: "loading",
						text: "TASKS_AJAX_LOAD_TEMPLATES"
					}
				]
			},


			{
				delimiter:true
			},

			{
				text : this.messages.addSubTask,
				className : "menu-popup-item menu-popup-no-icon",
				href: this.paths.newSubTask
			},
			{
				delimiter:true
			},
			{
				text : this.messages.listTaskTemplates,
				className : "menu-popup-item menu-popup-no-icon",
				href: this.paths.taskTemplates
			}
		];
	};

	BX.Tasks.Component.TaskView.prototype.onImportantButtonClick = function(node)
	{
		var priority = BX.data(node, 'priority');
		var newPriority = priority == 2 ? 1 : 2;

		this.query.run('task.update', {id: this.parameters.taskId, data: {
			PRIORITY: newPriority
		}}).then(function(result){
			if(result.isSuccess())
			{
				BX.data(node, 'priority', newPriority);
				BX.toggleClass(node, 'no');
			}
		}.bind(this));
		this.query.execute();
	};

	BX.Tasks.Component.TaskView.prototype.onCreateButtonClick = function()
	{
		BX.PopupMenu.show(
			"task-detail-create-button",
			this.layout.createButton,
			this.createButtonMenu,
			{
				angle:
					{
						position: "top",
						offset: 40
					}
			}
		);
	};

	BX.Tasks.Component.TaskView.prototype.onTaskEvent = function(type, parameters)
	{
		parameters = parameters || {};
		var data = parameters.task || {};

		if(type == 'UPDATE' && data.ID == this.parameters.taskId)
		{
			if(BX.type.isNotEmptyString(data.REAL_STATUS))
			{
				this.setStatus(data.REAL_STATUS);
			}
		}
	};

	BX.Tasks.Component.TaskView.prototype.setStatus = function(status)
	{
		var statusContainer = BX("task-detail-status-below-name");
		if(statusContainer)
		{
			var statusName = BX.message("TASKS_STATUS_" + status);
			statusContainer.innerHTML = statusName.substr(0, 1).toLowerCase()+statusName.substr(1);
		}
	};

	BX.Tasks.Component.TaskView.prototype.initFavorite = function()
	{
		BX.bind(this.layout.favorite, "click", BX.proxy(this.onFavoriteClick, this));
	};

	BX.Tasks.Component.TaskView.prototype.onFavoriteClick = function()
	{
		var action = BX.hasClass(this.layout.favorite, "task-detail-favorite-active") ? "task.favorite.delete" : "task.favorite.add";

		this.query.deleteAll();
		this.query.add(
			action,
			{
				taskId: this.taskId
			},
			{
				code: action
			}
		);

		this.query.execute();

		BX.toggleClass(this.layout.favorite, "task-detail-favorite-active");
	};

	BX.Tasks.Component.TaskView.prototype.initSwitcher = function()
	{
		if (!this.layout.switcher)
		{
			return;
		}

		var tabs = this.layout.switcher.getElementsByClassName("task-switcher");
		var blocks = this.layout.switcher.parentNode.getElementsByClassName("task-switcher-block");
		for (var i = 0; i < tabs.length; i++)
		{
			var tab = tabs[i];
			var block = blocks[i];
			BX.bind(tab, "click", BX.proxy(this.onSwitch, this));
			this.layout.switcherTabs.push({
				title: tab,
				block: block
			});
		}

		BX.addCustomEvent("TaskElapsedTimeUpdated", BX.proxy(function(a, b, c, totalTime) {
			this.layout.elapsedTime.innerText = BX.Tasks.Util.formatTimeAmount(totalTime.time);
		}, this));
	};

	BX.Tasks.Component.TaskView.prototype.onSwitch = function()
	{
		var currentTitle = BX.proxy_context;
		if (BX.hasClass(currentTitle, "task-switcher-selected"))
		{
			return false;
		}

		for (var i = 0; i < this.layout.switcherTabs.length; i++)
		{
			var title = this.layout.switcherTabs[i].title;
			var block = this.layout.switcherTabs[i].block;

			if (title === currentTitle)
			{
				BX.addClass(title, "task-switcher-selected");
				BX.addClass(block, "task-switcher-block-selected");
			}
			else
			{
				BX.removeClass(title, "task-switcher-selected");
				BX.removeClass(block, "task-switcher-block-selected");
			}
		}

		return false;
	};

	BX.Tasks.Component.TaskView.prototype.onQueryExecuted = function(response)
	{
	};

	BX.Tasks.Component.TaskView.prototype.initViewer = function()
	{
		var fileAreas = ["task-detail-description", "task-detail-files", "task-comments-block", "task-files-block"];

		for (var i = 0; i < fileAreas.length; i++)
		{
			var area = BX(fileAreas[i]);
			if (area)
			{
				top.BX.viewElementBind(
					area,
					{},
					function(node){
						return BX.type.isElementNode(node) &&
							(node.getAttribute("data-bx-viewer") || node.getAttribute("data-bx-image"));
					}
				);
			}
		}
	};

	BX.Tasks.Component.TaskView.prototype.initAjaxErrorHandler = function()
	{
		BX.addCustomEvent("TaskAjaxError", function(errors) {
			BX.Tasks.alert(errors).then(function(){
				BX.reload();
			});
		});
	};

}).call(this);