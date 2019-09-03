const keystone = require('keystone');
const trainings = keystone.list('Training');
const teachers = keystone.list('Teacher');
const posts = keystone.list('Post');
const programs = keystone.list('Program');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;
	locals.section = 'workShopDetail';
	locals.title = '澳洲匠人学院课程_墨尔本_悉尼_布里斯班_IT培训';
	locals.metaDescription = '澳洲最大IT从业者组织，地跨悉尼（Sydney），墨尔本（Melbourne），布里斯班（Brisbane），有来自全球的四千多位小伙伴加入我们，北美，欧洲，日本，东南亚，因为有你，我们因此而不同';

	// locals.section is used to set the currently selected
	// item in the header navigation.
	Object.assign(locals, {
		title:'',
		metaDescription:'',
		section:'',
		reviews: [],
		teachers: [],
		training: [],
		filters: {
			slug: req.params.slug
		}
	});
	view.on('init', function (next) {
		trainings.model.find()
			.sort('-publishedAt')
			.where('slug', locals.filters.slug)
			.populate('project')
			.exec(function(err, training) {
				if (err) res.err(err);
				locals.training = training[0];
				locals.title = `${training[0].name}_澳洲匠人学院_最大的IT教育平台`;
				if(training[0].meta.description) {
					locals.metaDescription = training[0].meta.description;
				}
				if(training[0].meta.keywords) {
					locals.metaKeywords = training[0].meta.keywords;
				}
				next();
			});
	});

	view.on('init', function (next) {
		teachers.model.find()
			.sort('-priority')
			.where('training')
			.populate('careerPath preCompany university')
			.in([locals.training._id])
			.exec(function(err, teachers) {
				if (err) res.err(err);
				locals.teachers = teachers;
				next();
			});
	});
	view.on('init', function (next) {
		programs.model.find()
			.where('training', locals.training._id)
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
		const post = posts
			.paginate({
				page: req.query.page || 1,
				perPage: 10,
				maxPages: 1,
				filters: {
					state: 'published',
					'training': locals.training._id
				}
			}).sort('-publishedDate').populate('author categories').limit(10);

		post.exec(function (err, results) {
			locals.posts = results;
			next(err);
		});
	});
	view.render('training');
};
