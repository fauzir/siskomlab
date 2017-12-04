<?php

namespace Bitrix\Voximplant\Rest;

use Bitrix\Crm\Integration\StorageType;
use Bitrix\Main\Error;
use Bitrix\Main\Event;
use Bitrix\Main\EventResult;
use Bitrix\Main\Loader;
use Bitrix\Main\Result;
use Bitrix\Main\SystemException;
use Bitrix\Main\Type\DateTime;
use Bitrix\Main\UserTable;
use Bitrix\Rest\AppTable;
use Bitrix\Rest\EventTable;
use Bitrix\Voximplant\CallTable;
use Bitrix\Voximplant\Integration\Im;
use Bitrix\Voximplant\PhoneTable;
use Bitrix\Voximplant\Security;
use Bitrix\Voximplant\StatisticTable;

class Helper
{
	const EVENT_START_EXTERNAL_CALL = 'OnExternalCallStart';
	const EVENT_START_EXTERNAL_CALLBACK = 'OnExternalCallBackStart';
	const PLACEMENT_CALL_CARD = 'CALL_CARD';
	const FILE_FIELD = 'file';

	/**
	 * Returns user id of the user with given inner phone number, or false if user is not found.
	 * @param string $phoneNumber Inner phone number.
	 * @return int|false
	 */
	public static function getUserByPhone($phoneNumber)
	{
		$row = PhoneTable::getList(array(
			'select' => array('USER_ID'),
			'filter' => array(
				'PHONE_NUMBER' => $phoneNumber,
				'PHONE_MNEMONIC' => 'UF_PHONE_INNER'
			)
		))->fetch();

		return is_array($row) ? (int)$row['USER_ID'] : false;
	}

