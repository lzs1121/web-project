const keystone = require('keystone');
const courses = keystone.list('Course');
const tutors = keystone.list('Tutor');
const services = keystone.list('Service');
const async = require('async');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'Tutors';
	locals.tutor = {};
	locals.services = [];
	locals.courses = [];
	locals.id = req.params.id;
	locals.title = '澳洲大学 | 澳洲IT匠人圈 ，澳洲最大IT从业者组织，求职招聘，职业培训，项目合作';
	locals.metaDescription = '澳洲大学 | 澳洲最大IT从业者组织，地跨悉尼（Sydney），墨尔本（Melbourne），布里斯班（Brisbane），有来自全球的四千多位小伙伴加入我们，北美，欧洲，日本，东南亚，因为有你，我们因此而不同';
	view.on('init', function (next) {
		tutors.model.findById(locals.id)
			.populate('university')
			.populate('techSkills')
			.sort('-priority')
			.exec(function(err, tutor) {
				if (err) res.err(err);
				locals.tutor = tutor;
				locals.title = `${tutor.name}|${tutor.university[0].name}_澳洲匠人学院`;
				locals.metaDescription = tutor.introduction;
				async.series([
					function(next) {
						if(locals.tutor.service) {
							locals.tutor.service.forEach((service)=>{
								services.model.findById(service)
									.exec((err, item)=> {
										if(err) return res.json({ err:err });
										if(!item) return res.json('not found');
										locals.services.push(item);
										return next();
									});
							});
						}
					},
					function() {
						locals.tutor.course.forEach((course)=>{
							courses.model.findById(course)
								.exec((err, item) => {
									if(err) return res.json({ err:err });
									if(!item) return res.json('not found');
									locals.courses.push(item);
								});
						});
					}
				]);
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

	view.render('tutor');
};
