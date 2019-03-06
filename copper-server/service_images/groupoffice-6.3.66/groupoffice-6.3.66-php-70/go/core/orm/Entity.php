<?php

namespace go\core\orm;

use Exception;
use GO;
use go\core\acl\model\Acl;
use go\core\App;
use go\core\db\Criteria;
use go\core\db\Query;
use go\core\jmap\EntityController;
use go\core\util\StringUtil;
use go\core\validate\ErrorCode;
use go\modules\core\modules\model\Module;

/**
 * Entity model
 * 
 * An entity is a model that is saved to the database. An entity can have 
 * multiple database tables. It can be extended with has one related tables and
 * it can also have properties in other tables.
 */
abstract class Entity extends Property {
	
	const EVENT_BEFORESAVE = 'beforesave';
	
	const EVENT_SAVE = 'save';
	
	const EVENT_DELETE = 'delete';

	/**
	 * Find entities
	 * 
	 * Returns a query object that's also directly iterable:
	 * 
	 * @exanple
	 * ````
	 * $notes = Note::find()->where(['name' => 'Foo']);
	 * 
	 * foreach($notes as $note) {
	 *	echo $note->name;	
	 * }
	 * 
	 * ```
	 * 
	 * For a single value do:
	 * 
	 * @exanple
	 * ````
	 * $note = Note::find()->where(['name' => 'Foo'])->single();
	 * 
	 * ```
	 * 
	 * For more details see the Criteria::where() function description
	 * 
	 * @see Criteria::where()
	 * @return static[]|Query
	 */
	public static final function find(array $properties = []) {
		
		if(count($properties) && !isset($properties[0])) {
			throw new \Exception("Invalid properties given to Entity::find()");
		}
		return static::internalFind($properties);
	}

	/**
	 * Find by ID's. 
	 * 
	 * It will search on the primary key field of the first mapped table.
	 * 
	 * @exanple
	 * ```
	 * $note = Note::findById(1);
	 * ```
	 * 
	 * @param string|int $id
	 * @param string[] $properties
	 * @return static
	 * @throws Exception
	 */
	public static final function findById($id, array $properties = []) {

		$tables = static::getMapping()->getTables();
		$primaryTable = array_shift($tables);
		$pkOfPrimaryTable = $primaryTable->getPrimaryKey();
		
		if (count($pkOfPrimaryTable) > 1) {
			throw new Exception("Can't find by ids because the primary table has more than one primary key. Entities should have only one primary key field.");//		
		}
		
		$query = static::internalFind($properties);		
		$query->where([$pkOfPrimaryTable[0] => $id]);
	
		
//		$ids = explode('-', $id);
//
//		$where = [];
//		foreach($pkOfPrimaryTable as $key) {
//			$where[$key] = array_shift($ids);
//		}
		
		return $query->single();
	}
	
//	
//	public function getId() {		
//		$tables = static::getMapping()->getTables();
//		$primaryTable = array_shift($tables);
//		$pkOfPrimaryTable = $primaryTable->getPrimaryKey();
//		
//		$id = [];
//		
//		foreach($pkOfPrimaryTable as $key) {
//			$id[] = $this->{$key};
//		}
//		
//		
//		return implode("-", $id);		
//	}

	/**
	 * Save the entity
	 * 
	 * @return boolean
	 */
	public final function save() {	
		App::get()->getDbConnection()->beginTransaction();
			
		if (!$this->fireEvent(self::EVENT_BEFORESAVE, $this)) {
			$this->rollback();
			return false;
		}
		
		if (!$this->internalSave()) {
			$this->rollback();
			return false;
		}		
		
		if (!$this->fireEvent(self::EVENT_SAVE, $this)) {
			$this->rollback();
			return false;
		}

		return $this->commit();
	}
	
	/**
	 * Saves the model and property relations to the database
	 * 
	 * Important: When you override this make sure you call this parent function first so
	 * that validation takes place!
	 * 
	 * @return boolean
	 */
	protected function internalSave() {
		if(!parent::internalSave()) {
			App::get()->debug(static::class."::internalSave() returned false");
			return false;
		}
		
		//See \go\core\orm\CustomFieldsTrait;
		if(method_exists($this, 'saveCustomFields')) {
			if(!$this->saveCustomFields()) {
				$this->setValidationError("customFields", ErrorCode::INVALID_INPUT, "Could not save custom fields");
				return false;
			}
		}
		
		//See \go\core\orm\SearchableTrait;
		if(method_exists($this, 'saveSearch')) {
			if(!$this->saveSearch()) {				
				$this->setValidationError("search", ErrorCode::INVALID_INPUT, "Could not save core_search entry");				
				return false;
			}
		}		
		
		return true;
	}

	/**
	 * Delete the entity
	 * 
	 * @return boolean
	 */
	public final function delete() {

		App::get()->getDbConnection()->beginTransaction();

		if (!$this->internalDelete()) {
			$this->rollback();
			return false;
		}
		
		//See \go\core\orm\SearchableTrait;
		if(method_exists($this, 'deleteSearchAndLinks')) {
			if(!$this->deleteSearchAndLinks()) {				
				$this->setValidationError("search", ErrorCode::INVALID_INPUT, "Could not delete core_search entry");		
				$this->rollback();
				return false;
			}
		}	

		if (!$this->fireEvent(self::EVENT_DELETE, $this)) {
			$this->rollback();
			return false;
		}

		return $this->commit();		
	}
	
	protected function commit() {
		parent::commit();

		return App::get()->getDbConnection()->commit();
	}

