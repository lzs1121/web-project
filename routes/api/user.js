const jwt = require('jsonwebtoken');
const keystone = require('keystone');
const User = keystone.list('User');
const authConfig = require('../../config/auth-config');

const formateUser = (user) => ({
	email: user.email,
	backupEmail: user.backupEmail || '',
	securityQuestion: user.securityQuestion || '',
	name: `${user.name.first} ${user.name.last}`,
	lastname: user.name.last || '',
	firstname: user.name.first || '',
	isVerified: user.isVerified,
	passwordStrength: user.passwordStrength,
	avatar: user.avatar.secure_url || '',
	id: user._id,
	role: user.role || '',
	profile: user.profile || '',
	title: user.title || '',
	group: '',
	tag: user.tags.reduce(
		(obj, item, index) => {
			obj[index] = {
				key: index,
				label: item
			};
			return obj;
		},
		{}
	),
	country: user.country || '',
	address: user.address || '',
	phone: user.phone || '',
	wechat: user.wechat || '',
});

exports.getCurrentUser = (req, res) => {
	User.model.findById(req.user.id).exec((err, user) => {
		if (err) return res.status(400).json({ message: err });
		return res.status(200).json(formateUser(user));
	});
};

exports.updateCurrentUser = (req, res) => {
	User.model.findOneAndUpdate(
		{ _id: req.user.id },
		{
			$set: {
				...req.body
			}
		},
		{ new: true },
		(err, result) => {
			if (err) return res.status(400).json({ message: err });
			return res.status(200).json(formateUser(result));
		}
	);
};

exports.updatePassword = (req, res) => {
	const { email, oldPassword, newPassword } = req.body;
	User.model.findOne({ email: email }).exec(function (err, user) {
		if (err) return res.status(400).json({ message: err });
		if (!user) return res.status(401).json({ message: 'User not found, please retry to sign in' });
		return user._.password.compare(oldPassword, function (err, isMatch) {
			if (err) return res.status(400).json({ message: err });
			if (!isMatch) return res.status(400).json({ message: 'Incorrect old password ' });
			user.password = newPassword;
			user.save((err, updatedUser) => {
				if (err) return res.status(400).json({ message: err });
				return res.status(200).json(formateUser(updatedUser));
			});
		});
	});
};

exports.resetPassword = (req, res) => {
	const { token, password } = req.body;
	jwt.verify(token, authConfig.TOKEN_SECRET, (err, decoded) => {
		if (err) return res.status(400).json({ message: 'Invalid reset password token' });
		User.model.findOne({ email: decoded.email }).exec(function (err, user) {
			if (err) return res.status(400).json({ message: err });
			if (!user) return res.status(401).json({ message: 'Email not found, please try again' });
			user.password = password;
			return user.save((err, updatedUser) => {
				if (err) return res.status(400).json({ message: 'reset password failed, please contact our staff' });
				return res.status(200).send();
			});
		});
	});
};

exports.signUp = (req, res, next) => {
	User.model.findOne({ email: req.body.email }, (err, existingUser) => {
		if (err) return res.status(400).json({ message: err });
		if (existingUser) return res.status(400).json({ error: 'EMAIL_TAKEN', message: 'Email is already taken' });
		const user = new User.model(req.body);
		return user.save((err, result) => {
			if (err) return res.status(400).json({ message: err });
			next();
		});
	});
};

exports.verifyEmail = (req, res) => {
	const { token } = req.body;
	jwt.verify(token, authConfig.TOKEN_SECRET, (err, decoded) => {
		if (err) return res.status(400).json({ message: 'Invalid email token' });
		User.model.findOneAndUpdate(
			{ email: decoded.email },
			{ $set: { 'isVerified': true } },
			{ new: true },
			(err, result) => {
				if (err) return res.status(400).json({ message: 'Update error,please try again' });
				if (!result) return res.status(404).json({ message: 'User not found' });
				return res.status(200).json({ email: decoded.email });
			}
		);
	});
};



