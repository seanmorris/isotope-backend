// import { Config     } from 'Config';
// import { Repository } from 'curvature/base/Repository';
import { RowProducer      } from './RowProducer';
import { FizzBuzzProducer } from './FizzBuzzProducer';
import { View as BaseView } from 'curvature/base/View';

export class View extends BaseView
{
	constructor(args, source)
	{
		super(args);

		this.args.header = args.header !== undefined
			? args.header
			: false;

		this.args.cells      = [];
		this.args.autos      = 'auto';
		this.args.columns    = 1;
		this.args.rowHeight  = this.args.rowHeight || 24;
		this.args.rows       = 0;

		this.lastScroll      = null;
		this.lastTopRow      = 0;
		
		this.args.offset     = 0;
		this.args.cellOffset = 0;

		this.args.bindTo('columns', (v)=>{
			this.args.autos    = Array(v).fill('auto').join(' ');
			this.args.columnsP = 1 + v;
		});

		this.args.bindTo('rows', (v)=>{
			this.args.shimHeight = this.args.rowHeight * (
				v + Number(!!this.args.header)
			);
		});

		this.template = require('./view.tmp');

		this.source = source;

		if(source instanceof RowProducer)
		{
			this.rowProducer = source;
		}
		else if(RowProducer.isPrototypeOf(source))
		{
			this.rowProducer = new source({}, this);
		}
		else
		{
			this.rowProducer = new FizzBuzzProducer(this.source, this);
		}
	}

	postRender()
	{
		this.refreshDefault();
	}

	attachHandler(event){}
	scrollHandler(event)
	{
		let offset      = 0;
		let scroller    = this.tags.scroll;
		let scrolled    = scroller.element.scrollTop;
		let visibleRows = Math.ceil(scroller.element.clientHeight / this.args.rowHeight);

		let showRows = Math.ceil(scroller.element.clientHeight / this.args.rowHeight);

		this.args.rows = this.rowProducer.count();

		if(scroller.element.offsetHeight + scrolled >
			scroller.element.scrollHeight - this.args.rowHeight
		){
			// return;
		}

		if(this.lastScroll == scrolled)
		{
			return;
		}

		this.lastScroll = scrolled;

		this.viewLists.cells.pause();

		this.args.cells = Array(this.args.columns * (visibleRows+1)).fill('');

		this.args.total = this.args.cells.length;

		scroller.element.focus();

		let topRow      = Math.floor(scrolled / this.args.rowHeight);
		let tableHeight = visibleRows * this.args.rowHeight;
		let bottomRow   = topRow + visibleRows;

		console.log(bottomRow, this.args.rows);

		if(bottomRow <= this.args.rows)
		{
			this.args.offset = (
				Math.floor(scrolled / this.args.rowHeight)
				* this.args.rowHeight
			);

			this.refresh(topRow, visibleRows);

			if(this.args.header)
			{
				visibleRows++;

				this.args.offset = (
					Math.floor(scrolled / this.args.rowHeight)
					* this.args.rowHeight
				);

				this.refresh(topRow, visibleRows);
			}
			else
			{
				if(bottomRow < this.args.rows)
				{
					this.args.offset = (
						Math.floor(scrolled / this.args.rowHeight)
						* this.args.rowHeight
					);

					this.refresh(topRow, visibleRows);
				}
				else
				{
					this.args.offset = (
						Math.floor(scrolled / this.args.rowHeight)
						* this.args.rowHeight
					) - this.args.rowHeight;

					this.refresh(topRow - 1, visibleRows);
				}
			}
		}
		else
		{
			if(this.args.header && topRow > this.lastTopRow)
			{
				topRow = this.lastTopRow;
				visibleRows++;
			}

			this.args.offset = (
				Math.floor(this.rowProducer.count() * this.args.rowHeight)
				- tableHeight
			);

			this.refresh(topRow, visibleRows);
		}

		this.viewLists.cells.pause(false);
	}

	refreshDefault()
	{
		let scroller    = this.tags.scroll;
		let topRow      = 0;
		let visibleRows = Math.ceil(scroller.element.clientHeight / this.args.rowHeight);

		this.refresh(topRow, visibleRows);
	}

	refresh(topRow, visibleRows)
	{
		let scroller    = this.tags.scroll;

		this.args.rows  = this.rowProducer.count();

		if(visibleRows > this.args.rows)
		{
			visibleRows = this.args.rows;

			// if(this.args.header)
			// {
			// 	visibleRows++;
			// }
		}

		let segment = this.rowProducer.segment(topRow, visibleRows);

		// if(segment.segment.length >= visibleRows)
		// {
		// 	this.lastTopRow = topRow;
		// }
		// else
		// {
		// 	topRow = this.lastTopRow;
		// }

		console.log(segment.segment.length, visibleRows, topRow);

		if(!segment || !segment.segment)
		{
			return;
		}

		this.args.columns = segment.segment
			.map( s => s.length )
			.sort( (a,b) => a-b )
			.reverse()[0];

		const showCells = visibleRows * this.args.columns;

		if(this.args.cells.length < showCells)
		{
			for(let i = this.args.cells.length; i < showCells; i++)
			{
				this.args.cells[i] = '';
			}

			this.args.total = this.args.cells.length;
		}

		// while(this.args.cells.length + (this.args.header ? 0:this.args.columns) > showCells)
		// {
		// 	this.args.cells.pop();
		// }

		let segmentCells = [].concat(...segment.segment);

		this.viewLists.cells.pause();

		this.args.cells.map((cell, index) => {
			if(this.args.header)
			{
				if(index < this.args.columns)
				{
					this.args.cells[index] = segment.header[index] || '';

					return;
				}

				if(segmentCells[ index - this.args.columns ] !== undefined)
				{
					this.args.cells[ index ] = segmentCells[ index - this.args.columns ];
				}
				else
				{
					// delete this.args.cells[ index ];
				}
			}
			else
			{
				this.args.cells[ index ] = segmentCells[ index ];
			}
		});

		this.viewLists.cells.pause(false);
		this.viewLists.cells.reRender();
	}
}
