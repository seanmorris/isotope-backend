<?php
namespace SeanMorris\Isotope\Route;
class GameSubRoute extends \SeanMorris\PressKit\Route\ModelSubRoute
{
	protected
		$title = 'Game';

	public function view($router)
	{
		$this->context['js'][] = '/SeanMorris/PortfolioSite/jquery-1.11.2.min.js';

		//$this->context['js'][] = '/SeanMorris/Portfolio/jquery-1.11.2.min.js';

		$this->context['js'][] = '/SeanMorris/Isotope/isotope.js';

		return parent::view($router);
	}

	public function join($router)
	{
		$user = \SeanMorris\Access\Route\AccessRoute::_currentUser();
		$game = $router->parent()->routes()->model;
		$players = $game->getSubjects('players');
		$messages = \SeanMorris\Message\MessageHandler::get();

		if(count($players) >= $game->maxPlayers)
		{
			$messages->addFlash(
				new \SeanMorris\Message\ErrorMessage(
					'Game full.'
				)
			);

			throw new \SeanMorris\Ids\Http\Http303(
				$router->path()->pop()->pathString()
			);
		}

		foreach($players as $player)
		{
			if($user->publicId == $player->publicId)
			{
				$messages->addFlash(
					new \SeanMorris\Message\ErrorMessage(
						'Already joined.'
					)
				);

				throw new \SeanMorris\Ids\Http\Http303(
					$router->path()->pop()->pathString()
				);
			}
		}

		$messages->addFlash(
			new \SeanMorris\Message\SuccessMessage(
				'Joining.'
			)
		);

		$game->addPlayer($user);

		throw new \SeanMorris\Ids\Http\Http303(
			$router->path()->pop()->pathString()
		);
	}

	public function move($router)
	{
		$messages = \SeanMorris\Message\MessageHandler::get();
		$params = $router->request()->params();

		if(!isset($params['x'], $params['y']))
		{
			$messages->addFlash(
				new \SeanMorris\Message\ErrorMessage(
					'Invalid move.'
				)
			);

			throw new \SeanMorris\Ids\Http\Http303(
				$router->path()->pop()->pathString()
			);
		}

		$x = (int) $params['x'];
		$y = (int) $params['y'];

		$game = $router->parent()->routes()->model;

		$game->move($x, $y);

		throw new \SeanMorris\Ids\Http\Http303(
			$router->path()->pop()->pathString()
		);

		return;

		$user = \SeanMorris\Access\Route\AccessRoute::_currentUser();
		$game = $router->parent()->routes()->model;
		$players = $game->getSubjects('players');
		$messages = \SeanMorris\Message\MessageHandler::get();

		$params = $router->request()->params();

		if(!isset($params['x'], $params['y']))
		{
			$messages->addFlash(
				new \SeanMorris\Message\ErrorMessage(
					'Invalid move..'
				)
			);

			throw new \SeanMorris\Ids\Http\Http303(
				$router->path()->pop()->pathString()
			);
		}

		$x = (int) $params['x'];
		$y = (int) $params['y'];

		$success = FALSE;

		foreach($players as $i => $player)
		{
			if($i == $game->currentPlayer)
			{
				$currentPlayer = $game->currentPlayer+1;

				if($currentPlayer > count($players))
				{
					$currentPlayer = 0;
				}

				$board = $game->boardData;
				$board->data[$x][$y]++;

				$game->consume([
					'currentPlayer' => $currentPlayer,
					'boardData' => $board
				]);
				$game->save();

				$messages->addFlash(
					new \SeanMorris\Message\SuccessMessage(
						'Move accepted.'
					)
				);

				$success = TRUE;

				break;
			}
		}

		if(!$success)
		{
			$messages->addFlash(
				new \SeanMorris\Message\ErrorMessage(
					'Moving out of turn.'
				)
			);
		}

		throw new \SeanMorris\Ids\Http\Http303(
			$router->path()->pop()->pathString()
		);
	}
}
