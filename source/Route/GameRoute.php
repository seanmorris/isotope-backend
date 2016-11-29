<?php
namespace SeanMorris\Isotope\Route;
class GameRoute extends \SeanMorris\PressKit\Controller
{
	protected
		$title = 'Lobby'
		, $modelClass = 'SeanMorris\Isotope\Game'
		, $formTheme = 'SeanMorris\Form\Theme\Theme'
		, $theme = 'SeanMorris\Isotope\Theme\Theme'
		, $listColumns = ['id']
	;
	protected static
		$listBy = 'byModerated'
		, $pageSize = 10
		, $modelRoute = 'SeanMorris\Isotope\Route\GameSubRoute'
		, $forms = [
			'edit' => 'SeanMorris\Isotope\Form\GameForm'
		]
	;

	protected static function beforeCreate($instance, &$skeleton)
	{
		$width = 5;
		$height = 8;

		if(isset($skeleton['width']))
		{
			$width = (int) $skeleton['width'];
		}

		if(isset($skeleton['height']))
		{
			$height = (int) $skeleton['height'];
		}

		$boardData = [
			'data' => array_fill(
				0, $width
				, array_fill(0, $height, (object)[
					'claimed' => NULL
					, 'mass' => 0
				])
			)
			, 'width' => $width
			, 'height' => $height
		];

		$instance->consume([
			'boardData' => $boardData
			, 'maxPlayers' => (int) ($skeleton['maxPlayers'] < 3 ? 2 : 3)
			, 'maxMoves' => (int) ($skeleton['maxMoves'] < 40 ? $skeleton['maxMoves'] : 40)
		], TRUE);

		if(isset($skeleton['visibility']))
		{
			/*
			$state = $instance->getSubject('state');

			if(!$skeleton['visibility'])
			{
				$state->change(-1);
			}
			else
			{
				$state->change(1);
			}

			$state->save();
			*/
		}
	}
}
