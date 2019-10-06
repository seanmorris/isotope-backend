import { Config      } from 'Config';
import { RowProducer } from '../alot/RowProducer';
import { Repository  } from 'curvature/base/Repository';

export class GameRows extends RowProducer
{
	constructor(source, alot)
	{
		super(source, alot);

		this._count     = 0;
		this._realCount = 0;
		this._games     = [];

		Repository.request(Config.backend + '/games').then(response => {
			this._count     = response.meta.count*40000;
			this._realCount = response.meta.count;
			this._games     = response.body;

			alot.refreshDefault();
		});
	}

	count()
	{
		return this._count;
	}

	rowSource(index)
	{
		if(this.count() <= index || !this._games[index % this._realCount])
		{
			return {};
		}

		const game = this._games[index % this._realCount];

		return {
			id:        `${index % this._realCount}::${index}`
			, board:   `${game.boardData.width}x${game.boardData.height}`
			, players: `${game.players.length}/${game.maxPlayers}`
			, moves:   `${game.moves}/${game.maxMoves}`
			, '>':     `<a href = "/game/${game.publicId}">Spectate</a>`
		};
	}
}
