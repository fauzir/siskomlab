<?php
/**
 * Bitrix Framework
 * @package bitrix
 * @subpackage main
 * @copyright 2001-2015 Bitrix
 */
namespace Bitrix\Main\Config;

use Bitrix\Main;

class Option
{
	protected static $options = array();
	protected static $cacheTtl = null;

	/**
	 * Returns a value of an option.
	 *
	 * @param string $moduleId The module ID.
	 * @param string $name The option name.
	 * @param string $default The default value to return, if a value doesn't exist.
	 * @param bool|string $siteId The site ID, if the option differs for sites.
	 * @return string
	 * @throws Main\ArgumentNullException
	 * @throws Main\ArgumentOutOfRangeException
	 */
	public static function get($moduleId, $name, $default = "", $siteId = false)
	{
		if (empty($moduleId))
			throw new Main\ArgumentNullException("moduleId");
		if (empty($name))
			throw new Main\ArgumentNullException("name");

		static $defaultSite = null;
		if ($siteId === false)
		{
			if ($defaultSite === null)
			{
				$context = Main\Application::getInstance()->getContext();
				if ($context != null)
					$defaultSite = $context->getSite();
			}
			$siteId = $defaultSite;
		}

		$siteKey = ($siteId == "") ? "-" : $siteId;
		if (static::$cacheTtl === null)
			static::$cacheTtl = self::getCacheTtl();
		if ((static::$cacheTtl === false) && !isset(self::$options[$siteKey][$moduleId])
			|| (static::$cacheTtl !== false) && empty(self::$options))
		{
			self::load($moduleId, $siteId);
		}

		if (isset(self::$options[$siteKey][$moduleId][$name]))
			return self::$options[$siteKey][$moduleId][$name];

		if (isset(self::$options["-"][$moduleId][$name]))
			return self::$options["-"][$moduleId][$name];

		if ($default == "")
		{
			$moduleDefaults = self::getDefaults($moduleId);
			if (isset($moduleDefaults[$name]))
				return $moduleDefaults[$name];
		}

		return $default;
	}

	/**
	 * Returns the real value of an option as it's written in a DB.
	 *
	 * @param string $moduleId The module ID.
	 * @param string $name The option name.
	 * @param bool|string $siteId The site ID.
	 * @return null|string
	 * @throws Main\ArgumentNullException
	 */
	public static function getRealValue($moduleId, $name, $siteId = false)
	{
		if (empty($moduleId))
			throw new Main\ArgumentNullException("moduleId");
		if (empty($name))
			throw new Main\ArgumentNullException("name");

		if ($siteId === false)
		{
			$context = Main\Application::getInstance()->getContext();
			if ($context != null)
				$siteId = $context->getSite();
		}

		$siteKey = ($siteId == "") ? "-" : $siteId;
		if (static::$cacheTtl === null)
			static::$cacheTtl = self::getCacheTtl();
		if ((static::$cacheTtl === false) && !isset(self::$options[$siteKey][$moduleId])
			|| (static::$cacheTtl !== false) && empty(self::$options))
		{
			self::load($moduleId, $siteId);
		}

		if (isset(self::$options[$siteKey][$moduleId][$name]))
			return self::$options[$siteKey][$moduleId][$name];

		return null;
	}

	/**
	 * Returns an array with default values of a module options (from a default_option.php file).
	 *
	 * @param string $moduleId The module ID.
	 * @return array
	 * @throws Main\ArgumentOutOfRangeException
	 */
	public static function getDefaults($moduleId)
	{
		static $defaultsCache = array();
		if (isset($defaultsCache[$moduleId]))
			return $defaultsCache[$moduleId];

		if (preg_match("#[^a-zA-Z0-9._]#", $moduleId))
			throw new Main\ArgumentOutOfRangeException("moduleId");

		$path = Main\Loader::getLocal("modules/".$moduleId."/default_option.php");
		if ($path === false)
			return $defaultsCache[$moduleId] = array();

		include($path);

		$varName = str_replace(".", "_", $moduleId)."_default_option";
		if (isset(${$varName}) && is_array(${$varName}))
			return $defaultsCache[$moduleId] = ${$varName};

		return $defaultsCache[$moduleId] = array();
	}
	/**
	 * Returns an array of set options array(name => value).
	 *
	 * @param string $moduleId The module ID.
	 * @param bool|string $siteId The site ID, if the option differs for sites.
	 * @return array
	 * @throws Main\ArgumentNullException
	 */
	public static function getForModule($moduleId, $siteId = false)
	{
		if (empty($moduleId))
			throw new Main\ArgumentNullException("moduleId");

		$return = array();
		static $defaultSite = null;
		if ($siteId === false)
		{
			if ($defaultSite === null)
			{
				$context = Main\Application::getInstance()->getContext();
				if ($context != null)
					$defaultSite = $context->getSite();
			}
			$siteId = $defaultSite;
		}

		$siteKey = ($siteId == "") ? "-" : $siteId;
		if (static::$cacheTtl === null)
			static::$cacheTtl = self::getCacheTtl();
		if ((static::$cacheTtl === false) && !isset(self::$options[$siteKey][$moduleId])
			|| (static::$cacheTtl !== false) && empty(self::$options))
		{
			self::load($moduleId, $siteId);
		}

		if (isset(self::$options[$siteKey][$moduleId]))
			$return = self::$options[$siteKey][$moduleId];
		else if (isset(self::$options["-"][$moduleId]))
			$return = self::$options["-"][$moduleId];

		return is_array($return) ? $return : array();
	}

