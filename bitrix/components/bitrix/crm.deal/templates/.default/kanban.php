<?php if(!defined('B_PROLOG_INCLUDED') || B_PROLOG_INCLUDED!==true) die();

// js/css
$APPLICATION->SetAdditionalCSS('/bitrix/themes/.default/bitrix24/crm-entity-show.css');
$bodyClass = $APPLICATION->GetPageProperty('BodyClass');
$APPLICATION->SetPageProperty('BodyClass', ($bodyClass ? $bodyClass.' ' : '').'no-paddings grid-mode pagetitle-toolbar-field-view flexible-layout crm-toolbar');
$asset = Bitrix\Main\Page\Asset::getInstance();
$asset->addJs('/bitrix/js/crm/common.js');

// some common langs
use Bitrix\Crm\Category\DealCategory;
use Bitrix\Main\Localization\Loc;
Loc::loadMessages($_SERVER['DOCUMENT_ROOT'].'/bitrix/components/bitrix/crm.deal.menu/component.php');
Loc::loadMessages($_SERVER['DOCUMENT_ROOT'].'/bitrix/components/bitrix/crm.deal.list/templates/.default/template.php');

// if not isset
$categoryID = isset($arResult['VARIABLES']['category_id']) ? $arResult['VARIABLES']['category_id'] : 0;
$arResult['PATH_TO_DEAL_EDIT'] = isset($arResult['PATH_TO_DEAL_EDIT']) ? $arResult['PATH_TO_DEAL_EDIT'] : '';
$arResult['PATH_TO_DEAL_LIST'] = isset($arResult['PATH_TO_DEAL_LIST']) ? $arResult['PATH_TO_DEAL_LIST'] : '';
$arResult['PATH_TO_DEAL_CATEGORY'] = isset($arResult['PATH_TO_DEAL_CATEGORY']) ? $arResult['PATH_TO_DEAL_CATEGORY'] : '';
$arResult['PATH_TO_DEAL_WIDGET'] = isset($arResult['PATH_TO_DEAL_WIDGET']) ? $arResult['PATH_TO_DEAL_WIDGET'] : '';
$arResult['PATH_TO_DEAL_KANBAN'] = isset($arResult['PATH_TO_DEAL_KANBAN']) ? $arResult['PATH_TO_DEAL_KANBAN'] : '';
$arResult['PATH_TO_DEAL_KANBANCATEGORY'] = isset($arResult['PATH_TO_DEAL_KANBANCATEGORY']) ? $arResult['PATH_TO_DEAL_KANBANCATEGORY'] : '';
$arResult['PATH_TO_DEAL_IMPORT'] = isset($arResult['PATH_TO_DEAL_IMPORT']) ? $arResult['PATH_TO_DEAL_IMPORT'] : '';

// csv and excel delegate to list
$context = \Bitrix\Main\Application::getInstance()->getContext();
$request = $context->getRequest();
if (in_array($request->get('type'), array('csv', 'excel')))
{
	$curPage = $APPLICATION->getCurPageParam();
	$pathKanbanCategory = str_replace(
							'#category_id#',
							$categoryID,
							$arResult['PATH_TO_DEAL_KANBANCATEGORY']);
	$pathCategory = str_replace(
						'#category_id#',
						$categoryID,
						$arResult['PATH_TO_DEAL_CATEGORY']);
	if (strpos($curPage, $pathKanbanCategory) !== false)
	{
		LocalRedirect(str_replace(
						$pathKanbanCategory,
						$pathCategory,
						$curPage
					), true);
	}
	elseif (strpos($curPage, $arResult['PATH_TO_DEAL_KANBAN']) !== false)
	{
		LocalRedirect(str_replace(
						$arResult['PATH_TO_DEAL_KANBAN'],
						$arResult['PATH_TO_DEAL_LIST'],
						$curPage
					), true);
	}
}

