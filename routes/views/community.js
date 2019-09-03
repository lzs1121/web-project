const keystone = require('keystone');
const meetups = keystone.list('Meetup');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'IT社群';
	locals.title = '澳洲最大IT社群 | 澳洲IT匠人圈 ，澳洲最大IT从业者组织，悉尼（Sydney），墨尔本（Melbourne），布里斯班（Brisbane）';
	locals.metaDescription = '澳大利亚布里斯班Brisbane IT培训  | 澳洲最大IT从业者组织，地跨悉尼（Sydney），墨尔本（Melbourne），布里斯班（Brisbane），有来自全球的四千多位小伙伴加入我们，北美，欧洲，日本，东南亚，因为有你，我们因此而不同';
	locals.metaKeywords = 'IT社群, IT专业人士组织, 职场培训,IT圈, 技能培训, 求职服务, 大学辅导';
	// Render the view
	view.query('pastMeetups',
		meetups.model.find()
			.where('state', 'past')
			.sort('-startDate')
	);

	view.on('init', function (next) {

		const post = keystone.list('Post').paginate({
			page: req.query.page || 1,
			perPage: 2,
			maxPages: 1,
			filters: {
				state: 'published'
			}
		}).sort('-publishedDate').populate('author categories').limit(2);

		post.exec(function (err, results) {
			locals.posts = results;
			next(err);
		});
	});
	view.render('community');
};
