import { View   } from 'curvature/base/View';
import { Circle } from './Circle';

export class StatusBar extends View
{
	constructor(args)
	{
		super(args);

		this.args.circle  = new Circle;
		this.args.yOffset = 0;

		this.template = require('./statusBar.tmp');

		this.args.state = 0;

		this.args.bindTo('state', v => {
			this.args.circle  = new Circle;
			// console.trace(v);
			switch(v)
			{
				case 0:
					this.args.circle.args.repeatCount = '1';
					this.args.status  = 'Connected';
					this.onTimeout(1500, ()=>{
						this.args.yOffset = 100;
					});
					// status
					break;
				case 1:
					this.args.circle.args.repeatCount = 'indefinite';
					this.args.status  = 'Connecting...';
					this.onTimeout(500, ()=>{
						this.args.yOffset = 0;
					});
					break;
				case 2:
					this.args.circle.args.repeatCount = 'indefinite';
					this.args.status  = 'Reconnecting...';
					this.onTimeout(500, ()=>{
						this.args.yOffset = 0;
					});
					break;
			}
		});
	}
}