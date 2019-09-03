const keystone = require('keystone');
const courses = keystone.list('Training');
const teachers = keystone.list('Teacher');


exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'courses';
	locals.title = '匠人学院培训课程_Web培训_数据分析培训_UI_UX_产品经理培训_iOS开发_全栈_数据科学 | 澳洲最大最好的IT专业培训课';
	locals.metaDescription = '面向澳洲与中国的就业与技能培训，零基础转行做IT，从入门到就业，Web开发，iOS开发，全栈班，数据科学，数据分析，SEO，大数据，数据库，python培训等。澳洲求职就业，面试指导，获得澳洲工作经验,找到澳洲实习和工作';
	locals.courses = [];
	locals.posts = [];
	locals.teachers = [];

	view.on('init', function (next) {
		teachers.model.find()
			.sort('-priority')
			.populate('preCompany university')
			.exec(function(err, teachers) {
				if (err) res.err(err);
				locals.teachers = teachers;
				next();
			});
	});

	view.on('init', function (next) {
		courses.model.find()
			.sort('coursePhase').populate('teachers', 'name').populate('city', 'name')
			.exec(function(err, results) {
				if (err) res.err(err);
				locals.courses = results;
				next();
			});
	});

	// Render the view
	view.on('init', function (next) {

		const post = keystone.list('Post').paginate({
			page: req.query.page || 1,
			perPage: 10,
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
	view.render('trainings');
};