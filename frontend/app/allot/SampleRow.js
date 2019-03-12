import { View as BaseView } from 'curvature/base/View';

export class SampleRow extends BaseView
{
	constructor(args)
	{
		super(args);

		this.args.index = this.args.index || 0;
		this.args.cells = this.args.cells || [];
		this.args.time  = this.args.time  || 0;

		let cellSource = this.args.cells.map((v,k)=>{
			return `<div>[[$cells.${k}]]</div>`
		}).join('');

		this.template   = `
			<div
				class   = "allot-row"
				style   = "--allot-index: [[index]]; --allot-percent: [[percent]];"
			>${cellSource}</div>
		`;

		// this.preserve = true;

		// this.onInterval(10, ()=>{
		// 	this.args.time = (new Date).getTime();
		// });
	}
}
