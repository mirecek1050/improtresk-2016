(function()
{
	"use strict";

	pwf.reg_class('ui.car.offers', {
		"parents":['model.list', 'jq.struct', 'jq.adminer.abstract.filters'],

		"storage":{
			"opts":{
				"draw":'ui.car.offers.item',
				"model":'Car.Offer',

				"filters":[
					{
						'attr':'seats',
						'type':'gt',
						'gt':'used',
						'self':true
					},

					{
						'attr':'seats',
						'type':'gt',
						'gt':0
					}
				],

				"sort":[
					{"attr":"departure"}
				],

				"ui_filters":[
					{
						"name":"filter",
						"attrs":["from", "driver", "desc"],
						"type":'text',
						"placeholder":"Filtrovat"
					}
				]
			}
		},


		'proto':{
			'els':[
				{
					'name':'inner',
					'els':[
						'filter',
						'content'
					]
				}
			],


			'create_struct':function(p)
			{
				p('create_filters');
				this.load();
			},


			'loaded':function(p)
			{
				p('render_items');
			},


			'failed':function(p, err)
			{
				v(err);
			},


			'render_items':function(p)
			{
				var
					el = this.get_el('inner.content'),
					list = this.get_data();

				el.html('');

				if (list.data.length) {
					for (var i = 0; i < list.data.length; i++) {
						pwf.create(this.get('draw'), pwf.merge(list.data[i].get_data(), {
							'parent':el
						}));
					}
				} else {
					el.html('Bohužel, žádné výsledky. Zkus pošťouchnout lidi na <a href="https://www.facebook.com/events/1398346530471289/">Facebooku</a>.');
					el.find('a').bind('click touchend', function(e) {
						e.preventDefault();
						window.open(this.href);
					});
				}
			}
		}
	});
})();
