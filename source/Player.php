<?php
namespace \SeanMorris\Isotope;
class Player extends \SeanMorris\PressKit\Model
{
	protected
		$created
		, $user
	;

	protected static
		$table = 'IsotopePlayer'
		, $createColumns = [
			'created' => 'UNIX_TIMESTAMP()'
		]
		, $hasOne = [
			'user' => 'SeanMorris\Access\User'
		]
	;
}