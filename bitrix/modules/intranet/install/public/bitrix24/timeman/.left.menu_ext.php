<?
if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true)die();
IncludeModuleLangFile($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/intranet/public_bitrix24/timeman/.left.menu_ext.php");

$aMenuLinks = array(
	array(
		GetMessage("MENU_ABSENCE"),
		"/timeman/",
		array(),
		array("menu_item_id" => "menu_absence"),
		""
	)
);

if (IsModuleInstalled("timeman"))
{
	$aMenuLinks[] = array(
		GetMessage("MENU_TIMEMAN"),
		"/timeman/timeman.php",
		array(),
		array("menu_item_id"=>"menu_timeman"),
		""
	);

}

if (IsModuleInstalled("faceid") && !(\Bitrix\Main\Loader::includeModule('bitrix24') && \CBitrix24::getPortalZone() === 'ua'))
{
	$aMenuLinks[] = array(
		'Bitrix24.Time',
		"/timeman/bitrix24time.php",
		array(),
		array("menu_item_id"=>"menu_bitrix24time"),
		""
	);
}

if (IsModuleInstalled("timeman"))
{
	$aMenuLinks[] = array(
		GetMessage("MENU_WORK_REPORT"),
		"/timeman/work_report.php",
		array(),
		array("menu_item_id"=>"menu_work_report"),
		""
	);
}

if (IsModuleInstalled("meeting"))
{
	$aMenuLinks[] = array(
		GetMessage("MENU_MEETING"),
		"/timeman/meeting/",
		array(),
		array("menu_item_id"=>"menu_meeting"),
		""
	);
}