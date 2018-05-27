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
			, '_validators' => []
		];

		$skeleton['height'] = [
			'_title' => 'Height'
			, 'type' => 'text'
			, '_validators' => []
		];

		$skeleton['maxMoves'] = [
			'_title' => 'Max Moves'
			, 'type' => 'text'
			, '_validators' => []
		];

		$skeleton['maxPlayers'] = [
			'_title' => 'Max Players'
			, 'type' => 'text'
			, '_validators' => []
		];

		$skeleton['visibility'] = [
			'_title' => 'Visibility'
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