import { Config     } from 'Config';
import { Router     } from 'curvature/base/Router';
import { Repository } from 'curvature/base/Repository';
import { BaseForm   } from './BaseForm';

export class Register extends BaseForm
{
	constructor(args, path = '/user/register')
	{
		super(args, path);

		this.args.title = 'Create an Account'

		// Repository.request(
		// 	Config.backend + path
		// 	, {api: 'json'}
		// ).then((response)=>{
		// 	this.onResponse(response);
		// });
	}

	onResponse(response)
	{
		super.onResponse(response);

		if(response.body && response.body.id)
		{
			Router.go('/');
		}
	}
}
