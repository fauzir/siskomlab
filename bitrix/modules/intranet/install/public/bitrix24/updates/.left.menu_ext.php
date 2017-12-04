<?
if(!defined("B_PROLOG_INCLUDED") || B_PROLOG_INCLUDED!==true)die();
IncludeModuleLangFile($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/intranet/public_bitrix24/updates/.left.menu_ext.php");

$aMenuLinks = Array(
	Array(
		GetMessage("MENU_LICENSE"),
		"/updates/",
		Array("/updates/index.php"),
		Array("menu_item_id"=>"menu_updates_license"),
		""
	),
	Array(
		GetMessage("MENU_UPDATES"),
		"/updates/updates.php",
		Array(),
		Array("menu_item_id"=>"menu_updates_updates"),
		""
	)
);
?>