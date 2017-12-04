<?
if (!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED !== true)
{
	die();
}

IncludeModuleLangFile($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/intranet/public_bitrix24/calendar/.left.menu_ext.php");

$userId = $USER->getId();

$aMenuLinks = array(
	array(
		GetMessage("MENU_CALENDAR_USER"),
		"/company/personal/user/".$userId."/calendar/",
		array(),
		array(
			"menu_item_id" => "menu_my_calendar", 
			"counter_id" => "calendar"
		),
		""
	),
	array(
		GetMessage("MENU_CALENDAR_COMPANY"),
		"/calendar/",
		array(),
		array(
			"menu_item_id" => "menu_company_calendar"
		),
		""
	)
);