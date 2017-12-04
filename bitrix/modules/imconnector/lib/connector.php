<?php
namespace Bitrix\ImConnector;

use \Bitrix\Main\Loader,
	\Bitrix\Main\Context,
	\Bitrix\Main\Data\Cache,
	\Bitrix\Main\Config\Option,
	\Bitrix\Main\Localization\Loc;
use \Bitrix\ImOpenLines\Network,
	\Bitrix\ImOpenLines\LiveChatManager;

Loc::loadMessages(__FILE__);
Library::loadMessages();

/**
 * Auxiliary class for work with connectors.
 * @package Bitrix\ImConnector
 */
class Connector
{
	const ERROR_CHOICE_DOMAIN_FOR_FEEDBACK = 'CHOICE_DOMAIN_FOR_FEEDBACK';

	/**
	 * List of connectors, available on the client. connector id => connector Name.
	 * @param bool|integer $reduced To shorten the channel names.
	 *
	 * @return array
	 */
	public static function getListConnector($reduced = false)
	{
		$connectors =  array(
			"livechat" => Loc::getMessage('IMCONNECTOR_NAME_CONNECTOR_LIVECHAT'),
			"viber" => Loc::getMessage('IMCONNECTOR_NAME_CONNECTOR_VIBER_BOT'),
			"telegrambot" => Loc::getMessage('IMCONNECTOR_NAME_CONNECTOR_TELEGRAM_BOT')
		);

		// disabled in b24.ua
		if(!Loader::includeModule('bitrix24') || \CBitrix24::getPortalZone() !== 'ua')
			$connectors["vkgroup"] = Loc::getMessage('IMCONNECTOR_NAME_CONNECTOR_VK_GROUP');

		$connectors = array_merge($connectors, array(
			"facebook" => Loc::getMessage('IMCONNECTOR_NAME_CONNECTOR_FACEBOOK_PAGE'),
			"facebookcomments" => Loc::getMessage('IMCONNECTOR_NAME_CONNECTOR_FACEBOOK_COMMENTS_PAGE'),
			"instagram" => Loc::getMessage('IMCONNECTOR_NAME_CONNECTOR_INSTAGRAM'),
			"network" => Loc::getMessage('IMCONNECTOR_NAME_CONNECTOR_NETWORK'),
			//Virtual connectors.
			"botframework.skype" => Loc::getMessage('IMCONNECTOR_NAME_CONNECTOR_BOTFRAMEWORK_SKYPE'),
			"botframework.slack" => Loc::getMessage('IMCONNECTOR_NAME_CONNECTOR_BOTFRAMEWORK_SLACK'),
			"botframework.kik" => Loc::getMessage('IMCONNECTOR_NAME_CONNECTOR_BOTFRAMEWORK_KIK'),
			"botframework.groupme" => Loc::getMessage('IMCONNECTOR_NAME_CONNECTOR_BOTFRAMEWORK_GROUPME'),
			"botframework.twilio" => Loc::getMessage('IMCONNECTOR_NAME_CONNECTOR_BOTFRAMEWORK_TWILIO'),
			"botframework.msteams" => Loc::getMessage('IMCONNECTOR_NAME_CONNECTOR_BOTFRAMEWORK_MSTEAMS'),
			"botframework.webchat" => Loc::getMessage('IMCONNECTOR_NAME_CONNECTOR_BOTFRAMEWORK_WEBCHAT'),
			"botframework.emailoffice365" => Loc::getMessage('IMCONNECTOR_NAME_CONNECTOR_BOTFRAMEWORK_EMAILOFFICE365'),
			"botframework.telegram" => Loc::getMessage('IMCONNECTOR_NAME_CONNECTOR_BOTFRAMEWORK_TELEGRAM'),
			"botframework.facebookmessenger" => Loc::getMessage('IMCONNECTOR_NAME_CONNECTOR_BOTFRAMEWORK_FACEBOOKMESSENGER'),
			"botframework.directline" => Loc::getMessage('IMCONNECTOR_NAME_CONNECTOR_BOTFRAMEWORK_DIRECTLINE'),
		));

		if(!empty($reduced))
		{
			if($reduced>5)
				$number = $reduced;
			else
				$number = 30;

			foreach ($connectors as $cell=>$connector)
			{
				if(strlen($connector) > $number)
					$connectors[$cell] = substr($connector, 0, ($number-3)) . '...';
			}
		}

		return $connectors;
	}

