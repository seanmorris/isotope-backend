<?php
namespace SeanMorris\Isotope\Theme;
class Theme extends \SeanMorris\Theme\Theme
{
	protected static
		// $themes = ['SeanMorris\PressKit\Theme\Austere\Theme']
		$view = [
			'css' =>['SeanMorris/Isotope/isotope.css']
			// , 'js' =>['SeanMorris/Isotope/isotope.js']
			, 'SeanMorris\Isotope\Game' => [
				'single' => 'SeanMorris\Isotope\View\Board'
				, 'list' => 'SeanMorris\PressKit\Theme\Austere\ModelGrid'

			]
		]
		, $wrap = [
			'SeanMorris\PressKit\Theme\Austere\Page'
		];
}