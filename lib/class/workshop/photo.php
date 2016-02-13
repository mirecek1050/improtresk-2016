<?

namespace Workshop
{
	class Photo extends \System\Model\Perm
	{
		protected static $attrs = array(
			'image'     => array("type" => 'image'),
			'desc'      => array("type" => 'html', "is_null" => true),
			'workshop'  => array(
				"type" => 'belongs_to',
				"model" => 'Workshop',
			),
		);


		protected static $access = array(
			"browse" => true,
			"schema" => true,
		);
	}
}