	/**
	 * Real list of connectors, available on the client. connector id => connector Name.
	 * @param bool|integer $reduced To shorten the channel names.
	 *
	 * @return array.
	 */
	public static function getListConnectorReal($reduced = false)
	{
		$connectors =  array(
			"livechat" => Loc::getMessage('IMCONNECTOR_NAME_CONNECTOR_LIVECHAT'),
			"viber" => Loc::getMessage('IMCONNECTOR_NAME_CONNECTOR_VIBER_BOT'),
			"telegrambot" => Loc::getMessage('IMCONNECTOR_NAME_CONNECTOR_TELEGRAM_BOT')
		);

		// disabled in b24.ua
		if(!Loader::includeModule('bitrix24') || \CBitrix24::getPortalZone() !== 'ua')
			$connectors["vkgroup"] = Loc::getMessage('IMCONNECTOR_NAME_CONNECTOR_VK_GROUP');

		$connectors = array_merge($connectors, array(
			"facebook" => Loc::getMessage('IMCONNECTOR_NAME_CONNECTOR_FACEBOOK_PAGE'),
			"facebookcomments" => Loc::getMessage('IMCONNECTOR_NAME_CONNECTOR_FACEBOOK_COMMENTS_PAGE'),
			"instagram" => Loc::getMessage('IMCONNECTOR_NAME_CONNECTOR_INSTAGRAM'),
			"network" => Loc::getMessage('IMCONNECTOR_NAME_CONNECTOR_NETWORK'),

			"botframework" => Loc::getMessage('IMCONNECTOR_NAME_CONNECTOR_BOTFRAMEWORK'),
		));

		if(!empty($reduced))
		{
			if($reduced>5)
				$number = $reduced;
			else
				$number = 30;

			foreach ($connectors as $cell=>$connector)
			{
				if(strlen($connector) > $number)
					$connectors[$cell] = substr($connector, 0, ($number-3)) . '...';
			}
		}

		return $connectors;
	}

	public static function getListConnectorShowDeliveryStatus()
	{
		return array_keys(static::getListConnector());
	}

	/**
	 * A list of matching id of the connector component.
	 *
	 * @return array
	 */
	public static function getListComponentConnector()
	{
		$components = array(
			'livechat' => 'imconnector.livechat',
			'viber' => 'imconnector.viber',
			'telegrambot' => 'imconnector.telegrambot'
		);

		// disabled in b24.ua
		if(!Loader::includeModule('bitrix24') || \CBitrix24::getPortalZone() !== 'ua')
			$components["vkgroup"] = 'imconnector.vkgroup';

		$components = array_merge($components, array(
			'facebook' => 'imconnector.facebook',
			'facebookcomments' => 'imconnector.facebookcomments',
			'instagram' => 'imconnector.instagram',
			'network' => 'imconnector.network',
			'botframework' => 'imconnector.botframework',
		));

		return $components;
	}

	/**
	 * List of connectors where you can delete other people's posts
	 *
	 * @return array
	 */
	public static function getListConnectorDelExternalMessages()
	{
		return Library::$listConnectorDelExternalMessages;
	}

	/**
	 * List of connectors where you can edit your posts
	 *
	 * @return array
	 */
	public static function getListConnectorEditInternalMessages()
	{
		return Library::$listConnectorEditInternalMessages;
	}

	/**
	 * List of connectors where you can delete your posts
	 *
	 * @return array
	 */
	public static function getListConnectorDelInternalMessages()
	{
		return Library::$listConnectorDelInternalMessages;
	}

	/**
	 * Do I need to send system messages?
	 *
	 * @param string $id ID connector
	 * @return bool
	 */
	public static function isNeedSystemMessages($id)
	{
		return !in_array($id, Library::$listNotNeedSystemMessages);
	}

	/**
	 * Whether to send a signature?
	 *
	 * @param string $id ID connector
	 * @return bool
	 */
	public static function isNeedSignature($id)
	{
		return !in_array($id, Library::$listNotNeedSignature);
	}

	/**
	 * This chat group?
	 *
	 * @param string $id ID connector
	 * @return bool
	 */
	public static function isChatGroup($id)
	{
		return in_array($id, Library::$listGroupChats);
	}

