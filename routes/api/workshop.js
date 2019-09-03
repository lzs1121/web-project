import logger from '../../utils/logger';

const keystone = require('keystone');
const Workshops = keystone.list('Workshop');

exports.list = function(req, res) {
	Workshops.model.find().exec(function(err, workshops) {
		if (err) {
			logger.error(err);
			res.err(workshops);
		}
		res.apiResponse(workshops);
	});
};

exports.get = function(req, res) {
	const stripePublicAPIKEY = process.env.STRIPE_PK;
	Workshops.model
		.findOne()
		.where('key', req.params.key)
		.exec((err, item) => {
			if (err) {
				logger.error(err);
				return res.json({ err: err });
			}
			if (!item) return res.json('not found');
			res.json({
				status: 200,
				workshop: item,
				stripePublicAPIKEY: stripePublicAPIKEY
			});
		});
};
