<?
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
IncludeModuleLangFile($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/intranet/public_bitrix24/timeman/meeting/index.php");
$APPLICATION->SetTitle(GetMessage("TITLE"));?>
<?GetGlobalID();
$APPLICATION->IncludeComponent("bitrix:meetings", ".default", array(
	"SEF_MODE" => "Y",
	"SEF_FOLDER" => "/timeman/meeting/",
	"SEF_URL_TEMPLATES" => array(
		"list" => "",
		"meeting" => "meeting/#MEETING_ID#/",
		"meeting_edit" => "meeting/#MEETING_ID#/edit/",
		"meeting_copy" => "meeting/#MEETING_ID#/copy/",
		"item" => "item/#ITEM_ID#/",
	)
	),
	false
);

?>
<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>