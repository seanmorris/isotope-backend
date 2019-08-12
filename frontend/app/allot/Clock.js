// import { Config     } from 'Config';
import { ScrollTag } from 'curvature/tag/ScrollTag';
import { SubClock  } from './SubClock';

import { View as BaseView } from 'curvature/base/View';

export class Clock extends BaseView
{
	constructor(args, source)
	{
		super(args);

		this.template = `<div
			class = "clock [[status]]"
			cv-ref = "clock:curvature/tag/ScrollTag"
		>
			[[time]]:[[subClock]]
		</div>`;

		this.args.time     = this.args.time     || 0;
		this.args.subClock = this.args.subClock || new SubClock;

		this.args.subClock.preserve = true;

		// this.args.status = '';
		this.args.status = this.args.status || '';

		this.onInterval(1000, ()=>{
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
