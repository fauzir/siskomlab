<?php
namespace Bitrix\Crm\Merger;
use Bitrix\Main;
use Bitrix\Crm;
use Bitrix\Crm\Integrity;
use Bitrix\Crm\Recovery;
use Bitrix\Crm\EntityRequisite;
use Bitrix\Crm\Binding;

class ContactMerger extends EntityMerger
{
	private static $langIncluded = false;
	private $entity = null;

	public function __construct($userID, $enablePermissionCheck = false)
	{
		parent::__construct(\CCrmOwnerType::Contact, $userID, $enablePermissionCheck);
	}
	protected function getEntity()
	{
		if($this->entity === null)
		{
			$this->entity = new \CCrmContact(false);
		}
		return $this->entity;
	}
	protected function getEntityFieldsInfo()
	{
		return \CCrmContact::GetFieldsInfo();
	}
	protected function getEntityUserFieldsInfo()
	{
		return \CCrmContact::GetUserFields();
	}
	protected function getEntityResponsibleID($entityID, $roleID)
	{
		$dbResult = \CCrmContact::GetListEx(
			array(),
			array('=ID' => $entityID, 'CHECK_PERMISSIONS' => 'N'),
			false,
			false,
			array('ID', 'ASSIGNED_BY_ID')
		);
		$fields = is_object($dbResult) ? $dbResult->Fetch() : null;
		if(!is_array($fields))
		{
			throw new EntityMergerException(\CCrmOwnerType::Contact, $entityID, $roleID, EntityMergerException::NOT_FOUND);
		}
		return isset($fields['ASSIGNED_BY_ID']) ? (int)$fields['ASSIGNED_BY_ID'] : 0;
	}
	protected function getEntityFields($entityID, $roleID)
	{
		$dbResult = \CCrmContact::GetListEx(
			array(),
			array('=ID' => $entityID, 'CHECK_PERMISSIONS' => 'N'),
			false,
			false,
			array('*', 'UF_*')
		);
		$fields = is_object($dbResult) ? $dbResult->Fetch() : null;
		if(!is_array($fields))
		{
			throw new EntityMergerException(\CCrmOwnerType::Contact, $entityID, $roleID, EntityMergerException::NOT_FOUND);
		}
		return $fields;
	}
	protected function checkEntityReadPermission($entityID, $userPermissions)
	{
		return \CCrmContact::CheckReadPermission($entityID, $userPermissions);
	}
	protected function checkEntityUpdatePermission($entityID, $userPermissions)
	{
		return \CCrmContact::CheckUpdatePermission($entityID, $userPermissions);
	}
	protected function checkEntityDeletePermission($entityID, $userPermissions)
	{
		return \CCrmContact::CheckDeletePermission($entityID, $userPermissions);
	}
	protected function setupRecoveryData(Recovery\EntityRecoveryData $recoveryData, array &$fields)
	{
		$recoveryData->setTitle(\CCrmContact::PrepareFormattedName($fields));
		if(isset($fields['ASSIGNED_BY_ID']))
		{
			$recoveryData->setResponsibleID((int)$fields['ASSIGNED_BY_ID']);
		}
	}
	/**
	 * Merge entity fields. May be overridden by descendants.
	 * @param array $seed
	 * @param array $targ
	 * @param array $fieldInfos
	 * @param bool|false $skipEmpty
	 */
	protected function innerMergeEntityFields(array &$seed, array &$targ, array &$fieldInfos, $skipEmpty = false)
	{
		self::mergeEntityFields($seed, $targ, $fieldInfos, $skipEmpty);
		
		//region Merge company bindings
		$seedID = isset($seed['ID']) ? (int)$seed['ID'] : 0;
		$seedBindings = $seedID > 0 ? Binding\ContactCompanyTable::getContactBindings($seedID) : array();

		$targID = isset($targ['ID']) ? (int)$targ['ID'] : 0;
		$targBindings = $targID > 0 ? Binding\ContactCompanyTable::getContactBindings($targID) : array();

		if(empty($seedBindings))
		{
			//Prevent target companies from changing
			unset($targ['COMPANY_ID']);
		}
		else
		{
			if(empty($targBindings))
			{
				$targBindings = $seedBindings;
			}
			else
			{
				self::mergeEntityBindings(\CCrmOwnerType::Company, $seedBindings, $targBindings);
			}
			$targ['COMPANY_BINDINGS'] = $targBindings;
		}
		//endregion
	}
	protected function updateEntity($entityID, array &$fields, $roleID)
	{
		$entity = $this->getEntity();
		if(!$entity->Update($entityID, $fields))
		{
			throw new EntityMergerException(
				\CCrmOwnerType::Contact,
				$entityID,
				$roleID,
				EntityMergerException::UPDATE_FAILED,
				'',
				0,
				new Main\SystemException($entity->LAST_ERROR)
			);
		}
	}
	protected function deleteEntity($entityID, $roleID, array $options = array())
	{
		$entity = $this->getEntity();
		if(!$entity->Delete($entityID, $options))
		{
			throw new EntityMergerException(
				\CCrmOwnerType::Contact,
				$entityID,
				$roleID,
				EntityMergerException::DELETE_FAILED,
				'',
				0,
				new Main\SystemException($entity->LAST_ERROR)
			);
		}
	}
	protected function rebind($seedID, $targID)
	{
		Binding\DealContactTable::rebindAllDeals($seedID, $targID);
		Binding\ContactCompanyTable::rebindAllCompanies($seedID, $targID);
		\CCrmDeal::Rebind(\CCrmOwnerType::Contact, $seedID, $targID);
		\CCrmQuote::Rebind(\CCrmOwnerType::Contact, $seedID, $targID);
		\CCrmActivity::Rebind(\CCrmOwnerType::Contact, $seedID, $targID);
		\CCrmLiveFeed::Rebind(\CCrmOwnerType::Contact, $seedID, $targID);
		\CCrmSonetRelation::RebindRelations(\CCrmOwnerType::Contact, $seedID, $targID);
		\CCrmEvent::Rebind(\CCrmOwnerType::Contact, $seedID, $targID);
		EntityRequisite::rebind(\CCrmOwnerType::Contact, $seedID, $targID);
	}
	protected function resolveMergeCollisions($seedID, $targID, array &$results)
	{
		$dbResult = \CCrmContact::GetListEx(array(), array('=ID' => $seedID), false, false, array('ORIGINATOR_ID', 'ORIGIN_ID'));
		$fields = is_object($dbResult) ? $dbResult->Fetch() : null;
		if(!is_array($fields))
		{
			return;
		}

		$originatorID = isset($fields['ORIGINATOR_ID']) ? $fields['ORIGINATOR_ID'] : '';
		$originID = isset($fields['ORIGIN_ID']) ? $fields['ORIGIN_ID'] : '';
		if($originatorID !== '' || $originID !== '')
		{
			$results[EntityMergeCollision::SEED_EXTERNAL_OWNERSHIP] = new EntityMergeCollision(\CCrmOwnerType::Contact, $seedID, $targID, EntityMergeCollision::SEED_EXTERNAL_OWNERSHIP);
		}
	}
	protected function prepareCollisionMessageFields(array &$collisions, array &$seed, array &$targ)
	{
		self::includeLangFile();
		$replacements = array(
			'#USER_NAME#' => $this->getUserName(),
			'#SEED_TITLE#' => \CCrmContact::PrepareFormattedName($seed),
			'#SEED_ID#' => isset($seed['ID']) ? $seed['ID'] : '',
			'#TARG_TITLE#' => \CCrmContact::PrepareFormattedName($targ),
			'#TARG_ID#' => isset($targ['ID']) ? $targ['ID'] : '',
		);

		$messages = array();
		if(isset($collisions[EntityMergeCollision::READ_PERMISSION_LACK])
			&& isset($collisions[EntityMergeCollision::UPDATE_PERMISSION_LACK]))
		{
			$messages[] = GetMessage('CRM_CONTACT_MERGER_COLLISION_READ_UPDATE_PERMISSION', $replacements);
		}
		elseif(isset($collisions[EntityMergeCollision::READ_PERMISSION_LACK]))
		{
			$messages[] = GetMessage('CRM_CONTACT_MERGER_COLLISION_READ_PERMISSION', $replacements);
		}
		elseif(isset($collisions[EntityMergeCollision::UPDATE_PERMISSION_LACK]))
		{
			$messages[] = GetMessage('CRM_CONTACT_MERGER_COLLISION_UPDATE_PERMISSION', $replacements);
		}

		if(empty($messages))
		{
			return null;
		}

		$html = implode('<br/>', $messages);
		return array(
			'TO_USER_ID' => isset($seed['ASSIGNED_BY_ID']) ? (int)$seed['ASSIGNED_BY_ID'] : 0,
			'NOTIFY_MESSAGE' => $html,
			'NOTIFY_MESSAGE_OUT' => $html
		);
	}
	private static function includeLangFile()
	{
		if(!self::$langIncluded)
		{
			self::$langIncluded = IncludeModuleLangFile(__FILE__);
		}
	}
}