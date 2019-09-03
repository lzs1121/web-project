// import { keystone } from 'keystone';
const keystone = require('keystone');
const Services = keystone.list('Service');

exports.list = function(req, res) {
	const { slug, type } = req.query;
	//the slug is unique
	if (slug) {
		Services.model.findOne({ slug })
			.exec(function(err, service) {
				if (err) res.err(service);
				res.apiResponse({
					status:200,
					data: service,
				});
			});
	} else {
		const query = { };
		if (type) {
			Object.assign(query, { type });
		}
		Services.model.find(query)
			.exec(function(err, services) {
				if (err) res.err(services);
				res.apiResponse({
					status:200,
					services
				});
			});
	}
};

exports.getServicesByCityId = (req, res) => {
	const { cityId } = req.params;
	const { type } = req.query;
	const query = { };
	if (cityId) {
		Object.assign(query, { city: cityId });
	}
	if (type) {
		Object.assign(query, { type });
	}
	Services.model.find(query)
		.exec(function(err, services) {
			if (err) res.err(services);
			return res.apiResponse(services);
		});
};

exports.get = function(req, res) {
	const serviceId = req.params.id;
	Services.model.findById(serviceId)
		.populate('city', 'name')
		.populate('tutor')
		.exec((err, item)=> {
			if(err) return res.json({ err:err });
			if(!item) return res.json('not found');
			const service = {
				id: item._id,
				name: item.chName,
				slogan: item.slogan,
				shortDescription: item.shortDescription,
				packageIntroduction: item.packageIntroduction,
				city: item.city,
				scheduling: item.scheduling,
				promotion: item.promotion,
				serviceFeature: item.serviceFeature,
			};
			res.json({
				status: 200,
				service: service
			});
		});
};
