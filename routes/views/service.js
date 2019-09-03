const keystone = require('keystone');
const tutors = keystone.list('Tutor');
const universities = keystone.list('University');
const courses = keystone.list('Course');
const services = keystone.list('Service');
const posts = keystone.list('Post');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);

	const locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'IT Tutorials';
	locals.title = '澳洲大学IT课程辅导 IT补课 | 澳洲IT匠人圈 ，求职招聘，职业培训，项目合作';
	locals.metaDescription = '澳洲布里斯班 墨尔本 悉尼大学课程辅导 IT补课 IT专业课程辅导University Tutoring | 澳洲最大IT从业者组织，地跨悉尼（Sydney），墨尔本（Melbourne），布里斯班（Brisbane）';
	locals.filters = {
		service: req.params.slug || 'service'
	};
	locals.tutors = [];
	locals.universities = [];
	locals.cities = [];
	locals.courses = [];
	locals.service = [];

	view.on('init', function (next) {
		services.model.find()
			.where('slug', locals.filters.service)
			.exec(function(err, service) {
				if (err) res.err(err);
				locals.service = service[0];
				locals.metaKeywords = service[0].meta.keywords;
				locals.metaDescription = service[0].meta.description;
				locals.thumbnailSrc = service[0].thumbnail.secure_url || '';
				locals.title = service[0].title;
				next();
			});
	});
	view.on('init', function (next) {
		tutors.model.find()
			.where('service')
			.in([locals.service._id])
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
		const post = posts
			.paginate({
				page: req.query.page || 1,
				perPage: 10,
				maxPages: 1,
				filters: {
					state: 'published',
					'service': locals.service.id
				}
			}).sort('-publishedDate').populate('author categories').limit(4);

		post.exec(function (err, results) {
			locals.posts = results;
			next(err);
		});
	});
	// Render the view
	view.render('service');
};
