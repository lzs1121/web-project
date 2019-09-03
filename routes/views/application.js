const keystone = require('keystone');
const courses = keystone.list('Training');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	locals.filters = {
		slug: req.query.type
	};
	locals.data = {
		slug: [],
		title : '报名表',
		metaDescription : '澳洲IT行业，最大从业者组织，地跨悉尼（Sydney），墨尔本（Melbourne），布里斯班（Brisbane）',
		courses : []
	};
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'IT匠人圈';
	locals.title = 'IT匠人课程报名|培训报名 | 澳洲IT匠人圈';
	locals.metaDescription = '澳大利亚IT培训  | 澳洲最大IT从业者组织，地跨悉尼（Sydney），墨尔本（Melbourne），布里斯班（Brisbane），有来自全球的四千多位小伙伴加入我们，北美，欧洲，日本，东南亚，因为有你，我们因此而不同';
	// Render the view
	view.on('init', function (next) {
		const q = keystone.list('Training').model.findOne({
			slug: locals.filters.slug
		});
		q.exec(function (err, result) {
			if(result) {
				locals.data = result;
			}
			next(err);
		});

	});
	view.on('init', function (next) {
		courses.model.find()
			.where('featured', 'recommend')
			.exec(function(err, courses) {
				if (err) res.err(err);
				locals.courses = courses;
				next();
			});
	});
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
	view.render('application');
};
