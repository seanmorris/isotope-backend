<?php
namespace SeanMorris\Isotope\Channel;
class Game extends \SeanMorris\Kalisti\Channel
{
	protected $game, $gameId;

	public function __construct($server, $name)
	{
		parent::__construct($server, $name);

		list(,$gameId) = explode(':', $name);

		$this->gameId = $gameId;

		$this->getGame();
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
			case 'join':
				$output = $this->join($origin, $originalChannel);
				break;
			case 'pass':
				$output = $this->pass($origin, $originalChannel);
				break;
			case 'move':
				$output = $this->move($origin, $originalChannel, $received);
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

		foreach($this->subscribers as $origin)
		{
			$origin->onMessage(
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

		foreach($this->subscribers as $origin)
		{
			$origin->onMessage(
				json_encode($this->game->toApi(2))
				, $output
				, $origin
				, $this
				, $originalChannel
			);
		}

		return 'Moved.';
	}

	protected function join($origin, $originalChannel)
	{
		$game = $this->getGame();

		\SeanMorris\Ids\Relationship::clearCache();

		$players = $game->getSubjects('players');

		if(count($players) >= $game->maxPlayers)
		{
			foreach($this->subscribers as $origin)
			{
				$origin->onMessage(
					json_encode($this->game->toApi(2))
					, $output
					, $origin
					, $this
					, $originalChannel
				);
			}

			return 'Game full.';
		}

		if($user = $origin->contextGet('__persistent'))
		{
			foreach($players as $player)
			{
				if($user->publicId == $player->publicId)
				{
					return 'Already joined.';
				}
			}

			if($game->addPlayer($user))
			{
				foreach($this->subscribers as $origin)
				{
					$origin->onMessage(
						json_encode($this->game->toApi(2))
						, $output
						, $origin
						, $this
						, $originalChannel
					);
				}

				return 'Joined.';
			}
		}

		return 'Unknown error 0x03.';
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