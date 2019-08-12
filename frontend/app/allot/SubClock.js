// import { Config     } from 'Config';
import { ScrollTag } from 'curvature/tag/ScrollTag';
import { SampleRow } from './SampleRow';

import { View as BaseView } from 'curvature/base/View';

export class SubClock extends BaseView
{
	constructor(args, source)
	{
		super(args);

		this.template = `<div
			class = "clock [[status]]"
			cv-ref = "clock:curvature/tag/ScrollTag"
		>[[time]]</div>`;

		this.args.time   = this.args.time   || 0;
		this.args.status = '';
		// this.args.status = this.args.status || '';

		this.onInterval(10, ()=>{
			this.args.time++;
		})
	}

	postRender()
	{

		this.tags.clock.bindTo('visible', v => {
			if(this.tags.clock.element.getRootNode() !== document)
			{
				return;
			}
			this.args.status = v
				? 'visible'
				: 'not-visible';
		});
	}
}