	/**
	 * The list are available also connectors, active on the client.
	 * The connector has to be available on the client, it has to be included in settings and be supported on the server.
	 * @param bool|integer $reduced To shorten the channel names.
	 *
	 * @return array.
	 */
	public static function getListActiveConnector($reduced = false)
	{
		$result = array();
		foreach (self::getListConnector($reduced) as $id => $value)
		{
			if(self::isConnector($id))
				$result[$id] = $value;
		}

		return $result;
	}

	/**
	 * The list are available also real connectors, active on the client.
	 * The connector has to be available on the client, it has to be included in settings and be supported on the server.
	 * @param bool|integer $reduced To shorten the channel names.
	 *
	 * @return array.
	 */
	public static function getListActiveConnectorReal($reduced = false)
	{
		$result = array();
		foreach (self::getListConnectorReal($reduced) as $id => $value)
		{
			if(self::isConnector($id))
				$result[$id] = $value;
		}

		return $result;
	}

	/**
	 * Returns a list of connectors, ready for sharing.
	 *
	 * @param string $lineId ID Open Line.
	 * @return array
	 */
	public static function getListConnectedConnector($lineId)
	{
		$result = array();
		$listActiveConnector = self::getListActiveConnector();

		foreach ($listActiveConnector as $id => $value)
		{
			if(Status::getInstance($id, $lineId)->isStatus())
				$result[$id] = $value;
		}

		return $result;
	}

	/**
	 * List of connectors displayed in the menu.
	 *
	 * @param bool|integer $reduced To shorten the channel names.
	 * @return array
	 */
	public static function getListConnectorMenu($reduced = false)
	{
		$result = array();
		foreach (self::getListConnectorReal($reduced) as $id => $value)
		{
			if(self::isConnector($id, true))
			{
				$result[$id]['name'] = $value;

				if($reduced)
					$result[$id]['short_name'] = self::getNameConnector($value, $reduced);
			}
		}

		return $result;
	}

	/**
	 * Returns a list of real connectors, ready for sharing.
	 *
	 * @param string $lineId ID Open Line.
	 * @return array
	 */
	public static function getListConnectedConnectorReal($lineId)
	{
		$result = array();
		$listActiveConnector = self::getListActiveConnectorReal();

		foreach ($listActiveConnector as $id => $value)
		{
			if(Status::getInstance($id, $lineId)->isStatus())
				$result[$id] = $value;
		}

		return $result;
	}

	/**
	 * Returns a connector name.
	 *
	 * @param string $id ID connector.
	 * @param bool|integer $reduced To shorten the channel names.
	 * @return bool|mixed
	 */
	public static function getNameConnector($id, $reduced = false)
	{
		$listConnector = self::getListConnector($reduced);

		if(isset($listConnector[$id]))
			return $listConnector[$id];
		else
			return false;
	}

	/**
	 * Returns a real connector name.
	 *
	 * @param string $id ID connector.
	 * @param bool|integer $reduced To shorten the channel names.
	 * @return bool|mixed
	 */
	public static function getNameConnectorReal($id, $reduced = false)
	{
		$listConnector = self::getListConnectorReal($reduced);

		if(isset($listConnector[$id]))
			return $listConnector[$id];
		else
			return false;
	}

	/**
	 * Returns a real connector id.
	 *
	 * @param string $id ID connector.
	 * @return string $id ID connector real.
	 */
	public static function getConnectorRealId($id)
	{
		$id = strtolower($id);

		$positionSeparator = strpos($id, '.');

		if($positionSeparator != false)
		{
			$id = substr($id, 0, $positionSeparator);
		}

		return $id;
	}

	/**
	 * Check of the connector. That it is included in settings is checked and supported by the server.
	 *
	 * @param string $id ID connector.
	 * @param bool $local Not to check on a remote server.
	 * @return bool
	 * @throws \Bitrix\Main\ArgumentNullException
	 */
	public static function isConnector($id, $local = false)
	{
		$id = self::getConnectorRealId($id);

		$listConnector = strtolower(Option::get(Library::MODULE_ID, "list_connector"));
		$listConnector = explode(",", $listConnector);

		if(in_array($id, $listConnector) && (in_array($id, Library::$noServerConnectors) || $local || Output::isConnector($id)->isSuccess()))
			return true;
		else
			return false;
	}

