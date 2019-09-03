const keystone = require('keystone');
const Types = keystone.Field.Types;
const config = require('../config/config.json');

const Email = require('keystone-email');
const path = require('path');
/**
 * Enrollment Model
 * =============
 */

const Enrollment = new keystone.List('Enrollment', {
	autokey: { from: 'name', path: 'key', unique: true }
});

Enrollment.add({
	//first step
	name: { type: String, required: true },
	email: { type: Types.Email },
	phone: { type: String },
	wechat: { type: String },
	//second step
	training: { type: Types.Relationship, ref: 'Training', many: true, filters: { slug: ':slug' } },
	courseAlias: { type: String },
	location: { type: Types.Select, options: config.locations },
	enquiryType: { type: Types.Select, options: config.enquiryType },
	employmentStatus: { type: Types.Select, options: config.employmentStatus },
	linkedinUrl: { type: String },
	message: { type: String },
	experience: { type: String },
	createdAt: { type: Date, default: Date.now }
});

Enrollment.schema.pre('save', function (next) {
	this.wasNew = this.isNew;
	next();
});

Enrollment.schema.post('save', function () {
	if (this.wasNew) {
		// this.sendNotificationEmail();
	}
});

//TODO : Change template
Enrollment.schema.methods.sendNotificationEmail = function (callback) {
	if (typeof callback !== 'function') {
		callback = function () {};
	}
	const enrollment = this;
	keystone.list('User').model.find().where('isAdmin', true).exec(function (err, admins) {
		if (err) return callback(err);
		for(const admin of admins) {
			new Email(path.join(__dirname, 'email-template.pug'), {
				transport: 'mailgun'
			}).send({
				admin: admin,
				user: enrollment
			}, {
				apiKey: 'key-6eec61fd764df4b00bfb1634f528ad19',
				domain: 'sandbox36d2455d79fc4df79a29d08050415143.mailgun.org',
				to: 'ozitquan@gmail.com',
				from: {
					name: 'Your Site',
					email: 'ozitquan@gmail.com'
				},
				subject: 'Your first KeystoneJS email'
			}, function (err, result) {
				if (err) {
					console.error('Mailgun test failed with error:\n', err);
				} else {
					console.log('Successfully sent Mailgun with result:\n', result);
				}
			});
		}

	});
};

Enrollment.defaultSort = '-createdAt';
Enrollment.defaultColumns = 'name, email, wechat, location, courseAlias, createdAt';
Enrollment.register();