// main menu
$APPLICATION->IncludeComponent(
	'bitrix:crm.control_panel',
	'',
	array(
		'ID' => 'DEAL_LIST',
		'ACTIVE_ITEM_ID' => 'DEAL',
		'PATH_TO_COMPANY_LIST' => isset($arResult['PATH_TO_COMPANY_LIST']) ? $arResult['PATH_TO_COMPANY_LIST'] : '',
		'PATH_TO_COMPANY_EDIT' => isset($arResult['PATH_TO_COMPANY_EDIT']) ? $arResult['PATH_TO_COMPANY_EDIT'] : '',
		'PATH_TO_CONTACT_LIST' => isset($arResult['PATH_TO_CONTACT_LIST']) ? $arResult['PATH_TO_CONTACT_LIST'] : '',
		'PATH_TO_CONTACT_EDIT' => isset($arResult['PATH_TO_CONTACT_EDIT']) ? $arResult['PATH_TO_CONTACT_EDIT'] : '',
		'PATH_TO_DEAL_WIDGET' => isset($arResult['PATH_TO_DEAL_WIDGET']) ? $arResult['PATH_TO_DEAL_WIDGET'] : '',
		'PATH_TO_DEAL_LIST' => isset($arResult['PATH_TO_DEAL_LIST']) ? $arResult['PATH_TO_DEAL_LIST'] : '',
		'PATH_TO_DEAL_EDIT' => isset($arResult['PATH_TO_DEAL_EDIT']) ? $arResult['PATH_TO_DEAL_EDIT'] : '',
		'PATH_TO_DEAL_CATEGORY' => isset($arResult['PATH_TO_DEAL_CATEGORY']) ? $arResult['PATH_TO_DEAL_CATEGORY'] : '',
		'PATH_TO_LEAD_LIST' => isset($arResult['PATH_TO_LEAD_LIST']) ? $arResult['PATH_TO_LEAD_LIST'] : '',
		'PATH_TO_LEAD_EDIT' => isset($arResult['PATH_TO_LEAD_EDIT']) ? $arResult['PATH_TO_LEAD_EDIT'] : '',
		'PATH_TO_QUOTE_LIST' => isset($arResult['PATH_TO_QUOTE_LIST']) ? $arResult['PATH_TO_QUOTE_LIST'] : '',
		'PATH_TO_QUOTE_EDIT' => isset($arResult['PATH_TO_QUOTE_EDIT']) ? $arResult['PATH_TO_QUOTE_EDIT'] : '',
		'PATH_TO_INVOICE_LIST' => isset($arResult['PATH_TO_INVOICE_LIST']) ? $arResult['PATH_TO_INVOICE_LIST'] : '',
		'PATH_TO_INVOICE_EDIT' => isset($arResult['PATH_TO_INVOICE_EDIT']) ? $arResult['PATH_TO_INVOICE_EDIT'] : '',
		'PATH_TO_REPORT_LIST' => isset($arResult['PATH_TO_REPORT_LIST']) ? $arResult['PATH_TO_REPORT_LIST'] : '',
		'PATH_TO_DEAL_FUNNEL' => isset($arResult['PATH_TO_DEAL_FUNNEL']) ? $arResult['PATH_TO_DEAL_FUNNEL'] : '',
		'PATH_TO_EVENT_LIST' => isset($arResult['PATH_TO_EVENT_LIST']) ? $arResult['PATH_TO_EVENT_LIST'] : '',
		'PATH_TO_PRODUCT_LIST' => isset($arResult['PATH_TO_PRODUCT_LIST']) ? $arResult['PATH_TO_PRODUCT_LIST'] : '',
		//'COUNTER_EXTRAS' => array('DEAL_CATEGORY_ID' => $categoryID)
	),
	$component
);

// check rights
if (!\CCrmPerms::IsAccessEnabled())
{
	return false;
}

