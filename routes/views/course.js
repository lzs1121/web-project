// Deprecated
const keystone = require('keystone');
const courses = keystone.list('Course');
const universities = keystone.list('University');
const posts = keystone.list('Post');
const resources = keystone.list('Resource');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'Courses';
	locals.tutors = [];
	locals.course = {};
	locals.resources = [];
	locals.university = [];
	locals.filters = {
		uni: req.params.slug,
		slug: req.params.courseCode
	};
	view.on('init', function (next) {
		const q = universities.model.findOne({
			slug: locals.filters.uni
		});
		q.exec(function (err, result) {
			locals.university = result;
		});
		next();
	});
	view.on('init', function (next) {
		courses.model.find()
			.sort('-publishedAt')
			.where('slug', locals.filters.slug)
			.populate('tutor resource')
			.exec(function(err, result) {
				if (err) res.err(err);
				locals.course = result[0];
				locals.metaKeywords = result[0].meta.keywords || '';
				locals.metaDescription = result[0].meta.description || '';
				locals.title = `${result[0].meta.title} - ${locals.university.name}`;
				locals.resources = result[0].resource;
				resources.model.find()
					.where('course')
					.in([locals.course.id])
					.exec((err, item)=> {
						if(err) return res.json({ err:err });
						if(!item) return res.json('not found');
						locals.resources = item;
					});
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
					'course': locals.course._id
				}
			}).sort('-publishedDate').populate('author categories').limit(10);

		post.exec(function (err, results) {
			locals.posts = results;
			next(err);
		});
	});
	view.render('course');
};