	/**
	 * Returns the domain by default of the current client.
	 *
	 * @return string
	 * @throws \Bitrix\Main\ArgumentNullException
	 */
	public static function getDomainDefault()
	{
		$uriOption = Option::get(Library::MODULE_ID, "uri_client");

		if(!empty($uriOption))
			$uri = $uriOption;
		elseif(defined('BX24_HOST_NAME'))
			$uri = (Context::getCurrent()->getRequest()->isHttps() ? 'https://' :  'http://') . BX24_HOST_NAME;
		else
			$uri = Library::getCurrentServerUrl();

		return $uri;
	}

	/**
	 * Returns information about all connected connectors specific open line.
	 *
	 * @param string $id ID open line.
	 * @return array.
	 */
	public static function infoConnectorsLine($id)
	{
		$result = array();
		$cache = Cache::createInstance();

		if ($cache->initCache(Library::CACHE_TIME_INFO_CONNECTORS_LINE, $id, Library::CACHE_DIR_INFO_CONNECTORS_LINE))
		{
			$result = $cache->getVars();
		}
		elseif ($cache->startDataCache())
		{
			$rawInfo = Output::infoConnectorsLine($id);

			$infoConnectors = $rawInfo->getData();

			$result = array();

			$connectors = self::getListActiveConnector();

			foreach ($connectors as $idConnector=>$value)
			{
				if(!empty($infoConnectors[$idConnector]))
				{
					$result[$idConnector] = $infoConnectors[$idConnector];
					if(empty($result[$idConnector]['name']))
						$result[$idConnector]['name'] = $value;

					$result[$idConnector]['connector_name'] = $value;
				}
			}

			$cache->endDataCache($result);
		}

		return $result;
	}

	/**
	 * Returns the ID of the cache settings of the connector.
	 *
	 * @param string $line ID open line.
	 * @param string $connector ID connector.
	 * @return string ID for the cache.
	 */
	public static function getCacheIdConnector($line, $connector)
	{
		return $connector . '|' . $line;
	}

	/**
	 * Resets the cache settings connectors open lines.
	 *
	 * @param string $line ID open line.
	 * @param string $cacheId ID for the cache.
	 */
	public static function cleanCacheConnector($line, $cacheId)
	{
		$cache = Cache::createInstance();
		$cache->clean($cacheId, Library::CACHE_DIR_COMPONENT);
		$cache->clean($line, Library::CACHE_DIR_INFO_CONNECTORS_LINE);
	}

	/**
	 * Full resets the cache settings connectors open lines.
	 */
	public static function cleanFullCacheConnector()
	{
		$allConnector = Status::getInstanceAll();

		foreach ($allConnector as $connector => $item)
		{
			foreach ($item as $line => $status)
			{
				self::cleanCacheConnector($line, self::getCacheIdConnector($line, $connector));
			}
		}
	}

