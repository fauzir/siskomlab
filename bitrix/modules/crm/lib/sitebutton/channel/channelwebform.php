<?php
/**
 * Bitrix Framework
 * @package bitrix
 * @subpackage intranet
 * @copyright 2001-2016 Bitrix
 */

namespace Bitrix\Crm\SiteButton\Channel;

use Bitrix\Main\Loader;
use Bitrix\Main\Localization\Loc;
use Bitrix\Main\Config\Option;
use Bitrix\Crm\WebForm\EntityFieldProvider;
use Bitrix\Crm\WebForm\Internals\FormTable;
use Bitrix\Crm\WebForm\Internals\FieldTable;
use Bitrix\Crm\WebForm\Script as WebFormScript;

Loc::loadMessages(__FILE__);

/**
 * Class ChannelWebForm
 * @package Bitrix\Crm\SiteButton\Channel
 */
class ChannelWebForm implements iProvider
{
	/**
	 * Return true if it can be used.
	 *
	 * @return bool
	 */
	public static function canUse()
	{
		return (bool) Loader::includeModule('crm');
	}

	/**
	 * Get presets.
	 *
	 * @return array
	 */
	public static function getPresets()
	{
		if (!self::canUse())
		{
			return array();
		}

		return FormTable::getList(array(
			'select' => array('ID', 'NAME'),
			'filter' => array(
				'=ACTIVE' => 'Y',
				'=IS_CALLBACK_FORM' => 'N',
				'=IS_SYSTEM' => 'Y',
				'=XML_ID' => 'crm_preset_fb',
			),
		))->fetchAll();
	}

	/**
	 * Get list.
	 *
	 * @return array
	 */
	public static function getList()
	{
		if (!self::canUse())
		{
			return array();
		}

		$providerFields = EntityFieldProvider::getFields();
		$enumList = array();
		$enumListDb = FormTable::getList(array(
			'select' => array('ID', 'NAME'),
			'filter' => array(
				'=ACTIVE' => 'Y',
				'=IS_CALLBACK_FORM' => 'N'
			),
		));
		while($enumItem = $enumListDb->fetch())
		{
			$enumItem['FORM_FIELDS'] = array();
			$fieldDataDb = FieldTable::getList(array(
				'select' => array('CODE', 'CAPTION'),
				'filter' => array(
					'=FORM_ID' => $enumItem['ID'],
				),
			));
			while ($fieldData = $fieldDataDb->fetch())
			{
				if (!$fieldData['CAPTION'])
				{
					foreach($providerFields as $field)
					{
						if($field['name'] == $fieldData['CODE'])
						{
							$fieldData['CAPTION'] = $field['caption'];
							break;
						}
					}
				}

				if ($fieldData['CAPTION'])
				{
					$enumItem['FORM_FIELDS'][] = $fieldData;
				}
			}

			$enumList[] = $enumItem;
		}

		return $enumList;
	}

	/**
	 * Get widgets.
	 *
	 * @param string $id Channel id
	 * @param bool $removeCopyright Remove copyright
	 * @param string|null $lang Language ID
	 * @param array $config Config
	 * @return array
	 */
	public static function getWidgets($id, $removeCopyright = true, $lang = null, array $config = array())
	{
		Loc::loadMessages(__FILE__); // TODO: remove with dependence main: deeply lazy Load loc files
		if (!self::canUse())
		{
			return array();
		}

		$widgets = array();

		$type = self::getType();
		$formData = FormTable::getRowById($id);
		$title = strlen($formData['CAPTION']) > 0 ? $formData['CAPTION'] : Loc::getMessage('CRM_BUTTON_MANAGER_TYPE_NAME_CRMFORM_TITLE');
		$widget = array(
			'id' => $type,
			'title' => $title,
			'script' => WebFormScript::getCrmButtonWidget(
				$id,
				array(
					'IS_CALLBACK' => false,
					'REMOVE_COPYRIGHT' => $removeCopyright,
					'LANGUAGE_ID' => $lang
				)
			),
			'sort' => 300,
			'useColors' => true,
			'classList' => array('b24-widget-button-' . $type),
			'show' => WebFormScript::getCrmButtonWidgetShower($id, $lang),
			'hide' => 'BX.SiteButton.removeClass(document.getElementById(\'bx24_form_container_' . $id . '\'), \'open-sidebar\'); BX.SiteButton.onWidgetClose();',
		);
		$widgets[] = $widget;

		return $widgets;
	}

	/**
	 * Get resources.
	 *
	 * @return array
	 */
	public static function getResources()
	{
		return array();
	}

	/**
	 * Get edit path.
	 *
	 * @return array
	 */
	public static function getPathEdit()
	{
		return array(
			'path' => Option::get('crm', 'path_to_webform_edit', ''),
			'id' => '#form_id#'
		);
	}

	/**
	 * Get add path.
	 * @return string
	 */
	public static function getPathAdd()
	{
		return str_replace('#form_id#', '0', Option::get('crm', 'path_to_webform_edit', ''));
	}

	/**
	 * Get list path.
	 *
	 * @return string
	 */
	public static function getPathList()
	{
		return Option::get('crm', 'path_to_webform_list', '');
	}

	/**
	 * Get name.
	 *
	 * @return string
	 */
	public static function getName()
	{
		return Loc::getMessage('CRM_BUTTON_MANAGER_TYPE_NAME_' . strtoupper(self::getType()));
	}

	/**
	 * Get type.
	 *
	 * @return string
	 */
	public static function getType()
	{
		return 'crmform';
	}
}
