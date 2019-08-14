<?php
namespace SeanMorris\Isotope\Idilic\Route;
/**
 * Commands for Isotope web game.
 */
class RootRoute implements \SeanMorris\Ids\Routable
{
	/**
	 * Test the queuing system.
	 */
	public function testQueue($router)
	{
		$args  = $router->path()->consumeNodes();
		$topic = array_shift($args);


		while(TRUE)
		{
			$input = \SeanMorris\Ids\Idilic\Cli::in(
				'Type "exit" to quit.'
				, false
			);

			if($input && trim($input) === 'exit')
			{
				break;
			}

			\SeanMorris\Isotope\Queue\GameJoined::check(function($message, $raw){

				return (object) [
					'time'      => time()
					, 'message' => $message
				];

			}, $topic);
		}
	}

	/**
	 * Test the queue send system.
	 */
	public function testSend($router)
	{
		$args = $router->path()->consumeNodes();

		$message = array_shift($args);
		$topic   = array_shift($args);

		\SeanMorris\Isotope\Queue\GameJoined::send($message, $topic);
	}

	/**
	 * Test the queue broadcast system.
	 */
	public function testCast($router)
	{
		$args = $router->path()->consumeNodes();

		$message = array_shift($args);
		$topic   = array_shift($args);

		\SeanMorris\Isotope\Queue\GameJoined::broadcast($message, $topic);
	}

	public function testRpc($router)
	{
		$args    = $router->path()->consumeNodes();
		$message = array_shift($args);
		$topic   = array_shift($args);

		var_dump($message, $topic);

		$returner = \SeanMorris\Isotope\Queue\GameJoined::rpc($message, $topic);

		$time = time();

		while(TRUE)
		{
			if(time() - $time > 5)
			{
				break;
			}

			if($message = $returner())
			{
				var_dump($message);
			}
		}
	}

	public function rpcBenchmark($router)
	{
		$args    = $router->path()->consumeNodes();
		// $message = array_shift($args);
		$range   = array_fill(0, 10000, (object)[
			'start'    => NULL
			, 'end'    => NULL
			, 'time'   => NULL
			, 'return' => NULL
		]);

		array_map(
			function($item){
				$item->start  = microtime(TRUE);
				$item->return = \SeanMorris\Isotope\Queue\GameJoined::rpc($item->start);
			}
			, $range
		);

		while(TRUE)
		{
			foreach($range as $item)
			{
				if($ret = ($item->return)())
				{
					$item->end  = microtime(TRUE);
					$item->time = $item->end - $item->start;

					unset($item->return);

					var_dump($item, $ret);
				}
			}

			$remaining = array_filter($range, function($item){
				return !$item->end;
			});

			if(!$remaining)
			{
				break;
			}
		}

		foreach($range as $item)
		{
			var_dump($item->time);
		}
	}
}