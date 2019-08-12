<?php
namespace SeanMorris\Isotope\Route;
class SocketRoute extends \SeanMorris\SubSpace\EntryRoute
{
	/**
	 * Auth via JWT.
	 */
	public function auth($router)
	{
		$path     = clone $router->path();
		$args     = $path->consumeNodes();
		$agent    = $router->contextGet('__agent');
		$clientId = $agent->id;

		if(count($args) < 1)
		{
			return [
				'error' => 'Please supply an auth token.'
			];
		}

		if($tokenContent = \SeanMorris\SubSpace\JwtToken::verify($args[0]))
		{
			$tokenContent = json_decode($tokenContent);

			if($tokenContent->uid)
			{
				$user = \SeanMorris\Access\User::loadOneByPublicId(
					$tokenContent->uid
				);

				if($user)
				{
					$router->contextSet('__authed', TRUE);
					$router->contextSet('__persistent', $user);

					$agent->contextSet('__persistent', $user);

					return 'authed & logged in.';
				}
			}

			$router->contextSet('__authed', TRUE);

			return 'authed.';
		}
	}
}
