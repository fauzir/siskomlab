<?php

namespace Bitrix\Tasks\Integration\Socialnetwork;

use Bitrix\Main\Loader;

/**
 * Class for content view event handlers
 *
 * Class ContentViewHandler
 * @package Bitrix\Tasks\Integration\Socialnetwork
 */
final class ContentViewHandler
{
	const CONTENT_TYPE_ID_TASK = 'TASKS_TASK';

	final static function getContentTypeIdList()
	{
		return array(
			self::CONTENT_TYPE_ID_TASK
		);
	}

	/**
	 * Handles content view event, marking IM notifications as read
	 *
	 * @param \Bitrix\Main\Event $event Event.
	 * @return int|false
	 */
	public static function onContentViewed(\Bitrix\Main\Event $event)
	{
		$userId = intval($event->getParameter('userId'));
		$contentTypeId = $event->getParameter('typeId');
		$contentEntityId = intval($event->getParameter('entityId'));

		if (
			$userId <= 0
			|| !in_array($contentTypeId, self::getContentTypeIdList())
			|| $contentEntityId <= 0
			|| !Loader::includeModule('im')
		)
		{
			return false;
		}

		$subTagList = array();

		if ($contentTypeId == self::CONTENT_TYPE_ID_TASK)
		{
			$subTagList[] = "TASKS|TASK|".$contentEntityId.'|'.$userId.'|TASK_ADD';
		}

		if (!empty($subTagList))
		{
			$CIMNotify = new \CIMNotify();
			$CIMNotify->MarkNotifyReadBySubTag($subTagList);
		}

		return true;
	}
}