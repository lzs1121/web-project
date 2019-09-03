const keystone = require('keystone');
const courses = keystone.list('Course');
const tutors = keystone.list('Tutor');
const universities = keystone.list('University');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'Courses';
	locals.tutors = [];
	locals.course = [];
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
		courses.model.find()
			.sort('-publishedAt')
			.exec(function(err, courses) {
				if (err) res.err(err);
				locals.courses = courses;
				next();
			});
	});

	view.on('init', function (next) {
		universities.model.find()
			.sort('-publishedAt')
			.exec(function(err, universities) {
				if (err) res.err(err);
				locals.universities = universities;
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
	view.render('universities');
};
