(function()
{
	"use strict";

	pwf.reg_class('ui.car.offers.item', {
		'parents':['jq.struct'],

		'storage':{
			'opts':{
				'tag':'a'
			}
		},


		'proto':{
			'els':[
				{
					'name':'vehicle',
					'els':['icon', 'seats']
				},

				{
					'name':'info',
					'els':['from', 'departure', 'driver', 'c2a']
				}
			],

			'create_struct':function(p)
			{
				var el = this.get_el()
					.attr('href', '/autem/' + this.get('id'))
					.addClass(this.get('icon'));

				el.vehicle.addClass(this.get('icon'));
				el.vehicle.icon.addClass(this.get('icon'));
				el.vehicle.seats
					.html(this.get('seats') - this.get('used'))
					.attr('title', 'Počet míst')
					.addClass('free');

				this.get_el('info.from')
					.append(pwf.jquery.span('city').html(this.get('from')))
					.append(pwf.jquery.span('dest').html(' → Milevsko'));
				this.get_el('info.departure').html('Odjezd: ' + this.get('departure').format('D.M H:mm'));
				this.get_el('info.driver').html('Řidič: ' + this.get('driver'));
			}
		}
	});

})();
