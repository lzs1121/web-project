// Deprecated
const keystone = require('keystone');
const services = keystone.list('Service');
const teachers = keystone.list('Teacher');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.title = '澳洲IT职业辅导 | 澳洲IT匠人圈 ，求职招聘，职业培训，项目合作';
	locals.metaDescription = '';
	locals.section = 'Career';
	locals.services = [];
	locals.filters = {
		careerSlug: req.params.slug
	};
	view.on('init', function (next) {
		const q = services.model.findOne({
			slug: locals.filters.careerSlug
		});
		q.exec(function (err, result) {
			locals.career = result;
			locals.title = result.meta.title + ' | 澳洲匠人学院';
			locals.metaDescription = result.meta.description;
			next();
		});
	});
	view.on('init', function (next) {
		teachers.model.find()
			.where('service')
			.populate('careerPath preCompany university')
			.in([locals.career._id])
			.exec(function(err, teachers) {
				if (err) {
					res.err(err);
				}
				locals.teachers = teachers;
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
		}).sort('-publishedDate').populate('author categories').limit(10);

		post.exec(function (err, results) {
			locals.posts = results;
			next(err);
		});
	});
	view.render('career/careerService');
};
