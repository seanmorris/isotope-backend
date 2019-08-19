import { View } from 'curvature/base/View';

export class Circle extends View
{
	constructor(args)
	{
		super(args);

		this.template   = require('./circle.tmp');
		this.args.color = 'FFF';
		this.args.repeatCount = 'indefinite';
	}
}