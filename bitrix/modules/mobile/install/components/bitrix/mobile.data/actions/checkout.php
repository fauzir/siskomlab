<?if (!Defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true) die();

/**
 *
 * @var $APPLICATION CAllMain
 * @var $USER CAllUser
 * @var $params array
 */
global $APPLICATION, $USER;
use Bitrix\Main;
use Bitrix\Main\Authentication\ApplicationPasswordTable;


if ($_SERVER["REQUEST_METHOD"] == "OPTIONS")
{
	header('Access-Control-Allow-Methods: POST, OPTIONS');
	header('Access-Control-Max-Age: 60');
	header('Access-Control-Allow-Headers: X-Requested-With, Content-Type, Accept');
	die('');
}

if (!IsModuleInstalled('bitrix24'))
{
	header('Access-Control-Allow-Origin: *');
}

$data = array(
	"status" => "failed",
	"bitrix_sessid" => bitrix_sessid(),
);

$userData = CHTTP::ParseAuthRequest();
$APPLICATION->RestartBuffer();

$login = $userData["basic"]["username"];
$isAlreadyAuthorized = $USER->IsAuthorized();

if (!$isAlreadyAuthorized)
{
	if (IsModuleInstalled('bitrix24'))
	{
		header('Access-Control-Allow-Origin: *');
	}

	if($login)
	{
		if(CModule::IncludeModule('bitrix24') && ($captchaInfo = CBitrix24::getStoredCaptcha()))
		{
			$data["captchaCode"] = $captchaInfo["captchaCode"];
			$data["captchaURL"] = $captchaInfo["captchaURL"];
		}
		elseif($APPLICATION->NeedCAPTHAForLogin($login))
		{
			$data["captchaCode"] = $APPLICATION->CaptchaGetCode();
		}

		if (CModule::IncludeModule("security") && \Bitrix\Security\Mfa\Otp::isOtpRequired())
		{
			$data["needOtp"] = true;
		}
	}

	if(Main\Loader::includeModule('socialservices'))
	{
		$lastUserStatus = \Bitrix\Socialservices\Network::getLastUserStatus();
		if($lastUserStatus)
		{
			if(is_array($lastUserStatus))
			{
				$data["error"] = $lastUserStatus["error"];
				$data["error_message"] = $lastUserStatus["error_message"];
			}
			else
			{
				$data["error"] = $lastUserStatus;
			}
		}
	}

	CHTTP::SetStatus("401 Unauthorized");
}
else
{
	$isExtranetModuleInstalled = (
		CModule::IncludeModule("extranet")
		&& CExtranet::GetExtranetSiteID()
	);

	$selectFields = array(
		"FIELDS" => array("PERSONAL_PHOTO")
	);

	if ($isExtranetModuleInstalled)
	{
		$selectFields["SELECT"] = array("UF_DEPARTMENT");
	}

	$dbUser = CUser::GetList(
		($by = array("last_name" => "asc", "name" => "asc")),
		($order = false),
		Array("ID" => $USER->GetID()),
		$selectFields
	);
	$curUser = $dbUser->Fetch();
	$avatarSource = "";
	if (intval($curUser["PERSONAL_PHOTO"]) > 0)
	{
		$avatar = CFile::ResizeImageGet(
			$curUser["PERSONAL_PHOTO"],
			array("width" => 64, "height" => 64),
			BX_RESIZE_IMAGE_EXACT,
			false
		);

		if ($avatar && strlen($avatar["src"]) > 0)
		{
			$avatarSource = $avatar["src"];
		}
	}

	$bExtranetUser = ($isExtranetModuleInstalled && intval($curUser["UF_DEPARTMENT"][0]) <= 0);

	if (
		!$bExtranetUser
		|| CMobile::getApiVersion() >= 9
		|| intval($_GET["api_version"]) >= 9
	)
	{
		$data = array(
			"status" => "success",
			"name"=> CUser::FormatName(CSite::GetNameFormat(false), array(
				"NAME" => $USER->GetFirstName(),
				"LAST_NAME" => $USER->GetLastName(),
				"SECOND_NAME" => $USER->GetSecondName(),
				"LOGIN" => $USER->GetLogin()
			)),
			"sessid_md5" => bitrix_sessid(),
			"target" => md5($USER->GetID() . CMain::GetServerUniqID()),
			"photoUrl" => $avatarSource,
			"wkWebViewSupported"=>true,
			"tabInterfaceSupported"=>true,
			"useModernStyle"=>true,
			"appmap" => Array(
				"main" => Array("url" => $params["START_PAGE"]? $params["START_PAGE"]:"", "bx24ModernStyle"=>true),
				"menu" => Array("url" => $params["MENU_PAGE"]?$params["MENU_PAGE"]:""),
				"right" => Array("url" => $params["CHAT_PAGE"]),
				"notifications" => array("url" => "/mobile/im/notify.php")
			)
		);

		if ($bExtranetUser)
		{
			$rsSites = CSite::GetByID(CExtranet::GetExtranetSiteID());
			if (
				($arExtranetSite = $rsSites->Fetch())
				&& ($arExtranetSite["ACTIVE"] != "N")
			)
			{
				$data["whiteList"] = array($arExtranetSite["DIR"] . "mobile/");
				$data["appmap"] = array(
					"main" => Array("url" => $arExtranetSite["DIR"] . "mobile/index.php", "bx24ModernStyle"=>true),
					"menu" => Array("url" => $arExtranetSite["DIR"] . "mobile/left.php"),
					"right" => Array("url" => $arExtranetSite["DIR"] . "mobile/im/right.php")
				);
			}
		}
	}
	$needAppPass = \Bitrix\Main\Context::getCurrent()->getServer()->get("HTTP_BX_APP_PASS");
	$appUUID = \Bitrix\Main\Context::getCurrent()->getServer()->get("HTTP_BX_APP_UUID");
	$deviceName = \Bitrix\Main\Context::getCurrent()->getServer()->get("HTTP_BX_DEVICE_NAME");

	if ($needAppPass == 'mobile' && $USER->GetParam("APPLICATION_ID") === null)
	{
		if(strlen($appUUID) > 0)
		{
			$result = ApplicationPasswordTable::getList(Array(
				'select' => Array('ID'),
				'filter' => Array(
					'USER_ID' => $USER->GetID(),
					'CODE' => $appUUID
				)
			));
			if ($row = $result->fetch())
			{
				ApplicationPasswordTable::delete($row['ID']);
			}
		}

		$password = ApplicationPasswordTable::generatePassword();

		$res = ApplicationPasswordTable::add(array(
			'USER_ID' => $USER->GetID(),
			'APPLICATION_ID' => 'mobile',
			'PASSWORD' => $password,
			'CODE'=> $appUUID,
			'DATE_CREATE' => new Main\Type\DateTime(),
			'COMMENT' => GetMessage("MD_GENERATE_BY_MOBILE").(strlen($deviceName)>0 ? " (".$deviceName.")" : ""),
			'SYSCOMMENT' =>GetMessage("MD_MOBILE_APPLICATION")
		));

		if ($res->isSuccess())
		{
			$data["appPassword"] = $password;
		}
	}
}

return Main\Text\Encoding::convertEncoding($data, LANG_CHARSET, 'UTF-8');
