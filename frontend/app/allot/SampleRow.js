import { View as BaseView } from 'curvature/base/View';

export class SampleRow extends BaseView
{
	constructor(args)
	{
		super(args);

		this.args.index = this.args.index || 0;
		this.args.time  = this.args.time  || 0;

		this.template   = `
			<div>[[index]]</div>
			<div>[[_title]]</div>
			<div>[[time]]</div>
		`;

		// this.preserve = true;

		// this.onInterval(10, ()=>{
		// 	this.args.time = (new Date).getTime();
		// });
	}
}
