const keystone = require('keystone');
const courses = keystone.list('Training');
const programs = keystone.list('Program');
const meetups = keystone.list('Meetup');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'home';
	locals.title = '澳洲匠人学院（澳洲IT匠人圈）就业率最高的找工作平台及IT培训平台_澳洲最大IT专业人士组织';
	locals.metaDescription = '澳洲最好的IT培训平台，来自Google等澳洲一线二线公司的导师，帮助学生更好的Code Bootcamp，求职辅导，大学课程辅导，补习，面试简历指导，澳洲留学移民找工作。在布里斯班，悉尼，墨尔本，塔斯马尼亚，堪培拉';
	locals.metaKeywords = '澳洲最大IT找工作平台,IT培训,大学补习,澳洲IT就业培训方案,技能培训,求职服务,面试简历指导,大学辅导,匠人活动,澳洲IT匠人圈';
	locals.post = [];
	locals.services = [];

	view.query('upcomingMeetups',
		meetups.model.find()
			.where('state', 'active')
			.sort('-startDate')
	);
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
		programs.model.find()
			.sort('commenceCourseDate')
			.populate('city training')
			.exec(function(err, programs) {
				if (err) res.err(err);
				locals.programs = programs.filter(program => {
					return program.commenceCourseDate > Date.now();
				});
				next();
			});
	});

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
	// Render the view
	view.render('index');
};
