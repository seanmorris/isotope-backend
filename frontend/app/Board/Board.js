import { Config     } from 'Config';
import { Repository } from 'curvature/base/Repository';
import { View       } from 'curvature/base/View';
import { Toast      } from 'curvature/toast/Toast';
import { ToastAlert } from 'curvature/toast/ToastAlert';

import { Row  } from './Row';

import { UserRepository } from 'curvature/access/UserRepository';

export class Board extends View
{
	constructor(args, root)
	{
		super(args);

		this.root = root;

		let size = 9;

		this.moving    = false;
		this.args.rows = [];
		this.lastMove  = -1;
		this.args.currentPlayer = false;
		this.args.over = false;
		this.args.full = true;
		this.args.move = 0;
		this.args.button = {};
		this.args.button.disabled = 'disabled';

		this.args.flicker = '';

		this.args.bindTo('flicker', (v)=>{
			if(!v)
			{
				return;
			}
			this.onTimeout(250,()=>{
				this.args.flicker = '';
			});
		});

		this.playerNames = [
			'Red'
			, 'Blue'
			, 'Green'
		];

		this.root.args.bindTo('authed', v =>{

			if(!v)
			{
				return;
			}

			v.then(()=>{
				// console.log(this.socket.socket.readyState);

				root.socket.send('motd');

				// console.log(this.socket.socket.readyState);

				root.socket.subscribe(
					`message:game:${this.args.gameId}`
					, (e, m, c, o, i, oc, p) => {
						this.updateBoard(JSON.parse(m));
					}
				);

				this.cleanup.push(()=>{
					root.socket.unsubscribe(`message:game:${this.args.gameId}`);
				});
			});

		});


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
					}, this.root))
				}
			}

			this.onTimeout(100, ()=>{
				this.updateBoard(resp.body);

				document.dispatchEvent(new Event('renderComplete'));
			});
		});

		this.template = require('./BoardTemplate.html');
	}

	updateBoard(body)
	{
		this.args.playersCount = body.maxPlayers;

		if(body.players)
		{
			this.args.playersCount -= body.players.length;
			this.args.playersPlural = !(this.args.playersCount == 1);
		}

		for(let x = 0; x < this.args.width; x++)
		{
			for(let y = 0; y < this.args.height; y++)
			{
				let cell = this.cell(x, y);
				if(cell)
				{
					cell.args.value = body.boardData.data[x][y].mass;
					cell.args.owner = body.boardData.data[x][y].claimed;
					cell.args.chained = '';
				}
			}
		}

		if(body.chain)
		{
			this.chain(body.chain);
			this.lastMove = body.moves;
		}
		else if(body.chain.length === 1)
		{
			this.cell(body.chain[0][0], body.chain[0][1]).args.chained = 'chained';
		}
		
		if(body.chain.length >= 1)
		{
			this.cell(body.chain[0][0], body.chain[0][1]).args.lit = true;
		}

		this.args.currentPlayer = this.playerNames[body.currentPlayer];

		UserRepository.getCurrentUser(false).then((response)=>{
			// console.log(body.players[body.currentPlayer].publicId, response.body.publicId);
			if(body.players[body.currentPlayer].publicId === response.body.publicId)
			{
				if(!this.args.yourTurn)
				{
					this.args.flicker  = 'flicker';
				}
				this.args.yourTurn = true;
			}
			else
			{
				this.args.yourTurn        = false
				this.args.button.disabled = 'disabled';
			}
		}).catch((response)=>{
			if(response.messages)
			{
				for(let i in response.messages)
				{
					Toast.instance().pop(new ToastAlert({
						title: response.body && response.body.id
							? 'Error!'
							: 'Success!'
						, body: response.messages[i]
						, time: 9400
					}));
				}
			}
		});

		this.args.scores   = body.scores;

		// console.log(this.args.submoves);

		if(body.submoves)
		{
			this.args.submoves = body.submoves.map((s)=>{
				s = parseInt(s);
				return '●'.repeat(s) + '○'.repeat(3-s);
			});
		}

		this.args.over = false;

		if(body.moves >= body.maxMoves * body.maxPlayers)
		{
			this.args.over = true;
		}

		this.args.move = parseInt(body.moves / body.maxPlayers);

		this.args.roundsLeft = body.maxMoves - this.args.move;

		this.args.lastRound = false;

		if(this.args.roundsLeft == 1)
		{
			this.args.lastRound = true;
		}
		else if(this.args.roundsLeft < 0)
		{
			this.args.roundsLeft = 0;
		}

		this.args.maxMoves = body.maxMoves;

		// console.log(body.players.length);

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
		this.moving = true;

		for(let x = 0; x < this.args.width; x++)
		{
			for(let y = 0; y < this.args.height; y++)
			{
				let cell = this.cell(x, y);
				if(cell)
				{
					cell.args.chained = '';
				}
			}
		}

		let promises = [];

		for(let i in chain)
		{
			let x      = chain[i][0];
			let y      = chain[i][1];
			let t      = chain[i][2];
			let cM     = chain[i][3];
			let cC     = chain[i][4];
			let pM     = chain[i][5];
			let pC     = chain[i][6];
			let earned = chain[i][7];

			let cell = this.cell(x, y);

			cell.args.earned = earned;

			if(!cell.args.setback)
			{
				cell.args.setback = true;
				cell.args.owner   = pC;
				// cell.args.mass    = pM;
				cell.args.value   = pM;

				cell.args.previousMass  = pM;
				cell.args.previousOwner = pC;
			}

			cell.args.link    = t;

			let speed = 420;

			promises.push(new Promise((accept)=>{
				this.onTimeout(t*speed, ()=>{
					cell.args.setback   = false;
					cell.args.exploding = true;
					cell.args.value     = cM;
					if(cM > 3 || pM == 0)
					{
						cell.args.chained   = 'chained';
					}
				});
				this.onTimeout((t+1)*speed, ()=>{
					cell.args.chained   = 'chained';
					cell.args.owner     = cC;
					cell.args.mass      = cM;
					if(cM > 3)
					{
						cell.args.value = 0;
					}
					accept();
				});
			}));

		}

		Promise.all(promises).then(()=>{
			this.moving = false;
		});
	}

	refresh(callback)
	{
		Repository.request(
			Config.backend + '/games/' + this.args.gameId
			, {_t: (new Date()).getTime()}
		).then(callback);
	}

	pass()
	{
		this.root.socket.publish(`game:${this.args.gameId}`, JSON.stringify({
			type: 'pass'
		}));
	}

	join()
	{
		Repository.request(
			Config.backend + '/games/' + this.args.gameId + '/join'
			, {_t: (new Date()).getTime()}
		).catch(error=>{
			console.error(error);
		});
	}
}