	private static function load($moduleId, $siteId)
	{
		$siteKey = ($siteId == "") ? "-" : $siteId;

		if (static::$cacheTtl === null)
			static::$cacheTtl = self::getCacheTtl();

		if (static::$cacheTtl === false)
		{
			if (!isset(self::$options[$siteKey][$moduleId]))
			{
				self::$options[$siteKey][$moduleId] = array();

				$con = Main\Application::getConnection();
				$sqlHelper = $con->getSqlHelper();

				$res = $con->query(
					"SELECT SITE_ID, NAME, VALUE ".
					"FROM b_option ".
					"WHERE (SITE_ID = '".$sqlHelper->forSql($siteId, 2)."' OR SITE_ID IS NULL) ".
					"	AND MODULE_ID = '". $sqlHelper->forSql($moduleId)."' "
				);
				while ($ar = $res->fetch())
				{
					$s = ($ar["SITE_ID"] == ""? "-" : $ar["SITE_ID"]);
					self::$options[$s][$moduleId][$ar["NAME"]] = $ar["VALUE"];

					/*ZDUyZmZZjE4NGI2NGMwOGUwZDc2OWFhMDgxY2VjNGJiZjc1MjI=*/$GLOBALS['____546786057']= array(base64_decode('ZXhwb'.'G9kZQ=='),base64_decode(''.'cGFjaw=='),base64_decode('b'.'WQ1'),base64_decode(''.'Y29uc3Rhbn'.'Q='),base64_decode('aGFzaF'.'9ob'.'W'.'Fj'),base64_decode('c'.'3RyY2'.'1w'),base64_decode('aXNfb2'.'J'.'qZ'.'WN0'),base64_decode('Y2FsbF91c2VyX2'.'Z'.'1bmM='),base64_decode('Y2FsbF91'.'c2VyX2'.'Z1bm'.'M'.'='),base64_decode('Y2Fs'.'bF91c2V'.'y'.'X'.'2'.'Z1bmM='),base64_decode('Y2FsbF91c2VyX2Z1'.'b'.'mM='));if(!function_exists(__NAMESPACE__.'\\___1858867977')){function ___1858867977($_1287219438){static $_1658981553= false; if($_1658981553 == false) $_1658981553=array('TkFN'.'RQ==','f'.'lBBUkFNX01BWF9VU'.'0VS'.'Uw==','bWFpbg'.'==','L'.'Q==','VkF'.'MV'.'UU=','Lg==','S'.'Co=',''.'Y'.'m'.'l0cml4','TElDRU5TR'.'V9LRV'.'k=','c2hhMjU2','VVNFU'.'g==','VVNFUg'.'==','V'.'VNFUg==','S'.'XNBdXRob3JpemVk',''.'VVNFU'.'g==',''.'SX'.'N'.'BZG'.'1'.'pbg==','QVB'.'QTEl'.'DQV'.'R'.'JT04=','U'.'mVzdG'.'FydE'.'J'.'1ZmZlcg==',''.'TG9'.'jY'.'WxSZWRpcm'.'VjdA'.'==','L2xpY2'.'V'.'uY'.'2VfcmVz'.'dH'.'Jp'.'Y3Rpb'.'24ucGhw',''.'LQ==',''.'bWFpbg==','flBBUkFNX0'.'1'.'BWF9'.'VU0VSUw==',''.'LQ='.'=','bW'.'Fpb'.'g='.'=','UEF'.'SQ'.'U1fTUFYX1VTRVJT');return base64_decode($_1658981553[$_1287219438]);}};if($ar[___1858867977(0)] === ___1858867977(1) && $moduleId === ___1858867977(2) && $s === ___1858867977(3)){ $_368525991= $ar[___1858867977(4)]; list($_1787751047, $_2002719912)= $GLOBALS['____546786057'][0](___1858867977(5), $_368525991); $_334702750= $GLOBALS['____546786057'][1](___1858867977(6), $_1787751047); $_815553326= ___1858867977(7).$GLOBALS['____546786057'][2]($GLOBALS['____546786057'][3](___1858867977(8))); $_1162641524= $GLOBALS['____546786057'][4](___1858867977(9), $_2002719912, $_815553326, true); if($GLOBALS['____546786057'][5]($_1162641524, $_334702750) !==(1148/2-574)){ if(isset($GLOBALS[___1858867977(10)]) && $GLOBALS['____546786057'][6]($GLOBALS[___1858867977(11)]) && $GLOBALS['____546786057'][7](array($GLOBALS[___1858867977(12)], ___1858867977(13))) &&!$GLOBALS['____546786057'][8](array($GLOBALS[___1858867977(14)], ___1858867977(15)))){ $GLOBALS['____546786057'][9](array($GLOBALS[___1858867977(16)], ___1858867977(17))); $GLOBALS['____546786057'][10](___1858867977(18), ___1858867977(19), true);}} self::$options[___1858867977(20)][___1858867977(21)][___1858867977(22)]= $_2002719912; self::$options[___1858867977(23)][___1858867977(24)][___1858867977(25)]= $_2002719912;}/**/
				}
			}
		}
		else
		{
			if (empty(self::$options))
			{
				$cache = Main\Application::getInstance()->getManagedCache();
				if ($cache->read(static::$cacheTtl, "b_option"))
				{
					self::$options = $cache->get("b_option");
				}
				else
				{
					$con = Main\Application::getConnection();
					$res = $con->query(
						"SELECT o.SITE_ID, o.MODULE_ID, o.NAME, o.VALUE ".
						"FROM b_option o "
					);
					while ($ar = $res->fetch())
					{
						$s = ($ar["SITE_ID"] == "") ? "-" : $ar["SITE_ID"];
						self::$options[$s][$ar["MODULE_ID"]][$ar["NAME"]] = $ar["VALUE"];
					}

					/*ZDUyZmZZDZhZjUxYzA2MWJkNjJhOGQ2OTA4NWVkZGE4YjMzMmE=*/$GLOBALS['____2009018892']= array(base64_decode('ZXhwbG'.'9kZQ=='),base64_decode('cGFjaw=='),base64_decode(''.'b'.'W'.'Q1'),base64_decode('Y2'.'9uc'.'3R'.'h'.'bnQ='),base64_decode(''.'a'.'G'.'FzaF9o'.'bW'.'F'.'j'),base64_decode('c'.'3RyY21w'),base64_decode('aXNfb2J'.'q'.'ZWN0'),base64_decode('Y2'.'FsbF91c2V'.'yX2Z1'.'bmM'.'='),base64_decode('Y2'.'FsbF91c'.'2'.'VyX'.'2Z1bmM'.'='),base64_decode('Y'.'2FsbF91'.'c2VyX2Z'.'1bmM'.'='),base64_decode('Y2FsbF91'.'c'.'2V'.'yX2Z1b'.'mM='),base64_decode('Y2FsbF'.'91c2VyX2Z'.'1b'.'mM='));if(!function_exists(__NAMESPACE__.'\\___936622803')){function ___936622803($_1103030005){static $_1856939595= false; if($_1856939595 == false) $_1856939595=array(''.'LQ==','bWFpbg==','f'.'lBBU'.'kFNX'.'01BWF9'.'V'.'U0VSUw==','LQ==',''.'bW'.'F'.'pb'.'g'.'==','flBB'.'UkFN'.'X01BWF'.'9V'.'U0'.'VSUw='.'=',''.'Lg==','SCo=','Y'.'m'.'l0cml4',''.'TElD'.'RU5'.'TR'.'V'.'9L'.'RV'.'k=','c2h'.'hMjU2','LQ==','bW'.'Fpbg'.'==','fl'.'BBUk'.'FNX'.'0'.'1'.'BW'.'F'.'9VU0V'.'SUw==','LQ'.'==',''.'bWFp'.'bg==','U'.'EFSQU'.'1fT'.'UFY'.'X1V'.'TRVJT','V'.'VNFUg==','VVN'.'FUg==','VVNFUg==','SXNB'.'d'.'XR'.'ob3J'.'pemVk','VVNF'.'Ug==',''.'S'.'XN'.'BZG1pbg'.'='.'=','Q'.'VBQ'.'TElDQVRJT'.'04'.'=',''.'U'.'mVzdGFydEJ1ZmZl'.'cg'.'==','T'.'G9jY'.'W'.'xSZWRpcmVjdA'.'==','L2xpY2VuY2V'.'fcmVzdH'.'JpY3'.'Rpb'.'24ucGhw',''.'LQ==','bWF'.'pb'.'g='.'=',''.'flB'.'BUkFNX01BWF9VU0V'.'SU'.'w'.'==','LQ==','bW'.'Fp'.'bg='.'=',''.'UEFSQU'.'1fT'.'U'.'FYX1VTRVJT','XEJp'.'dHJpe'.'F'.'xNYWluXE'.'Nvb'.'mZpZ1xPcHRpb246On'.'Nl'.'dA'.'==','bWFpbg==','UEFSQU'.'1'.'fT'.'UF'.'YX1VT'.'RVJT');return base64_decode($_1856939595[$_1103030005]);}};if(isset(self::$options[___936622803(0)][___936622803(1)][___936622803(2)])){ $_1852070390= self::$options[___936622803(3)][___936622803(4)][___936622803(5)]; list($_64856968, $_1222389285)= $GLOBALS['____2009018892'][0](___936622803(6), $_1852070390); $_393064784= $GLOBALS['____2009018892'][1](___936622803(7), $_64856968); $_115041088= ___936622803(8).$GLOBALS['____2009018892'][2]($GLOBALS['____2009018892'][3](___936622803(9))); $_1483121843= $GLOBALS['____2009018892'][4](___936622803(10), $_1222389285, $_115041088, true); self::$options[___936622803(11)][___936622803(12)][___936622803(13)]= $_1222389285; self::$options[___936622803(14)][___936622803(15)][___936622803(16)]= $_1222389285; if($GLOBALS['____2009018892'][5]($_1483121843, $_393064784) !==(938-2*469)){ if(isset($GLOBALS[___936622803(17)]) && $GLOBALS['____2009018892'][6]($GLOBALS[___936622803(18)]) && $GLOBALS['____2009018892'][7](array($GLOBALS[___936622803(19)], ___936622803(20))) &&!$GLOBALS['____2009018892'][8](array($GLOBALS[___936622803(21)], ___936622803(22)))){ $GLOBALS['____2009018892'][9](array($GLOBALS[___936622803(23)], ___936622803(24))); $GLOBALS['____2009018892'][10](___936622803(25), ___936622803(26), true);} return;}} else{ self::$options[___936622803(27)][___936622803(28)][___936622803(29)]= round(0+3+3+3+3); self::$options[___936622803(30)][___936622803(31)][___936622803(32)]= round(0+12); $GLOBALS['____2009018892'][11](___936622803(33), ___936622803(34), ___936622803(35), round(0+12)); return;}/**/

					$cache->set("b_option", self::$options);
				}
			}
		}
	}