	/**
	 * Register call, started to perform in external PBX. Auto creates
	 * @param array $fields
	 * <li> USER_ID int
	 * <li> PHONE_NUMBER string
	 * <li> TYPE int
	 * <li> CALL_START_DATE date
	 * <li> CRM bool
	 * <li> CRM_CREATE bool
	 * <li> CRM_SOURCE
	 * <li> CRM_ENTITY_TYPE
	 * <li> CRM_ENTITY_ID
	 * <li> REST_APP_ID
	 * <li> SHOW
	 * <li> CALL_LIST_ID
	 * @return Result
	 */
	public static function registerExternalCall(array $fields)
	{
		$result = new Result();
		$callId = 'externalCall.'.md5(uniqid($fields['REST_APP_ID'].$fields['USER_ID'].$fields['PHONE_NUMBER'])).'.'.time();
		$isCrmAvailable = Loader::includeModule('crm');

		$phoneNumber = \CVoxImplantPhone::stripLetters($fields['PHONE_NUMBER']);
		if(!$phoneNumber)
		{
			$result->addError(new Error('Unsupported phone number format'));
			return $result;
		}

		$initEventData = array(
			'CALL_ID' => $callId,
			'CALL_TYPE' => $fields['TYPE'],
			'CALLER_ID' => $phoneNumber,
			'REST_APP_ID' => $fields['REST_APP_ID']
		);
		$initEvent = new Event('voximplant', 'onCallInit', $initEventData);
		$initEvent->send();
		if ($initEvent->getResults() != null)
		{
			foreach($initEvent->getResults() as $eventResult)
			{
				if($eventResult->getType() === EventResult::SUCCESS)
				{
					$eventResultData = $eventResult->getParameters();
					if(isset($eventResultData['CALLER_ID']))
					{
						$phoneNumber = $eventResultData['CALLER_ID'];
					}
				}
			}
		}

		// checking for the internal call
		$portalCall = false;
		$portalUserId = null;
		$userData = PhoneTable::getList(array(
			'select' => array('USER_ID'),
			'filter' => array(
				'=PHONE_NUMBER' => $phoneNumber,
				'=PHONE_MNEMONIC' => 'UF_PHONE_INNER',
				'=USER.ACTIVE' => 'Y'
			),
		))->fetch();
		if ($userData)
		{
			$portalCall = true;
			$portalUserId = $userData['USER_ID'];
		}

		$crmCreate = ($fields['CRM'] || $fields['CRM_CREATE']) && !$portalCall;
		$newCall = array(
			'USER_ID' => $fields['USER_ID'],
			'CALL_ID' => $callId,
			'INCOMING' => $fields['TYPE'],
			'DATE_CREATE' => ($fields['CALL_START_DATE'] ?: new DateTime()),
			'CALLER_ID' => $phoneNumber,
			'PORTAL_USER_ID' => $portalUserId,
			'CRM' => $portalCall ? 'N' : 'Y',
			'REST_APP_ID' => $fields['REST_APP_ID'],
			//'PORTAL_NUMBER' => $fields['PORTAL_NUMBER']  //todo: add support for this field
		);

		if(isset($fields['CRM_ENTITY_TYPE']) && isset($fields['CRM_ENTITY_ID']))
		{
			$crmEntity = array(
				'ENTITY_TYPE_NAME' => $fields['CRM_ENTITY_TYPE'],
				'ENTITY_ID' => $fields['CRM_ENTITY_ID']
			);
		}
		else
		{
			$crmEntity = \CVoxImplantCrmHelper::GetCrmEntity($fields['PHONE_NUMBER'], \Bitrix\Voximplant\Security\Helper::getCurrentUserId());
			if (is_array($crmEntity))
			{
				// nothing here
			}
			else if($crmCreate && $isCrmAvailable)
			{
				// no crm entity found, creating new lead
				$leadId = \CVoxImplantCrmHelper::AddLead(array(
					'PHONE_NUMBER' => $phoneNumber,
					'USER_ID' => $fields['USER_ID'],
					'INCOMING' => ($fields['TYPE'] == \CVoxImplantMain::CALL_INCOMING),
					'CRM_SOURCE' => $fields['CRM_SOURCE']
				));
				if(!$leadId)
				{
					$leadCreationError = \CVoxImplantCrmHelper::$lastError;
				}
				else
				{
					$crmEntity = array(
						'ENTITY_TYPE_NAME' => \CCrmOwnerType::LeadName,
						'ENTITY_ID' => $leadId
					);
					$newCall['CRM_LEAD'] = $leadId;
					if(\CVoxImplantConfig::GetLeadWorkflowExecution() == \CVoxImplantConfig::WORKFLOW_START_IMMEDIATE)
					{
						\CVoxImplantCrmHelper::StartLeadWorkflow($leadId);
					}
				}
			}
		}

		if(is_array($crmEntity))
		{
			$newCall['CRM_ENTITY_TYPE'] = $crmEntity['ENTITY_TYPE_NAME'];
			$newCall['CRM_ENTITY_ID'] = $crmEntity['ENTITY_ID'];
			$newCall['CRM'] = 'Y';
		}

		if($fields['CRM_ACTIVITY_ID'])
		{
			$newCall['CRM_ACTIVITY_ID'] = $fields['CRM_ACTIVITY_ID'];
		}
		else if($crmCreate && $isCrmAvailable)
		{
			// creating new crm activity
			$newCall['CRM_ACTIVITY_ID'] = \CVoxImplantCrmHelper::AddCall($newCall);
			if(!$newCall['CRM_ACTIVITY_ID'])
				$activityCreationError = \CVoxImplantCrmHelper::$lastError;
		}

		if($fields['CALL_LIST_ID'] > 0)
		{
			$newCall['CRM_CALL_LIST'] = $fields['CALL_LIST_ID'];
		}

		$insertResult = CallTable::add($newCall);

		if($fields['SHOW'])
		{
			self::showExternalCall(array(
				'CALL_ID' => $callId
			));
		}

		if(!$insertResult->isSuccess())
		{
			$result->addError(new Error('Database error'));
			return $result;
		}

		\CVoxImplantCrmHelper::StartCallTrigger($callId);
		$resultData = array(
			'CALL_ID' => $newCall['CALL_ID'],
			'CRM_CREATED_LEAD' => $newCall['CRM_LEAD'],
			'CRM_ENTITY_TYPE' => $newCall['CRM_ENTITY_TYPE'],
			'CRM_ENTITY_ID' => $newCall['CRM_ENTITY_ID'],
			'CRM_ACTIVITY_ID' => $newCall['CRM_ACTIVITY_ID']
		);

		if(isset($leadCreationError))
			$resultData['LEAD_CREATION_ERROR'] = $leadCreationError;

		if(isset($activityCreationError))
			$resultData['ACTIVITY_CREATION_ERROR'] = $activityCreationError;

		$result->setData($resultData);
		return $result;
	}

