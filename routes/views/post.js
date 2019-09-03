const keystone = require('keystone');
const post = keystone.list('Post');
const programs = keystone.list('Program');
exports = module.exports = function (req, res) {
	const view = new keystone.View(req, res);
	const locals = res.locals;

	// Set locals
	locals.section = 'blog';

	locals.filters = {
		post: req.params.slug
	};
	locals.data = {
		posts: []
	};
	locals.programs = [];
	locals.title = 'Blog - 澳洲最大IT从业者组织，地跨悉尼（Sydney），墨尔本（Melbourne），布里斯班（Brisbane）';
	locals.metaDescription = '澳洲最大IT从业者组织，地跨悉尼（Sydney），墨尔本（Melbourne），布里斯班（Brisbane），有来自全球的四千多位小伙伴加入我们，北美，欧洲，日本，东南亚，因为有你，我们因此而不同';
	// Load the current post
	view.on('init', function (next) {

		const q = post.model.findOne({
			state: 'published',
			slug: locals.filters.post
		}).populate('author categories');

		q.exec(function (err, result) {
			if(result) {
				locals.data.post = result;
				locals.title = result.title + '|澳洲IT匠人学院 最专业IT找工作平台';
				locals.metaDescription = result.meta.description || result.content.brief;
				locals.metaKeywords = result.meta.keywords;
				locals.thumbnailSrc = result.image.secure_url || '';
			}
			next(err);
		});

	});
	view.on('init', function (next) {
		programs.model.find()
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

	// Load other posts
	view.on('init', function (next) {

		const q = post.model.find().where('state', 'published').sort('-publishedDate').populate('author').limit('4');

		q.exec(function (err, results) {
			locals.data.posts = results;
			next(err);
		});

	});

	// Render the view
	view.render('post');
};
