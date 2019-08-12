import { Config         } from 'Config';
// import { Cookie         } from 'curvature/base/Cookie';
import { UserRepository } from 'curvature/access/UserRepository';
import { Repository     } from 'curvature/base/Repository';
import { View           } from 'curvature/base/View';
import { View as Allot  } from '../allot/View';

export class Lobby extends View
{
	constructor(args)
	{
		super(args);

		this.args.elipses = '...';
		this.template     = require('./LobbyTemplate.html');

		this.args.games       = [];
		this.args.gamesFound  = 0;
		this.args.searching   = false;

		this.args.currentUserId = null;

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
		this.args.games     = [];

		// this.args.list.refresh();

		let args = event ? {t: Date.now()} : null;

		return Repository.request(
			Config.backend + '/games'
			, args
		).then(resp=>{
			this.args.games     = resp.body;
			this.args.searching = false;
		});
	}

	logout(event)
	{
		event.preventDefault();
		UserRepository.logout();
		this.findGames();
		this.args.currentUserId = null;
	}
}
