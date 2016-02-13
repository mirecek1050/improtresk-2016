<?

namespace Workshop
{
	class Request extends \System\Model\Perm
	{
		protected static $attrs = array(
			'name'      => array("type" => 'varchar'),
			'email'     => array("type" => 'varchar'),
			'workshops' => array(
				"type" => 'has_many',
				"model" => 'Workshop\Concept',
				"is_bilinear" => true,
				"is_master" => true
			),

			'other' => array("type" => 'text', "is_null" => true),
		);
	}
}