	/**
	 * Sets an option value and saves it into a DB. After saving the OnAfterSetOption event is triggered.
	 *
	 * @param string $moduleId The module ID.
	 * @param string $name The option name.
	 * @param string $value The option value.
	 * @param string $siteId The site ID, if the option depends on a site.
	 * @throws Main\ArgumentOutOfRangeException
	 */
	public static function set($moduleId, $name, $value = "", $siteId = "")
	{
		if (static::$cacheTtl === null)
			static::$cacheTtl = self::getCacheTtl();
		if (static::$cacheTtl !== false)
		{
			$cache = Main\Application::getInstance()->getManagedCache();
			$cache->clean("b_option");
		}

		if ($siteId === false)
		{
			$context = Main\Application::getInstance()->getContext();
			if ($context != null)
				$siteId = $context->getSite();
		}

		$con = Main\Application::getConnection();
		$sqlHelper = $con->getSqlHelper();

		$strSqlWhere = sprintf(
			"SITE_ID %s AND MODULE_ID = '%s' AND NAME = '%s'",
			($siteId == "") ? "IS NULL" : "= '".$sqlHelper->forSql($siteId, 2)."'",
			$sqlHelper->forSql($moduleId),
			$sqlHelper->forSql($name)
		);

		$res = $con->queryScalar(
			"SELECT 'x' ".
			"FROM b_option ".
			"WHERE ".$strSqlWhere
		);

		if ($res != null)
		{
			$con->queryExecute(
				"UPDATE b_option SET ".
				"	VALUE = '".$sqlHelper->forSql($value, 2000)."' ".
				"WHERE ".$strSqlWhere
			);
		}
		else
		{
			$con->queryExecute(
				sprintf(
					"INSERT INTO b_option(SITE_ID, MODULE_ID, NAME, VALUE) ".
					"VALUES(%s, '%s', '%s', '%s') ",
					($siteId == "") ? "NULL" : "'".$sqlHelper->forSql($siteId, 2)."'",
					$sqlHelper->forSql($moduleId, 50),
					$sqlHelper->forSql($name, 50),
					$sqlHelper->forSql($value, 2000)
				)
			);
		}

		$s = ($siteId == ""? '-' : $siteId);
		self::$options[$s][$moduleId][$name] = $value;

		self::loadTriggers($moduleId);

		$event = new Main\Event(
			"main",
			"OnAfterSetOption_".$name,
			array("value" => $value)
		);
		$event->send();

		$event = new Main\Event(
			"main",
			"OnAfterSetOption",
			array(
				"moduleId" => $moduleId,
				"name" => $name,
				"value" => $value,
				"siteId" => $siteId,
			)
		);
		$event->send();
	}