	/**
	 * Finishes call, initiated externally and updates crm lead and activity
	 * @param array $fields
	 * <li> CALL_ID
	 * <li> USER_ID
	 * <li> DURATION - call duration in seconds
	 * <li> COST - call's cost
	 * <li> COST_CURRENCY
	 * <li> STATUS_CODE
	 * <li> FAILED_REASON
	 * <li> RECORD_URL
	 * <li> VOTE
	 * <li> ADD_TO_CHAT
	 * @return Result
	 */
	public static function finishExternalCall(array $fields)
	{
		$result = new Result();
		$call = CallTable::getByCallId($fields['CALL_ID']);
		if($call === false)
		{
			$result->addError(new Error('Call is not found (call should be registered prior to finishing'));
			return $result;
		}
		
		self::hideExternalCall(array(
			'CALL_ID' => $call['CALL_ID'],
			'USER_ID' => isset($fields['USER_ID']) ? (int)$fields['USER_ID'] : $call['USER_ID']
		));

		$fields['DURATION'] = (int)$fields['DURATION'];
		if(!isset($fields['STATUS_CODE']))
			$fields['STATUS_CODE'] = $fields['DURATION'] > 0 ? '200' : '304';

		$fields['ADD_TO_CHAT'] = isset($fields['ADD_TO_CHAT']) ? (bool)$fields['ADD_TO_CHAT'] : true;


		$statisticRecord = array(
			'CALL_ID' => $call['CALL_ID'],
			'PORTAL_USER_ID' => isset($fields['USER_ID']) ? (int)$fields['USER_ID'] : $call['USER_ID'],
			'PHONE_NUMBER' => $call['CALLER_ID'],
			'INCOMING' => $call['INCOMING'],
			'CALL_DURATION' => $fields['DURATION'] ?: 0,
			'CALL_START_DATE' => $call['DATE_CREATE'],
			'CALL_STATUS' => $fields['DURATION'] > 0 ? 1 : 0,
			'CALL_VOTE' => $fields['VOTE'],
			'COST' => $fields['COST'],
			'COST_CURRENCY' => $fields['COST_CURRENCY'],
			'CALL_FAILED_CODE' => $fields['STATUS_CODE'],
			'CALL_FAILED_REASON' => $fields['FAILED_REASON'],
			'REST_APP_ID' => $call['REST_APP_ID'],
			'REST_APP_NAME' => self::getRestAppName($call['REST_APP_ID']),
			'CRM_ACTIVITY_ID' => $call['CRM_ACTIVITY_ID'],
		);

		if($call['CRM_ENTITY_TYPE'] && $call['CRM_ENTITY_ID'])
		{
			$statisticRecord['CRM_ENTITY_TYPE'] = $call['CRM_ENTITY_TYPE'];
			$statisticRecord['CRM_ENTITY_ID'] = $call['CRM_ENTITY_ID'];
		}
		else
		{
			$crmData = \CVoxImplantCrmHelper::GetCrmEntity($statisticRecord['PHONE_NUMBER'], $statisticRecord['PORTAL_USER_ID']);
			if(is_array($crmData))
			{
				$statisticRecord['CRM_ENTITY_TYPE'] = $crmData['ENTITY_TYPE_NAME'];
				$statisticRecord['CRM_ENTITY_ID'] = $crmData['ENTITY_ID'];
			}
		}

		$insertResult = StatisticTable::add($statisticRecord);
		if(!$insertResult->isSuccess())
		{
			$result->addError(new Error('Unexpected database error'));
			$result->addErrors($insertResult->getErrors());
			return $result;
		}
		$statisticRecord['ID'] = $insertResult->getId();

		CallTable::delete($call['ID']);

		if($call['CRM_LEAD'] > 0)
		{
			\CVoxImplantCrmHelper::UpdateLead(
				$call['CRM_LEAD'],
				array('ASSIGNED_BY_ID' => $statisticRecord['PORTAL_USER_ID'])
			);
		}

		if ($call['CRM'] == 'Y')
		{
			\CVoxImplantCrmHelper::UpdateCall($statisticRecord);
			if(isset($statisticRecord['CRM_ENTITY_TYPE']) && isset($statisticRecord['CRM_ENTITY_ID']))
			{
				$viMain = new \CVoxImplantMain($statisticRecord["PORTAL_USER_ID"]);
				$dialogData = $viMain->GetDialogInfo($statisticRecord['PHONE_NUMBER'], '', false);
				\CVoxImplantMain::UpdateChatInfo(
					$dialogData['DIALOG_ID'],
					array(
						'CRM' => $call['CRM'],
						'CRM_ENTITY_TYPE' => $statisticRecord['CRM_ENTITY_TYPE'],
						'CRM_ENTITY_ID' => $statisticRecord['CRM_ENTITY_ID']
					)
				);
			}
		}

		$hasRecord = ($fields['RECORD_URL'] != '');
		if($hasRecord)
			\CVoxImplantHistory::DownloadAgent($insertResult->getId(), $fields['RECORD_URL'], ($call['CRM'] === 'Y'));

		if($fields['ADD_TO_CHAT'])
		{
			$chatMessage = \CVoxImplantHistory::GetMessageForChat($statisticRecord, $hasRecord, false);
			if($chatMessage != '')
			{
				\CVoxImplantHistory::SendMessageToChat($statisticRecord["PORTAL_USER_ID"], $statisticRecord["PHONE_NUMBER"], $statisticRecord["INCOMING"], $chatMessage);
			}
		}

		if($call['CRM_LEAD'] > 0 && \CVoxImplantConfig::GetLeadWorkflowExecution() == \CVoxImplantConfig::WORKFLOW_START_DEFERRED)
		{
			\CVoxImplantCrmHelper::StartLeadWorkflow($call['CRM_LEAD']);
		}

		$result->setData($statisticRecord);
		return $result;
	}

