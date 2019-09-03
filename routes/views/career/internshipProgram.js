const keystone = require('keystone');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);

	const locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'Internship Program';
	locals.title = '匠人实习计划 - Internship Program | 澳洲最大IT从业者组织，求职招聘，职业培训，项目合作。地跨悉尼，墨尔本，布里斯班';
	locals.metaDescription = '匠人实习计划 - 澳洲最大IT从业者组织，地跨悉尼（Sydney），墨尔本（Melbourne），布里斯班（Brisbane），有来自全球的六千多位小伙伴加入我们，因为有你，我们因此而不同';

	view.on('init', function (next) {
		const post = keystone.list('Post').paginate({
			page: req.query.page || 1,
			perPage: 2,
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
	// Render the view
	view.render('career/internshipProgram');
};
