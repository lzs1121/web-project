const jwt = require('jsonwebtoken');
const keystone = require('keystone');
const User = keystone.list('User');
const sendEmail = require('../../utils/mailer');
const template = require('../../config/mailer-config.json');
const urlConfig = require('../../config/url-config.json');
const authConfig = require('../../config/auth-config');
const verificationEmail = require('../../templates/emails/verification-email');

const createToken = (payload, expiresIn = '1d') => {
	return jwt.sign(payload, authConfig.TOKEN_SECRET, { expiresIn: expiresIn });
};

const prefix = process.env.NODE_ENV === 'production' ? urlConfig.jrDashProd : urlConfig.jrDashDev;

exports.sendVerification = (req, res) => {
	User.model.findOne({ email: req.body.email }, (err, existingUser) => {
		if (err) return res.status(400).json({ message: err });
		if (!existingUser) return res.status(401).json({ message: 'Email not found,please register first' });
		const token = createToken({ email: existingUser.email });
		const email = verificationEmail(
			`${prefix}/user/email-verification?token=${token}`
		);
		sendEmail({
			from: template.registry.from,
			to: req.body.email,
			subject: template.registry.subject,
			html:`${email}`
		}, (err, msg) => {
			if (err) return res.status(400).json({ message: 'sending email failed, please try again' });
			return res.status(200).send();
		});
	});
};

exports.sendForgetPassword = (req, res) => {
	User.model.findOne({ email: req.body.email }, (err, existingUser) => {
		if (err) return res.status(400).json({ message: err });
		if (!existingUser) return res.status(401).json({ message: 'Email not found,please register first' });
		const token = createToken({ email: existingUser.email });
		sendEmail({
			from: template.password.from,
			to: req.body.email,
			subject: template.password.subject,
			text: `${template.password.text}\n${prefix}/user/reset-password?token=${token}${template.signature}`
		}, (err, msg) => {
			if (err) return res.status(400).json({ message: 'sending email failed, please try again' });
			return res.status(200).send();
		});
	});
};