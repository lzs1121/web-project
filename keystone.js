// Simulate config options from your production environment by
// customising the .env file in your project's root folder.
require('babel-core/register');
require('babel-polyfill');
require('dotenv').config();

// Require keystone
const keystone = require('keystone');
const isProd = process.env.NODE_ENV === 'production';

keystone.init({
	name: 'jiangren',
	brand: 'jiangren',

	sass: 'public',
	static: ['public', 'dist'],
	favicon: 'public/favicon.ico',
	views: 'templates/views',
	'view engine': 'pug',
	'view cache': true,

	emails: 'templates/emails',
	'wysiwyg menubar': true,
	'wysiwyg override toolbar': false,
	'wysiwyg cloudinary images': true,
	'wysiwyg additional buttons': 'forecolor backcolor',
	'wysiwyg additional plugins':
		'table, advlist, anchor, media, textcolor, paste',
	'wysiwyg additional options': {
		//'uploadimage_form_url': '/api/admin/upload',
		external_plugins: {
			uploadimage: '/js/uploadimage/plugin.min.js'
		}
	},
	'auto update': true,
	session: true,
	'session store': 'mongo',
	auth: true,
	'user model': 'User',
	'role model': 'Role',
	'permission model': 'Permission',
	compress: true,
	'case sensitive routing': true
});

if (!isProd) {
	const webpack = require('webpack');
	const config = require('./webpack.config.js');
	const webpackDevMiddleware = require('webpack-dev-middleware');
	const webpackHotMiddleware = require('webpack-hot-middleware');
	const compiler = webpack(config);

	keystone.pre(
		'routes',
		webpackDevMiddleware(compiler, {
			publicPath: config.output.publicPath
		})
	);
	keystone.pre('routes', webpackHotMiddleware(compiler));
}

// Load your project's Models
keystone.import('models');

// Setup common locals for your templates. The following are required for the
// bundled templates and layouts. Any runtime locals (that should be set uniquely
// for each request) should be added to ./routes/middleware.js
keystone.set('locals', {
	_: require('lodash'),
	env: keystone.get('env'),
	utils: keystone.utils,
	editable: keystone.content.editable
});
keystone.set('cors allow origin', true);
keystone.set('cors allow methods', true);
keystone.set('cors allow headers', true);
keystone.set('case sensitive routing', false);
// Load your project's Routes
keystone.set('routes', require('./routes'));

// Setup common locals for your emails. The following are required by keystone's
// default email templates, you may remove them if you're using your own.
keystone.set('email locals', {
	logo_src: '/images/logo-email.gif',
	logo_width: 194,
	logo_height: 76,
	theme: {
		email_bg: '#f9f9f9',
		link_color: '#2697de',
		buttons: {
			color: '#fff',
			background_color: '#2697de',
			border_color: '#1a7cb7'
		}
	}
});

// Load your project's email test routes
keystone.set('email tests', require('./routes/emails'));

// Configure the navigation bar in keystone's Admin UI
keystone.set('nav', {
	补课: ['Order', 'Workshop', 'Student', 'Scheduling', 'Service', 'Resource'],
	培训: [
		'Training',
		'Program',
		'Project',
		'Faq',
		'Question',
		'Answer',
		'TechnologyStack'
	],
	'Career Coaching': ['CareerPath', 'Service'],
	活动: ['meetups', 'MeetupEnrollment'],
	文章: ['posts', 'post-categories'],
	老师: ['Teacher', 'Tutor'],
	Students: [
		'Student',
		'Enrollment',
		'Testimonial',
		'Showcase',
		'Reviews',
		'Quota'
	],
	Settings: ['Service', 'Course', 'University', 'City', 'Resource'],
	工作: ['jobs', 'job-categories', 'Company'],
	Admin: ['users', 'Role', 'Permission', 'MailCampaign']
});

// Start keystone to connect to your database and initialise the web server
// keystone.set('port', 3010);

keystone.start();
