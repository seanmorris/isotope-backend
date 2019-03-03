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

		let rand = Math.random() / 2000;

		this.onInterval(60, ()=>{
			let speed = 0.25;

			if(this.args.nucleus > 1)
			{
				speed = 0.333;
			}

			if(this.args.nucleus > 2)
			{
				speed = 0.666;
			}

			speed += rand;

			let seconds = (new Date).getTime() / (1000 / speed);

			let time = (seconds - this.args.offset) * Math.PI;

			if(this.args.color == '#FFF')
			{
				if(this.args.nucleus >= 3)
				{
					this.args.blur   = Math.sin(time*4)*2+6;
					this.args.radius = Math.abs(Math.sin(time))*2+8;
				}
				else
				{
					this.args.blur   = Math.sin(time*3)*2+8;
					this.args.radius = Math.abs(Math.sin(time))*2+6;
				}
			}
			else
			{
				this.args.blur   = Math.sin(time/2)*2+4;
				this.args.radius = 8;
			}
		});
	}
}
