import { View as BaseView } from 'curvature/base/View';

export class SampleRow extends BaseView
{
	constructor(args)
	{
		super(args);

		this.args.index  = this.args.index || 0;
		this.args.cells  = this.args.cells || {};
		this.args.time   = this.args.time  || 0;
		// this.args._cells = {};
		// this.debindCells = this.args.cells.bindTo((v,k)=>{
		// 	this.args[k] = v;
		// });

		let cellSource = Object.keys(this.args.cells).map((k)=>{
			return `<div>[[$cells.${k}]]</div>`;
		}).join('');

		this.template = `
			<div
				class   = "allot-row"
				style   = "--allot-index: [[index]]; --allot-percent: [[percent]];"
			>${cellSource}</div>
		`;

		this.preserve = true;

		// this.onInterval(10, ()=>{
		// 	this.args.time = (new Date).getTime();
		// });
		this.onInterval(10, ()=>{
			// this.args.time = (new Date).getTime();
			this.args.cells.time++;
		});
	}

	postRender()
	{
		this.onTimeout(1000, ()=>{
		});
	}

	remove()
	{
		// console.trace();
		// this.debindCells();
		this.template = '';
		// console.log('Remove!', this.args.cells.id);
		super.remove();
	}
}
