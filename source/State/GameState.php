<?php
namespace SeanMorris\Isotope\State;
class GameState extends \SeanMorris\PressKit\State
{
	protected static
		$states	= [
			0 => [
				'create'	=> 'SeanMorris\Access\Role\User'
				, 'read'	 => 1
				, 'update'	 => [1, 'SeanMorris\Access\Role\Moderator']
				, 'delete'	 => [1, 'SeanMorris\Access\Role\Administrator']
				, '$id' => [
					'read' => TRUE
					, 'write' => FALSE
				]
				, '$publicId' => [
					'read' => TRUE
					, 'write' => FALSE
				]
				, '$created' => [
					'read' => TRUE
					, 'write' => FALSE
				]
				, '$maxPlayers' => [
					'read' => TRUE
					, 'write' => FALSE
				]
				, '$currentPlayer' => [
					'read' => TRUE
					, 'write' => FALSE
				]
				, '$state' => [
					'read' => TRUE
					, 'write' => FALSE
				]
				, '$boardData' => [
					'read' => TRUE
					, 'write' => FALSE
				]
				, '$class' => [
					'read' => TRUE
					, 'write' => FALSE
				]
				, '$chain' => [
					'read' => TRUE
					, 'write' => FALSE
				]
				, '$scores' => [
					'read' => TRUE
					, 'write' => FALSE
				]
				, '$players' => [
					'add'    => 'SeanMorris\Access\Role\User'
					, 'read' => TRUE
					, 'write' => FALSE
				]
			]
			, 1 => [
				'create'	=> 'SeanMorris\Access\Role\User'
				, 'read'	 => ['SeanMorris\Access\Role\User', 'SeanMorris\Access\Role\User']
				, 'update'	 => [1, 'SeanMorris\Access\Role\Moderator']
				, 'delete'	 => [1, 'SeanMorris\Access\Role\Administrator']
				, '$id' => [
					'read' => TRUE
					, 'write' => FALSE
				]
				, '$publicId' => [
					'read' => TRUE
					, 'write' => FALSE
				]
				, '$created' => [
					'read' => TRUE
					, 'write' => FALSE
				]
				, '$maxPlayers' => [
					'read' => TRUE
					, 'write' => FALSE
				]
				, '$currentPlayer' => [
					'read' => TRUE
					, 'write' => FALSE
				]
				, '$state' => [
					'read' => TRUE
					, 'write' => FALSE
				]
				, '$boardData' => [
					'read' => TRUE
					, 'write' => FALSE
				]
				, '$class' => [
					'read' => TRUE
					, 'write' => FALSE
				]
				, '$chain' => [
					'read' => TRUE
					, 'write' => FALSE
				]
				, '$scores' => [
					'read' => TRUE
					, 'write' => FALSE
				]
				, '$players' => [
					'add'    => 'SeanMorris\Access\Role\User'
					, 'read' => TRUE
					, 'write' => FALSE
				]
			]
			, -1 => [
				'create'	=> 'SeanMorris\Access\Role\User'
				, 'read'	 => ['SeanMorris\Access\Role\User', 'SeanMorris\Access\Role\User']
				, 'update'	 => [1, 'SeanMorris\Access\Role\Moderator']
				, 'delete'	 => [1, 'SeanMorris\Access\Role\Administrator']
				, '$id' => [
					'read' => TRUE
					, 'write' => FALSE
				]
				, '$publicId' => [
					'read' => TRUE
					, 'write' => FALSE
				]
				, '$created' => [
					'read' => TRUE
					, 'write' => FALSE
				]
				, '$maxPlayers' => [
					'read' => TRUE
					, 'write' => FALSE
				]
				, '$currentPlayer' => [
					'read' => TRUE
					, 'write' => FALSE
				]
				, '$state' => [
					'read' => TRUE
					, 'write' => FALSE
				]
				, '$boardData' => [
					'read' => TRUE
					, 'write' => FALSE
				]
				, '$class' => [
					'read' => TRUE
					, 'write' => FALSE
				]
				, '$chain' => [
					'read' => TRUE
					, 'write' => FALSE
				]
				, '$scores' => [
					'read' => TRUE
					, 'write' => FALSE
				]
				, '$players' => [
					'add'    => 'SeanMorris\Access\Role\User'
					, 'read' => TRUE
					, 'write' => FALSE
				]
			]
		]
		, $transitions = [
			0 => [
				-1 => 'SeanMorris\Access\Role\User'
				, 1 => 'SeanMorris\Access\Role\User'
			]
		];
}