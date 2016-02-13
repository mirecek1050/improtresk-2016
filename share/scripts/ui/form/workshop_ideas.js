(function()
{
	"use strict";

	pwf.reg_class('ui.form.workshop_ideas', {
		"parents":['model.list', 'form'],
		'requires':['Workshop.Concept'],

		"storage":{
			"opts":{
				'action':'/formulare/koncept/feed',
				'heading':'',
				'desc':'Letošní Improtřesk bude 13. - 15. května v Milevsku a ty máš možnost ovlivnit, jaké workshopy nabídne. Hlasuj až pro tři workshopy. Workshopy s největším počtem hlasů se pokusíme uskutečnit. Hlasování končí v <span style="text-decoration:underline">sobotu 20. února v 20:00</span>. Toto není přihláška na Improtřesk 2016.',
				'model':'Workshop.Concept',
				'sort':[
					{
						'attr':'name',
					}
				],

				'on_ready':function(err) {
					if (err) {
						this.display_error(err);
					} else {
						pwf.storage.store('concept_voted', pwf.moment().format('YYYY-MM-DD HH:mm:ss'));
						this.display_thanks();
					}
				},


				'on_invalid':function(err) {
					alert('Vyplň prosím svoje jméno, e-mail a vyber přesně tři workshopy.');
				},

				"elements":[
					{
						'element':'container',
						'type':'inputs',
						'elements':[
							{
								'name':'submited',
								'type':'hidden',
								'value':1
							},

							{
								'name':'name',
								'type':'text',
								'label':'Tvoje jméno',
								'required':true
							},

							{
								'name':'email',
								'type':'email',
								'label':'Tvůj e-mail',
								'required':true
							},

							{
								"name":'workshops',
								'label':'Vyber tři workshopy',
								'type':'checkbox',
								'multiple':true,
								'required':true,
								'value':[],
								'on_validate':function() {
									return this.val().length == 3;
								},

								'on_change':function() {
									var other = this.get('form').get_input('other');

									if (~this.val().indexOf('666')) {
										other.get_el().show();
										other.set('required', true);
									} else {
										other.get_el().hide();
										other.set('required', false);
									}
								}
							},

							{
								'name':'other',
								'placeholder':'Tvoje představa jiného workshopu',
								'type':'textarea',
								'on_validate':function() {
									var ws = this.get('form').get_input('workshops');

									return !~ws.val().indexOf('666') || this.val().length > 10;
								}
							}
						]
					},

					{
						'label':'Poslat',
						'element':'button',
						'type':'submit'
					}
				]
			}
		},


		'proto':{
			'create_struct':function(p)
			{
				var voted = pwf.storage.get('concept_voted');

				if (voted) {
					p('create_meta');
					this.get_el('form').hide();
					this.display_thanks();
				} else {
					this.load();
				}
			},


			'loaded':function(p)
			{
				var
					items = p.storage.dataray.data,
					opts  = [];

				for (var i = 0 ; i < items.length; i++) {
					var label = pwf.jquery.div('workshop-option');

					label.create_divs(['name', 'desc', 'diff']);

					label.name.html(items[i].get('name'));
					label.desc.html(items[i].get('desc'));
					label.diff.html('(' + items[i].get('difficulty') + ')');

					opts.push({
						'name':pwf.jquery.div('a').html(label).html(),
						'value':items[i].get('id')
					});
				}
				var other = pwf.jquery.div('workshop-option');

				other.create_divs(['name', 'desc']);

				other.name.html('Jiný workshop');
				other.desc.html('Napiš nám vlastní představu workshopu.');

				opts.push({'value':666, 'name':pwf.jquery.div('a').html(other).html()});

				p.storage.opts.elements[0].elements[3].options = opts;

				p('create_meta');
				p('create_form_obj');

				this.get_input('workshops').job('change');
			}
		},


		'public':{
			'display_error':function(err)
			{
				alert('Ajaj. Něco tady nefunguje. Zkus to prosím znovu později.');
				v(err);
			},


			'display_thanks':function(p, next)
			{
				var jobs = [];

				jobs.push(function(next) {
					p.object.get_el('form').stop(true).slideUp(500, next);
				});

				jobs.push(function(next) {
					var el = p.object.get_el();

					el.create_divs(['thanks']);

					el.thanks
						.html('Děkujeme. Sledujte Facebookovou událost kvůli novinkám.')
						.hide()
						.slideDown(500, next);
				});


				pwf.async.series(jobs, next);
			}
		}
	});
})();
