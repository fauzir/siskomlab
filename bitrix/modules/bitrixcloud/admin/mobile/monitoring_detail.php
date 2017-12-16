<?php
require_once($_SERVER["DOCUMENT_ROOT"] . '/bitrix/modules/mobileapp/include/prolog_admin_mobile_before.php');
require_once($_SERVER["DOCUMENT_ROOT"] . '/bitrix/modules/mobileapp/include/prolog_admin_mobile_after.php');

$params = array(
	"LIST_URL" => "/bnpt/admin/mobile/bitrixcloud_monitoring_list.php",
	"EDIT_URL" => "/bnpt/admin/mobile/bitrixcloud_monitoring_edit.php"
);

$APPLICATION->IncludeComponent(
	'bitrix:bitrixcloud.mobile.monitoring.detail',
	'.default',
	$params,
	false
);

require_once($_SERVER["DOCUMENT_ROOT"] . '/bitrix/modules/mobileapp/include/epilog_admin_mobile_before.php');
require_once($_SERVER["DOCUMENT_ROOT"] . '/bitrix/modules/mobileapp/include/epilog_admin_mobile_after.php');