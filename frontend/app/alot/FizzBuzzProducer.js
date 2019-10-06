import { Clock       } from '../allot/Clock';
import { RowProducer } from './RowProducer';

export class FizzBuzzProducer extends RowProducer
{
	count()
	{
		return 1000*1000;
	}

	rowSource(index)
	{
		if(this.count() < index)
		{
			return {};
		}

		return {
			id:     index+1
			, '1/i':  1/(index+1)
			, blah: 'blah'
			, hm:   new Clock
			, c:    '>'
			, _noCache : true
		};
	}
}
