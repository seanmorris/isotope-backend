<?php
namespace SeanMorris\Isotope\Route;
class RootRoute extends \SeanMorris\PressKit\Controller
{
	public
		$title = 'Isotope'
		, $routes = [
			'games' => 'SeanMorris\Isotope\Route\GameRoute'
		]
	;

	function index($router)
	{
		header(sprintf('Location: /%s/games', $router->path()->pathString()));
	}
}
