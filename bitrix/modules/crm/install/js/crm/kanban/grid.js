(function() {

"use strict";

BX.namespace("BX.CRM.Kanban");

/**
 * @param options
 * @extends {BX.Kanban.Grid}
 * @constructor
 */
BX.CRM.Kanban.Grid = function(options)
{
	BX.Kanban.Grid.apply(this, arguments);

	BX.addCustomEvent(this, "Kanban.DropZone:onBeforeItemCaptured", BX.delegate(this.onBeforeItemCaptured, this));
	BX.addCustomEvent(this, "Kanban.DropZone:onBeforeItemRestored", BX.delegate(this.onBeforeItemRestored, this));

	BX.addCustomEvent(this, "Kanban.Grid:onBeforeItemMoved", BX.delegate(this.onBeforeItemMoved, this));
	BX.addCustomEvent(this, "Kanban.Grid:onItemMoved", BX.delegate(this.onItemMoved, this));
	BX.addCustomEvent(this, "Kanban.Grid:onColumnAddedAsync", BX.delegate(this.onColumnAddedAsync, this));
	BX.addCustomEvent(this, "Kanban.Grid:onColumnUpdated", BX.delegate(this.onColumnUpdated, this));
	BX.addCustomEvent(this, "Kanban.Grid:onColumnMoved", BX.delegate(this.onColumnMoved, this));
	BX.addCustomEvent(this, "Kanban.Grid:onColumnRemovedAsync", BX.delegate(this.onColumnRemovedAsync, this));
	BX.addCustomEvent(this, "Kanban.Grid:onColumnLoadAsync", BX.delegate(this.onColumnLoadAsync, this));
	BX.addCustomEvent(this, "Kanban.Grid:onItemDragStart", BX.delegate(this.onItemDragStartHandler, this));

	BX.addCustomEvent(this, "Kanban.Grid:onRender", BX.delegate(this.onGridRender, this));

	BX.addCustomEvent("BX.Main.Filter:apply", BX.delegate(this.onApplyFilter, this));
	BX.addCustomEvent("BX.CrmEntityCounterPanel:applyFilter", BX.delegate(this.onApplyFilterCounter, this));
	BX.addCustomEvent("onPullEvent-crm", BX.proxy(this.onPullEventHandlerCrm, this));
	BX.addCustomEvent("onCrmActivityTodoChecked", BX.proxy(this.onCrmActivityTodoChecked, this));
	
	setInterval(BX.proxy(this.loadNew, this), this.loadNewInterval * 1000);
};

BX.CRM.Kanban.Grid.prototype = {
	__proto__: BX.Kanban.Grid.prototype,
	constructor: BX.CRM.Kanban.Grid,
	accessNotifyDialog: null,
	loadNewInterval: 25,
	ajaxParams: {},

	/**
	 * Get path for ajax query.
	 * @returns {string}
	 */
	getAjaxHandlerPath: function()
	{
		var data = this.getData();

		return (
			BX.type.isNotEmptyString(data.ajaxHandlerPath)
				? data.ajaxHandlerPath
				: "/bitrix/components/bitrix/crm.kanban/ajax.php"
		);

	},

	/**
	 * Set additional params for ajax.
	 * @param {Object} data
	 * @returns {void}
	 */
	setAjaxParams: function(data)
	{
		this.ajaxParams = data;
	},

	/**
	 * Perform ajax query.
	 * @param {Object} data
	 * @param {Function} onsuccess
	 * @param {Function} onfailure
	 * @param {String} dataType html/json/script
	 * @returns {Void}
	 */
	ajax: function(data, onsuccess, onfailure, dataType)
	{
		var gridData = this.getData();

		if (typeof dataType === "undefined")
		{
			dataType = "json";
		}

		data.sessid = BX.bitrix_sessid();
		data.extra = gridData.params;
		data.entity_type = gridData.entityType;
		data.version = 2;
		data.ajaxParams = this.ajaxParams;

		BX.ajax({
			method: "POST",
			dataType: dataType,
			url: this.getAjaxHandlerPath(),
			data: data,
			onsuccess: onsuccess,
			onfailure: onfailure
		});
	},

	/**
	 * Show popup for request access.
	 * @returns {void}
	 */
	accessNotify: function()
	{
		if (
			typeof BX.Intranet !== "undefined" &&
			typeof BX.Intranet.NotifyDialog !== "undefined"
		)
		{
			if (this.accessNotifyDialog === null)
			{
				var gridData = this.getData();
				this.accessNotifyDialog = new BX.Intranet.NotifyDialog({
					listUserData: [],
					notificationHandlerUrl: this.getAjaxHandlerPath() + "?action=notifyAdmin&version=2&entity_type=" + gridData.entityType,
					popupTexts: {
						sendButton: BX.message("CRM_KANBAN_NOTIFY_BUTTON"),
						title: BX.message("CRM_KANBAN_NOTIFY_TITLE"),
						header: BX.message("CRM_KANBAN_NOTIFY_HEADER"),
						description: BX.message("CRM_KANBAN_NOTIFY_TEXT")
					}
				});
			}
			this.accessNotifyDialog.setUsersForNotify(this.getData().admins);
			this.accessNotifyDialog.show();
		}
	},

	/**
	 * Add new stage.
	 * @param {BX.Kanban.Column} column
	 * @returns {BX.Promise}
	 */
	addStage: function(column)
	{
		var promise = new BX.Promise();
		var targetColumn = this.getPreviousColumnSibling(column);
		var targetColumnId = targetColumn ? targetColumn.getId() : 0;

		this.ajax({
				action: "modifyStage",
				columnName: column.getName(),
				columnColor: column.getColor(),
				afterColumnId: targetColumnId
			},
			function(data)
			{
				if (data && !data.error)
				{
					promise.fulfill(data);
				}
				else if (data)
				{
					BX.Kanban.Utils.showErrorDialog(data.error, data.fatal);
					promise.reject(data.error);
				}
			}.bind(this),
			function(error)
			{
				BX.Kanban.Utils.showErrorDialog("Error: " + error, true);
				promise.reject("Error: " + error);
			}.bind(this)
		);

		return promise;
	},

	/**
	 * Remove one column (stage).
	 * @param {BX.Kanban.Column} column
	 * @returns {BX.Promise}
	 */
	removeStage: function(column)
	{
		var promise = new BX.Promise();

		this.ajax({
				action: "modifyStage",
				columnId: column.getId(),
				delete: 1
			},
			function(data)
			{
				if (data && !data.error)
				{
					promise.fulfill();
				}
				else if (data)
				{
					promise.reject(data.error);
				}
			}.bind(this),
			function(error)
			{
				BX.Kanban.Utils.showErrorDialog("Error: " + error, true);
				promise.reject("Error: " + error);
			}.bind(this)
		);

		return promise;
	},

	/**
	 * Get items from one columns.
	 * @param {BX.Kanban.Column} column
	 * @returns {BX.Promise}
	 */
	getColumnItems: function(column)
	{
		var promise = new BX.Promise();

		this.ajax({
				action: "page",
				page: column.getPagination().getPage() + 1,
				column: column.getId()
			},
			function(data)
			{
				if (data && (BX.type.isArray(data) || BX.type.isArray(data.items)) && !data.error)
				{
					promise.fulfill(BX.type.isArray(data) ? data : data.items);
				}
				else if (data)
				{
					BX.Kanban.Utils.showErrorDialog(data.error, data.fatal);
					promise.reject(data.error);
				}
			}.bind(this),
			function(error)
			{
				BX.Kanban.Utils.showErrorDialog("Error: " + error, true);
				promise.reject("Error: " + error);
			}.bind(this)
		);

		return promise;
	},
	
	/**
	 * Add item to the column in top.
	 * @param {Object} data
	 * @returns {void}
	 */
	addItemTop: function(data)
	{
		var column = this.getColumn(data.columnId);
		var columnItems = column ? column.getItems() : [];

		// get first item in column
		if (columnItems.length > 0)
		{
			data.targetId = columnItems[0].getId();
		}
		
		// inc column price and add item
		column.incPrice(data.data.price);
		this.addItem(data);
	},
	
	/**
	 * Load new items by interval.
	 * @returns {void}
	 */
	loadNew: function()
	{
		var gridData = this.getData();
		
		this.ajax({
				action: "get",
				min_entity_id: gridData.lastId
			},
			function(data)
			{
				if (data && data.items && data.items.length > 0)
				{
					for (var i = data.items.length-1; i >= 0; i--)
					{
						var item = data.items[i];
						this.addItemTop(item);
						gridData.lastId = item.id;
						this.setData(gridData);
					}
				}
			}.bind(this),
			function(error)
			{
			}.bind(this)
		);
	},

	/**
	 * Hook on item drag start.
	 * @param {BX.Kanban.Item} item
	 * @returns {void}
	 */
	onItemDragStart: function(item)
	{
		this.setDragMode(BX.Kanban.DragMode.ITEM);

		var gridData = this.getData();
		var items = this.getItems();
		var itemColumnData = item.getColumn().getData();
		var itemColumnId = item.getColumnId();

		// disable move for win lead
		if (
			gridData.entityType === "LEAD" &&
			itemColumnData.type === "WIN"
		)
		{
			for (var itemId in items)
			{
				var columnId = items[itemId].getColumnId();

				if (columnId === itemColumnId)
				{
					items[itemId].enableDropping();
				}
			}

			return;
		}

		BX.Kanban.Grid.prototype.onItemDragStart.apply(this, arguments);
	},

	/**
	 * Hook on item drag start.
	 * @param {BX.Kanban.Item} item
	 * @returns {voiid}
	 */
	onItemDragStartHandler: function(item)
	{
		item.setLastPosition();
	},

	/**
	 * Event Handler must add a promise to the 'promises' collection.
	 * @param {Array} promises
	 * @returns {void}
	 */
	onColumnLoadAsync: function(promises)
	{
		promises.push(BX.delegate(this.getColumnItems, this));
	},

	/**
	 * Event Handler must add a promise to the 'promises' collection.
	 * @param {Array} promises
	 * @returns {void}
	 */
	onColumnRemovedAsync: function(promises)
	{
		promises.push(BX.delegate(this.removeStage, this));
	},

	/**
	 * Event Handler must add a promise to the 'promises' collection.
	 * @param {Array} promises
	 * @returns {void}
	 */
	onColumnAddedAsync: function(promises)
	{
		promises.push(BX.delegate(this.addStage, this));
	},

	/**
	 * Hook on item drop to junk's.
	 * @param {BX.Kanban.DropZoneEvent} dropEvent
	 * @returns {void}
	 */
	onBeforeItemCaptured: function(dropEvent)
	{
		BX.onCustomEvent("Crm.Kanban.Grid:onBeforeItemCapturedStart", [this, dropEvent]);
		
		// move item and decprice in column
		if (dropEvent.isActionAllowed())
		{
			var item = dropEvent.getItem();
			var column = item.getColumn();
			var drop = dropEvent.getDropZone();
			var price = parseFloat(item.getData().price);
			
			column.decPrice(price);
			this.onItemMoved(item, drop, null, true);
		}
	},

	/**
	 * Hook on item return from junk's.
	 * @param {BX.Kanban.DropZoneEvent} event
	 * @returns {void}
	 */
	onBeforeItemRestored: function(event)
	{
		var item = event.getItem();
		var column = item.getColumn();
		var price = parseFloat(item.getData().price);

		// chamge price in column and move item
		column.incPrice(price);
		this.onItemMoved(item, column);
	},

	/**
	 * Hook on item moved start.
	 * @param {BX.Kanban.DragEvent} event
	 * @returns {void}
	 */
	onBeforeItemMoved: function(event)
	{
		var targetColumn = event.getTargetColumn();
		var item = event.getItem();
		var column = item.getColumn();
		var price = parseFloat(item.getData().price);
		
		// change price in old/new columns
		column.decPrice(price);
		targetColumn.incPrice(price);
	},

	/**
	 * Hook on item moved.
	 * @param {BX.Kanban.Item} item
	 * @param {BX.Kanban.Column|BX.Kanban.DropZone} targetColumn
	 * @param {BX.Kanban.Item} [beforeItem]
	 * @param {Boolean} [skipHandler]
	 * @returns {void}
	 */
	onItemMoved: function(item, targetColumn, beforeItem, skipHandler)
	{
		// call handler
		if (skipHandler !== true)
		{
			var handlerData = {
				grid: this,
				item: item,
				targetColumn: targetColumn,
				beforeItem: beforeItem,
				skip: false
			};
			BX.onCustomEvent("Crm.Kanban.Grid:onItemMovedFinal", [handlerData]);
			if (handlerData.skip === true)
			{
				return;
			}
		}

		// some vars
		var afterItemId = 0;
		var itemId = item.getId();
		var targetColumnId = targetColumn ? targetColumn.getId() : 0;
		
		// set sort
		if (targetColumn instanceof BX.Kanban.DropZone)
		{
			afterItemId = 0;
		}
		else
		{
			var afterItem = targetColumn.getPreviousItemSibling(item);
			if (afterItem)
			{
				afterItemId = afterItem.getId();
			}
		}

		// ajax
		this.ajax({
				action: "status",
				entity_id: itemId,
				prev_entity_id: afterItemId,
				status: targetColumnId
			},
			function(data)
			{
				if (data && !data.error)
				{
					if (data.items && data.items.length > 0)
					{
						this.updateItem(itemId, data.items[0]);
					}
					else
					{
						item.setDataKey("columnId", targetColumnId);
					}
				}
				else if (data)
				{
					BX.Kanban.Utils.showErrorDialog(data.error, true);
				}
			}.bind(this),
			function(error)
			{
				BX.Kanban.Utils.showErrorDialog("Error: " + error, true);
			}.bind(this)
		);
	},

	/**
	 * Hook on column update.
	 * @param {BX.Kanban.Column} column
	 * @returns {void}
	 */
	onColumnUpdated: function(column)
	{
		var columnId = column.getId();
		var title = column.getName();
		var color = column.getColor();

		this.ajax({
				action: "modifyStage",
				columnId: columnId,
				columnName: title,
				columnColor: color
			},
			function(data)
			{
				if (data && data.error)
				{
					BX.Kanban.Utils.showErrorDialog(data.error, data.fatal);
				}
			}.bind(this),
			function(error)
			{
				BX.Kanban.Utils.showErrorDialog("Error: " + error, true);
			}.bind(this)
		);
	},

	/**
	 * Hook on column move.
	 * @param {BX.Kanban.Column} column
	 * @param {BX.Kanban.Column} [targetColumn]
	 * @returns {void}
	 */
	onColumnMoved: function(column, targetColumn)
	{
		var columnId = column.getId();
		var afterColumn = this.getPreviousColumnSibling(column);
		var afterColumnId = afterColumn ? afterColumn.getId() : 0;

		this.ajax({
				action: "modifyStage",
				columnId: columnId,
				afterColumnId: afterColumnId
			},
			function(data)
			{
				if (data && data.error)
				{
					BX.Kanban.Utils.showErrorDialog(data.error, true);
				}
			}.bind(this),
			function(error)
			{
				BX.Kanban.Utils.showErrorDialog("Error: " + error, true);
			}.bind(this)
		);
	},

	/**
	 * Hook on main filter applied.
	 * @param {String} filterId
	 * @param {Object} values
	 * @param {Object} filterInstance
	 * @param {BX.Promise} promise
	 * @param {Object} params
	 * @returns {void}
	 */
	onApplyFilter: function(filterId, values, filterInstance, promise, params)
	{
		this.fadeOut();
		params.autoResolve = false;
		this.ajax({
				action: "get"
			},
			function(data)
			{
				// remove all columns
				var columns = this.getColumns();
				for (var i = 0, c = columns.length; i < c; i++)
				{
					this.removeColumn(columns[i]);
				}
				// remove items
				this.removeItems();
				// and load new
				this.loadData(data);
				promise.fulfill();
				this.fadeIn();
			}.bind(this),
			function(error)
			{
				promise.reject();
				this.fadeIn();
			}.bind(this)
		);
	},

	/**
	 * Hook on filter counters click.
	 * @param {BX.CrmEntityCounterPanel} sender
	 * @param {Object} eventArgs
	 * @returns {undefined}
	 */
	onApplyFilterCounter: function(sender, eventArgs)
	{
		setTimeout(
			BX.delegate(
				function() {
					var gridData = this.getData();
					var fields = {
						ACTIVITY_COUNTER: eventArgs["counterTypeId"]
					};
					var filter = BX.Main.filterManager.getById(gridData.gridId);
					var api = filter.getApi();
					api.setFields(fields);
					api.apply();
				},
				this
			), 0
		);
		eventArgs["cancel"] = true;
	},

	/**
	 * Hook on pull event.
	 * @param {String} command
	 * @param {Object} params
	 * @returns {void}
	 */
	onPullEventHandlerCrm: function(command, params)
	{
		var gridData = this.getData();

		// new activity
		if (command === 'activity_add' && params.COMPLETED !== 'Y' &&
			params.OWNER_TYPE_NAME === gridData.entityType
		)
		{
			var item = this.getItem(params.OWNER_ID);
			if (item)
			{
				var activityProgress = item.getDataKey("activityProgress");
				activityProgress++;
				item.setDataKey("activityProgress", activityProgress);
				item.switchPlanner();
			}
		}
	},

	/**
	 * Check on one activity.
	 * @param {Integer} activityId
	 * @param {Integer} ownerId
	 * @param {Integer} ownerTypeId
	 * @returns {void}
	 */
	onCrmActivityTodoChecked: function(activityId, ownerId, ownerTypeId)
	{
		var item = this.getItem(ownerId);
		if (item)
		{
			var activityProgress = item.getDataKey("activityProgress");
			activityProgress--;
			item.setDataKey("activityProgress", activityProgress);
			item.switchPlanner();
		}
	},

	/**
	 * Handler on grid render.
	 * @returns {void}
	 */
	onGridRender: function()
	{
		var grid = this.getGridContainer();

		var columnsWidth = this.getColumns().reduce(function(width, /*BX.Kanban.Column*/column) {
			return width + column.getContainer().offsetWidth;
		}, 0);

		var showBorder = (columnsWidth + 80) < grid.offsetWidth;

		this.getRenderToContainer().classList[showBorder ? "add" : "remove"]("crm-kanban-border");

		console.log(this.getRenderToContainer())
	}
};

})();