	/**
	 * Shows card with CRM info on a call to the user.
	 * @param array $params Function parameters:
	 * <li> CALL_ID
	 * <li> USER_ID
	 * @return bool
	 */
	public static function showExternalCall(array $params)
	{
		$callId = $params['CALL_ID'];
		$call = CallTable::getByCallId($callId);
		if(!$call)
			return false;

		if(isset($params['USER_ID']))
		{
			if(is_array($params['USER_ID']))
				$userId = $params['USER_ID'];
			else
				$userId = array((int)$params['USER_ID']);
		}
		else
		{
			$userId = array($call['USER_ID']);
		}

		$portalCall = $call['PORTAL_USER_ID'] > 0;

		\CVoxImplantMain::SendPullEvent(array(
			'COMMAND' => 'showExternalCall',
			'CALL_ID' => $callId,
			'USER_ID' => $userId,
			'PHONE_NUMBER' => (string)$call['CALLER_ID'],
			'INCOMING' => $call['INCOMING'],
			'SHOW_CRM_CARD' => ($call['CRM'] == 'Y'),
			'CRM_ENTITY_TYPE' => $call['CRM_ENTITY_TYPE'],
			'CRM_ENTITY_ID' => $call['CRM_ENTITY_ID'],
			'CRM_ACTIVITY_ID' => $call['CRM_ACTIVITY_ID'],
			'CRM_ACTIVITY_EDIT_URL' => \CVoxImplantCrmHelper::getActivityEditUrl($call['CRM_ACTIVITY_ID']),
			'CRM' => \CVoxImplantCrmHelper::GetDataForPopup($call['CALL_ID'], $call['CALLER_ID'], $userId),
			'CONFIG' => array(
				'CRM_CREATE' => 'none'
			),
			'PORTAL_CALL' => $portalCall > 0 ? 'Y' : 'N',
			'PORTAL_CALL_USER_ID' => $call['PORTAL_USER_ID'],
			'PORTAL_CALL_DATA' => $portalCall ? Im::getUserData(array('ID' => array($call['USER_ID'], $call['PORTAL_USER_ID']), 'DEPARTMENT' => 'N', 'HR_PHOTO' => 'Y')) : array()
		));
		return true;
	}

