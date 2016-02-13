<?php

namespace Food
{
	class Item extends \System\Model\Perm
	{
		protected static $attrs = array(
			'name' => array("type" => 'varchar'),
			'date' => array("type" => 'date'),

			'type' => array(
				"type" => 'int',
				"options" => array(
					1 => 'Polévka',
					2 => 'Hlavní chod'
				)
			),

			'blank' => array("type" => 'bool'),

			'edible' => array(
				"type" => 'bool',
				"default" => 1
			),

			'eaters' => array(
				"type"  => 'has_many',
				"model" => 'Workshop\SignUp',
				"is_bilinear" => true,
			),
		);
	}
}
