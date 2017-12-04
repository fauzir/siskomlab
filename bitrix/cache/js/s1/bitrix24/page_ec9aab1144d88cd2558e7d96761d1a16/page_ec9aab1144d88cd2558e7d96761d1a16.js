
; /* Start:"a:4:{s:4:"full";s:93:"/bitrix/components/bitrix/socialnetwork.admin.set/templates/.default/script.js?15113165822527";s:6:"source";s:78:"/bitrix/components/bitrix/socialnetwork.admin.set/templates/.default/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
var waitDiv = null;
var waitPopup = null;
var waitTimeout = null;
var waitTime = 500;

function __SASSetAdmin()
{
	__SASShowWait();
	BX.ajax({
		url: '/bitrix/components/bitrix/socialnetwork.admin.set/ajax.php',
		method: 'POST',
		dataType: 'json',
		data: {'ACTION': 'SET', 'sessid': BX.bitrix_sessid(), 'site': BX.util.urlencode(BX.message('SASSiteId'))},
		onsuccess: function(data) { __SASProcessAJAXResponse(data); }
	});
}

function __SASProcessAJAXResponse(data)
{
	if (data["SUCCESS"] != "undefined" && data["SUCCESS"] == "Y")
	{
		BX.reload();
		return false;
	}
	else if (data["ERROR"] != "undefined" && data["ERROR"].length > 0)
	{
		if (data["ERROR"].indexOf("SESSION_ERROR", 0) === 0)
		{
			__SASShowError(BX.message('SASErrorSessionWrong'));
			BX.reload();
		}
		else if (data["ERROR"].indexOf("CURRENT_USER_NOT_ADMIN", 0) === 0)
		{
			__SASShowError(BX.message('SASErrorNotAdmin'));
			return false;
		}
		else if (data["ERROR"].indexOf("CURRENT_USER_NOT_AUTH", 0) === 0)
		{
			__SASShowError(BX.message('SASErrorCurrentUserNotAuthorized'));
			return false;
		}
		else if (data["ERROR"].indexOf("SONET_MODULE_NOT_INSTALLED", 0) === 0)
		{
			__SASShowError(BX.message('SASErrorModuleNotInstalled'));
			return false;
		}
		else
		{
			__SASShowError(data["ERROR"]);
			return false;		
		}
	}
}
				
function __SASShowError(errorText) 
{
	__SASCloseWait();

	var errorPopup = new BX.PopupWindow('sas-error' + Math.random(), window, {
		autoHide: true,
		lightShadow: false,
		zIndex: 2,
		content: BX.create('DIV', {props: {'className': 'sonet-adminset-error-text-block'}, html: errorText}),
		closeByEsc: true,
		closeIcon: true
	});
	errorPopup.show();

}

function __SASShowWait(timeout)
{
	if (timeout !== 0)
	{
		return (waitTimeout = setTimeout(function(){
			__SASShowWait(0)
		}, 50));
	}

	if (!waitPopup)
	{
		waitPopup = new BX.PopupWindow('sas_wait', window, {
			autoHide: true,
			lightShadow: true,
			zIndex: 2,
			content: BX.create('DIV', {
				props: {
					className: 'sonet-adminset-wait-cont'
				},
				children: [
					BX.create('DIV', {
						props: {
							className: 'sonet-adminset-wait-icon'
						}
					}),
					BX.create('DIV', {
						props: {
							className: 'sonet-adminset-wait-text'
						},
						html: BX.message('SASWaitTitle')
					})
				]
			})
		});
	}
	else
		waitPopup.setBindElement(window);

	waitPopup.show();
}

function __SASCloseWait()
{
	if (waitTimeout)
	{
		clearTimeout(waitTimeout);
		waitTimeout = null;
	}

	if (waitPopup)
		waitPopup.close();
}
/* End */
;
; /* Start:"a:4:{s:4:"full";s:100:"/bitrix/components/bitrix/socialnetwork.forum.topic.list/templates/.default/script.js?15113165822021";s:6:"source";s:85:"/bitrix/components/bitrix/socialnetwork.forum.topic.list/templates/.default/script.js";s:3:"min";s:0:"";s:3:"map";s:0:"";}"*/
function SelectRow(row)
{
	if (row == null)
		return;

	if(row.className.match(/forum-row-selected/))
		row.className = row.className.replace(/\s*forum-row-selected/i, '');
	else
		row.className += ' forum-row-selected';
}

if (typeof oForum != "object")
	var oForum = {};
if (typeof oForum["topics"] != "object")
	oForum["topics"] = {};

function SelectRows(iIndex)
{
	oForum["topics"][iIndex] = (oForum["topics"][iIndex] != "Y" ? "Y" : "N");
	form = document.forms['TOPICS_' + iIndex];
	if (typeof(form) != "object" || form == null)
		return false;

	var items = form.getElementsByTagName('input');
	if (items && typeof items == "object" )
	{
		if (!items.length || (typeof(items.length) == 'undefined'))
		{
			items = [items];
		}
		
		for (ii = 0; ii < items.length; ii++)
		{
			if (!(items[ii].type == "checkbox" && items[ii].name == 'TID[]'))
				continue;
			items[ii].checked = (oForum["topics"][iIndex] == "Y" ? true : false);
			var row = items[ii].parentNode.parentNode.parentNode;
			if (row == null)
				return;
			if (!items[ii].checked)
				row.className = row.className.replace(/\s*forum-row-selected/i, '');
			else if (!row.className.match(/forum-row-selected/))
				row.className += ' forum-row-selected';
		}
	}
}
function Validate(form)
{
	if (typeof(form) != "object" || form == null)
		return false;
	var oError = [];
	var items = form.getElementsByTagName('input');
	if (items && typeof items == "object" )
	{
		if (!items.length || (typeof(items.length) == 'undefined'))
		{
			items = [items];
		}
		var bEmptyData = true;
		for (ii = 0; ii < items.length; ii++)
		{
			if (!(items[ii].type == "checkbox" && items[ii].name == 'TID[]'))
				continue;
			if (items[ii].checked)
			{
				bEmptyData = false;
				break;
			}
		}
		if (bEmptyData)
			oError.push(oText['empty_topics']);
	}
	if (form['ACTION'].value == '')
	{
		if (oError.length > 0)
			return false;
		oError.push(oText['empty_action']);
	}
	if (oError.length > 0)
	{
		alert(oError.join('\n'));
		return false;
	}
	return true;
}
/* End */
;; /* /bitrix/components/bitrix/socialnetwork.admin.set/templates/.default/script.js?15113165822527*/
; /* /bitrix/components/bitrix/socialnetwork.forum.topic.list/templates/.default/script.js?15113165822021*/
