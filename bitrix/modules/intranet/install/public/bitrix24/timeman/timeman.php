<?
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
$APPLICATION->SetPageProperty("BodyClass", "page-one-column");
IncludeModuleLangFile($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/intranet/public_bitrix24/timeman/timeman.php");
$APPLICATION->SetTitle(GetMessage("TITLE"));
?> <?
$APPLICATION->IncludeComponent("bitrix:timeman.report", ".default", array());
?>
<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>