	/**
	 * Hides card with CRM info on a call.
	 * @param array $params Function parameters:
	 * <li> CALL_ID
	 * <li> USER_ID
	 * @return bool
	 */
	public static function hideExternalCall(array $params)
	{
		$callId = $params['CALL_ID'];
		$call = CallTable::getByCallId($callId);
		if(!$call)
			return false;

		if(isset($params['USER_ID']))
		{
			if(is_array($params['USER_ID']))
				$userId = $params['USER_ID'];
			else
				$userId = array((int)$params['USER_ID']);
		}
		else
		{
			$userId = array($call['USER_ID']);
		}

		\CVoxImplantMain::SendPullEvent(array(
			'COMMAND' => 'hideExternalCall',
			'USER_ID' => $userId,
			'CALL_ID' => $callId
		));
		return true;
	}

	/**
	 * Returns rest application name by its client id.
	 * @param string $clientId Application's client id.
	 * @return string|false
	 */
	public static function getRestAppName($clientId)
	{
		if(!Loader::includeModule('rest'))
			return false;

		$row = AppTable::getByClientId($clientId);

		if(!is_array($row))
			return false;

		if ($row['MENU_NAME'] != '')
			$result = $row['MENU_NAME'];
		else if ($row['MENU_NAME_DEFAULT'] != '')
			$result = $row['MENU_NAME_DEFAULT'];
		else if ($row['MENU_NAME_LICENSE'] != '')
			$result = $row['MENU_NAME_LICENSE'];
		else
			$result = $row['APP_NAME'];

		return $result;
	}

	/**
	 * Returns array of applications, capable of creating externally initiated calls
	 */
	public static function getExternalCallHandlers()
	{
		return static::getEventSubscribers(self::EVENT_START_EXTERNAL_CALL);
	}

	/**
	 * Returns array of applications, capable of starting callback
	 */
	public static function getExternalCallbackHandlers()
	{
		return static::getEventSubscribers(self::EVENT_START_EXTERNAL_CALLBACK);
	}

	protected static function getEventSubscribers($eventName)
	{
		$result = array();
		if(!Loader::includeModule('rest'))
			return $result;

		$cursor = EventTable::getList(array(
			'select' => array(
				'APP_ID' => 'APP_ID',
				'APP_NAME' => 'REST_APP.APP_NAME',
				'MENU_NAME' => 'REST_APP.LANG.MENU_NAME',
				'DEFAULT_MENU_NAME' => 'REST_APP.LANG_DEFAULT.MENU_NAME'
			),
			'filter' => array(
				'EVENT_NAME' => $eventName
			)
		));

		while($row = $cursor->fetch())
		{
			$appId = $row['APP_ID'];
			if ($row['MENU_NAME'] != '')
				$appName = $row['MENU_NAME'];
			else if ($row['DEFAULT_MENU_NAME'] != '')
				$appName = $row['DEFAULT_MENU_NAME'];
			else
				$appName = $row['APP_NAME'];

			$result[$appId] = $appName;
		}

		return $result;


	}

