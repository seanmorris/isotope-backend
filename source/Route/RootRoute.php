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
		if(isset($_SERVER['HTTP_REFERER']) && $corsDomains = \SeanMorris\Ids\Settings::read('corsDomains'))
		{
			$referrer = parse_url($_SERVER['HTTP_REFERER']);
			$referrerDomain = sprintf('%s://%s', $referrer['scheme'], $referrer['host']);

			if(isset($referrer['port']))
			{
				$referrerDomain .= ':' . $referrer['port'];
			}

			$corsDomainsIndex = array_flip($corsDomains);

			if(isset($corsDomainsIndex[$referrerDomain]))
			{
				$index = $corsDomainsIndex[$referrerDomain];

				header(sprintf('Access-Control-Allow-Origin: %s', $corsDomains[$index]));
				header('Access-Control-Allow-Credentials: true');
				header('Access-Control-Allow-Methods: GET,POST');
				header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
			}
		}
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
