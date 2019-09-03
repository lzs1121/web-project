const keystone = require('keystone');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);

	const locals = res.locals;

	locals.section = 'UI Design';
	locals.title = 'UI Design UI設計入门班 | 澳洲IT匠人圈 ，澳洲最大IT从业者组织，求职招聘，职业培训';
	locals.metaDescription = 'UI Design UI設計入门班 | 澳洲最大IT从业者组织，地跨悉尼（Sydney），墨尔本（Melbourne），布里斯班（Brisbane），有来自全球的四千多位小伙伴加入我们，北美，欧洲，日本，东南亚，因为有你，我们因此而不同';

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
	view.render('bootcamp/uiDesign');
};
