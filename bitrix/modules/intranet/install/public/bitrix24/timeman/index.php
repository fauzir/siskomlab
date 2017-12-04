<?
require($_SERVER["DOCUMENT_ROOT"]."/bitrix/header.php");
IncludeModuleLangFile($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/intranet/public_bitrix24/timeman/index.php");
$APPLICATION->SetTitle(GetMessage("TITLE"));

$workTimeStart = 9;
$workTimeEnd = 18;
if (Bitrix\Main\Loader::includeModule("calendar"))
{
	$arCalendarSet = CCalendar::GetSettings(array('getDefaultForEmpty' => false));
	if (intval($arCalendarSet['work_time_start']))
		$workTimeStart = $arCalendarSet['work_time_start'];
	if (intval($arCalendarSet['work_time_end']))
		$workTimeEnd = $arCalendarSet['work_time_end'];
}
?><?$APPLICATION->IncludeComponent("bitrix:intranet.absence.calendar", ".default", Array(
		"FILTER_NAME"	=>	"absence",
		"FILTER_SECTION_CURONLY"	=>	"N",
		"DAY_START" => $workTimeStart,
		"DAY_FINISH" => $workTimeEnd
	)
);?><?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/footer.php");?>