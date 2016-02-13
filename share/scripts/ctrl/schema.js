pwf.wait_for('class', 'preloader.resource.schema_package', function()
{
	pwf.preload([
		{
			'type':'schema_package',
			'name':'public'
		}
	]);
});
