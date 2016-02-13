<?

namespace Workshop
{
	class Check extends \System\Model\Perm
	{
		protected static $attrs = array(
			'currency' => array("type" => 'varchar', "default" => 'CZK'),
			'symvar'  => array("type" => 'int', "is_unsigned" => true),
			'amount'  => array("type" => 'float'),

			'is_paid' => array("type" => 'bool'),
			'is_over' => array("type" => 'bool'),
			'paid_on' => array("type" => 'datetime', "is_null" => true),

			'signup' => array(
				"type" => 'belongs_to',
				"model" => 'Workshop\SignUp'
			),

			'payments' => array(
				"type" => 'has_many',
				"model" => 'Workshop\Payment'
			)
		);


		protected static $access = array(
			"browse" => true,
			"schema" => true,
		);


		protected static function create_symvar($id)
		{
			return intval(date('ymdHi')) + $id;
		}


		public function save()
		{
			parent::save();

			if (!$this->symvar) {
				$this->symvar = self::create_symvar($this->id);
				$this->save();
			}
		}


		public function update_ballance()
		{
			$payments = $this->payments->fetch();
			$paid = 0;

			foreach ($payments as $p) {
				$paid += $p->amount;
			}

			if ($paid >= $this->amount) {
				$this->is_paid = true;

				if (!$this->paid_on) {
					$this->paid_on = new \DateTime();
				}

				if ($paid > $this->amount) {
					$this->is_over = true;
				}
			} else {
				$this->is_paid = false;
			}

			$this->save();

			if (any($payments)) {
				$this->signup->update_ballance()->mail_payment_update();
			}

			return $this;
		}
	}
}
