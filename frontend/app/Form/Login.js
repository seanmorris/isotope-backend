import { Config     } from 'Config';
import { Router     } from 'curvature/base/Router';
import { Repository } from 'curvature/base/Repository';
import { BaseForm   } from './BaseForm';

export class Login extends BaseForm
{
	constructor(args, path = '/user/login')
	{
		super(args, path);

		this.args.title = 'Login';

		// Repository.request(
		// 	Config.backend + path
		// 	, {api: 'json'}
		// ).then((response)=>{
		// 	this.onResponse(response);
		// });
	}

	onResponse(response)
	{
		console.log(response);

		super.onResponse(response);

		if(response.body && response.body.id)
		{
			console.log(response.body.id);
			Router.go('/');
		}
	}
}
