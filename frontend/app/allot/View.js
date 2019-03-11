// import { Config     } from 'Config';
// import { Repository } from 'curvature/base/Repository';

import { SampleRow } from './SampleRow';

import { View as BaseView } from 'curvature/base/View';

export class View extends BaseView
{
	static source(set)
	{
		if(set)
		{
			this._source = set;
		};

		return this._source;
	}

	constructor(args)
	{
		super(args);

		this.template  = require('./view.tmp');


		this.args.rowHeight  = 120;
		this.args.offset     = 0;
		this.args.topRow     = 0;

		this.args.rows   = [];

		let source = [];

		Object.defineProperty(this, 'source', {
			get:            () => source
			, set:          () => {}
			, enumerable:   false
			, configurable: false
			, arbitrary:    true
		});

		Object.getOwnPropertyDescriptors(this).source.get.lol = 'wow';

		View.source(Array(1000*500).fill(0).map((v,k)=>{
			let rand = parseInt(Math.random()*50);

			return {
				index:        String(k).padStart(5,'0')
				, title:      rand
				, time:       (new Date).getTime()
				, _title:     rand + ' ' + 'x'.repeat(rand)
			};
		}));

		this.mapper = (v,k) => {
			let row = new SampleRow(v);

			row.args.percent = k / View.source().length;

			return row;
		};

		this.cacher = () => {
			return false;
		};

		this.args.header = new SampleRow;
		
		this.args.header.args.index  = 'id';
		this.args.header.args._title = 'title';
		this.args.header.args.time   = 'time';
	}

	postRender()
	{
		this.refresh(
			this.tags.scroller.element.scrollTop
			, this.tags.scroller.element.scrollHeight
			, this.tags.scroller.element.clientHeight
		);

		this.args.shimHeight = View.source().length * this.args.rowHeight;

		if(this.args.header)
		{
			this.args.shimHeight += this.args.rowHeight;
		}

		console.log(this.source, Object.getOwnPropertyDescriptors(this).source.get.lol);
	}

	scrollHandler(event)
	{
		let current = document.activeElement;

		this.refresh(
			event.target.scrollTop
			, event.target.scrollHeight
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
		this.refresh(
			this.tags.scroller.element.scrollTop
			, this.tags.scroller.element.scrollHeight
			, this.tags.scroller.element.clientHeight
		);
	}

	refresh(top, height, viewportHeight)
	{
		this.args.position = parseInt(top);
		this.args.height   = parseInt(height);

		let showRows = Math.ceil(viewportHeight / this.args.rowHeight) + 1;

		this.args.topRow  = parseInt(this.args.position / this.args.rowHeight);
		this.args.offset  = -this.args.position % this.args.rowHeight;
		this.args.percent = parseInt(this.args.position / this.args.height * 100);

		for(let i = 0; i < showRows; i++)
		{
			let ia = i + this.args.topRow;

			if(ia >= View.source().length)
			{
				this.args.rows.splice(i,1).map(x=>x.remove());
				continue;
			}

			this.args.rows[i] = this.mapper(View.source()[ia], ia) || '';
		}

		this.args.rows.splice(showRows - 1).map(x=>x.remove());

	}

	reverse(event)
	{
		View.source().reverse();
		this.refreshDefault();
	}

	unshift()
	{
		let rand = parseInt(Math.random()*50);
		let k    = -1;

		this.args.source.unshift({
			index:        String(k).padStart(5,'0')
			, title:      rand
			, time:       (new Date).getTime()
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
		View.source().sort((a,b)=>{
			return a[column] - b[column]
		});

		this.refreshDefault();
	}
}