// check accessable
if (!Bitrix\Crm\Integration\Bitrix24Manager::isAccessEnabled(\CCrmOwnerType::Deal))
{
	$APPLICATION->IncludeComponent('bitrix:bitrix24.business.tools.info', '', array());
}
else
{
	$entityType = \CCrmOwnerType::DealName;
	$isBitrix24Template = SITE_TEMPLATE_ID === 'bitrix24';

	// counters
	if ($isBitrix24Template)
	{
		$this->SetViewTarget('below_pagetitle', 0);
	}
	?><div class="pagetitle-container" style="overflow: hidden;"><?
	$APPLICATION->IncludeComponent(
		'bitrix:crm.entity.counter.panel',
		'',
		array(
			'ENTITY_TYPE_NAME' => $entityType,
			'EXTRAS' => array('DEAL_CATEGORY_ID' => $categoryID),
			'PATH_TO_ENTITY_LIST' =>
				$categoryID < 1
					? $arResult['PATH_TO_DEAL_KANBAN']
					: CComponentEngine::makePathFromTemplate(
							$arResult['PATH_TO_DEAL_KANBANCATEGORY'],
							array('category_id' => $categoryID)
				)
		)
	);
	?></div><?
	if ($isBitrix24Template)
	{
		$this->EndViewTarget();
	}

	// category selector
	if ($isBitrix24Template)
	{
		$this->SetViewTarget('inside_pagetitle', 100);
	}
	$userPermissions = CCrmPerms::GetCurrentUserPermissions();
	$map = array_fill_keys(CCrmDeal::GetPermittedToReadCategoryIDs($userPermissions), true);
	// first available category
	if (!array_key_exists($categoryID, $map))
	{
		$accessCID = array_shift(array_keys($map));
		LocalRedirect(CComponentEngine::MakePathFromTemplate(
			$arResult['PATH_TO_DEAL_KANBANCATEGORY'],
			array('category_id' => $accessCID)
		), true);
	}
	$APPLICATION->IncludeComponent(
		'bitrix:crm.deal_category.panel',
		$isBitrix24Template ? 'tiny' : '',
		array(
			'PATH_TO_DEAL_LIST' => $arResult['PATH_TO_DEAL_KANBAN'],
			'PATH_TO_DEAL_EDIT' => $arResult['PATH_TO_DEAL_EDIT'],
			'PATH_TO_DEAL_CATEGORY' => $arResult['PATH_TO_DEAL_KANBANCATEGORY'],
			'PATH_TO_DEAL_CATEGORY_LIST' => $arResult['PATH_TO_DEAL_CATEGORY_LIST'],
			'PATH_TO_DEAL_CATEGORY_EDIT' => $arResult['PATH_TO_DEAL_CATEGORY_EDIT'],
			'ENABLE_CATEGORY_ALL' => 'N',
			'CATEGORY_ID' => $categoryID
		),
		$component
	);
	if ($isBitrix24Template)
	{
		$this->EndViewTarget();
	}

	// filter
	if (!$isBitrix24Template)
	{
		$APPLICATION->ShowViewContent('crm-grid-filter');
	}

	// menu
	$APPLICATION->IncludeComponent(
		'bitrix:crm.deal.menu',
		'',
		array(
			'PATH_TO_DEAL_LIST' => $arResult['PATH_TO_DEAL_LIST'],
			'PATH_TO_DEAL_EDIT' => $arResult['PATH_TO_DEAL_EDIT'],
			'PATH_TO_DEAL_IMPORT' => $arResult['PATH_TO_DEAL_IMPORT'],
			'ELEMENT_ID' => 0,
			'CATEGORY_ID' => $categoryID,
			'TYPE' => 'list',
			'DISABLE_EXPORT' => 'Y'
		),
		$component
	);

	// filter
	$APPLICATION->IncludeComponent(
		'bitrix:crm.kanban.filter',
		'',
		array(
			'ENTITY_TYPE' => $entityType,
			'NAVIGATION_BAR' => array(
				'ITEMS' => array(
					array(
						//'icon' => 'table',
						'id' => 'list',
						'name' => Loc::getMessage('CRM_DEAL_LIST_FILTER_NAV_BUTTON_LIST'),
						'active' => 0,
						'url' => $arResult['PATH_TO_DEAL_LIST']
					),
					array(
						//'icon' => 'kanban',
						'id' => 'kanban',
						'name' => Loc::getMessage('CRM_DEAL_LIST_FILTER_NAV_BUTTON_KANBAN'),
						'active' => 1,
						'url' => $arResult['PATH_TO_DEAL_KANBAN']
					),
					array(
						//'icon' => 'chart',
						'id' => 'widget',
						'name' => Loc::getMessage('CRM_DEAL_LIST_FILTER_NAV_BUTTON_WIDGET'),
						'active' => 0,
						'url' => $arResult['PATH_TO_DEAL_WIDGET']
					)
				),
				'BINDING' => array(
					'category' => 'crm.navigation',
					'name' => 'index',
					'key' => strtolower($arResult['NAVIGATION_CONTEXT_ID'])
				)
			)
		),
		$component,
		array('HIDE_ICONS' => true)
	);

	/*
	$supervisorInv = \Bitrix\Crm\Kanban\SupervisorTable::isSupervisor($entityType) ? 'N' : 'Y';
	CCrmUrlUtil::AddUrlParams(
							CComponentEngine::MakePathFromTemplate(
								$arResult['PATH_TO_DEAL_KANBAN']
							),
							array('supervisor' => $supervisorInv, 'clear_filter' => 'Y')
						)*/

	$APPLICATION->IncludeComponent(
		'bitrix:crm.kanban',
		'',
		array(
			'ENTITY_TYPE' => $entityType,
			'SHOW_ACTIVITY' => 'Y',
			'EXTRA' => array(
				'CATEGORY_ID' => $categoryID
			)
		),
		$component
	);
}