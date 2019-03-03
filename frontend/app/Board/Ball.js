import { Config     } from 'Config';
import { View       } from 'curvature/base/View';

export class Ball extends View
{
	constructor(args)
	{
		super(args);

		this.template   = require('./ball.tmp');
		
		this.args.size   = 100;
		this.args._size  = `${this.args.size}px`;

		this.args.bindTo('size', (v)=>{
			this.args._size = `${v}px`;
		});

		this.args.color = this.args.color || '#FFF';

		this.args.fillColor   = this.args.color;
		this.args.strokeColor = this.args.color;

		this.args.bindTo('color', (v)=>{
			this.args.fillColor   = v;
			this.args.strokeColor = v;
		});

		this.args.strokeWidth = 1;
		this.args.radius      = 7;
		this.args.blur        = 2;

		this.args.index   = this.args.index   || 0;
		this.args.nucleus = this.args.nucleus || 1;
		
		this.args.blur = 4;

		this.args.offset  = (
			(this.args.nucleus-this.args.index)
			 / this.args.nucleus
		);

		console.log(this.args.offset);

		this.onInterval(15, ()=>{
			let speed = 0.1;

			if(this.args.nucleus > 1)
			{
				speed = 0.5;
			}

			if(this.args.nucleus > 2)
			{
				speed = this.args.nucleus;
			}

			let seconds = (new Date).getTime() / (1000 / speed);

			let time = (seconds + this.args.offset) * Math.PI;

			this.args.blur = Math.abs(Math.sin(time))*4+4
		});
	}
}
