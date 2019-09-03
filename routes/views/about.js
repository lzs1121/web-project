const keystone = require('keystone');
const teachers = keystone.list('Teacher');
const meetups = keystone.list('Meetup');
const users = keystone.list('User');
exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);

	const locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'about';
	locals.title = '关于匠人学院（澳洲IT匠人圈 ）- 澳洲最大IT从业者组织，求职招聘，职业培训，项目合作。地跨悉尼，墨尔本，布里斯班';
	locals.metaDescription = 'About Us - 澳洲最大IT从业者组织，地跨悉尼（Sydney），墨尔本（Melbourne），布里斯班（Brisbane），有来自全球的8000多位小伙伴加入我们，北美，欧洲，日本，东南亚，因为有你，我们因此而不同';
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
			.populate('preCompany university')
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
	view.render('about');
};
