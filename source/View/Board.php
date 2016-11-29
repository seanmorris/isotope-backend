<?php
namespace SeanMorris\Isotope\View;
class Board extends \SeanMorris\Theme\View
{
	public function preprocess(&$vars)
	{
		$vars['width'] = 5;
		$vars['height'] = 8;
		$game = $vars['object'];
		$path = $vars['path'];
		$board = $game->boardData;
		$players = $game->getSubjects('players');
		$state = $game->getSubject('state');
		$user = \SeanMorris\Access\Route\AccessRoute::_currentUser();

		$vars['width'] = $board->width;
		$vars['height'] = $board->height;

		$vars['board'] = $board->data;

		$vars['status'] = 'Waiting for move...';

		if(!$players)
		{
			$vars['status'] = 'Waiting for players to join.<br />'
				. sprintf('<a href = "/%s">%s', $path . '/join', 'Join');
		}

		$joined = FALSE;
		$myTurn = FALSE;

		foreach($players as $i => $player)
		{
			if($player->publicId == $user->publicId)
			{
				$joined = TRUE;
			}

			if($i != $game->currentPlayer)
			{
				continue;
			}

			if($player->publicId == $user->publicId)
			{
				$myTurn = TRUE;
			}
		}

		if($myTurn)
		{
			$vars['status'] = 'Waiting for your move.';
		}

		if($players && $game->mode != 2)
		{
			$vars['status'] = 'Waiting for opponent player to join.<br />' . $game->mode
				. ($joined
					? NULL
					: sprintf('<a href = "/%s">%s', $path . '/join', 'Join')
				);
		}
	}
}
__halt_compiler(); ?>
<table class = "IsotopeBoard">
	<tr>
		<td colspan = "<?=$width;?>">
			<span class = "IsotopeStatus"><?=$status;?></span>
		</td>
	</tr>
	<?php for($i = 0; $i < $height; $i++): ?>
	<tr>
		<?php for($j = 0; $j < $width; $j++): ?>
		<td data-x="<?=$j;?>" data-y="<?=$i;?>" data-claim="<?=$board[$j][$i]->claimed;?>">
			<a href = "/<?=$path;?>/move?x=<?=$j;?>&y=<?=$i;?>">
				<?=$board[$j][$i]->mass;?>
			</a>
		</td>
		<?php endfor; ?>
	</tr>
	<?php endfor; ?>
</table>
