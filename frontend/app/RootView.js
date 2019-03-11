import { Config     } from 'Config';
import { View     } from 'curvature/base/View';
import { Toast    } from 'curvature/toast/Toast';
import { Login    } from './Form/Login';
import { Create   } from './Form/Create';
import { Register } from './Form/Register';
import { Profile  } from './Access/Profile';

import { Lobby } from './Lobby/Lobby';
import { Board } from './Board/Board';

import { UserRepository } from 'curvature/access/UserRepository';

import { Socket } from 'subspace-client/Socket';

export class RootView extends View
{
	constructor(args = {})
	{
		super(args);

		this.args.toast = Toast.instance();

		this.socket = Socket.get(Config.socketUri);

		let authed;

		UserRepository.onChange((user)=>{
			authed = fetch('/auth?api', {credentials: 'same-origin'}).then((response)=>{
				return response.text();
			}).then((tokenSource)=>{
				let token = JSON.parse(tokenSource);

				this.socket.subscribe(`message`, (e, m, c, o, i, oc, p) => {
					if(m && m.substring(0,9) === '"authed &' && o == 'server')
					{
						return Promise.resolve();
					}
					else
					{
					}
				});

				return this.socket.send(`auth ${token.body.string}`);
			});
		});

		this.routes = {
			'':               Lobby
			, home:           Lobby
			, game:           a=>new Board(Object.assign(a,{authed}))
			, 'game/%gameId': a=>new Board(Object.assign(a,{authed}))
			, login:          Login
			, register:       Register
			, 'my-account':   Profile
			, create:         Create
			, allot:          require('allot/View').View
			, false:          '404!'
		};

		this.template = `
			[[toast]]
			<div class = "header">
				<a cv-link = "/">Isotope</a>
			</div>
			<div class = "main-box">
				[[content]]
			</div>
		`;

	}
}

