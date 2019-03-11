<?php
namespace SeanMorris\Isotope\Queue;
class UserCreated extends \SeanMorris\Ids\Queue
{
	protected static $frame = 0;
	const ASYNC             = TRUE;

	protected static function tick()
	{
		$lastFrame = static::$frame;
		$frame     = microtime(TRUE);

		if($frame - static::$frame < 5)
		{
			return FALSE;
		}

		static::$frame = $frame;

		fwrite(STDERR, 'TICK!' . microtime(TRUE) . PHP_EOL);
	}

	protected static function recieve($message)
	{
		var_dump($message);
	}
}