import { View } from 'curvature/base/View';

import { Cell } from './Cell';

export class Row extends View
{
	constructor(args)
	{
		super(args);

		this.args.cells = [];

		if(this.args.width)
		{
			for(let i = 0; i < this.args.width; i++)
			{
				this.args.cells.push(new Cell({
					board: this.args.board
					, x:   i
					, y:   this.args.y
				}));
			}
		}

		this.template = require('./RowTemplate.html');
	}

	cell(x)
	{
		if(this.args.cells[x])
		{
			return this.args.cells[x];
		}

		return false;
	}
}
