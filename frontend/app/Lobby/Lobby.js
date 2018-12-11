import { Config         } from 'Config';
import { Cookie         } from 'curvature/base/Cookie';
import { Repository     } from 'curvature/base/Repository';
import { UserRepository } from 'curvature/access/UserRepository';
import { View           } from 'curvature/base/View';

export class Lobby extends View
{
	constructor(args)
	{
		super(args);

		this.args.elipses = '...';
		this.template     = require('./LobbyTemplate.html');

		this.args.games       = 0;
		this.args.gamesFound  = 0;
		this.args.searching   = false;

		this.args.currentUserId = null;

		this.args.bindTo('games', (v)=>{
			if(!v)
			{
				console.log(v);
				return;
			}
			this.args.gamesFound = v.length;
		});

		this.onInterval(150, ()=>{
			this.incrementElipses();
		});

		if(!Cookie.get('prerenderer'))
		{
			UserRepository.getCurrentUser(1).then((resp)=>{
				this.args.currentUserId = resp.body.publicId;
			});
		}
		
		this.findGame().then(()=>{
			document.dispatchEvent(new Event('renderComplete'));
		});
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

	findGame(event = null)
	{
		event && event.preventDefault();
		this.args.searching = true;

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
		this.findGame();
		this.args.currentUserId = null;
	}
}
