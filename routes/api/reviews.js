const keystone = require('keystone');

const Reviews = keystone.list('Reviews');

exports.get = (req, res) =>{
	res.apiResponse({

	});
};

exports.create = ( req, res ) => {
	const reviews = new Reviews.model();
	const data = (req.method === 'POST') ? req.body: req.query;

	reviews.getUpdateHandler(req).process(data, (err)=>{
		if(err) return res.apiError('error', err);

		return res.apiResponse({
			status: 200
		});
	});
};
