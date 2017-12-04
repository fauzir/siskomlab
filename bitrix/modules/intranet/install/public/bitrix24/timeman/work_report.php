<?
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetPageProperty("BodyClass", "page-one-column");
IncludeModuleLangFile($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/intranet/public_bitrix24/timeman/work_report.php");

$APPLICATION->SetTitle(GetMessage("TITLE"));
?>
<?$APPLICATION->IncludeComponent(
	"bitrix:timeman.report.weekly",
	"",
	Array(
	),
false
);?>
<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>