	protected function rollback() {
		App::get()->debug("Rolling back save operation for ".static::class);
		parent::rollBack();
		return App::get()->getDbConnection()->rollBack();
	}

	/**
	 * Checks if the current user has a given permission level.
	 * 
	 * @param int $level
	 * @return boolean
	 */
	public function hasPermissionLevel($level = Acl::LEVEL_READ) {
		return $level <= $this->getPermissionLevel();
	}
	
	/**
	 * Get the permission level of the current user
	 * 
	 * @return int
	 */
	public function getPermissionLevel() {
		return GO()->getAuthState() && GO()->getAuthState()->getUser() && GO()->getAuthState()->getUser()->isAdmin() ? Acl::LEVEL_MANAGE : Acl::LEVEL_READ;
	}

	/**
	 * Applies conditions to the query so that only entities with the given permission level are fetched.
	 * 
	 * @param Query $query
	 * @param int $level
	 * @return Query $query;
	 */
	public static function applyAclToQuery(Query $query, $level = Acl::LEVEL_READ) {
		
		return $query;
	}

	/**
	 * Finds all aclId's for this entity
	 * 
	 * This query is used in the "getFooUpdates" methods of entities to determine if any of the ACL's has been changed.
	 * If so then the server will respond that it cannot calculate the updates.
	 * 
	 * @see EntityController::getUpdates()
	 * 
	 * @return Query
	 */
	public static function findAcls() {
		return null;
	}
	
	/**
	 * Finds the ACL id that holds this models permissions.
	 * Defaults to the module permissions it belongs to.
	 * 
	 * @return int
	 */
	public function findAclId() {
		$moduleId = static::getType()->getModuleId();
		
		return Module::findById($moduleId)->findAclId();
	}
	
	
	private static $typeCache = [];
	
	/**
	 * Gets an ID from the database for this class used in database relations and 
	 * routing short routes like "Note/get"
	 * 
	 * @return EntityType
	 */
	public static function getType() {		
		if(!isset(self::$typeCache[static::class])) {
			self::$typeCache[static::class] = EntityType::findByClassName(static::class);;
		}
		return self::$typeCache[static::class];
	}
  
  /**
   * Return the unique (!) client name for this entity. Each entity must have a unique name for the client.
   * 
   * For main entities this is not a problem like "Note", "Contact", "Project" etc.
   * 
   * But common names like "Category" or "Folder" should be avoided. Use 
   * "CommentCategory" for example as client name. By default the class name without namespace is used as clientName().
   * @return string
   */
  public static function getClientName() {
		$cls = static::class;
    return substr($cls, strrpos($cls, '\\') + 1);
  }
	
	
	/**
	 * Filter entities See JMAP spec for details on the $filter array.
	 * 
	 * By default the "q" filter is implemented which will search on multiple fields defined in {@see searchColumns()}	 
	 * 
	 * @param Query $query
	 * @param array $filter
	 * @return Query
	 */
	public static function filter(Query $query, array $filter) {

		if(!empty($filter['q'])) {
			static::search($query, $filter['q']);			
		}
		
		return $query;
	}
	
	/**
	 * Return columns to search on with the "q" filter. {@see filter()}
	 * 
	 * @return string[]
	 */
	protected static function searchColumns() {
		return [];
	}
	
	/**
	 * Applies a search expression to the given database query
	 * 
	 * @param Query $query
	 * @param string $expression
	 * @return Query
	 */
	protected static function search(Query $query, $expression) {
		
		$columns = static::searchColumns();
		
		if(!empty($columns)) {
			//Explode string into tokens and wrap in wildcard signs to search within the texts.
			$tokens = StringUtil::explodeSearchExpression($expression);
			
			$tokensWithWildcard = array_map(
											function($t){
												return '%' . $t . '%';
											}, 
											$tokens
											);

			$searchConditions = (new Criteria());

			foreach($columns as $column) {
				$columnConditions = (new Criteria());
				foreach($tokensWithWildcard as $token) {
					$columnConditions->andWhere($column, 'LIKE', $token);
				}
				$searchConditions->orWhere($columnConditions);
			}		
		}
		
		//Search on the "id" field if the search phrase is an int.
		if(static::getMapping()->getColumn('id')){
			foreach($tokens as $token) {
				$int = (int) $token;
				if((string) $int === $token) {
					$searchConditions->orWhere('id', '=', $int);
				}
			}
		}

		$query->andWhere($searchConditions);
		
		return $query;
	}
	
	/**
	 * Sort entities.
	 * 
	 * By default you can sort on all database columns. But you can override this
	 * to implement custom logic.
	 * 
	 * @example
	 * ```
	 * public static function sort(Query $query, array $sort) {
	 * 		
	 * 		if(isset($sort['creator'])) {			
	 * 			$query->join('core_user', 'u', 'n.createdBy = u.id', 'LEFT')->orderBy(['u.displayName' => $sort['creator']]);			
	 * 		} 
	 * 
	 * 		
	 * 		return parent::sort($query, $sort);
	 * 		
	 * 	}
	 * 
	 * ```
	 * 
	 * @param Query $query
	 * @param array $sort eg. ['field' => 'ASC']
	 * @return Query
	 */
	public static function sort(Query $query, array $sort) {	
		
		//filter by columns
//		$query->orderBy(array_filter($sort, function($key) {
//				return static::getMapping()->getColumn($key) !== false;
//			}, ARRAY_FILTER_USE_KEY)
//							, true
//		);
		
		$query->orderBy($sort, true);
		
		return $query;
	}


}
