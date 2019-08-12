import { Clock       } from '../allot/Clock';
import { RowProducer } from './RowProducer';

export class FizzBuzzProducer extends RowProducer
{
	count()
	{
		return 1000*100;
	}

	rowSource(index)
	{
		if(this.count() < index)
		{
			return undefined;
		}

		return {
			id:     index
			, blah: 'blah'
			, hm:   new Clock
		};
	}
}