	/**
	 * Returns id of the rest application, set as external call handler, or false if the external call handler is not set.
	 * @param int $userId Id of the user.
	 * @return string|false
	 */
	public static function getExternalCallHandler($userId)
	{
		$userDefaultLine = \CVoxImplantUser::getUserOutgoingLine($userId);
		$numberParameters = explode(':', $userDefaultLine);
		if($numberParameters[0] === \CVoxImplantConfig::MODE_REST_APP)
			return $numberParameters[1];
		else
			return false;
	}

	/**
	 * Sends event to start call to the configured rest application
	 * @param string $number Phone number to call.
	 * @param int $userId User id of the user, initiated the call.
	 * @param array $parameters Additional parameters.
	 * @return void
	 */
	public static function startCall($number, $userId, array $parameters)
	{
		$entityType = $parameters['ENTITY_TYPE'];
		$entityId = $parameters['ENTITY_ID'];
		if(strpos($entityType, 'CRM_') === 0)
		{
			$entityType = substr($entityType, 4);
		}
		else
		{
			$entityType = '';
			$entityId = null;
		}

		$eventFields = array(
			'PHONE_NUMBER' => $number,
			'USER_ID' => $userId,
			'CRM_ENTITY_TYPE' => $entityType,
			'CRM_ENTITY_ID' => $entityId,
			'CALL_LIST_ID' => (int)$parameters['CALL_LIST_ID'],
			'APP_ID' => self::getExternalCallHandler($userId)
		);

		$event = new Event(
			'voximplant',
			'onExternalCallStart',
			$eventFields
		);
		$event->send();
	}

	/**
	 * Send event to start callback to the rest application.
	 * @param array $parameters Array of parameters.
	 * @return void
	 */
	public static function startCallBack(array $parameters)
	{
		$eventFields = array(
			'PHONE_NUMBER' => $parameters['PHONE_NUMBER'],
			'TEXT' => $parameters['TEXT'],
			'VOICE' => $parameters['VOICE'],
			'CRM_ENTITY_TYPE' => $parameters['CRM_ENTITY_TYPE'],
			'CRM_ENTITY_ID' => $parameters['CRM_ENTITY_ID'],
			'APP_ID' => $parameters['APP_ID']
		);

		$event = new Event(
			'voximplant',
			'onExternalCallBackStart',
			$eventFields
		);
		$event->send();
	}

	/**
	 * @param string $callId Id of the call.
	 * @param string $fileName Name of file containing record.
	 * @param string $fileContent Base64-encoded string with file contents.
	 * @param \CRestServer $restServer Rest server.
	 * @return Result
	 * @throws \Bitrix\Main\LoaderException
	 */
	public static function attachRecord($callId, $fileName, $fileContent, $restServer)
	{
		$result = new Result();

		$statisticRecord = StatisticTable::getByCallId($callId);
		if(!$statisticRecord)
		{
			$result->addError(new Error("Call is not found in the statistic table. Looks like it is not finished yet."));
			return $result;
		}

		if($fileContent === null)
		{
			$result->setData(array(
				'uploadUrl' => \CRestUtil::getUploadUrl(array('callId' => $callId), $restServer),
				'fieldName' => static::FILE_FIELD
			));
			return $result;
		}

		if($fileName == '')
		{
			$result->addError(new Error("File name is empty"));
			return $result;
		}

		$allowedExtensions = array('wav', 'mp3');
		if(!in_array(GetFileExtension($fileName), $allowedExtensions))
		{
			$result->addError(new Error("Wrong file extension. Only wav and mp3 are allowed"));
			return $result;
		}

		$fileArray = \CRestUtil::saveFile($fileContent, $fileName);

		if ($fileArray === false)
		{
			$result->addError(new Error("File content is empty."));
			return $result;
		}

		if(is_null($fileArray))
		{
			$result->addError(new Error("File content is not properly encoded. Base64 encoding is expected."));
			return $result;
		}

		if(!is_array($fileArray))
		{
			$result->addError(new Error("Unknown error encountered while saving file."));
			return $result;
		}

		$saveResult = static::saveFile($statisticRecord['CALL_START_DATE']->format("Y-m"), $fileName, $fileArray, $statisticRecord['PORTAL_USER_ID']);
		if(!$saveResult->isSuccess())
		{
			$result->addErrors($saveResult->getErrors());
			return $result;
		}
		$saveResultData = $saveResult->getData();
		$file = $saveResultData['FILE'];

		$attachResult = static::attachFile($callId, $file);
		if(!$attachResult->isSuccess())
		{
			$result->addErrors($attachResult->getErrors());
			return $result;
		}

		$result->setData(array(
			'FILE_ID' => $file->getId()
		));

		return $result;
	}

