<?php

namespace Bitrix\ImOpenLines;

use Bitrix\Main,
	Bitrix\Main\Localization\Loc;

Loc::loadMessages(__FILE__);

class Common
{
	const TYPE_BITRIX24 = 'B24';
	const TYPE_CP = 'CP';
	
	/**
	 * Unsupported old-fashioned permission check. 
	 * @return bool
	 * @deprecated Use Bitrix\ImOpenLines\Security\Permissions instead. 
	 */
	public static function hasAccessForAdminPages()
	{
		if (\IsModuleInstalled('bitrix24'))
		{
			return $GLOBALS['USER']->CanDoOperation('bitrix24_config');
		}
		else
		{
			return $GLOBALS["USER"]->IsAdmin();
		}
	}
	
	public static function getPortalType()
	{
		$type = '';
		if(defined('BX24_HOST_NAME'))
		{
			$type = self::TYPE_BITRIX24;
		}
		else
		{
			$type = self::TYPE_CP;
		}
		return $type;
	}

	public static function getPublicFolder()
	{
		return self::GetPortalType() == self::TYPE_BITRIX24 || file_exists($_SERVER['DOCUMENT_ROOT'].'/openlines/')? '/openlines/': SITE_DIR . 'services/openlines/';
	}

	public static function getServerAddress()
	{
		$publicUrl = \Bitrix\Main\Config\Option::get("imopenlines", "portal_url");

		if ($publicUrl != '')
			return $publicUrl;
		else
			return (\Bitrix\Main\Context::getCurrent()->getRequest()->isHttps() ? "https" : "http")."://".$_SERVER['SERVER_NAME'].(in_array($_SERVER['SERVER_PORT'], Array(80, 443))?'':':'.$_SERVER['SERVER_PORT']);
	}

	public static function deleteBrokenSession()
	{
		$orm = \Bitrix\ImOpenLines\Model\SessionTable::getList(array(
			'select' => Array('ID'),
			'filter' => Array('=CONFIG.ID' => '')
		));
		while ($session = $orm->fetch())
		{
			\Bitrix\ImOpenLines\Model\SessionTable::delete($session['ID']);
		}
		
		$orm = \Bitrix\ImOpenLines\Model\SessionCheckTable::getList(array(
			'filter' => Array('=SESSION.ID' => '')
		));
		while ($session = $orm->fetch())
		{
			\Bitrix\ImOpenLines\Model\SessionCheckTable::delete($session['SESSION_ID']);
		}

		return '\Bitrix\ImOpenLines\Common::deleteBrokenSession();';
	}
	
	public static function setUserAgrees($params)
	{
		if (empty($params['USER_CODE']))
			return false;
		
		$params['AGREEMENT_ID'] = intval($params['AGREEMENT_ID']);
		if ($params['AGREEMENT_ID'] <= 0)
			return false;
		
		$params['FLAG'] = $params['FLAG'] == 'N'? 'N': 'Y';
		
		\Bitrix\Imopenlines\Model\UserRelationTable::update($params['USER_CODE'], Array('AGREES' => $params['FLAG']));
		
		if ($params['FLAG'] == 'Y' && \Bitrix\Main\Loader::includeModule('crm'))
		{
			\Bitrix\Main\UserConsent\Consent::addByContext(
				intval($params['AGREEMENT_ID']),
				\Bitrix\Crm\Integration\UserConsent::PROVIDER_CODE,
				intval($params['CRM_ACTIVITY_ID']),
				array('IP' => '', 'URL' => self::getHistoryLink($params['SESSION_ID'], $params['CONFIG_ID']))
			);
		}
		
		return true;
	}
	
	public static function getAgreementLink($agreementId, $fieldsNames = Array())
	{
		$url = '/pub/agreement.php';
		
		$url = \Bitrix\Main\UserConsent\AgreementLink::getUri(
			$agreementId, 
			array('fields' => $fieldsNames), 
			\Bitrix\ImOpenLines\Common::getServerAddress().$url
		);
		
		return $url;
	}
	
	public static function getHistoryLink($sessionId, $configId)
	{
		$sessionId = intval($sessionId);
		$configId = intval($configId);
		
		return \Bitrix\ImOpenLines\Common::getServerAddress().\Bitrix\ImOpenLines\Common::getPublicFolder()."statistics.php?".($configId? 'CONFIG_ID='.$configId.'&': '').'IM_HISTORY=imol|'.$sessionId;
	}
	
	public static function getBitrixUrlByLang($lang = null)
	{
		$url = '';
		if (\Bitrix\Main\Loader::includeModule('bitrix24'))
		{
			if (!$lang)
			{
				if (defined('B24_LANGUAGE_ID'))
					$lang = B24_LANGUAGE_ID;
				else
					$lang = substr((string)\Bitrix\Main\Config\Option::get('main', '~controller_group_name'), 0, 2);
			}
			
			$areaConfig = \CBitrix24::getAreaConfig($lang);
			if ($areaConfig)
			{
				$url = 'www'.$areaConfig['DEFAULT_DOMAIN'];
			}
			else
			{
				$url = 'www.bitrix24.com';
			}
		}
		else
		{
			if (LANGUAGE_ID == 'de')
			{
				$url = 'www.bitrix24.de';
			}
			else if (LANGUAGE_ID == 'ua')
			{
				$url = 'www.bitrix24.ua';
			}
			else if (LANGUAGE_ID == 'kz')
			{
				$url = 'www.bitrix24.kz';
			}
			else if (LANGUAGE_ID == 'by')
			{
				$url = 'www.bitrix24.by';
			}
			else if (LANGUAGE_ID == 'ru')
			{
				$url = 'www.bitrix24.ru';
			}
			else
			{
				$url = 'www.bitrix24.com';
			}
		}
		
		$partnerId = \Bitrix\Main\Config\Option::get("bitrix24", "partner_id", 0);
		if ($partnerId)
		{
			$url .= '/?p='.$partnerId;
		}
		
		return "https://".$url;
	}
}
