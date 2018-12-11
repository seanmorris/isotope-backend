import { Config         } from 'Config';
import { Repository     } from 'curvature/base/Repository';
import { UserRepository } from 'curvature/access/UserRepository';
import { View           } from 'curvature/base/View';

export class Profile extends View
{
	constructor(args)
	{
		super(args);
		this.template = require('./ProfileTemplate.html');

		this.args.user = {
			id: 0
			, username: ''
			, publicId: ''
			, 
		};

		UserRepository.getCurrentUser(1).then((resp)=>{
			Object.keys(resp.body).map((k)=>{
				this.args.user[k] = resp.body[k];
			});
		});
	}
}
