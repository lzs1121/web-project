const keystone = require('keystone');
const courses = keystone.list('Training');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'courses';
	locals.title = '匠人学院培训课程_Web培训_数据分析培训_UI_UX_产品经理培训 | 澳洲最大最好的IT专业培训课';
	locals.metaDescription = '澳大利亚布里斯班,墨尔本,悉尼,堪培拉,塔斯马尼亚,阿德莱德IT培训,Web培训,Java培训,数据分析,数据工程师,数据科学家培训,UI培训,产品经理培训.获得澳洲工作经验,找到澳洲实习和工作';

	view.on('init', function (next) {
		courses.model.find()
			.sort('-publishedAt')
			.exec(function(err, courses) {
				if (err) res.err(err);
				locals.courses = courses;
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
	view.render('courses');
};
