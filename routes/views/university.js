const keystone = require('keystone');
const courses = keystone.list('Course');
const resources = keystone.list('Resource');
const tutors = keystone.list('Tutor');
const universities = keystone.list('University');
const async = require('async');
const workshops = keystone.list('Workshop');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'University';
	locals.slug = req.params.slug;
	locals.university = {};
	locals.tutors = [];
	locals.courses = [];
	locals.resources = [];
	locals.title = '澳洲大学 | 澳洲IT匠人圈 ，澳洲最大IT从业者组织，求职招聘，职业培训，项目合作';
	locals.metaDescription = '澳洲大学 | 澳洲最大IT从业者组织，地跨悉尼（Sydney），墨尔本（Melbourne），布里斯班（Brisbane），有来自全球的四千多位小伙伴加入我们，北美，欧洲，日本，东南亚，因为有你，我们因此而不同';
	// locals.meta.title = locals.title;

	view.on('init', function (next) {
		const q = universities.model.findOne({
			slug: locals.slug
		});
		q.exec(function (err, result) {
			locals.university = result;
			locals.title = result.meta.title + '_澳洲匠人学院';
			locals.metaDescription = result.meta.description;
			async.series([
				function(next) {
					tutors.model.find()
						.where('university')
						.in([locals.university.id])
						.exec((err, item)=> {
							if(err) return res.json({ err:err });
							if(!item) return res.json('not found');
							locals.tutors = item;
							return next();
						});
				},
				function(next) {
					courses.model.find()
						.where('university')
						.in([locals.university.id])
						.exec((err, item)=> {
							if(err) return res.json({ err:err });
							if(!item) return res.json('not found');
							locals.courses = item;
						});
					return next();
				},
				function(next) {
					resources.model.find()
						.where('university')
						.in([locals.university.id])
						.exec((err, item)=> {
							if(err) return res.json({ err:err });
							if(!item) return res.json('not found');
							locals.resources = item;
						});
					return next();
				}
			]);
			next();
		});

	});
	view.on('init', function (next) {
		workshops.model.find()
			.where('state', 'active')
			.sort('-publishedAt')
			.where('university', locals.university._id)
			.exec(function(err, workshop) {
				if (err) res.err(err);
				locals.workshops = workshop;
				next();
			});
	});
	view.on('init', function (next) {
		workshops.model.find()
			.where('state', 'past')
			.where('university')
			.in([locals.university.id])
			.sort('-startDate')
			.exec(function(err, pastWorkshop) {
				if (err) res.err(err);
				locals.pastWorkshop = pastWorkshop;
				next();
			});
	});
	// Render the view
	view.on('init', function (next) {
		const post = keystone.list('Post').paginate({
			page: req.query.page || 1,
			perPage: 8,
			maxPages: 1,
			filters: {
				state: 'published',
				university:locals.university.id
			}
		}).sort('-publishedDate').populate('author categories').limit(8);

		post.exec(function (err, results) {
			locals.posts = results;
			next(err);
		});
	});

	view.render('university');
};
