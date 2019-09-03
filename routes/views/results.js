const keystone = require('keystone');
const universities = keystone.list('University');

exports = module.exports = function (req, res) {
	const view = new keystone.View(req, res);
	const locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'Results';
	locals.slug = req.params.slug;
	locals.university = {};
	locals.tutors = [];
	locals.courses = [];
	locals.title = '澳洲大学 | 澳洲IT匠人圈 ，澳洲最大IT从业者组织，求职招聘，职业培训，项目合作';
	locals.metaDescription = '澳洲大学 | 澳洲最大IT从业者组织，地跨悉尼（Sydney），墨尔本（Melbourne），布里斯班（Brisbane），有来自全球的四千多位小伙伴加入我们，北美，欧洲，日本，东南亚，因为有你，我们因此而不同';


	view.on('init', function (next) {
		universities.model.findOne({
			slug: locals.slug
		}).exec(function (err, result) {
			if (!result) return res.json('not found');
			locals.university = result;
			locals.title = result.meta.title + '- 澳洲IT匠人圈';
			locals.metaDescription = result.meta.description;
			result.populateRelated('course', function (err) {
				if (err) return res.json({ err: err });
				locals.courses = result.course;
			});
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
				state: 'published',
				university: locals.university.id
			}
		}).sort('-publishedDate').populate('author categories').limit(8);

		post.exec(function (err, results) {
			locals.posts = results;
			next(err);
		});
	});

	view.render('results');
};