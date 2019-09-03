const keystone = require('keystone');
const training = keystone.list('Training');
const reviews = keystone.list('Reviews');
const teachers = keystone.list('Teacher');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	locals.teachers = [];
	locals.reviews = [];
	// locals.section is used to set the currently selected
	// item in the header navigation.

	locals.section = 'Business Intelligence Analysis';
	locals.title = '数据分析 Business Intelligence - Microsoft Power BI  | 澳洲IT匠人圈 ，澳洲最大IT从业者组织，求职招聘，职业培训';
	locals.metaDescription = '数据分析Business Intelligence Analysis  - Microsoft Power BI | 澳洲最大IT从业者组织，地跨悉尼Sydney，墨尔本Melbourne，布里斯班Brisbane 澳洲最大IT找工作平台,职场培训,您的澳洲IT就业培训方案,技能培训,求职辅导';
	locals.metaKeywords = '数据分析，Data Analysis, Power BI ,职场培训,您的澳洲IT就业培训方案,技能培训,求职服务, 大学辅导';
	// Render the view
	view.on('init', function (next) {
		training.model.find()
			.sort('-publishedAt')
			.exec(function(err, courses) {
				if (err) res.err(err);
				locals.courses = courses;
				next();
			});
	});
	view.on('init', function (next) {
		const q = training.model.findOne({
			courseCode: 'data1801'
		});

		q.exec(function (err, result) {
			locals.data = result;

			reviews.model.find()
				.sort('-priority')
				.where('course', result._id)
				.exec(function(err, reviews) {
					if (err) res.err(err);
					locals.reviews = reviews;
					next();
				});
		});
	});
	view.on('init', function (next) {
		teachers.model.find()
			.sort('-priority')
			.where('training')
			.populate('careerPath preCompany university')
			.in([locals.data._id])
			.exec(function(err, teachers) {
				if (err) res.err(err);
				locals.teachers = teachers;
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
	view.render('bootcamp/powerBI');
};
