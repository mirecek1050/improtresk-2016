pwf.wait_for('module', 'config', function() {
	"use strict";

	var cfg = pwf.config.get('ui.data');

	if (cfg) {
		for (var i = 0; i < cfg.length; i++) {
			pwf.wait_for('class', cfg[i].model, function(item) {
				return function() {
					for (var j = 0; j < item.items.length; j++) {
						var o = pwf.create(item.model, item.items[j]);
					}
				};
			}(cfg[i]));
		}
	}

	pwf.queue.fire('models-loaded');
});
