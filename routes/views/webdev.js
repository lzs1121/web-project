const keystone = require('keystone');
const training = keystone.list('Training');
const reviews = keystone.list('Reviews');
const teachers = keystone.list('Teacher');
const posts = keystone.list('Post');
const programs = keystone.list('Program');
const STORE_COURSE = require('../storeLocation');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;
	locals.teachers = [];
	locals.reviews = [];
	locals.programs = [];
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'Web';
	locals.title = '澳洲Web全栈开发项目班_Web培训_前端工程师培训_FLAG名师带你飞|悉尼布里斯班墨尔本';
	locals.metaDescription = '澳洲Fullstack全栈开发培训，培养前端Front-end工程师和具备前端Frontend技能的后端工程师，通过3个项目+1个月澳洲公司实习，快速获得工作经验，在悉尼，墨尔本，布里斯班，堪培拉，阿德莱德等地培训';
	locals.metaKeywords = 'Web全栈,Fullstack,前端,后端,Web开发培训';
	// Render the view
	view.on('init', function (next) {
		const q = training.model.findOne({
			courseCode: STORE_COURSE.COURSE.WEB_FULLSTACK
		});
		q.exec(function (err, result) {
			locals.data = result;
			reviews.model.find()
				.sort('-priority')
				.where('course', result._id)
				.exec(function(err, reviews) {
					if (err) res.err(err);
					locals.reviews = reviews;
					next();
				});
		});
	});
	view.on('init', function (next) {
		teachers.model.find()
			.sort('-priority')
			.where('training')
			.populate('careerPath preCompany university')
			.in([locals.data._id])
			.exec(function(err, teachers) {
				if (err) res.err(err);
				locals.teachers = teachers;
				next();
			});
	});
	view.on('init', function (next) {
		programs.model.find()
			.where('training', locals.data.id)
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
					'training': locals.data.id
				}
			}).sort('-publishedDate').populate('author categories').limit(10);
		post.exec(function (err, results) {
			locals.posts = results;
			next(err);
		});
	});
	view.render('webdev');
};
