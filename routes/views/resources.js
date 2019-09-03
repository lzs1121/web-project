const keystone = require('keystone');
const resources = keystone.list('Resource');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'resources';

	view.on('init', function (next) {
		resources.model.find()
			.sort('-publishedAt')
			.exec(function(err, resources) {
				if (err) res.err(err);
				locals.resources = resources;
				next();
			});
	});

	// Render the view
	view.on('init', function (next) {

		const post = keystone.list('Post').paginate({
			page: req.query.page || 1,
			perPage: 4,
			maxPages: 1,
			filters: {
				state: 'published'
			}
		}).sort('-publishedDate').populate('author categories').limit(4);

		post.exec(function (err, results) {
			locals.posts = results;
			next(err);
		});
	});
	view.render('resources');
};
