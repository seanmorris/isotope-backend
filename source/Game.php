<?php
namespace SeanMorris\Isotope;
class Game extends \SeanMorris\PressKit\Model
{
	const NEW_GAME            = 0
		, WAITING_FOR_PLAYERS = 1
		, PLAY_IN_PROGRESS    = 2
		, GAME_OVER           = 3;

	protected
		$publicId
		, $created
		, $moves
		, $maxMoves
		, $mode
		, $maxPlayers
		, $currentPlayer
		, $state
		, $players
		, $chain    = []
		, $scores   = []
		, $submoves = []
		, $boardData
	;

	protected static
		$table = 'IsotopeGame'
		, $byPublicId = [
			'where' => [['publicId' => 'UNHEX(?)']]
		]
		, $createColumns = [
			'publicId' => 'UNHEX(REPLACE(UUID(), "-", ""))'
			, 'created' => 'UNIX_TIMESTAMP()'
		]
		, $readColumns = [
			'publicId' => 'HEX(%s)'
		]
		, $updateColumns = [
			'publicId' => 'UNHEX(%s)'
		]
		, $hasOne = [
			'state' => 'SeanMorris\Isotope\State\GameState'
		]
		, $hasMany = [
			'players' => 'SeanMorris\Access\User'
		]
		, $byModerated = [
			/*
			'join' => [
				'SeanMorris\Isotope\State\GameState' => [
					'on' => 'state'
					, 'by' => 'moderated'
					, 'type' => 'LEFT'
				]
			]
			, */
			'order' => [
				'id' => 'DESC'
			]
			, 'with' => [
				'state' => 'byNull'
			]
		]
	;

	public function pass($user)
	{
		$players = $this->getSubjects('players');

		$this->chain = [];

		foreach($players as $i => $player)
		{
			if($user->id != $player->id)
			{
				continue;
			}

			if($i == $this->currentPlayer)
			{
				$this->submoves[$this->currentPlayer]++;
				$this->submoves[$this->currentPlayer]++;

				if($this->submoves[$this->currentPlayer] > 3)
				{
					$this->submoves[$this->currentPlayer] = 3;
				}

				$this->currentPlayer++;

				if($this->currentPlayer > (count($players)-1))
				{
					$this->currentPlayer = 0;
				}

				$this->submoves[$this->currentPlayer]++;

				if($this->submoves[$this->currentPlayer] > 3)
				{
					$this->submoves[$this->currentPlayer] = 3;
				}

				$this->moves++;

				return TRUE;
			}
		}

		return FALSE;
	}

	public function move($x, $y, $user)
	{
		foreach($this->chain as $chainLink)
		{
			if($chainLink[0] == $x && $chainLink[1] == $y)
			{
				return false;
			}
		}

		if($this->maxMoves <= floor($this->moves / $this->maxPlayers))
		{
			return FALSE;
		}

		$players = $this->getSubjects('players');
		$messages = \SeanMorris\Message\MessageHandler::get();

		foreach($players as $i => $player)
		{
			if($user->id != $player->id)
			{
				continue;
			}

			if($i == $this->currentPlayer)
			{
				if(!isset($this->submoves[$i]) || $this->submoves[$i] <= 0)
				{
					$this->submoves[$i] = 0;
				}
				else
				{
					$this->submoves[$i]--;
				}

				if($this->submoves[$i] == 0)
				{
					$this->currentPlayer++;

					if($this->currentPlayer > (count($players)-1))
					{
						$this->currentPlayer = 0;
					}

					// $this->submoves[$this->currentPlayer] = 3;
					$this->submoves[$this->currentPlayer]++;
					if($this->submoves[$this->currentPlayer] > 3)
					{
						$this->submoves[$this->currentPlayer] = 3;
					}
					$this->moves++;
				}


				$this->chain = [];

				if(!isset($this->scores[$i]))
				{
					$this->scores[$i] = 0;
				}

				$this->add($i, $x, $y);

				// $chainLength = count($this->chain);

				// $this->scores[$i] += floor(
				// 	(pow($chainLength,3)-pow($chainLength,2))
				// 	/pow($chainLength,2)
				// );

				$this->forceSave();

				// $messages->addFlash(
				// 	new \SeanMorris\Message\SuccessMessage(
				// 		'Move accepted.'
				// 	)
				// );

				if($this->chain == NULL)
				{
					\SeanMorris\Ids\Log::error($this, debug_backtrace());
				}

				return TRUE;
			}
		}

		// $messages->addFlash(
		// 	new \SeanMorris\Message\ErrorMessage(
		// 		'Moving out of turn.'
		// 	)
		// );

		return FALSE;
	}

