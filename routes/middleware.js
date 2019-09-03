/**
 * This file contains the common middleware used by your routes.
 *
 * Extend or replace these functions as your application requires.
 *
 * This structure is not enforced, and just a starting point. If
 * you have more middleware you may want to group it as separate
 * modules in your project's /lib directory.
 */
const keystone = require('keystone');
const url = require('url');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const config = require('../config/auth-config');
/*
	Initialises the standard view locals

	The included layout depends on the navLinks array to generate
	the navigation in the header, you may wish to change this array
	or replace it with your own templates / logic.
*/
exports.initLocals = function (req, res, next) {
	const Service = keystone.list('Service');
	const Training = keystone.list('Training');
	const Workshop = keystone.list('Workshop');
	res.locals.url = url.format({
		protocol: req.protocol,
		host: req.get('host'),
		pathname: req.originalUrl
	});
	res.locals.currentPath = req.originalUrl;
	res.locals.navLinks = [
		{ label: '首页', key: 'home', href: '/' },
		{ label: '关于匠人', key: 'about', href: '/about' },
		{ label: '培训课程', key: 'courses', href: '/program-courses' },
		{ label: '大学辅导', key: 'tutorials', href: '/tutorials' },
		{ label: '公开课', key: 'open-lecture', href: '/open-lecture' },
		{ label: '求职服务', key: 'career', href: '/career-coaching' },
		{ label: '新闻&资源', key: 'blog', href: '/blog' },
		{ label: 'Jobs', key: 'job', href: '/job' }
	];
	res.locals.user = req.user;
	res.locals.tutoringServiceList = [];
	res.locals.careerCoachingList = [];
	res.locals.workshopsList = [];
	res.locals.trainingList = [];
	Training.model.find()
		.exec(function (err, item) {
			if (err) res.err(err);
			res.locals.trainingList = item;

		});
	Service.model.find()
		.exec(function (err, services) {
			if (err) res.err(err);
			services.map(e => {
				if (e.type === 'Tutoring') {
					res.locals.tutoringServiceList.push(e);
				}
				if (e.type === 'Career') {
					res.locals.careerCoachingList.push(e);
				}
				return res;
			});

			// next();
		});
	Workshop.model.find()
		.sort('-publishedAt')
		.limit(6)
		.exec(function (err, item) {
			if (err) res.err(err);
			res.locals.workshopsList = item.filter(workshop => {
				return workshop.startDate > Date.now();
			});
		});

	res.locals.page = {
		title: '匠人学院',
		path: req.url.split('?')[0] // strip the query - handy for redirecting back to the page
	};
	next();
};


/**
	Fetches and clears the flashMessages before a view is rendered
*/
exports.flashMessages = function (req, res, next) {
	const flashMessages = {
		info: req.flash('info'),
		success: req.flash('success'),
		warning: req.flash('warning'),
		error: req.flash('error')
	};
	res.locals.messages = _.some(flashMessages, function (msgs) { return msgs.length; }) ? flashMessages : false;
	next();
};


/**
	Prevents people from accessing protected pages when they're not signed in
 */
exports.requireUser = function (req, res, next) {
	if (!req.user) {
		req.flash('error', 'Please sign in to access this page.');
		res.redirect('/signin');
	} else {
		next();
	}
};


/**
	Inits the error handler functions into `req`
*/

exports.initErrorHandlers = function (req, res, next) {
	res.err = function (err, title, message) {
		res.status(500).render('errors/500', {
			err: err,
			errorTitle: title,
			errorMsg: message
		});
	};
	res.notfound = function (title, message) {
		res.status(404).render('errors/404', {
			errorTitle: title,
			errorMsg: message
		});
	};
	next();
};

//verify auth and save information in req.user
exports.verifyAuth = (req, res, next) => {
	const token = req.headers.authorization;
	if (!token) {
		return res.status(401).json({
			message: 'Please provide authorization token'
		});
	}
	jwt.verify(token, config.TOKEN_SECRET, (err, decoded) => {
		if (err) {
			return res.status(401).json({
				message: 'Invalid authorization token'
			});
		}
		req.user = decoded;
		next();
	});
};