const keystone = require('keystone');
const teachers = keystone.list('Teacher');
const services = keystone.list('Service');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;
	locals.services = [];
	locals.teachers = [];
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'career';
	locals.title = '职业辅导Career Services | 澳洲IT匠人圈 ，澳洲最大IT从业者组织，求职招聘，职业培训，项目合作';
	locals.metaDescription = '澳大利亚布里斯班Brisbane IT培训  | 澳洲最大IT从业者组织，地跨悉尼（Sydney），墨尔本（Melbourne），布里斯班（Brisbane），有来自全球的四千多位小伙伴加入我们';
	// Render the view
	view.on('init', function (next) {
		services.model.find()
			.exec(function(err, services) {
				if (err) res.err(err);
				locals.careerService = services.filter(s => {
					return s.type === 'Career';
				});
				next();
			});
	});
	view.on('init', function (next) {
		teachers.model.find()
			.sort('-priority')
			.populate('careerPath preCompany university')
			.exec(function(err, teachers) {
				if (err) res.err(err);
				locals.teachers = teachers;
				next();
			});
	});
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
	view.render('careerCoaching');
};
