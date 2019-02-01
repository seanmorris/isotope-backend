<?php
namespace SeanMorris\Isotope\Form;
class GameForm extends \SeanMorris\PressKit\Form\Form
{
	public function __construct($skeleton = [])
	{
		$skeleton['_method'] = 'POST';

		$skeleton['id'] = [
			'_title' => 'Id'
			, 'type' => 'hidden'
		];

		$skeleton['publicId'] = [
			'_title' => 'PublicId'
			, 'type' => 'hidden'
		];

		$skeleton['width'] = [
			'_title' => 'Width'
			, 'type' => 'text'
			, 'value'  => 11
			, '_range' => [
				3       => '%s must be at least 3.'
				, 20    => '%s can be at most 20.'
				, 'nan' => '%s must be a valid integer.'
			]
		];

		$skeleton['height'] = [
			'_title' => 'Height'
			, 'type' => 'text'
			, 'value'  => 13
			, '_range' => [
				3       => '%s must be at least 3.'
				, 20    => '%s can be at most 20.'
				, 'nan' => '%s must be a valid integer.'
			]
		];

		$skeleton['maxMoves'] = [
			'_title'   => 'Rounds'
			, 'type'   => 'text'
			, 'value'  => 25
			, '_range' => [
				10      => '%s must be at least 10.'
				, 120   => '%s can be at most 120.'
				, 'nan' => '%s must be a valid integer.'
			]
		];

		$skeleton['maxPlayers'] = [
			'_title'     => 'Max Players'
			, 'type'     => 'select'
			, 'value'    => 2
			, '_options' => [
				2=>2, 3=>3
			]
		];

		$skeleton['visibility'] = [
			'_title' => 'Visibility'
			, 'value'=> 1
			, 'type' => 'select'
			, '_options' => [
				'Public'    => 1
				, 'Private' => 0
			]
		];

		$skeleton['submit'] = [
			'_title' => 'submit'
			, 'type' => 'submit'
		];

		parent::__construct($skeleton);
	}
}