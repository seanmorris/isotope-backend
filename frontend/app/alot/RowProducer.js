import { View } from 'curvature/base/View';

export class RowProducer
{
	constructor(source, alot)
	{
		Object.defineProperty(this, 'source', {
			enumerable: false
			, writable: false
			, value:    source
		});

		Object.defineProperty(this, 'rowCache', {
			enumerable: false
			, writable: false
			, value:    {}
		});

		Object.defineProperty(this, 'alot', {
			enumerable: false
			, writable: false
			, value:    alot
		});
	}

	count()
	{
		return this.source.length;
	}

	rowSource(index)
	{
		if(this.count() < index)
		{
			return {};
		}

		if(this.source[index])
		{
			return this.source[index];
		}

		return {};
	}

	rowSources(start, length)
	{
		if(this.count() < start)
		{
			return [];
		}

		let result = [];

		for(let i = start; i <= start + length; i++)
		{
			let row = {};
			let rowSource;

			if(this.rowCache[i])
			{
				for(let j in this.rowCache[i])
				{
					if(this.rowCache[i][j] instanceof View && this.rowCache[i][j])
					{
						this.rowCache[i][j].remove();

						row[j] = new this.rowCache[i][j].constructor(
							Object.assign({}, this.rowCache[i][j].args)
						);
					}
					else
					{
						row[j] = this.rowCache[i][j];
					}
				}
			}
			else if(rowSource = this.rowSource(i))
			{
				for(let j in rowSource)
				{
					row[j] = rowSource[j];
				}
			}

			if(Object.keys(row).length)
			{
				this.rowCache[i] = row;
			}

			result.push(row);
		}

		return result;
	}

	header(sources)
	{
		let header = {};

		for(let i in sources)
		{
			for(let j in sources[i])
			{
				header[j] = j;
			}
		}

		return Object.keys(header);
	}

	segment(start, length)
	{
		// for(let i in this.rowCache)
		// {
		// 	delete this.rowCache[i];
		// }

		if(this.count() < start)
		{
			return {header: [], segment: []};
		}

		let sources = this.rowSources(start, length);
		let header  = this.header(sources);

		let segment = [];

		for(let i in sources)
		{
			let row = [];

			for(let j in header)
			{
				if(typeof sources[i][ header[j] ])
				{
					row.push( sources[i][ header[j] ] );
				}
				else
				{
					row.push(null);
				}
			}

			segment.push(row);
		}

		return {header, segment};
	}
}
