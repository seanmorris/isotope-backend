<?php
namespace SeanMorris\Isotope\Channel;
class Game extends \SeanMorris\SubSpace\Kallisti\Channel
{
	protected $game, $gameId;

	public function __construct($server, $name)
	{
		parent::__construct($server, $name);

		list(,$gameId) = explode(':', $name);

		$this->gameId = $gameId;

		$this->getGame();
	}

	public function tick()
	{
		if(!$this->game)
		{
			if(!$game = $this->getGame())
			{
				return;
			}
		}

		\SeanMorris\Isotope\Queue\GameJoined::check(function($message){
			$game = $this->getGame();

			if(!$message
				|| !$message['game']
				|| $message['game']->publicId !== $this->gameId
			){
				return;
			}

			foreach($this->subscribers as $origin)
			{
				$origin->onMessage(
					json_encode($game->toApi(2))
					, $output
					, $origin
					, $this
					, $this
				);
			}
		}, get_class($this->game) . '.' . $this->gameId);
	}

	public function send($content, &$output, $origin, $originalChannel = NULL)
	{
		$output = false;

		if(!$received = json_decode($content, true))
		{
			return;
		}

		switch($received['type'] ?? NULL)
		{
			// case 'join':
			// 	$output = $this->join($origin, $originalChannel);
			// 	break;
			case 'move':
				$output = $this->move($origin, $originalChannel, $received);
				break;
			case 'pass':
				$output = $this->pass($origin, $originalChannel);
				break;
		}

		if(!$output)
		{
			$output = 'invalid.';
			return;
		}
	}

	protected function pass($origin, $originalChannel)
	{
		if(!$user = $origin->contextGet('__persistent'))
		{
			return 'Not logged in.';
		}

		$game = $this->getGame();

		if(!$game->pass($user))
		{
			return 'Unknown error 0x01.';
		}

		foreach($this->subscribers as $subscriber)
		{
			$subscriber->onMessage(
				json_encode($this->game->toApi(2))
				, $output
				, $origin
				, $this
				, $originalChannel
			);
		}

		return 'Passed.';
	}

	protected function move($origin, $originalChannel, $move)
	{
		if(!isset($move['x'], $move['y']))
		{
			return 'Invalid move.';
		}

		if(!$user = $origin->contextGet('__persistent'))
		{
			return 'Not logged in.';
		}

		$x = (int) $move['x'];
		$y = (int) $move['y'];

		$game = $this->getGame();

		if(!$game->move($x, $y, $user))
		{
			return 'Unknown error 0x02.';
		}

		foreach($this->subscribers as $subscriber)
		{
			$subscriber->onMessage(
				json_encode($this->game->toApi(2))
				, $output
				, $origin
				, $this
				, $originalChannel
			);
		}

		return 'Moved.';
	}

	protected function getGame()
	{
		\SeanMorris\Isotope\Game::clearCache();
		\SeanMorris\Ids\Relationship::clearCache();
		\SeanMorris\Isotope\Game::canHaveMany('players')::clearCache();

		$this->game = \SeanMorris\Isotope\Game::loadOneByPublicId($this->gameId);

		\SeanMorris\Ids\Log::debug($this->game);

		return $this->game;
	}
}