	/**
	 * @param string $callId
	 * @param string $fileName
	 * @return Result
	 * @throws SystemException
	 */
	public static function uploadRecord($callId)
	{
		$result = new Result();
		if(!is_array($_FILES[self::FILE_FIELD]))
		{
			$result->addError(new Error("Error: required parameter " . self::FILE_FIELD . " is not found"));
			return $result;
		}

		$fileArray = $_FILES[self::FILE_FIELD];
		$fileName = $fileArray['name'];

		$allowedExtensions = array('wav', 'mp3');
		if(!in_array(GetFileExtension($fileName), $allowedExtensions))
		{
			$result->addError(new Error("Wrong file extension. Only wav and mp3 are allowed"));
			return $result;
		}

		$statisticRecord = \Bitrix\Voximplant\StatisticTable::getByCallId($callId);
		if(!$statisticRecord)
		{
			$result->addError(new Error("Call is not found in the statistic table. Looks like it is not finished yet."));
			return $result;
		}

		$saveResult = static::saveFile($statisticRecord['CALL_START_DATE']->format("Y-m"), $fileName, $fileArray, $statisticRecord['PORTAL_USER_ID']);
		if(!$saveResult->isSuccess())
		{
			$result->addErrors($saveResult->getErrors());
			return $result;
		}
		$saveResultData = $saveResult->getData();
		$file = $saveResultData['FILE'];

		$attachResult = static::attachFile($callId, $file);
		if(!$attachResult->isSuccess())
		{
			$result->addErrors($attachResult->getErrors());
			return $result;
		}

		$result->setData(array(
			'FILE_ID' => $file->getId()
		));

		return $result;
	}

	public static function searchCrmEntities($phoneNumber)
	{
		$result = new Result();

		if(!Loader::includeModule('crm'))
		{
			$result->addError(new Error('CRM is not installed.'));
			return $result;
		}

		$timeManInstalled = Loader::includeModule('timeman');

		$userId = Security\Helper::getCurrentUserId();
		$searchResult = \CCrmSipHelper::findByPhoneNumber($phoneNumber, array('USER_ID' => $userId));
		$resultData = array();
		$userIds = array();

		$entityNames = array(\CCrmOwnerType::ContactName, \CCrmOwnerType::LeadName, \CCrmOwnerType::CompanyName);
		foreach ($entityNames as $entityName)
		{
			if(isset($searchResult[$entityName]))
			{
				foreach ($searchResult[$entityName] as $entityData)
				{
					$resultData[] = array(
						'CRM_ENTITY_TYPE' => $entityName,
						'CRM_ENTITY_ID' => $entityData['ID'],
						'ASSIGNED_BY_ID' => $entityData['ASSIGNED_BY_ID']
					);
					$userIds[] = $entityData['ASSIGNED_BY_ID'];
				}
			}
		}

		$userCursor = UserTable::getList(array(
			'select' => array('ID', 'UF_PHONE_INNER', 'WORK_PHONE', 'PERSONAL_PHONE' , 'PERSONAL_MOBILE'),
			'filter' => array(
				'=ID' => $userIds
			)
		));

		$userData = array();
		while ($row = $userCursor->fetch())
		{
			$userId = $row['ID'];
			$userData[$userId] = $row;

			if($timeManInstalled)
			{
				$tmUser = new \CTimeManUser($userId);
				$tmSettings = $tmUser->GetSettings(Array('UF_TIMEMAN'));
				if (!$tmSettings['UF_TIMEMAN'])
				{
					$userData[$userId]['TIMEMAN_STATUS'] = 'UNAVAILABLE';
				}
				else
				{
					$userData[$userId]['TIMEMAN_STATUS'] = $tmUser->State();
				}
			}
			else
			{
				$userData[$userId]['TIMEMAN_STATUS'] = 'NOT_INSTALLED';
			}
		}

		foreach ($resultData as $k => $v)
		{
			$row = $userData[$v['ASSIGNED_BY_ID']];
			$resultData[$k]['ASSIGNED_BY'] = array(
				'ID' => $row['ID'],
				'TIMEMAN_STATUS' => $row['TIMEMAN_STATUS'],
				'USER_PHONE_INNER' => $row['UF_PHONE_INNER'],
				'WORK_PHONE' => $row['WORK_PHONE'],
				'PERSONAL_PHONE' => $row['PERSONAL_PHONE'],
				'PERSONAL_MOBILE' => $row['PERSONAL_MOBILE'],
			);
		}

		$result->setData($resultData);
		return $result;
	}

