<?php
namespace SeanMorris\Isotope\Theme;
class Theme extends \SeanMorris\Theme\Theme
{
	protected static
		$view = [
			'css' =>['/SeanMorris/Isotope/isotope.css']
			, 'SeanMorris\Isotope\Game' => [
				'single' => 'SeanMorris\Isotope\View\Board'
				, 'list' => 'SeanMorris\PressKit\Theme\Austere\ModelGrid'

			]
		];
}