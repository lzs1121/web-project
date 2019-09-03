const keystone = require('keystone');
const Feedback = keystone.list('Feedback');

exports.get = function(req, res) {
	Feedback.model.find()
		.exec(function(err, feedbacks) {
			if (err) res.err(err);
			res.apiResponse(feedbacks);
		});
};

exports.create = function (req, res) {
	const feed = new Feedback.model();
	const data = (req.method === 'POST') ? req.body :req.query;
	feed.getUpdateHandler(req).process(data, function(err) {
		if(err) return res.apiError('error', err);

		return res.apiResponse({
			data: '200'
		});
	});

};
