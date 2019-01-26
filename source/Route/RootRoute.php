<?php
namespace SeanMorris\Isotope\Route;
class RootRoute extends \SeanMorris\PressKit\Controller
{
	public
		$title    = 'Isotope'
		, $theme  = 'SeanMorris\Isotope\Theme\Theme'
		, $routes = [
			'games'  => 'SeanMorris\Isotope\Route\GameRoute'
			, 'user' => 'SeanMorris\Access\Route\AccessRoute'
		]
	;

	public function __construct()
	{
		session_start();

		if(!isset($_GET['api']) && !($_POST ?? FALSE))
		{
			\SeanMorris\Ids\Log::debug($_SERVER);

			$public = \SeanMorris\Ids\Settings::read('public');
			$uiPath = realpath($public . '/index.html');

			if($uiPath = realpath($public . '/index.html'))
			{
				print file_get_contents($uiPath);
				die;
			}
		}
	}

	public function auth($router)
	{
		$subspaceRoute = new \SeanMorris\SubSpace\WebRoute;
		print (string) $subspaceRoute->auth($router);
		die;
	}

	public function facebookLogin($router)
	{
		throw new \SeanMorris\Ids\Http\Http303(
			\SeanMorris\Access\Route\AccessRoute::facebookLink(
				$router
				, 'app?close=1'
			)
		);
	}

	function index($router)
	{
		$path = $router->path()->pathString();
		$path = $path ? '/' . $path : $path;

		header(sprintf('Location: %s/games', $path));

		// return 'abc';
	}
}
