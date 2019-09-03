const nodemailer = require('nodemailer');
const logger = require('./logger');
const config = require('../config/auth-config');

module.exports = (mailOptions) => {
	const transporter = nodemailer.createTransport({
		host: config.GMAIL_AUTH_HOST,
		port: config.GMAIL_AUTH_PORT,
		secure: false, // ture for 465, false for other ports

		auth: {
			user: config.GMAIL_AUTH_USER,
			pass: config.GMAIL_AUTH_PASS
		}
	});

	transporter.sendMail(mailOptions, (err, res) => {
		if (err) {
			// callback(err, null);
			logger.error(err);
		} else {
			// callback(null, res);
			logger.debug('Email Sent');
		}
	});
};