	/**
	 * Adding a channel is an open line.
	 *
	 * @param string $line ID open line.
	 * @param string $connector ID open line.
	 * @param array $params Settings.
	 * @return Result The result of the addition.
	 */
	public static function add($line, $connector, $params = array())
	{
		$result = new Result();

		if(empty($line) || empty($connector))
		{
			$result->addError(new Error(Loc::getMessage('IMCONNECTOR_EMPTY_PARAMETRS'), Library::ERROR_IMCONNECTOR_EMPTY_PARAMETRS, __METHOD__, array('line' => $line, 'connector' => $connector, 'params' => $params)));
		}
		else
		{
			if(!self::isConnector($connector))
			{
				$result->addError(new Error(Loc::getMessage('IMCONNECTOR_NOT_AVAILABLE_CONNECTOR'), Library::ERROR_NOT_AVAILABLE_CONNECTOR, __METHOD__, $connector));
			}
			else
			{
				$status = Status::getInstance($connector, $line);
				$cacheId = self::getCacheIdConnector($line, $connector);

				if($status->getActive())
					$result->addError(new Error(Loc::getMessage('IMCONNECTOR_ADD_EXISTING_CONNECTOR'), Library::ERROR_ADD_EXISTING_CONNECTOR, __METHOD__, $connector));

				if($result->isSuccess())
				{
					switch ($connector)
					{
						case 'livechat':
							if(Loader::includeModule(Library::MODULE_ID_OPEN_LINES))
							{
								$liveChatManager = new LiveChatManager($line);
								if (!$liveChatManager->add($params))
									$result->addError(new Error(Loc::getMessage('IMCONNECTOR_FAILED_TO_ADD_CONNECTOR'), Library::ERROR_FAILED_TO_ADD_CONNECTOR, __METHOD__, $connector));
							}
							else
							{
								$result->addError(new Error(Loc::getMessage('IMCONNECTOR_FAILED_TO_LOAD_MODULE_OPEN_LINES'), Library::ERROR_FAILED_TO_LOAD_MODULE_OPEN_LINES, __METHOD__, $connector));
							}
							break;

						case 'network':
							if(Loader::includeModule(Library::MODULE_ID_OPEN_LINES))
							{
								$network = new Network();
								$resultRegister = $network->registerConnector($line, $params);
								if (!$resultRegister)
									$result->addError(new Error(Loc::getMessage('IMCONNECTOR_FAILED_TO_ADD_CONNECTOR'), Library::ERROR_FAILED_TO_ADD_CONNECTOR, __METHOD__, $connector));
								else
									$status->setData($resultRegister);
							}
							else
							{
								$result->addError(new Error(Loc::getMessage('IMCONNECTOR_FAILED_TO_LOAD_MODULE_OPEN_LINES'), Library::ERROR_FAILED_TO_LOAD_MODULE_OPEN_LINES, __METHOD__, $connector));
							}
							break;

						case 'telegrambot':
						case 'botframework':
							$output = new Output($connector, $line);
							$saved = $output->saveSettings($params);

							if($saved->isSuccess())
							{
								$status->setActive(true);

								$testConnect = $output->testConnect();
								if($testConnect->isSuccess())
								{
									$status->setConnection(true);

									$register = $output->register();
									if(!$register->isSuccess())
									{
										$result->addError(new Error(Loc::getMessage('IMCONNECTOR_FAILED_REGISTER_CONNECTOR'), Library::ERROR_FAILED_REGISTER_CONNECTOR, __METHOD__, $connector));
										$result->addErrors($testConnect->getErrors());
									}
								}
								else
								{
									$result->addError(new Error(Loc::getMessage('IMCONNECTOR_FAILED_TO_TEST_CONNECTOR'), Library::ERROR_FAILED_TO_TEST_CONNECTOR, __METHOD__, $connector));
									$result->addErrors($testConnect->getErrors());
								}
							}
							else
							{
								$result->addError(new Error(Loc::getMessage('IMCONNECTOR_FAILED_TO_SAVE_SETTINGS_CONNECTOR'), Library::ERROR_FAILED_TO_SAVE_SETTINGS_CONNECTOR, __METHOD__, $connector));
								$result->addErrors($saved->getErrors());
							}
							break;

						case 'vkgroup':
						case 'facebook':
						case 'facebookcomments':
						case 'instagram':
						default:
							$result->addError(new Error(Loc::getMessage('IMCONNECTOR_FEATURE_IS_NOT_SUPPORTED'), Library::ERROR_FEATURE_IS_NOT_SUPPORTED, __METHOD__, $connector));
							break;
					}
				}

				if($result->isSuccess())
				{
					$status->setActive(true);
					$status->setConnection(true);
					$status->setRegister(true);
					$status->setError(false);
					Status::save();
					Status::sendUpdateEvent();
				}

				self::cleanCacheConnector($line, $cacheId);
			}
		}

		return $result;
	}

