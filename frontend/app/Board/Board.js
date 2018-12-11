import { Config     } from 'Config';
import { Repository } from 'curvature/base/Repository';
import { View       } from 'curvature/base/View';

import { Row } from './Row';

export class Board extends View
{
	constructor(args)
	{
		super(args);

		let size = 9;

		this.moving    = false;
		this.args.rows = [];
		this.lastMove  = -1;
		this.args.currentPlayer = false;
		this.args.over = false;
		this.args.full = true;
		this.args.move = 0;

		this.playerNames = [
			'Red'
			, 'Blue'
			, 'Green'
		];

		this.refresh(resp=>{
			this.args.height = resp.body.boardData.height;
			this.args.width  = resp.body.boardData.width;

			if(this.args.height)
			{
				for(let i = 0; i < this.args.height; i++)
				{
					this.args.rows.push(new Row({
						board:  this
						, width: this.args.width
						, y:     i
					}))
				}
			}

			this.onTimeout(1, ()=>{
				this.updateBoard(resp)

				document.dispatchEvent(new Event('renderComplete'));
			});
		});

		this.template = require('./BoardTemplate.html');

		this.onInterval(1000, ()=>{
			this.refresh(resp=>this.updateBoard(resp));
		});
	}

	updateBoard(resp)
	{
		let body = resp.body;

		for(let x = 0; x < this.args.width; x++)
		{
			for(let y = 0; y < this.args.height; y++)
			{
				let cell = this.cell(x, y);
				if(cell)
				{
					cell.args.value = body.boardData.data[x][y].mass;
					cell.args.owner = body.boardData.data[x][y].claimed;
				}
			}
		}

		if(this.lastMove < body.moves && body.chain && body.chain.length > 1)
		{
			this.chain(body.chain);
			this.lastMove = body.moves;
		}
		
		if(body.chain.length >= 1)
		{
			this.cell(body.chain[0][0], body.chain[0][1]).args.lit = true;
		}

		this.args.currentPlayer = this.playerNames[body.currentPlayer];

		this.args.scores = this.args.scores || [];

		for(let i in body.scores)
		{
			this.args.scores[i] = this.args.scores[i];
		}

		this.args.over = false;

		if(body.moves >= body.maxMoves * body.maxPlayers)
		{
			this.args.over = true;
		}

		this.args.move     = parseInt(body.moves / body.maxPlayers);
		this.args.maxMoves = body.maxMoves;

		if(body.players.length < body.maxPlayers)
		{
			this.args.full = false;
		}
		else
		{
			this.args.full = true;
		}
	}

	cell(x, y)
	{
		if(this.args.rows[y])
		{
			return this.args.rows[y].cell(x);
		}

		return false;
	}

	chain(chain)
	{
		for(let i in chain)
		{
			let x    = chain[i][0];
			let y    = chain[i][1];
			let t    = 0;
			if(chain[i][2])
			{
				t    = chain[i][2];
			}
			let cell = this.cell(x, y);

			this.onTimeout(t*200, ()=>{
				cell.args.exploding = true;
			});
		}
	}

	setMoving(moving)
	{
		this.moving = moving;
	}

	refresh(callback)
	{
		Repository.request(
			Config.backend + '/games/' + this.args.gameId
			, {_t: (new Date()).getTime()}
		).then(callback);
	}

	join()
	{
		Repository.request(
			Config.backend + '/games/' + this.args.gameId + '/join'
			, {_t: (new Date()).getTime()}
		).then(()=>{

		});
	}
}