(function()
{
	"use strict";

	pwf.reg_class('text', {
		"parents":['jq.struct'],

		'proto':{
			'els':['label', 'content'],

			'create_struct':function(p)
			{
				this.get_el('label').html(this.get('label'));
				this.get_el('content').html(this.get('content'));
			}
		}
	});
})();