	/**
	 * Update a channel is an open line.
	 *
	 * @param string $line ID open line.
	 * @param string $connector ID open line.
	 * @param array $params Settings.
	 * @return Result The result of the addition.
	 */
	public static function update($line, $connector, $params = array())
	{
		$result = new Result();

		if(empty($line) || empty($connector))
		{
			$result->addError(new Error(Loc::getMessage('IMCONNECTOR_EMPTY_PARAMETRS'), Library::ERROR_IMCONNECTOR_EMPTY_PARAMETRS, __METHOD__, array('line' => $line, 'connector' => $connector, 'params' => $params)));
		}
		else
		{
			if(!self::isConnector($connector))
			{
				$result->addError(new Error(Loc::getMessage('IMCONNECTOR_NOT_AVAILABLE_CONNECTOR'), Library::ERROR_NOT_AVAILABLE_CONNECTOR, __METHOD__, $connector));
			}
			else
			{
				$status = Status::getInstance($connector, $line);
				$cacheId = self::getCacheIdConnector($line, $connector);

				if(!$status->getActive())
					$result->addError(new Error(Loc::getMessage('IMCONNECTOR_UPDATE_NOT_EXISTING_CONNECTOR'), Library::ERROR_UPDATE_NOT_EXISTING_CONNECTOR, __METHOD__, $connector));

				if($result->isSuccess())
				{
					switch ($connector)
					{
						case 'livechat':
							if(Loader::includeModule(Library::MODULE_ID_OPEN_LINES))
							{
								$liveChatManager = new LiveChatManager($line);
								if (!$liveChatManager->update($params))
									$result->addError(new Error(Loc::getMessage('IMCONNECTOR_FAILED_TO_UPDATE_CONNECTOR'), Library::ERROR_FAILED_TO_UPDATE_CONNECTOR, __METHOD__, $connector));
							}
							else
							{
								$result->addError(new Error(Loc::getMessage('IMCONNECTOR_FAILED_TO_LOAD_MODULE_OPEN_LINES'), Library::ERROR_FAILED_TO_LOAD_MODULE_OPEN_LINES, __METHOD__, $connector));
							}

							if(!$result->isSuccess())
							{
								$status->setConnection(false);
								$status->setRegister(false);
							}
							break;

						case 'network':
							if(Loader::includeModule(Library::MODULE_ID_OPEN_LINES))
							{
								$network = new Network();
								if (!$network->updateConnector($line, $params))
								{
									$result->addError(new Error(Loc::getMessage('IMCONNECTOR_FAILED_TO_UPDATE_CONNECTOR'), Library::ERROR_FAILED_TO_UPDATE_CONNECTOR, __METHOD__, $connector));
								}
								else
								{
									$dataStatus = $status->getData();
									$dataStatus = array_merge($dataStatus, $params);
									$status->setData($dataStatus);
								}
							}
							else
							{
								$result->addError(new Error(Loc::getMessage('IMCONNECTOR_FAILED_TO_LOAD_MODULE_OPEN_LINES'), Library::ERROR_FAILED_TO_LOAD_MODULE_OPEN_LINES, __METHOD__, $connector));
							}

							if(!$result->isSuccess())
							{
								$status->setConnection(false);
								$status->setRegister(false);
							}
							break;

						case 'telegrambot':
						case 'botframework':
							$output = new Output($connector, $line);
							$saved = $output->saveSettings($params);

							if($saved->isSuccess())
							{
								$testConnect = $output->testConnect();
								if($testConnect->isSuccess())
								{
									$status->setConnection(true);

									$register = $output->register();
									if(!$register->isSuccess())
									{
										$result->addError(new Error(Loc::getMessage('IMCONNECTOR_FAILED_REGISTER_CONNECTOR'), Library::ERROR_FAILED_REGISTER_CONNECTOR, __METHOD__, $connector));
										$result->addErrors($testConnect->getErrors());

										$status->setRegister(false);
									}
								}
								else
								{
									$result->addError(new Error(Loc::getMessage('IMCONNECTOR_FAILED_TO_TEST_CONNECTOR'), Library::ERROR_FAILED_TO_TEST_CONNECTOR, __METHOD__, $connector));
									$result->addErrors($testConnect->getErrors());

									$status->setConnection(false);
								}
							}
							else
							{
								$result->addError(new Error(Loc::getMessage('IMCONNECTOR_FAILED_TO_SAVE_SETTINGS_CONNECTOR'), Library::ERROR_FAILED_TO_SAVE_SETTINGS_CONNECTOR, __METHOD__, $connector));
								$result->addErrors($saved->getErrors());

								$status->setConnection(false);
								$status->setRegister(false);
							}
							break;

						case 'vkgroup':
						case 'facebook':
						case 'facebookcomments':
						case 'instagram':
						default:
							$result->addError(new Error(Loc::getMessage('IMCONNECTOR_FEATURE_IS_NOT_SUPPORTED'), Library::ERROR_FEATURE_IS_NOT_SUPPORTED, __METHOD__, $connector));
							break;
					}
				}

				if($result->isSuccess())
				{
					$status->setActive(true);
					$status->setConnection(true);
					$status->setRegister(true);
				}

				$status->setError(false);
				Status::save();
				Status::sendUpdateEvent();

				self::cleanCacheConnector($line, $cacheId);
			}
		}

		return $result;
	}