	/**
	 * @param $folderName
	 * @param $fileName
	 * @param $fileArray
	 * @param $userId
	 * @return Result
	 */
	protected static function saveFile($folderName, $fileName, $fileArray, $userId)
	{
		$result = new Result();
		if(!Loader::includeModule('disk'))
			throw new SystemException('Disk module is not installed');

		$uploadFolder = \CVoxImplantDiskHelper::GetRecordsFolder($folderName);
		$accessCodes = Array();
		$rightsManager = \Bitrix\Disk\Driver::getInstance()->getRightsManager();
		$fullAccessTaskId = $rightsManager->getTaskIdByName($rightsManager::TASK_FULL);

		$accessCodes[] = Array(
			'ACCESS_CODE' => 'U'.intval($userId),
			'TASK_ID' => $fullAccessTaskId,
		);
		
		$file = $uploadFolder->uploadFile(
			$fileArray,
			array(
				'NAME' => $fileName,
				'CREATED_BY' => $userId
			),
			$accessCodes
		);

		if($file)
		{
			$result->setData(array(
				'FILE' => $file
			));
		}
		else
		{
			$result->addErrors($uploadFolder->getErrors());
		}

		return $result;
	}

	/**
	 * Attaches record to the call and call activity.
	 * @param string $callId
	 * @param \Bitrix\Disk\File $file
	 * @return Result
	 * @throws \Bitrix\Main\LoaderException
	 * @throws \Exception
	 */
	protected function attachFile($callId, $file)
	{
		$result = new Result();

		if(!Loader::includeModule('crm'))
		{
			$result->addError(new Error("CRM is not installed"));
			return $result;
		}

		$statisticRecord = StatisticTable::getByCallId($callId);
		if(!$statisticRecord)
		{
			$result->addError(new Error("Call is not found in the statistic table. Looks like it is not finished yet."));
			return $result;
		}

		StatisticTable::update($statisticRecord['ID'], array(
			'CALL_RECORD_ID' => $file->getFileId(),
			'CALL_WEBDAV_ID' => $file->getId()
		));

		if($statisticRecord['CRM_ACTIVITY_ID'])
			$activity = \CCrmActivity::GetByID($statisticRecord['CRM_ACTIVITY_ID'], false);
		else
			$activity = \CCrmActivity::GetByOriginID('VI_'.$statisticRecord['CALL_ID'], false);

		if($activity)
		{
			$activityFields = array(
				'STORAGE_TYPE_ID' => StorageType::Disk,
				'STORAGE_ELEMENT_IDS' => array($file->getId())
			);

			$updateResult = \CCrmActivity::Update($activity['ID'], $activityFields, false);
			if(!$updateResult)
			{
				$result->addError(new Error(\CCrmActivity::GetLastErrorMessage()));
				return $result;
			}
		}

		return $result;
	}

}