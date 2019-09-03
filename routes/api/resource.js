const keystone = require('keystone');
const Resource = keystone.list('Resource');

exports.update = function (req, res) {
	Resource.model.findById(req.params.id).exec((err, item) => {
		if(err) return res.json({ err:err });
		if(!item) return res.json('not found');

		const data = (req.method === 'PUT') ? req.body : req.query;

		return item.getUpdateHandler(req).process(data, function(err) {
			if(err) return res.apiError('error', err);
			return res.json({
				status: 200,
				data: item
			});
		});
	});
};

exports.get = (req, res) => {
	Resource.model.findById(req.params.id).exec((err, item) => {
		if(err) return res.json({ err:err });
		if(!item) return res.json('not found');

		return res.json({
			status: 200,
			enrollment:item
		});
	});
};