	/**
	 * Delete a channel is an open line.
	 *
	 * @param string $line ID open line.
	 * @param string $connector ID open line.
	 * @return Result The result of the addition.
	 */
	public static function delete($line, $connector)
	{
		$result = new Result();

		if(empty($line) || empty($connector))
		{
			$result->addError(new Error(Loc::getMessage('IMCONNECTOR_EMPTY_PARAMETRS'), Library::ERROR_IMCONNECTOR_EMPTY_PARAMETRS, __METHOD__, array('line' => $line, 'connector' => $connector)));
		}
		else
		{
			if(!self::isConnector($connector))
			{
				$result->addError(new Error(Loc::getMessage('IMCONNECTOR_NOT_AVAILABLE_CONNECTOR'), Library::ERROR_NOT_AVAILABLE_CONNECTOR, __METHOD__, $connector));
			}
			else
			{
				$status = Status::getInstance($connector, $line);
				$cacheId = self::getCacheIdConnector($line, $connector);

				if(!$status->getActive())
					$result->addError(new Error(Loc::getMessage('IMCONNECTOR_DELETE_NOT_EXISTING_CONNECTOR'), Library::ERROR_DELETE_NOT_EXISTING_CONNECTOR, __METHOD__, $connector));

				if($result->isSuccess())
				{
					switch ($connector)
					{
						case 'livechat':
							if(Loader::includeModule(Library::MODULE_ID_OPEN_LINES))
							{
							$liveChatManager = new LiveChatManager($line);
							if (!$liveChatManager->delete())
								$result->addError(new Error(Loc::getMessage('IMCONNECTOR_FAILED_TO_DELETE_CONNECTOR'), Library::ERROR_FAILED_TO_DELETE_CONNECTOR,  __METHOD__, $connector));
							}
							else
							{
								$result->addError(new Error(Loc::getMessage('IMCONNECTOR_FAILED_TO_LOAD_MODULE_OPEN_LINES'), Library::ERROR_FAILED_TO_LOAD_MODULE_OPEN_LINES, __METHOD__, $connector));
							}

							break;

						case 'network':
							if(Loader::includeModule(Library::MODULE_ID_OPEN_LINES))
							{
								$network = new Network();
								if (!$network->unRegisterConnector($line))
									$result->addError(new Error(Loc::getMessage('IMCONNECTOR_FAILED_TO_DELETE_CONNECTOR'), Library::ERROR_FAILED_TO_DELETE_CONNECTOR, __METHOD__, $connector));
							}
							else
							{
								$result->addError(new Error(Loc::getMessage('IMCONNECTOR_FAILED_TO_LOAD_MODULE_OPEN_LINES'), Library::ERROR_FAILED_TO_LOAD_MODULE_OPEN_LINES, __METHOD__, $connector));
							}
							break;

						case 'facebook':
						case 'vkgroup':
						case 'telegrambot':
						case 'botframework':
						case 'facebookcomments':
						case 'instagram':
							$output = new Output($connector, $line);
							$rawDelete = $output->deleteConnector();
							if(!$rawDelete->isSuccess())
							{
								$result->addError(new Error(Loc::getMessage('IMCONNECTOR_FAILED_TO_DELETE_CONNECTOR'), Library::ERROR_FAILED_TO_DELETE_CONNECTOR, __METHOD__, $connector));
								$result->addErrors($rawDelete->getErrors());

							}
							break;

						default:
							$result->addError(new Error(Loc::getMessage('IMCONNECTOR_FEATURE_IS_NOT_SUPPORTED'), Library::ERROR_FEATURE_IS_NOT_SUPPORTED, __METHOD__, $connector));
							break;
					}
				}

				if($result->isSuccess())
				{
					Status::delete($connector, $line);
				}

				self::cleanCacheConnector($line, $cacheId);
			}
		}

		return $result;
	}
}