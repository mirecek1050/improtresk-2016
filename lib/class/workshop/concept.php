<?

namespace Workshop
{
	class Concept extends \System\Model\Perm
	{
		protected static $attrs = array(
			'name' => array("type" => 'varchar'),
			'desc' => array("type" => 'text'),
			'difficulty' => array("type" => 'varchar'),
			'visible' => array("type" => 'bool'),
			'requests' => array(
				"type" => 'has_many',
				"model" => 'Workshop\Request',
				"is_bilinear" => true,
				"is_master" => false
			),
		);


		protected static $access = array(
			"browse" => true,
			"schema" => true,
		);
	}
}
