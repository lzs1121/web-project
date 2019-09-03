const keystone = require('keystone');
const async = require('async');
const courses = keystone.list('Training');
const post = keystone.list('Post');
exports = module.exports = function (req, res) {
	const view = new keystone.View(req, res);
	const locals = res.locals;

	// Init locals
	locals.section = 'blog';
	locals.filters = {
		category: req.params.category
	};
	locals.data = {
		posts: [],
		categories: []
	};
	locals.title = '澳洲IT新闻，大学选课，考试重点，IT资源，IT新闻 | 澳洲匠人学院(澳洲IT匠人圈)';
	locals.metaDescription = '澳大利亚最专业的中文IT网站。我们旨在为中国澳洲程序员，网络工程师，BA等提供每日不可或缺的新闻、深度分析以及评论。让更多中国程序员了解澳洲IT';
	// Load all categories
	view.on('init', function (next) {

		keystone.list('PostCategory').model.find().sort('name').exec(function (err, results) {

			if (err || !results.length) {
				return next(err);
			}

			locals.data.categories = results;

			// Load the counts for each category
			async.each(locals.data.categories, function (category, next) {

				keystone.list('Post').model.count().where('categories').in([category.id]).exec(function (err, count) {
					category.postCount = count;
					next(err);
				});

			}, function (err) {
				next(err);
			});
		});
	});

	// Load the current category filter
	view.on('init', function (next) {

		if (req.params.category) {
			keystone.list('PostCategory').model.findOne({ key: locals.filters.category }).exec(function (err, result) {
				locals.data.category = result;
				next(err);
			});
		} else {
			next();
		}
	});

	view.on('init', function (next) {
		courses.model.find()
			.where('featured', 'recommend')
			.exec(function(err, courses) {
				if (err) res.err(err);
				locals.courses = courses;
				next();
			});
	});

	// Load the posts
	view.on('init', function (next) {
		const q = post.paginate({
			page: req.query.page || 1,
			perPage: 20,
			maxPages: 20,
			filters: {
				state: 'published',
				isAuthor: true
			}
		})
			.sort('-publishedDate')
			.populate('author categories');

		if (locals.data.category) {
			q.where('categories').in([locals.data.category]);
		}

		q.exec(function (err, results) {
			locals.data.posts = results;
			next(err);
		});
	});

	// Render the view
	view.render('blog');
};
