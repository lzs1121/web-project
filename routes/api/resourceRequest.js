const keystone = require('keystone');
const MailCampaign = keystone.list('MailCampaign');
const Resource = keystone.list('Resource');
const sendEmail = require('../../utils/mailer');
const mailConfig = require('../../config/mailer-config');

exports.list = function(req, res) {
	MailCampaign.model.find()
		.exec(function(err, request) {
			if (err) res.err(request);
			res.apiResponse(request);
		});
};

exports.create = function (req, res) {
	const data = (req.method === 'POST') ? req.body :req.query;
	const mailOptions = {
		from: mailConfig.resource.from,
		to: req.body.email,
		subject: mailConfig.resource.subject,
		text: mailConfig.resource.text,
		attachments: [
			{
				// use URL as an attachment
				filename: req.body.resourceName,
				path: req.body.resourceLink
			}
		],
	};
	// Timers plus one
	Resource.model.findById(data.targetResource).exec((err, data) => {
		if (err) return null;
		data.requestTimes = data.requestTimes+1;
		data.save((err) => {
			if(err) console.log(err);
		});
	});
	sendEmail(mailOptions);
	const mailCampaign = new MailCampaign.model(data);

	mailCampaign.save((err, item) => {
		if (err) return res.json({ err: err });
		res.json({
			status: 200,
			data: item
		});
	});

};

exports.update = function (req, res) {
	Resource.model.findById(req.params.id).exec((err, item) => {
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