const keystone = require('keystone');
const Enrollment = keystone.list('Enrollment');

exports.list = function(req, res) {
	Enrollment.model.find()
		.exec(function(err, enrollment) {
			if (err) res.err(enrollment);
			res.apiResponse(enrollment);
		});
};

exports.get = (req, res) => {
	Enrollment.model.findById(req.params.id).exec((err, item)=> {
		if(err) return res.json({ err:err });
		if(!item) return res.json('not found');

		res.json({
			status: 200,
			enrollment:item
		});
	});
};


exports.create = function (req, res) {
	const data = (req.method === 'POST') ? req.body :req.query;
	const enrollment = new Enrollment.model(data);
	enrollment.save( (err, item) => {
		if(err) return res.json({ err:err });
		res.json({
			status: 200,
			data: item
		});
	});
};

exports.update = function (req, res) {
	Enrollment.model.findById(req.params.id).exec((err, item)=> {
		if(err) return res.json({ err:err });
		if(!item) return res.json('not found');

		const data = (req.method === 'PUT') ? req.body : req.query;

		item.getUpdateHandler(req).process(data, function(err) {
			if(err) return res.apiError('error', err);
			res.json({
				status: 200,
				data: item
			});
		});
	});

};
