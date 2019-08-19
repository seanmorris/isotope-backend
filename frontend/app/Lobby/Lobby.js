import { Config         } from 'Config';
// import { Cookie         } from 'curvature/base/Cookie';
import { UserRepository } from 'curvature/access/UserRepository';
import { Repository     } from 'curvature/base/Repository';
import { Router         } from 'curvature/base/Router';
import { View           } from 'curvature/base/View';
import { View as Allot  } from '../allot/View';

export class Lobby extends View
{
	constructor(args, root)
	{
		super(args);

		this.root = root;

		this.args.elipses = '...';
		this.template     = require('./LobbyTemplate.html');

		this.args.games       = [];
		this.args.gamesFound  = 0;
		this.args.searching   = false;

		this.args.page = 0;

		this.args.currentUserId = null;

		this.socket = root.socket;

		// this.args.list = new Allot({
		// 	rowHeight: 42
		// 	, header:  [
		// 		'board'
		// 		, 'players'
		// 		, 'moves'
		// 		, ''
		// 	]
		// });

		this.args.bindTo('games', (v)=>{
			if(!v)
			{
				return;
			}

			this.args.gamesFound = v.length;

			// this.args.list.source(v.map(vv=>{
			// 	return {cells:[
			// 		`${vv.boardData.width} x ${vv.boardData.height}`
			// 		, `${vv.players.length} / ${vv.maxPlayers}`
			// 		, `${Math.floor(vv.moves/vv.maxPlayers)} / ${vv.maxMoves}`
			// 		, `<a href = "/game/${vv.publicId}"><button>go </button></a>`
			// 	]};
			// }));

			// this.args.list.refreshDefault();
		});

		this.onInterval(150, ()=>{
			this.incrementElipses();
		});

		UserRepository.getCurrentUser(1).then((resp)=>{
			this.args.currentUserId = resp.body.publicId;
		});

		this.findGames().then(()=>{
			document.dispatchEvent(new Event('renderComplete'));
		});
	}

	postRender()
	{
		// this.args.list.refreshDefault();
	}

	incrementElipses()
	{
		if(this.args.elipses.length >= 3)
		{
			this.args.elipses = '';
		}
		else
		{
			this.args.elipses += '.';
		}
	}

	findGames(event = null)
	{
		event && event.preventDefault();

		this.args.searching = true;
		this.args.games     = this.args.games || [];

		// this.args.list.refresh();

		if(Array.isArray(this.args.games))
		{
			this.args.games.map(g => {
				this.root.socket.unsubscribe(`message:game:${g.publicId}`);
			});
		}

		let args = {
			page: this.args.page
			, t:   Date.now()
		};

		return Repository.request(
			Config.backend + '/games'
			, args
		).then(resp=>{
			this.args.games     = resp.body;
			this.args.searching = false;

			if(Array.isArray(this.args.games))
			{
				if(this.authBound)
				{
					this.authBound.map(a=>a());
				}

				this.authBound = this.args.games.map(g => {
					const game = g.___ref___;

					game.__full      = g.players.length == g.maxPlayers;
					game.playerCount = g.players.length;
					game.moves       = parseInt(game.moves / game.maxPlayers);

					game.__mine      = false;

					if(g.players)
					{
						UserRepository.getCurrentUser(false).then(r=>{
							game.__mine = !!game.players.filter(p => {
								if(!r || !r.body)
								{
									return false;
								}
								return p.publicId == r.body.publicId;
							}).length;
						});
					}

					const authBound = this.root.args.bindTo('authed', v =>{

						if(!v)
						{
							return;
						}

						v.then(()=>{
							this.root.socket.subscribe(
								`message:game:${g.publicId}`
								, (e, m, c, o, i, oc, p) => {

									const update = JSON.parse(m);

									game.playerCount = update.players.length;
									game.moves       = parseInt(update.moves / update.maxPlayers);;
									game.__full      = update.players.length == update.maxPlayers;

									game.__mine      = false;

									if(update.players)
									{
										UserRepository.getCurrentUser(false).then(r=>{
											if(!r)
											{
												game.__mine = false;
												return;
											}
											game.__mine = !!update.players.filter(p => {
												return p.publicId == r.body.publicId;
											}).length;
										});
									}
								}
							);
						});
					});

					const clean = ()=>{
						authBound()
						this.root.socket.unsubscribe(`message:game:${game.publicId}`);
					};

					this.cleanup.push(clean);

					return clean;
				});
			}
		});
	}

	logout(event)
	{
		event.preventDefault();
		UserRepository.logout();
		this.findGames();
		this.args.currentUserId = null;
	}

	previousPage(event)
	{
		if(this.args.page > 0)
		{
			this.args.page--;
			Router.setQuery('page', this.args.page);
		}
		this.findGames(event);
	}

	nextPage(event)
	{
		if(this.args.games.length)
		{
			this.args.page++;
			Router.setQuery('page', this.args.page);
		}
		this.findGames(event);
	}
}
