<?php
namespace SeanMorris\Isotope\Channel;
class BlackHole extends \SeanMorris\SubSpace\Kalisti\Channel
{
	public function send($content, &$output, $origin, $originalChannel = NULL)
	{
		// foreach($this->subscribers as $agent)
		// {
		// 	$agent->onMessage(
		// 		$content
		// 		, $output
		// 		, $origin
		// 		, $this
		// 		, $originalChannel
		// 	);
		// }
	}
}