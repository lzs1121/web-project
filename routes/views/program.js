const keystone = require('keystone');
const teachers = keystone.list('Teacher');
const projects = keystone.list('Project');
const async = require('async');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	// Set locals
	locals.section = 'Training';

	locals.filters = {
		slug: req.params.slug
	};

	locals.data = {
		slug: []
	};

	locals.projects = [];
	locals.title = 'Course - 澳洲最大IT从业者组织，地跨悉尼（Sydney），墨尔本（Melbourne），布里斯班（Brisbane）';
	locals.metaDescription = '澳洲IT行业，最大从业者组织，地跨悉尼（Sydney），墨尔本（Melbourne），布里斯班（Brisbane），有来自全球的四千多位小伙伴加入我们，北美，欧洲，日本，东南亚，因为有你，我们因此而不同';
	// Load the current portfolio
	view.on('init', function (next) {
		const q = keystone.list('Training').model.findOne({
			slug: locals.filters.slug
		});
		q.exec(function (err, result) {
			locals.data = result;
			locals.title = result.name + ' - 澳洲最大IT从业者组织，地跨悉尼（Sydney），墨尔本（Melbourne），布里斯班（Brisbane）';
			locals.metaDescription = result.solution + ' - 澳洲IT行业，最大从业者组织，地跨悉尼（Sydney），墨尔本（Melbourne），布里斯班（Brisbane）';
			async.each(locals.data.teachers, function(id, next) {
				teachers.model.find().where('_id', id).exec(function(err, data) {
					locals.teachers = data;
					next(err);
				});

			}, function(err) {
				next(err);
			});
		});
	});

	view.on('init', function(next) {
		if (!locals.data) return next();

		async.each(locals.data.project, function(id, next) {
			projects.model.find().where('_id', id).exec(function(err, data) {
				locals.projects.push(data[0]);
				next(err);
			});

		}, function(err) {
			next(err);
		});

	});
	// Render the view
	view.render('training');

};
