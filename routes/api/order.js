import logger from '../../utils/logger';

const keystone = require('keystone');
const Order = keystone.list('Order');

exports.create = (req, res) =>{
	const reqData = (req.method === 'POST') ? req.body: req.query;
	// For temporary the student name will be saved as Tempary name 
	const data = reqData;
	data['temporaryName']=reqData.name;
	if (reqData.workshop) {
		data['orderType']='Workshop';
	}else{
		data['orderType']='General';
	}
	const order = new Order.model(data);
	order.save((err, item) =>{
		if (err) {
			logger.error(err);
			return res.json({ err: err });
		}
		return res.json({
			status: 200,
			data: item
		});
	});
};

exports.list = function(req, res) {
	Order.model.find()
		.exec(function(err, order) {
			if (err) {
				logger.error(err);
				res.err(order);
			}
			res.json({
				status: 200,
				data:order
			});
		});
};

exports.update = function (req, res) {
	Order.model.findById(req.params.id).exec((err, item) => {
		if(err) {
			logger.error(err);
			return res.json({ err:err });
		}
		if(!item) return res.json('not found');

		const data = (req.method === 'PUT') ? req.body : req.query;

		return item.getUpdateHandler(req).process(data, function(err) {
			if(err) {
				logger.error(err);
				return res.apiError('error', err);
			}
			return res.json({
				status: 200,
				data: item
			});
		});
	});
};

exports.get = (req, res) => {
	Order.model.findById(req.params.id).exec((err, item) => {
		if(err) {
			logger.error(err);
			return res.json({ err:err });
		}
		if(!item) return res.json('not found');

		return res.json({
			status: 200,
			enrollment:item
		});
	});
};