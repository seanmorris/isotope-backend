<?php
namespace SeanMorris\Isotope\Channel;
class Game extends \SeanMorris\Kalisti\Channel
{
	protected $game;

	public function __construct($server, $name)
	{
		parent::__construct($server, $name);

		list(,$gameId) = explode(':', $name);

		$this->game = \SeanMorris\Isotope\Game::loadOneByPublicId($gameId);
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

		$game = $this->game;

		if(!$game->move($x, $y, $user))
		{
			return;
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

	protected function join($origin)
	{
		$game = $this->game;
		$players = $game->getSubjects('players');

		if(count($players) >= $game->maxPlayers)
		{
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
				return 'Joined.';
				return json_encode($this->game->toApi(2));
			}
		}

		return 'Unknown error.';
	}
}