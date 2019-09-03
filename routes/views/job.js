const keystone = require('keystone');
const job = keystone.list('Job');
exports = module.exports = function (req, res) {
	const view = new keystone.View(req, res);
	const locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'job';
	locals.title = '澳洲IT工作招聘信息 | 澳洲最大IT从业者组织，求职招聘，职业培训，项目合作。地跨悉尼，墨尔本，布里斯班';
	locals.metaDescription = 'IT匠人圈为大家提供澳洲优质IT工作信息 - 澳洲最大IT从业者组织，地跨悉尼（Sydney），墨尔本（Melbourne），布里斯班（Brisbane），有来自全球的六千多位小伙伴加入我们，因为有你，我们因此而不同';
	locals.metaKeywords = '澳洲最大IT找工作平台,职场培训,您的澳洲IT就业培训方案,技能培训,求职服务,大学辅导,匠人活动';

	locals.data = {
		featuredJobs: []
	};

	view.query('published',
		job.model.find()
			.where('state', 'published')
	);

	view.query('openJobs',
		job.model.find()
			.where('status', 'Open')
			.where('state', 'published')
			.populate('company')
			.sort('-publishedDate')
	);

	view.query('closedJobs',
		job.model.find()
			.where('status', 'Close')
			.where('state', 'published')
			.populate('company')
			.sort('-publishedDate')
	);

	view.on('init', function (next) {
		const featured = job.paginate({
			page: req.query.page || 1,
			perPage: 8,
			maxPages: 10,
			filters: {
				state: 'published',
				isFeatured: true,
				status: 'Open'
			}
		}).sort('-publishedDate').populate('city').populate('company');
		featured.exec(function(err, results) {
			locals.data.featuredJobs = results;
			next(err);
		});
	});

	// Render the view
	view.render('jobboard/job');
};
