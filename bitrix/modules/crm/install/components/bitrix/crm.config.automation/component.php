<?
if (!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED!==true) die();

if (!CModule::IncludeModule('crm'))
{
	ShowError(GetMessage('CRM_MODULE_NOT_INSTALLED'));
	return;
}

$CrmPerms = new CCrmPerms($USER->GetID());
if (!$CrmPerms->HavePerm('CONFIG', BX_CRM_PERM_CONFIG, 'WRITE'))
{
	ShowError(GetMessage('CRM_PERMISSION_DENIED'));
	return;
}

$arDefaultUrlTemplates404 = array(
	"index" => "index.php",
	"edit" => "#entity#/#category#/",
);
$arDefaultVariableAliases404 = $arDefaultVariableAliases = array();
$arComponentVariables = array('index', 'edit');
$arVariables = array();

if($arParams['SEF_MODE'] == 'Y')
{
	$arUrlTemplates = CComponentEngine::MakeComponentUrlTemplates($arDefaultUrlTemplates404, $arParams['SEF_URL_TEMPLATES']);
	$arVariableAliases = CComponentEngine::MakeComponentVariableAliases($arDefaultVariableAliases404, $arParams['VARIABLE_ALIASES']);

	$componentPage = CComponentEngine::ParseComponentPath(
		$arParams['SEF_FOLDER'],
		$arUrlTemplates,
		$arVariables
	);

	if(!$componentPage)
		$componentPage = 'index';

	CComponentEngine::InitComponentVariables($componentPage, $arComponentVariables, $arVariableAliases, $arVariables);
	$arResult = array(
		'FOLDER' => $arParams['SEF_FOLDER'],
		'URL_TEMPLATES' => $arUrlTemplates,
		'VARIABLES' => $arVariables,
		'ALIASES' => $arVariableAliases
	);
}
else
{
	ShowError('SEF MODE ONLY');
	return;
}

$requestEntity = isset($arVariables['entity'])  ? $arVariables['entity'] : \CCrmOwnerType::LeadName;
$requestCategory = isset($arVariables['category'])  ? (int)$arVariables['category'] : 0;

$arResult['ENTITY_TYPE_ID'] = \CCrmOwnerType::ResolveID($requestEntity);

$arResult['ENTITY_CATEGORY'] = $requestCategory;

if (!\CCrmOwnerType::IsDefined($arResult['ENTITY_TYPE_ID']))
{
	$arResult['ENTITY_TYPE_ID'] = \CCrmOwnerType::Lead;
	$arResult['ENTITY_CATEGORY'] = 0;
}

$arResult['ENTITY_TYPE_NAME'] = \CCrmOwnerType::ResolveName($arResult['ENTITY_TYPE_ID']);
$arResult['CATEGORY_NAME'] = '';

$categories = array();

if ($arResult['ENTITY_TYPE_ID'] === \CCrmOwnerType::Deal)
{
	$dealCategories = \Bitrix\Crm\Category\DealCategory::getSelectListItems();
	$arResult['CATEGORY_NAME'] = $dealCategories[0];
	foreach ($dealCategories as $id => $category)
	{
		$categories[] = array('id' => $id, 'name' => $category);
		if ($id == $requestCategory)
			$arResult['CATEGORY_NAME'] = $category;
	}
}

$arResult['CATEGORIES'] = $categories;
$arResult['HIDE_HELP'] = CUserOptions::GetOption('crm.config.automation', 'hide_help');

$this->IncludeComponentTemplate();