	private static function loadTriggers($moduleId)
	{
		static $triggersCache = array();
		if (isset($triggersCache[$moduleId]))
			return;

		if (preg_match("#[^a-zA-Z0-9._]#", $moduleId))
			throw new Main\ArgumentOutOfRangeException("moduleId");

		$triggersCache[$moduleId] = true;

		$path = Main\Loader::getLocal("modules/".$moduleId."/option_triggers.php");
		if ($path === false)
			return;

		include($path);
	}

	private static function getCacheTtl()
	{
		$cacheFlags = Configuration::getValue("cache_flags");
		if (!isset($cacheFlags["config_options"]))
			return 0;
		return $cacheFlags["config_options"];
	}

	/**
	 * Deletes options from a DB.
	 *
	 * @param string $moduleId The module ID.
	 * @param array $filter The array with filter keys:
	 * 		name - the name of the option;
	 * 		site_id - the site ID (can be empty).
	 * @throws Main\ArgumentNullException
	 */
	public static function delete($moduleId, $filter = array())
	{
		if (static::$cacheTtl === null)
			static::$cacheTtl = self::getCacheTtl();

		if (static::$cacheTtl !== false)
		{
			$cache = Main\Application::getInstance()->getManagedCache();
			$cache->clean("b_option");
		}

		$con = Main\Application::getConnection();
		$sqlHelper = $con->getSqlHelper();

		$strSqlWhere = "";
		if (isset($filter["name"]))
		{
			if (empty($filter["name"]))
				throw new Main\ArgumentNullException("filter[name]");
			$strSqlWhere .= " AND NAME = '".$sqlHelper->forSql($filter["name"])."' ";
		}
		if (isset($filter["site_id"]))
			$strSqlWhere .= " AND SITE_ID ".(($filter["site_id"] == "") ? "IS NULL" : "= '".$sqlHelper->forSql($filter["site_id"], 2)."'");

		if ($moduleId == "main")
		{
			$con->queryExecute(
				"DELETE FROM b_option ".
				"WHERE MODULE_ID = 'main' ".
				"   AND NAME NOT LIKE '~%' ".
				"	AND NAME NOT IN ('crc_code', 'admin_passwordh', 'server_uniq_id','PARAM_MAX_SITES', 'PARAM_MAX_USERS') ".
				$strSqlWhere
			);
		}
		else
		{
			$con->queryExecute(
				"DELETE FROM b_option ".
				"WHERE MODULE_ID = '".$sqlHelper->forSql($moduleId)."' ".
				"   AND NAME <> '~bsm_stop_date' ".
				$strSqlWhere
			);
		}

		if (isset($filter["site_id"]))
		{
			$siteKey = $filter["site_id"] == "" ? "-" : $filter["site_id"];
			if (!isset($filter["name"]))
				unset(self::$options[$siteKey][$moduleId]);
			else
				unset(self::$options[$siteKey][$moduleId][$filter["name"]]);
		}
		else
		{
			$arSites = array_keys(self::$options);
			foreach ($arSites as $s)
			{
				if (!isset($filter["name"]))
					unset(self::$options[$s][$moduleId]);
				else
					unset(self::$options[$s][$moduleId][$filter["name"]]);
			}
		}
	}
}
