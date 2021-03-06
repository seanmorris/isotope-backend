import { Config     } from 'Config';
import { Repository } from 'curvature/base/Repository';
import { Toast      } from 'curvature/toast/Toast';
import { ToastAlert } from 'curvature/toast/ToastAlert';
import { View       } from 'curvature/base/View';
import { Ball       } from './Ball';

export class Cell extends View
{
	constructor(args, root)
	{
		super(args);

		this.root = root;

		this.template   = require('./CellTemplate.html');
		this.delay      = 350;
		this.delayDrift = 100;
		this.max        = 3;
		this.icons    = {
			neutral: '●'
			// , minus: '-'
			// , plus:  '+'
			// , neutral: '○'
			, minus:   '○'
			, plus:    '●'
		};

		this.args.value         = 0;
		this.args.chained       = '';
		this.args.link          = 0;
		this.args.displayValue  = '';

		this.args.particles     = [];

		this.args.exploding     = false;
		this.args.lit           = false;
		this.args.owner         = null;
		this.args.previousOwner = null;
		this.args.mass          = null;
		this.args.lostMass      = 0;
		this.args.changed       = 'not';

		let icon = this.icons.neutral;

		this.args.bindTo('value', (v)=>{

			icon = this.icons.plus;

			if(v < 0)
			{
				icon = this.icons.minus;

				v*=-1;
			}

			if(v > 3)
			{
				v = 0;
			}
		
			this.args.displayValue = v;
		});

		this.args.bindTo('lit', (v)=>{
			if(!v)
			{
				return;
			}

			setTimeout(()=>{
				this.args.lit = false;
			}, 350 * ((this.args.value >= 3) ? 4 : 1));
		});

		this.args.bindTo('mass', (v,k,t,d,p)=>{
			if(this.args.previousOwner !== null)
			{
				if(this.args.previousOwner !== this.args.owner)
				{
					this.args.lostMass = -v || 0;
				}
			}
			else
			{
				this.args.previousMass = v;
			}

			if(p !== undefined)
			{
				this.args.changed = 'changed';
			}


			setTimeout(()=>{
				this.args.changed = 'not';
			}, 250 * (this.args.link+1));
		});

		this.args.bindTo('exploding', (v)=>{
			this.args.displayValue = this.args.value;
			if(!v)
			{
				return;
			}
			setTimeout(()=>{
				this.args.exploding = false;
			}, 350);
		});

		this.args.bindTo('chained', (v)=>{
			this.args.particles.map((particle)=>{
				particle.args.color = v
					? '#000'
					: '#FFF';
			});
		});

		this.args.bindTo('value', (v)=>{
			this.args.particles = [];

			for(let i = 0; i < v; i++)
			{
				let particle = new Ball({
					nucleus: v
					, index: parseInt(i)
					, color: this.args.chained 
						? '#000'
						: '#FFF'
				});

				this.args.particles.push(particle);
			}

			if(!v)
			{
				return;
			}
			setTimeout(()=>{
				this.args.lit = false;
			}, 350);
		});
	}

	click()
	{
		if(this.args.board.moving)
		{
			return;
		}

		this.sendMove();
	}

	sendMove()
	{
		this.root.socket.publish(`game:${this.args.board.args.gameId}`, JSON.stringify({
			type: 'move'
			, x: this.args.x
			, y: this.args.y
			, _t: (new Date()).getTime()
		}));
	}
}
