const keystone = require('keystone');
const Post = keystone.list('Post');

exports.create = (req, res) => {
	const reqData = (req.method === 'POST') ? req.body : req.query;
	// For temporary the student name will be saved as Tempary name 
	const data = {
		title: reqData.title,
		meta: {
			title: reqData.meta.title
		},
		content: {
			brief: reqData.content.brief,
			extended: reqData.content.extended
		}

	};

	const post = new Post.model(data);

	post.save((err, item) => {
		res.json({
			status: 200,
			data: item
		});
	});
};

exports.list = function (req, res) {
	Post.model.find()
		.exec(function (err, posts) {
			if (err) res.err(posts);
			res.apiResponse(posts);
		});
};

exports.getPostBySlug = (req, res) => {
	const slug = req.params.slug;
	Post.model.findOne(
		{
			state: 'published',
			slug
		}).populate('author').exec(function (err, article) {
		if (err) {
			res.err(article);
		}
		res.json({
			status: 200,
			data: article
		});
	});
};

exports.getPostsByPage = (req, res) => {
	// page size means the number of Blogs per page
	const pageSize = req.query.number;
	if (!pageSize) return	res.json('not found');
	Post.model.where('state', 'published').sort({ publishedDate: 'desc' })
		.exec(function (err, posts) {
			if (err) res.err(posts);
			posts = posts.slice(0, pageSize);
			res.json({
				status: 200,
				data: posts
			});
		});

};