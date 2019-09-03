const keystone = require('keystone');
const tutors = keystone.list('Tutor');
const universities = keystone.list('University');
const courses = keystone.list('Course');
const post = keystone.list('Post');
exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'tutorials';
	locals.title = '澳洲大学课程辅导补习，悉尼，墨尔本，布里斯班，堪培拉，阿德莱德补课, 补习，作业辅导，考试冲刺 | 澳洲匠人学院 ';
	locals.metaDescription = '拥有200多导师团队的大学辅导团队，针对澳洲布里斯班，墨尔本，悉尼，堪培拉，阿德莱德，塔斯马尼亚等澳洲大学课程辅导，涉及IT补课，补习，专业课程辅导，University Tutoring，考试冲刺，作业辅导，保过班，冲刺班';
	locals.metaKeywords = '布里斯班,悉尼,墨尔,堪培拉,塔斯马尼亚,阿德莱德,澳洲,大学辅导,IT补课,IT求职,作业辅导,考试冲刺';
	locals.thumbnailSrc = '';
	locals.tutors = [];
	locals.universities = [];
	locals.courses = [];
	locals.services = [];

	view.on('init', function (next) {
		tutors.model.find()
			.sort('-priority')
			.exec(function(err, tutors) {
				if (err) res.err(err);
				locals.tutors = tutors;
				next();
			});
	});

	view.on('init', function (next) {
		universities.model.find()
			.where('featured', true)
			.populate('city')
			.exec(function(err, universities) {
				if (err) res.err(err);
				locals.universities = universities;
				next();
			});
	});

	view.on('init', function (next) {
		courses.model.find()
			.exec(function(err, courses) {
				if (err) res.err(err);
				locals.courses = courses;
				next();
			});
	});

	view.on('init', function (next) {
		const recentPost = post.paginate({
			page: req.query.page || 1,
			perPage: 10,
			maxPages: 1,
			filters: {
				state: 'published'
			}
		}).sort('-publishedDate').populate('author categories').limit(4);

		recentPost.exec(function (err, results) {
			locals.posts = results;
			next(err);
		});
	});
	// Render the view
	view.render('tutorials');
};
