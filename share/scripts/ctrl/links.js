pwf.wait_for('module', 'jquery', function()
{
	var els = pwf.jquery('a');

	for (var i = 0; i < els.length; i++) {
		var el = pwf.jquery(els[i]);

		if (el.attr('href') == document.location.pathname) {
			el.addClass('active');
		}
	}

});
