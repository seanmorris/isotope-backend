// import { Config     } from 'Config';
// import { Repository } from 'curvature/base/Repository';

import { SampleRow } from './SampleRow';
import { Clock     } from './Clock';

import { View as BaseView } from 'curvature/base/View';

export class View extends BaseView
{
	static source(symbol, set)
	{
		if(!this._source)
		{
			this._source = [];
		}

		if(set)
		{
			this._source[symbol] = set;
		};

		return this._source[symbol];
	}

	constructor(args, source)
	{
		super(args);

		this.template = require('./view.tmp');

		this.args.rowHeight = this.args.rowHeight || 128;
		this.args.offset    = 0;
		this.args.topRow    = 0;
		this.args.rows      = this.args.rows || [];
		this.args.header    = this.args.header
			? new SampleRow({cells: this.args.header})
			: null;

		this.sourceSymbol   = Symbol();
		this.indexSymbol    = Symbol();
		this.prevSymbol     = Symbol();

		// View.source(this.sourceSymbol, source || []);

		this.args.newRows   = [];

		this.args.newRows.bindTo((v,k)=>{
			if(this.args.newRows.length)
			{
				console.log(this.args.newRows.filter(z=>z).join(','));
			}

			while(this.args.newRows.length)
			{
				this.args.newRows.pop();
			}
			
		},{wait:100});

		View.source(this.sourceSymbol, Array(1000*10).fill(0).map((v,k)=>{
			let rand = parseInt(Math.random()*50);
			let args = {
				cells: {
					id:     String(1+k).padStart(6,'0')
					, x:    new Clock
					, time: 0
				}
			};

			return args;
		}));

		this.mapper = (v,k) => {
			let row = new SampleRow(v);

			row.preserve = true;

			row.args.percent = k / View.source(this.sourceSymbol).length;

			return row;
		};
	}

	source(source)
	{
		View.source(this.sourceSymbol, source || []);

		this.args.shimHeight = View.source(this.sourceSymbol).length * this.args.rowHeight;
	}

	postRender()
	{
		let attachListener = (event)=>{
			if(event.target !== this.tags.scroller.element)
			{
				return;
			}
			
			this.refresh(
				this.tags.scroller.element.scrollTop
				, this.tags.scroller.element.clientHeight
			);
		};

		this.refresh(
			this.tags.scroller.element.scrollTop
			, this.tags.scroller.element.clientHeight
		);

		this.tags.scroller.element.addEventListener('cvDomAttached', attachListener);

		this.args.shimHeight = View.source(this.sourceSymbol).length * this.args.rowHeight;

		if(this.args.header)
		{
			this.args.shimHeight += this.args.rowHeight;
		}
	}

	scrollHandler(event)
	{
		let current = document.activeElement;

		this.refresh(
			event.target.scrollTop
			, event.target.clientHeight
		);

		if(current && document.body.contains(current))
		{
			current.focus();
		}
		else
		{
			event.target.focus();
		}
	}

	refreshDefault()
	{
		if(!this.tags.scroller)
		{
			return;
		}

		this.refresh(
			this.tags.scroller.element.scrollTop
			, this.tags.scroller.element.clientHeight
		);
	}

	refresh(top, viewportHeight)
	{
		if(this._refresher)
		{
			clearTimeout(this._refresher);
		}

		this._refresher = setTimeout(()=>{
			this._refresh(top, viewportHeight)
		}, 0);
	}

	_refresh(top, viewportHeight)
	{
		this.args.position = Math.floor(top);

		let showRows = Math.ceil(viewportHeight / this.args.rowHeight) + 1;

		if(!this.args.header)
		{
		}

		showRows++;

		this.args.topRow = parseInt(this.args.position / this.args.rowHeight);
		this.args.offset = -this.args.position % this.args.rowHeight;

		// let existing = [];

		// for(let i in this.args.rows)
		// {
		// 	if(this.args.rows[i])
		// 	{
		// 		existing[i] = this.args.rows[i];
		// 		existing[i][this.prevSymbol] = i;
		// 	}
		// }

		// this.args.rows = [];

		while(this.args.rows.length)
		{
			if(!this.args.rows[0])
			{
				this.args.rows.shift();
				continue;
			}

			if(this.args.rows[0][this.indexSymbol] < this.args.topRow)
			{
				this.args.rows.shift().remove();
				continue;
			}

			break;
		}

		while(this.args.rows.length)
		{
			if(!this.args.rows[this.args.rows.length-1])
			{
				this.args.rows.pop();
				continue;
			}

			if(this.args.rows[this.args.rows.length-1][this.indexSymbol] >= (this.args.topRow + showRows))
			{
				this.args.rows.pop().remove();
				continue;
			}

			break;
		}

		// this.args.rows.splice(showRows).map(x=>x.remove());

		for(let i = 0; i < showRows; i++)
		{
			let ia = i + this.args.topRow;

			if(ia+1 > View.source(this.sourceSymbol).length)
			{
				continue;
			}

			if(!this.args.rows[i])
			{
				this.args.newRows.push(ia);
			}

			this.args.rows[i] = this.mapper(
				View.source(this.sourceSymbol)[ia], ia
			);

			this.args.rows[i][this.indexSymbol] = ia;
		}

	}

	reverse(event)
	{
		View.source(this.sourceSymbol).reverse();
		this.refreshDefault();
	}

	unshift()
	{
		let rand = parseInt(Math.random()*50);
		let k    = -1;

		this.args.source.unshift({
			index:        String(k).padStart(6,'0')
			, title:      rand
			, time:       0
			, _title:     rand + ' ' + 'x'.repeat(rand)
		});

		console.log(this.args.source.shift);
	}

	shift()
	{
		this.args.source.shift();
	}

	sort(event, column)
	{
		View.source(this.sourceSymbol).sort((a,b)=>{
			return a[column] - b[column]
		});

		this.refreshDefault();
	}
}