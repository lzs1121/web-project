const keystone = require('keystone');
const courses = keystone.list('Training');
const reviews = keystone.list('Reviews');
const teachers = keystone.list('Teacher');
const STORE_COURSE = require('../storeLocation');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	locals.teachers = [];
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'data-science';
	locals.title = 'Data Science数据科学与云大数据工程就业技能班| 澳洲IT匠人圈 ，澳洲最大IT从业者组织，求职招聘，职业培训';
	locals.metaDescription = '数据科学与云大数据工程就业技能班 | 澳洲最大IT从业者组织，地跨悉尼（Sydney），墨尔本（Melbourne），布里斯班（Brisbane），有来自全球的四千多位小伙伴加入我们，北美，欧洲，日本，东南亚，因为有你，我们因此而不同';
	locals.teachers = [];
	locals.courses = [];
	locals.reviews = [];
	locals.data = {};
	// Render the view
	view.on('init', function (next) {
		courses.model.find()
			.sort('-publishedAt')
			.exec(function(err, courses) {
				if (err) res.err(err);
				locals.courses = courses;
				next();
			});
	});
	view.on('init', function (next) {
		const q = courses.model.findOne({
			courseCode: STORE_COURSE.COURSE.DATA_SCIENCE
		});
		q.exec(function (err, result) {
			locals.data = result;
			next();
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
		reviews.model.find()
			.sort('-priority')
			.where('courseSelect', 'webdev')
			.exec(function(err, reviews) {
				if (err) res.err(err);
				locals.reviews = reviews;
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
	view.render('dataScience');
};
