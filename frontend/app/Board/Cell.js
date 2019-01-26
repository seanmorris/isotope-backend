import { Config     } from 'Config';
import { Repository } from 'curvature/base/Repository';
import { Toast      } from 'curvature/toast/Toast';
import { ToastAlert } from 'curvature/toast/ToastAlert';
import { View       } from 'curvature/base/View';

import { Socket } from 'subspace-client/Socket';

export class Cell extends View
{
	constructor(args)
	{
		super(args);

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

		this.args.value        = 0;
		this.args.displayValue = '';
		this.args.exploding    = false;
		this.args.lit          = false;
		this.args.owner        = null;

		this.socket = Socket.get('ws://localhost:9998');

		this.args.bindTo('value', (v)=>{
			let icon = this.icons.neutral;

			if(this.args.exploding)
			{
				v = 4;
			}

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
		
			this.args.displayValue = icon.repeat(v);
		});

		this.args.bindTo('lit', (v)=>{
			if(!v)
			{
				return;
			}
			setTimeout(()=>{
				this.args.lit = false;
			}, 350);
		});

		this.args.bindTo('exploding', (v)=>{
			if(!v)
			{
				return;
			}
			setTimeout(()=>{
				this.args.exploding = false;
			}, 350);
		});
	}

	drawIcons(number)
	{
		let icon = this.icons.plus;

		if(number < 0)
		{
			icon = this.icons.minus;

			number*=-1;
		}

		if(number > 3)
		{
			number = 0;
		}

		if(!Number.isNumber(number))
		{
			return;
		}

		this.args.displayValue = icon.repeat(number);
	}

	// increment(step = 0)
	// {
	// 	if(step === 0)
	// 	{
	// 		this.args.board.setMoving(true);
	// 	}

	// 	this.args.value++;

	// 	let v    = this.args.value;

	// 	let left  = this.args.board.cell(this.args.x - 1, this.args.y);
	// 	let right = this.args.board.cell(this.args.x + 1, this.args.y);
	// 	let above = this.args.board.cell(this.args.x, this.args.y - 1);
	// 	let below = this.args.board.cell(this.args.x, this.args.y + 1);

	// 	if(v > this.max)
	// 	{
	// 		this.args.exploding = true;

	// 		v = 0;
	// 		this.args.value = 0;

	// 		setTimeout(
	// 			()=>{
	// 				this.args.exploding = false;

	// 				left  &&  left.increment(step+1);
	// 				below && below.increment(step+1);
	// 				above && above.increment(step+1);
	// 				right && right.increment(step+1);					
	// 			}
	// 			, this.delay
	// 		);
	// 	}
	// }

	click()
	{
		this.sendMove();
	}

	sendMove()
	{
		this.socket.publish(`game:${this.args.board.args.gameId}`, JSON.stringify({
			type: 'move'
			, x: this.args.x
			, y: this.args.y
			, _t: (new Date()).getTime()
		}));

		// Repository.request(
		// 	Config.backend
		// 	+ '/games/'
		// 	+ this.args.board.args.gameId
		// 	+ '/move'
		// 	, {
		// 		x: this.args.x
		// 		, y: this.args.y
		// 		, _t: (new Date()).getTime()
		// 	}
		// ).then(resp=>{
		// 	if(resp.messages.length)
		// 	{
		// 		for(let i in resp.messages)
		// 		{
		// 			Toast.instance().pop(new ToastAlert({
		// 				title: resp.code == 0
		// 					? 'Success!'
		// 					: 'Error!'
		// 				, body: resp.messages[i]
		// 				, time: 2400
		// 			}));
		// 		}
		// 	}
		// });
	}
}
