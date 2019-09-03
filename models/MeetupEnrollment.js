const keystone = require('keystone');
const Types = keystone.Field.Types;
const nodemailer = require('nodemailer');
/**
 * Meetup Enrollment Model
 * =============
 */

const MeetupEnrollment = new keystone.List('MeetupEnrollment', {
	autokey: { from: 'name', path: 'key', unique: true }
});

MeetupEnrollment.add({
	name: { type: String, required: true },
	email: { type: Types.Email },
	phone: { type: String },
	wechat: { type: String },
	university:{ type:String },
	major:{ type:String },
	degree:{ type:String },
	channel:{ type:String },
	payMethod:{ type:String },
	createdAt: { type: Date, default: Date.now }

});
MeetupEnrollment.schema.pre('save', function (next) {
	this.wasNew = this.isNew;
	next();
});
MeetupEnrollment.schema.post('save', function () {
	if(this.wasNew) {
		this.sendNotificationEmail();
	}
});
MeetupEnrollment.schema.methods.sendNotificationEmail = function (callback) {
	// Gmail Account: jracademybne@gmail.com
	// Gmail Password: jracademybne2018
	//Please go to Google OAuth 2.0 Playground for the new refreshToken and accessToken
	if (typeof callback !== 'function') {
		callback = function () {};
	}
	const transporter = nodemailer.createTransport({
		host: 'smtp.gmail.com',
		port: 587,
		secure: false, // ture for 465, false for other ports
		auth: {
			user: 'jracademybne@gmail.com',
			pass: 'jracademybne2018'
		}
	});

	const mailOptions = {
		from: 'JR Academy <jracademybne@gmail.com>',
		to: this.email,
		subject: '报名成功通知-澳洲IT匠人圈',
		text: '亲爱的 ' + this.name + ' 同学，\n\n您已经成功报名匠人圈活动，我们会及时与您取得联系。\n\n如果您有任何问题，请与客服小花联系。微信号：uniapp001\n\n澳洲IT匠人圈\n\nhttps://jiangren.com.au/'
	};

	transporter.sendMail(mailOptions, function (err, res) {
		if(err) {
			console.log('Error');
		} else {
			console.log('Email Sent');
		}
	});
};

// MeetupEnrollment.schema.pre('save', function (next) {
// 	this.wasNew = this.isNew;
// 	next();
// });

//
// //TODO : Change template
// MeetupEnrollment.schema.methods.sendNotificationEmail = function (callback) {
// 	if (typeof callback !== 'function') {
// 		callback = function () {};
// 	}
// 	const enrollment = this;
// 	keystone.list('User').model.find().where('isAdmin', true).exec(function (err, admins) {
// 		if (err) return callback(err);
// 		for(let admin of admins) {
// 			new Email(path.join(__dirname, 'email-template.pug'), {
// 				transport: 'mailgun'
// 			}).send({
// 				admin: admin,
// 				user: enrollment
// 			}, {
// 				apiKey: 'key-6eec61fd764df4b00bfb1634f528ad19',
// 				domain: 'sandbox36d2455d79fc4df79a29d08050415143.mailgun.org',
// 				to: 'ozitquan@gmail.com',
// 				from: {
// 					name: 'Your Site',
// 					email: 'ozitquan@gmail.com'
// 				},
// 				subject: 'Your first KeystoneJS email'
// 			}, function (err, result) {
// 				if (err) {
// 					console.error('Mailgun test failed with error:\n', err);
// 				} else {
// 					console.log('Successfully sent Mailgun with result:\n', result);
// 				}
// 			});
// 		}
//
// 	});
// };

MeetupEnrollment.defaultSort = '-createdAt';
MeetupEnrollment.defaultColumns = 'name, email, wechat, phone, createdAt';
MeetupEnrollment.register();
