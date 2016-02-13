<?php

namespace Workshop
{
	class Payment extends \System\Model\Perm
	{
		const FORMAT_DATE = 'Y-m-dO';

		const FEED_KEY_ACCOUNT  = 'accountStatement';
		const FEED_KEY_LIST     = 'transactionList';
		const FEED_KEY_MOVES    = 'transaction';

		protected static $pairs = array(
			array(
				"col"    => '0',
				"attr"   => 'received',
				"type"   => 'date',
				"format" => self::FORMAT_DATE,
			),

			array(
				"col"  => '1',
				"attr" => 'amount'
			),

			array(
				"col"  => '2',
				"attr" => 'from'
			),

			array(
				"col"  => '3',
				"attr" => 'bank'
			),

			array(
				"col"  => '4',
				"attr" => 'symcon'
			),

			array(
				"col"  => '5',
				"attr" => 'symvar'
			),

			array(
				"col"  => '6',
				"attr" => 'symspc'
			),

			array(
				"col"  => '14',
				"attr" => 'currency'
			),

			array(
				"col"  => '16',
				"attr" => 'message'
			),

			array(
				"col"  => '22',
				"attr" => 'ident'
			),

		);

		protected static $attrs = array(
			'ident'    => array("type" => 'varchar', "is_unique" => true),
			'symvar'   => array("type" => 'varchar', "is_null" => true),
			'symcon'   => array("type" => 'varchar', "is_null" => true),
			'symspc'   => array("type" => 'varchar', "is_null" => true),
			'amount'   => array("type" => 'float'),
			'from'     => array("type" => 'varchar', "is_null" => true),
			'bank'     => array("type" => 'varchar', "is_null" => true),
			'message'  => array("type" => 'varchar', "is_null" => true),
			'currency' => array("type" => 'varchar', "is_null" => true),
			'received' => array("type" => 'datetime', "is_null" => true),
			'message'  => array("type" => 'text', "is_null" => true),

			'check' => array(
				"type" => 'belongs_to',
				"model" => 'Workshop\Check',
				"is_null" => true,
			)
		);


		protected static $access = array(
			"browse" => true,
			"schema" => true,
		);


		public static function pair_with_feed(array $feed)
		{
			if (!array_key_exists(self::FEED_KEY_ACCOUNT, $feed) || !is_array($feed[self::FEED_KEY_ACCOUNT])) {
				throw new \System\Error\Argument('Invalid feed format', self::FEED_KEY_ACCOUNT);
			}

			$stat = $feed[self::FEED_KEY_ACCOUNT];

			if (!array_key_exists(self::FEED_KEY_LIST, $stat) || !is_array($stat[self::FEED_KEY_LIST])) {
				throw new \System\Error\Argument('Invalid feed format', self::FEED_KEY_LIST);
			}

			$list = $stat[self::FEED_KEY_LIST];

			if (!array_key_exists(self::FEED_KEY_MOVES, $list) || !is_array($list[self::FEED_KEY_MOVES])) {
				throw new \System\Error\Argument('Invalid feed format', self::FEED_KEY_MOVES);
			}

			foreach ($list[self::FEED_KEY_MOVES] as $item) {
				self::pair_with_transaction($item);
			}
		}


		public static function pair_with_transaction(array $item)
		{
			$trans = self::transaction_to_assoc($item);

			if (empty($trans['ident']) || empty($trans['symvar'])) {
				//~ throw new \System\Error('No ident or symvar');
				// Ignored - not an interesting payment
				return;
			}

			$match = self::get_first(array(
				'ident' => $trans['ident'],
				'symvar' => $trans['symvar']
			))->fetch();

			if ($match) {
				$item = $match;
			} else {
				$item = new self($trans);
			}

			if ($item->id && $item->check) {
				if ($item->check->is_paid) {
					// Ignored - transaction already paired with check and check is paid
					return;
				}

				$check = $item->check;
			} else {
				$check = \Workshop\Check::get_first()->where(array(
					"symvar" => $item->symvar
				))->fetch();
			}

			if ($check) {
				$item->check = $check;
			} else {
				// Ignored - transaction without check
				//~ return;
				// No. Save payment with no checks.
			}

			$item->save();

			if ($check && !$check->is_paid) {
				$item->check->update_ballance();
			}
		}


		public static function transaction_to_assoc(array $item)
		{
			$assoc = array();

			foreach (self::$pairs as $pair) {
				$name = 'column'.$pair['col'];

				if (array_key_exists($name, $item)) {
					$col = $item[$name];

					if (is_array($col) && array_key_exists('value', $col)) {
						$val = $col['value'];

						if (isset($pair['type'])) {
							if (isset($pair['type']) == 'date') {
								$assoc[$pair['attr']] = \DateTime::createFromFormat($pair['format'], $val);
							}
						} else {
							$assoc[$pair['attr']] = $val;
						}
					}
				}
			}

			return $assoc;
		}
	}
}
