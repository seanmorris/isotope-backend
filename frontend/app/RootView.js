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

import { StatusBar } from './statusBar/StatusBar';

export class RootView extends View
{
	constructor(args = {})
	{
		super(args);

		this.args.toast     = Toast.instance();
		this.args.statusBar = new StatusBar;

		this.args.statusBar.args.state = 1;

		this.routes = {
			'':               a => new Lobby(a, this)
			, home:           a => new Lobby(a, this)
			, game:           a => new Board(a, this)
			, 'game/%gameId': a => new Board(a, this)
			, login:          Login
			, register:       Register
			, 'my-account':   Profile
			, create:         Create
			, allot:          require('allot/View').View
			, alot:           require('alot/View').View
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
			[[statusBar]]
		`;

		this.refreshSocket();
	}

	refreshSocket()
	{
		console.log('refresh');

		this.socket = Socket.get(Config.socketUri, true);

		this.socket.subscribe('open', (event) => {
			if(this.reconnecting)
			{
				clearInterval(this.reconnecting);
			}

			this.args.statusBar.args.state = 0;
		});

		this.args.authed = new Promise((accept)=>{
			this.socket.subscribe(`message`, (e, m, c, o, i, oc, p) => {
				if(m && m.substring(0,9) === '"authed &' && o == 'server')
				{
					return accept();
				}
				else
				{
				}
			});
		});


		this.socket.subscribe('close', (event) => {
			console.log('Disconnected!');

			this.args.statusBar.args.state = 2;

			this.reconnecting = setInterval(()=>{
				this.refreshSocket();
			}, 3000);
		});

		UserRepository.getCurrentUser(true).then(response => {
			return fetch('/auth?api', {credentials: 'same-origin'}).then((response)=>{
				return response.text();
			});
		}).then((tokenSource)=>{
			let token = JSON.parse(tokenSource);

			// console.log(this.socket.socket.OPEN, this.socket.socket.readyState, `auth ${token.body.string}`);

			return this.socket.send(`auth ${token.body.string}`);
		});	
	}
}
