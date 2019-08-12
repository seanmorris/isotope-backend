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

		this.args.header     = false;
		// this.args.header     = true;
		this.args.cells      = [];//Array(1024).fill(0).map((x,y)=>y);
		this.args.autos      = 'auto';
		this.args.columns    = 3;
		this.args.rowHeight  = 240;
		this.args.rows       = 0;
		
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
	}

	postRender()
	{
		let scroller = this.tags.scroll;
		let showRows = Math.ceil(scroller.element.clientHeight / this.args.rowHeight);

		let source = Array(100).fill(0).map((v,k)=>{
			return {
				id: k
				, title: 'blah'
				, time:  (new Date).getTime()
			};
		});

		if(source instanceof RowProducer)
		{
			this.rowProducer = source;
		}
		else
		{
			// this.rowProducer = new RowProducer(source);
			this.rowProducer = new FizzBuzzProducer(source);
		}

		this.args.rows  = this.rowProducer.count();
		this.args.cells = Array(this.args.columns * (showRows+1)).fill();

		let topRow      = 0;
		let visibleRows = Math.ceil(scroller.element.clientHeight / this.args.rowHeight);

		this.refresh(topRow, visibleRows);
	}

	attachHandler(event){}
	scrollHandler(event)
	{
		let offset      = 0;
		let scroller    = this.tags.scroll;
		let scrolled    = scroller.element.scrollTop;

		scroller.element.focus();

		let topRow      = Math.floor(scrolled / this.args.rowHeight);
		let visibleRows = Math.ceil(scroller.element.clientHeight / this.args.rowHeight);
		let tableHeight = visibleRows * this.args.rowHeight;
		let bottomRow   = topRow + visibleRows;

		if(bottomRow <= this.args.rows)
		{
			if(this.args.header)
			{
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
			this.args.offset = (
				(this.rowProducer.count() * this.args.rowHeight)
				- tableHeight
			);

			this.refresh(topRow - 1, visibleRows );
		}
	}

	refresh(topRow, visibleRows)
	{
		let segment = this.rowProducer.segment(topRow, visibleRows);

		let segmentCells = [].concat(...segment.segment);

		this.args.cells.map((cell, index) => {
			if(this.args.header)
			{
				if(index < this.args.columns)
				{
					this.args.cells[index] = segment.header[index] || '';
					return;
				}
				this.args.cells[ index ] = segmentCells[ index - this.args.columns ];
			}
			else
			{
				this.args.cells[ index ] = segmentCells[ index ];
			}
		});
	}
}
