import { View     } from 'curvature/base/View';
import { Toast    } from 'curvature/toast/Toast';
import { Login    } from './Form/Login';
import { Create   } from './Form/Create';
import { Register } from './Form/Register';
import { Profile  } from './Access/Profile';

import { Lobby } from './Lobby/Lobby';
import { Board } from './Board/Board';

export class RootView extends View
{
	constructor(args = {})
	{
		super(args);

		this.args.toast = Toast.instance();

		this.routes = {
			'':               Lobby
			, home:           Lobby
			, game:           Board
			, 'game/%gameId': Board
			, login:          Login
			, register:       Register
			, 'my-account':   Profile
			, create:         Create
			, false:          '404!'
		};

		this.template = `
			[[toast]]
			<div
				class = "main-box"
				style = "
					width: 100%;
					max-width: 900px;
					margin: auto;
					position: relative;"
			>
				[[content]]
			</div>
		`;

	}
}

