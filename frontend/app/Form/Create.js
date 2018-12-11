import { Router     } from 'curvature/base/Router';
import { BaseForm   } from './BaseForm';

export class Create extends BaseForm
{
	constructor(args, path = '/games/create')
	{
		super(args, path);

		this.args.title = 'Create Game'
	}

	onResponse(response)
	{
		super.onResponse(response);

		if(response.body && response.body.id)
		{
			Router.go('/game/' + response.body.publicId);
		}
	}
}