	protected function add($i, $x, $y, $negative = FALSE , $stage = 0)
	{
		\SeanMorris\Ids\Log::debug(sprintf('Adding atom to %d %d', $x, $y));
		$this->chain[] = [$x, $y, $stage];

		$board = $this->boardData;

		// $this->scores[$i] += abs($board->data[$x][$y]->mass ? pow($board->data[$x][$y]->mass, 2) : 1);
		$this->scores[$i] += ($board->data[$x][$y]->mass
			? abs($board->data[$x][$y]->mass)
			: 1
		);

		$board->data[$x][$y]->mass += $negative ? -1 : 1;

		if(isset($board->data[$x][$y]->claimed)
			&& $board->data[$x][$y]->claimed != $i
		){
			//$this->scores[$board->data[$x][$y]->claimed] -= abs($board->data[$x][$y]->mass-1);
			$this->scores[$board->data[$x][$y]->claimed] -= ($board->data[$x][$y]->mass
				? abs($board->data[$x][$y]->mass)
				: 1
			);
		}

		$board->data[$x][$y]->claimed = $i;

		$random = rand(0, 10) / 10;

		if($this->maxMoves - floor($this->moves / $this->maxPlayers) <=	 10)
		{
			$random = $random * 2;
		}

		\SeanMorris\Ids\Log::debug(
			'MOVES LEFT: ' . ($this->maxMoves - floor($this->moves / $this->maxPlayers))
			, 'RNG ' . $random
		);

		if($board->data[$x][$y]->mass > 3
			// || ($board->data[$x][$y]->mass > 2 && $random < 0.33 && count($this->chain) < 4)
			// || ($board->data[$x][$y]->mass > 1 && $random < 0.66 && count($this->chain) < 4)
			//|| ($board->data[$x][$y]->mass == 1 && $random < 0.1515)
		){
			$board->data[$x][$y]->mass -= 4;

			if(isset($board->data[$x][$y+1]))
			{
				$this->add($i, $x, $y+1, FALSE, $stage+1);
			}

			if(isset($board->data[$x+1][$y]))
			{
				$this->add($i, $x+1, $y, FALSE, $stage+1);
			}

			if(isset($board->data[$x-1][$y]))
			{
				$this->add($i, $x-1, $y, FALSE, $stage+1);
			}

			if(isset($board->data[$x][$y-1]))
			{
				$this->add($i, $x, $y-1, FALSE, $stage+1);
			}
		}
		// else if($board->data[$x][$y]->mass == -1 && $random > 0.66)
		// {
		// 	$board->data[$x][$y]->mass += 4;

		// 	if(isset($board->data[$x][$y+1]))
		// 	{
		// 		$this->add($i, $x, $y+1, TRUE, $stage+1);
		// 	}

		// 	if(isset($board->data[$x+1][$y]))
		// 	{
		// 		$this->add($i, $x+1, $y, TRUE, $stage+1);
		// 	}

		// 	if(isset($board->data[$x-1][$y]))
		// 	{
		// 		$this->add($i, $x-1, $y, TRUE, $stage+1);
		// 	}

		// 	if(isset($board->data[$x][$y-1]))
		// 	{
		// 		$this->add($i, $x, $y-1, TRUE, $stage+1);
		// 	}
		// }
		// else if($board->data[$x][$y]->mass < -3)
		// {
		// 	$board->data[$x][$y]->mass += 4;
		// }
	}

	public function addPlayer($user)
	{
		$messages = \SeanMorris\Message\MessageHandler::get();

		if(!$this->players || count($this->players) < $this->maxPlayers)
		{
			if(!$user->id)
			{
				$generatedName = sprintf('%s::%d', $this->publicId
					, rand(0, PHP_INT_MAX)
				);

				$user->consume([
					'username' => $generatedName
					, 'email'  => sprintf('%s@isotope.seanmorr.is', $generatedName)
				]);

				$user->save();

				\SeanMorris\Access\Route\AccessRoute::_currentUser($user);
			}

			$this->addSubject('players', $user);
			$this->storeRelationships('players', $this->players);
			
			$this->scores[]   = 0;
			$this->submoves[] = 3;
		}

		if($this->players && count($this->players) >= $this->maxPlayers)
		{
			$this->mode = static::PLAY_IN_PROGRESS;

			$messages->addFlash(
				new \SeanMorris\Message\ErrorMessage(
					'Game is now full.'
				)
			);
		}

		$this->forceSave();

		return $this->players;
	}

	protected static function afterRead($instance)
	{
		$instance->chain     = json_decode($instance->chain);
		$instance->scores    = json_decode($instance->scores);
		$instance->submoves  = json_decode($instance->submoves);
		$instance->boardData = json_decode($instance->boardData);
	}

	protected static function afterWrite($instance, &$skeleton)
	{
		$instance->chain     = is_string($instance->chain)
			? json_decode($instance->chain)
			: $instance->chain;

		$instance->scores    = is_string($instance->scores)
			? json_decode($instance->scores)
			: $instance->scores;

		$instance->submoves  = is_string($instance->submoves)
			? json_decode($instance->submoves)
			: $instance->submoves;

		$instance->boardData = is_string($instance->boardData)
			? json_decode($instance->boardData)
			: $instance->boardData;
	}

	protected static function beforeCreate($instance, &$skeleton)
	{
		$skeleton['mode']          = static::NEW_GAME;
		$skeleton['moves']         = 0;
		$skeleton['currentPlayer'] = 0;
	}

	protected static function beforeWrite($instance, &$skeleton)
	{
		$instance->chain     = $skeleton['chain']     = json_encode($instance->chain);
		$instance->scores    = $skeleton['scores']    = json_encode($instance->scores);
		$instance->submoves  = $skeleton['submoves']  = json_encode($instance->submoves);
		$instance->boardData = $skeleton['boardData'] = json_encode($instance->boardData);
	}
}
