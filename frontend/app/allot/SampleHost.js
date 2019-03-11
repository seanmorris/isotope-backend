// import { Config     } from 'Config';
// import { Repository } from 'curvature/base/Repository';
import { View as BaseView } from 'curvature/base/View';

export class SampleHost extends BaseView
{
	constructor(args)
	{
		super(args);

		this.template = require('./view.tmp');
	}
}
