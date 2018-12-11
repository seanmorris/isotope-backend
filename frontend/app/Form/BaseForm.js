import { Config     } from 'Config';
import { Repository } from 'curvature/base/Repository';
import { Form       } from 'curvature/form/Form';
import { Toast      } from 'curvature/toast/Toast';
import { ToastAlert } from 'curvature/toast/ToastAlert';
import { View       } from 'curvature/base/View';
import { Router     } from 'curvature/base/Router';

export class BaseForm extends View
{
	constructor(args, path, method = 'GET')
	{
		super(args);

		this.args.method = method;
		this.args.form = null;
		this.args.title = null;
		this.template  = `
			<div class = "board-wrap">
				<div class = "lobby-welcome">
					<div cv-if = "title"><label>[[title]]</label></div>
					[[form]]
				</div>
			</div>
		`;

		Repository.request(
			Config.backend + path
			, {_t: (new Date()).getTime()}
		).then(resp=>{
			if(!resp
				|| !resp.meta
				|| !resp.meta.form
				|| !(resp.meta.form instanceof Object)
			){
				document.dispatchEvent(new Event('renderComplete'));

				console.log('Cannot render form with ', resp);
				Router.go('/');
				return;
			}

			this.args.form = new Form(resp.meta.form);

			document.dispatchEvent(new Event('renderComplete'));

			this.args.form.onSubmit((form, event)=>{
				let formElement = form.tags.formTag.element;
				let uri         = formElement.getAttribute('action') || path;
				let method      = formElement.getAttribute('method') || this.args.method;
				let query       = form.args.flatValue;

				method = method.toUpperCase();

				if(method == 'GET')
				{
					let _query = {};

					if(this.args.content && this.args.content.args)
					{
						this.args.content.args.page = 0;						
					}

					_query.page = 0;
					
					for(let i in query)
					{
						if(i === 'api')
						{
							continue;
						}
						_query[i] = query[i];
					}

					Router.go(uri + '?' + Router.queryToString(_query));

					this.update(_query);
				}
				else if(method == 'POST')
				{
					query = form.args.flatValue;

					console.log(uri);

					Repository.request(
						Config.backend + uri
						, {api: 'json'}
						, query
					).then((response)=>{
						this.onResponse(response);
					});

					console.log(query);
				}
			});
		});
	}

	onResponse(response)
	{
		if(response.messages)
		{
			for(let i in response.messages)
			{
				Toast.instance().pop(new ToastAlert({
					title: response.body && response.body.id
						? 'Success!'
						: 'Error!'
					, body: response.messages[i]
					, time: 2400
				}));
			}
		}
	}
}