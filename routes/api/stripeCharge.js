const stripe = require('stripe')(process.env.STRIPE_SK);
const logger = require('../../utils/logger');

exports.create = async function(req, res) {
	try {
		const item = await stripe.charges.create({
			amount: req.body.amount,
			currency: req.body.currency,
			source: req.body.source
		});
		res.json(item);
	} catch (err) {
		logger.error(err);
		res.status(500).end();
	}
};
