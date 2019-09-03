const keystone = require('keystone');
const MeetupEnrollment = keystone.list('MeetupEnrollment');

exports.list = function(req, res) {
	MeetupEnrollment.model.find()
		.exec(function(err, enrollment) {
			if (err) res.err(enrollment);
			res.apiResponse(enrollment);
		});
};

exports.get = (req, res) => {
	MeetupEnrollment.model.findById(req.params.id).exec((err, item)=> {
		if(err) return res.json({ err:err });
		if(!item) return res.json('not found');

		res.json({
			enrollment:item
		});
	});
};


exports.create = function (req, res) {
	const data = (req.method === 'POST') ? req.body :req.query;
	const enrollment = new MeetupEnrollment.model(data);
	enrollment.save( (err, item) => {
		if(err) return res.json({ err:err });
		return res.json({
			status: 200,
			data: item
		});
	});
};

exports.update = function (req, res) {
	MeetupEnrollment.model.findById(req.params.id).exec((err, item)=> {
		if(err) return res.json({ err:err });
		if(!item) return res.json('not found');

		const data = (req.method === 'PUT') ? req.body : req.query;

		item.getUpdateHandler(req).process(data, function(err) {
			if(err) return res.apiError('error', err);
			return res.json({
				status: 200,
				data: item
			});
		});
	});

};
