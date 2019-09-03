const keystone = require('keystone');
const async = require('async');
const _ = require('lodash');
const User = keystone.list('User');

exports = module.exports = function(req, res) {

	const locals = {
		form: req.body,

		newUser: false
	};
	// Function to handle signin
	const doSignIn = function() {

		const onSuccess = function(user) {
			return res.apiResponse({
				success: true,
				session: true,
				date: new Date().getTime(),
				userId: user.id
			});
		};

		const onFail = function(err) {
			return res.apiResponse({
				success: false,
				session: false,
				message: (err && err.message ? err.message : false) || 'Sorry, there was an issue signing you in, please try again.'
			});
		};

		keystone.session.signin(String(locals.newUser._id), req, res, onSuccess, onFail);

	};

	async.series([
		// Perform basic validation
		function(next) {
			if (!locals.form.firstname || !locals.form.lastname || !locals.form.email || !locals.form.password || !locals.form.website) {
				return res.apiResponse({
					success: false,
					session: false
				});
			}

			return next();

		},

		// Check for user by email
		function(next) {

			const query = User.model.findOne();
			query.where('email', locals.form.email);
			query.exec(function(err, user) {
				if (err) {
					return next({ message: 'Sorry, there was an error processing your information, please try again.' });
				}
				if (user) {
					return next({ message: 'There\'s already an account with that email address, please sign-in instead.' });
				}
				return next();
			});

		},

		// Create user
		function(next) {

			const userData = {
				name: {
					first: locals.form.firstname,
					last: locals.form.lastname
				},
				email: locals.form.email,
				password: locals.form.password,

				state: 'enabled',

				website: locals.form.website,

				isVerified: false,
				roles: 'member',
				notifications: {
					posts: locals.form.alertsNotifications,
					meetups: locals.form.alertsNotifications
				},

				services: {}
			};

			// console.log('[api.app.signup]  - New user data:', userData );

			locals.newUser = new User.model(userData);

			locals.newUser.save(function(err) {
				if (err) {
					return next({ message: 'Sorry, there was an error processing your account, please try again.' });
				}
				return next();
			});

		},

		// Session
		function() {
			return doSignIn();
		}

	], function(err) {
		if (err) {
			return res.apiResponse({
				success: false,
				session: false,
				message: (err && err.message ? err.message : false) || 'Sorry, there was an issue signing you in, please try again.'
			});
		}
	});

};
