const jwt = require('jsonwebtoken');
const keystone = require('keystone');
const User = keystone.list('User');
const config = require('../../config/auth-config');

const createToken = (payload, expiresIn = '1d') => {
	return jwt.sign(payload, config.TOKEN_SECRET, { expiresIn: expiresIn });
};

exports.signIn = (req, res) => {
	User.model.findOne({ email: req.body.email }, (err, user) => {
		if (err) return res.status(400).json({ message: err });
		if (!user) return res.status(401).json({ error: 'INVALID_ENTRY', message: 'Invalid email/password' });
		user._.password.compare(req.body.password, (err, result) => {
			if (err) return res.status(400).json({ message: err });
			if (!result) return res.status(401).json({ error: 'INVALID_ENTRY', message: 'Invalid email/password' });
			if (!user.isVerified) return res.status(401).json({ error: 'EMAIL_UNVERIFIED', message: 'email has not been verified' });
			const token = createToken({ id: user._id, role: user.role });
			res.status(200).json({ token, id: user._id, role: user.role });
		});
	});
};