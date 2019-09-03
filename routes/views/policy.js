const keystone = require('keystone');
const teachers = keystone.list('Teacher');
const meetups = keystone.list('Meetup');
const users = keystone.list('User');
exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);

	const locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'policy';
	locals.title = '匠人学院政策与条款 JR Academy Policy';
	locals.metaDescription = '关于匠人学院的政策及其条款 - Terms & Conditions';
	locals.teachers =[];
	locals.users =[];
	locals.post =[];
	view.query('pastMeetups',
		meetups.model.find()
			.where('state', 'past')
			.sort('-startDate')
	);

	view.on('init', function (next) {
		teachers.model.find()
			.sort('-priority')
			.exec(function(err, teachers) {
				if (err) res.err(err);
				locals.teachers = teachers;
				next();
			});
	});
	// Get Staff
	view.on('init', function (next) {
		users.model.find()
			.sort('-priority')
			.where('role', 'staff')
			.exec(function(err, users) {
				if (err) res.err(err);
				locals.users = users;
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
	view.render('policy');
};
