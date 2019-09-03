const keystone = require('keystone');
const courses = keystone.list('Training');
const teachers = keystone.list('Teacher');
const posts = keystone.list('Post');
const programs = keystone.list('Program');
const STORE_COURSE = require('../storeLocation');

exports = module.exports = function (req, res) {

	const view = new keystone.View(req, res);
	const locals = res.locals;

	locals.teachers = [];
	// locals.section is used to set the currently selected
	// item in the header navigation.
	locals.section = 'Web';
	locals.title = '澳洲Web开发培训入门班_Wordpress项目_Web培训_Web零基础培训 | 澳洲匠人学院 学IT，找匠人，拿offer';
	locals.metaDescription = '澳洲匠人学院Web零基础培训，Wordpress项目培训，老师带领项目上线，为大家提供针对于澳洲大学以及澳洲就业市场的Web系列培训，提供开班信息，Web培训就业薪资，Web培训教程下载，行业专家线下指导';
	// Render the view
	view.on('init', function (next) {
		const q = courses.model.findOne({
			courseCode:  STORE_COURSE.COURSE.WEB_BASICS
		});
		q.exec(function (err, result) {
			locals.data = result;
			next();
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
	view.render('webdevBasic');
};
