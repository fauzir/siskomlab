(function() {

	//"use strict";

	BX.namespace("BX.CRM.Kanban");

	/**
	 *
	 * @param options
	 * @extends {BX.Kanban.Column}
	 * @constructor
	 */
	BX.CRM.Kanban.Column = function(options)
	{
		BX.Kanban.Column.apply(this, arguments);
	};

	BX.CRM.Kanban.Column.prototype = {
		__proto__: BX.Kanban.Column.prototype,
		constructor: BX.CRM.Kanban.Column,
		renderSubtitleTime: 6,

		/**
		 * Decrement total price of column.
		 * @param {Number} val Value to decrement.
		 * @returns {void}
		 */
		decPrice: function(val)
		{
			var data = this.getData();
			data.sum = parseFloat(data.sum) - val;
			this.setData(data);
		},

		/**
		 * Increment total price of column.
		 * @param {Integer} val Value to increment.
		 * @returns {void}
		 */
		incPrice: function(val)
		{
			var data = this.getData();
			data.sum = parseFloat(data.sum) + val;
			this.setData(data);
		},
		
		/**
		 * Return add-button for new column.
		 * @returns {DOM|null}
		 */
		getAddColumnButton: function ()
		{
			var columnData = this.getData();
			
			if (columnData.type === "WIN")
			{
				this.layout.info.style.marginRight = "0";
				return BX.create("div");
			}
			else
			{
				return BX.Kanban.Column.prototype.getAddColumnButton.apply(this, arguments);
			}
		},

		/**
		 * Renders subtitle content.
		 * @returns {Element}
		 */
		renderSubTitle: function()
		{
			var data = this.getData();

			// render layout first time
			if (typeof this.layout.subTitlePrice === "undefined")
			{
				var gridData = this.getGridData();

				if (gridData.entityType !== "LEAD")
				{
					this.layout.subTitlePriceText = BX.create("span", {
						attrs: {
							className: "crm-kanban-total-price-total"
						}
					});
					this.layout.subTitlePrice = BX.create("div", {
						attrs: {
							className: "crm-kanban-total-price"
						},
						children: [
							this.layout.subTitlePriceText
						]
					});
				}
				else
				{
					this.layout.subTitlePrice = null;
				}
			}

			// animate change
			if (this.layout.subTitlePriceText)
			{
				var gridData = this.getGridData();

				data.sum = parseFloat(data.sum);
				data.sum_old = data.sum_old ? data.sum_old : data.sum_init;
				data.sum_init = data.sum;

				this.renderSubTitleAnimation(
					data.sum_old,
					data.sum,
					Math.abs(data.sum_old - data.sum) / 20,
					this.layout.subTitlePriceText,
					function (element, value)
					{
						element.innerHTML = BX.Currency.currencyFormat(
							Math.round(value),
							gridData.currency,
							true
						);
						data.sum_old = data.sum;
					}.bind(this)
				);

				this.setData(data);
			}

			return this.layout.subTitlePrice;
		},

		/**
		 * Animate change from start to val with step in element.
		 * @param {Number} start
		 * @param {Number} value
		 * @param {Number} step
		 * @param {DOM} element
		 * @param {Function} finalCall Call finaly for element with val.
		 * @returns {void}
		 */
		renderSubTitleAnimation: function(start, value, step, element, finalCall)
		{
			var i = +start;
			var val = parseFloat(value);
			var timeout = this.renderSubtitleTime;

			if (i < val)
			{
				(function ()
				{
					if (i <= val)
					{
						setTimeout(arguments.callee, timeout);
						element.textContent = BX.util.number_format(i, 0, ",", " ");
						i = i + step;
					}
					else
					{
						if (typeof finalCall === "function")
						{
							finalCall(element, value);
						}
					}
				})();
			}
			else if (i > val)
			{
				(function ()
				{
					if (i >= val)
					{
						setTimeout(arguments.callee, timeout);
						element.textContent = BX.util.number_format(i, 0, ",", " ");
						i = i - step;
					}
					else
					{
						if (typeof finalCall === "function")
						{
							finalCall(element, value);
						}
					}
				})();
			}
			else if (typeof finalCall === "function")
			{
				finalCall(element, value);
			}
		},

		/**
		 * Hook on add column button.
		 * @param {MouseEvent} event
		 * @returns {void}
		 */
		handleAddColumnButtonClick: function(event)
		{
			var gridData = this.getGridData();
			// if no access, show access-query popup
			if (
				gridData.rights &&
				gridData.rights.canAddColumn
			)
			{
				BX.Kanban.Column.prototype.handleAddColumnButtonClick.apply(this, arguments);
			}
			else if (typeof BX.Intranet !== "undefined")
			{
				this.getGrid().accessNotify();
			}
		},

		/**
		 * Switch from view to edit mode (column).
		 * @returns {void}
		 */
		switchToEditMode: function()
		{
			var gridData = this.getGridData();
			// if no access, show access-query popup
			if (
				gridData.rights &&
				gridData.rights.canAddColumn
			)
			{
				BX.Kanban.Column.prototype.switchToEditMode.apply(this, arguments);
			}
			else if (typeof BX.Intranet !== "undefined")
			{
				this.getGrid().accessNotify();
			}
		}
	};

})();