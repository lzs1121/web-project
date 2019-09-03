const keystone = require('keystone');
const workshops = keystone.list('Workshop');
const posts = keystone.list('Post');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'workShopDetail';
	locals.title = '澳洲IT匠人圈活动 | 澳洲IT匠人圈 ，澳洲最大IT从业者组织，求职招聘，职业培训，项目合作';
	locals.metaDescription = '澳大利亚IT匠人圈活动  | 澳洲最大IT从业者组织，地跨悉尼（Sydney），墨尔本（Melbourne），布里斯班（Brisbane），有来自全球的四千多位小伙伴加入我们，北美，欧洲，日本，东南亚，因为有你，我们因此而不同';
	// Render the view
	locals.curWorkShops = {};

	view.on('init', function (next) {
		workshops.model.find()
			.populate('tutor')
			.where('key', req.params.key)
			.exec(function(err, result) {
				if (err) res.err(err);
				locals.curWorkShops = result[0];
				locals.title = result[0].name;
				if(result[0].meta.description) {
					locals.metaDescription = result[0].meta.description;
				}
				if(result[0].meta.keywords) {
					locals.metaKeywords = result[0].meta.keywords;
				}
				next();
			});
	});

	view.on('init', function (next) {
		const post = posts
			.paginate({
				page: req.query.page || 1,
				perPage: 10,
				maxPages: 1,
				filters: {
					state: 'published',
					'city': locals.curWorkShops.city
				}
			}).sort('-publishedDate').populate('author categories').limit(10);
		post.exec(function (err, results) {
			locals.posts = results;
			next(err);
		});
	});

	view.render('workShopDetail');
};
