const keystone = require('keystone');
const Jobs = keystone.list('Job');

exports.list = function (req, res) {
	const featured = Jobs.paginate({
		page: (isNaN(req.query.page)
			|| req.query.page === ''
			|| req.query.page == null)
			? 1 : req.query.page,
		perPage: 6,
		filters: {
			state: 'published',
			isFeatured: true,
			status: 'Open'
		}
	})
		.sort('-publishedDate')
		.populate('city', 'name');
	featured.exec(function (err, results) {
		if (err) return res.json({ err: err });
		if (!results) return res.json('not found');
		res.json({
			status: 200,
			data: results,
		});
	});
};