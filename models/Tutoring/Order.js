import logger from '../../utils/logger';
import sendMail from '../../utils/mailer';

const template = require('../../config/mailer-config.json');
const keystone = require('keystone');
const Types = keystone.Field.Types;
const salesMail = process.env.MAIL_OF_SALES;

/**
 * Order Model
 * For order package and service
 * =============
 */

const Order = new keystone.List('Order', {
	map: { name: 'bookId' },
	autokey: { from: 'bookId', path: 'slug', unique: true },
	defaultSort: '-createdAt',
	track: true
});

Order.add(
	{
		bookId: { type: String, noedit: true },
		orderType: { type: Types.Select, options: 'General , Workshop' },
		email: { type: String },
		wechat: { type: String },
		phone: { type: String },
		student: { type: Types.Relationship, ref: 'Student' },
		service: { type: Types.Relationship, ref: 'Service' },
		serviceTime: { type: String },
		workshop: { type: Types.Relationship, ref: 'Workshop' },
		city: { type: Types.Relationship, ref: 'City' }
	},
	'School Information',
	{
		university: { type: Types.Relationship, ref: 'University' },
		year: { type: String }, //TODO: ref to a new database called 'year', or keep it String and done the year selection at front end.
		semester: { type: String }, //TODO: ref to a new database called 'semester', or keep it String and done the year selection at front end.
		major: { type: String },
		degree: { type: String }
	},
	'Price',
	{
		unit: { type: String },
		packagePrice: { type: Number },
		unitPrice: { type: Number },
		tutoringLength: { type: Number, label: 'Package hours', default: 1 },
		totalPrice: { type: Number, noedit: true }
	},
	'Transaction Info',
	{
		payMethod: {
			type: Types.Select,
			options: 'royalpay, paypal, stripe, 当面付款',
			label: '付款方式'
		},
		paymentTransactionId: { type: String, label: '交易ID' }
	},
	'Extended Infomation (Optional)',
	{
		course: { type: Types.Relationship, ref: 'Course' },
		tutor: { type: Types.Relationship, ref: 'Tutor' },
		teacher: { type: Types.Relationship, ref: 'Teacher' },
		training: { type: Types.Relationship, ref: 'Training' },
		address: { type: String },
		temporaryName: { type: String }, //TBA remove after created user management
		wayKnowUs: { type: String },
		startedDate: { type: Types.Date },
		studyTarget: { type: String },
		userComment: { type: String },
		confirmed: { type: Types.Boolean, index: true }
	},
	'Sales Admin',
	{
		leadStatus: {
			type: Types.Select,
			options:
				'Open, Connected, In Progress,Done, Unqualified, Bad Timing',
			label: '销售状态'
		},
		followedby: {
			type: Types.Relationship,
			ref: 'User',
			label: '联系人',
			many: true
		},
		comment: { type: Types.TextArray, label: '纪录' }
	},
	'Payment In Person',
	{
		isFaceToFace: { type: Boolean, label: '当面付款' },
		responsiblePerson: {
			type: Types.Relationship,
			ref: 'User',
			label: '处理人'
		},
		transferRecord: { type: Types.Html, wysiwyg: true, label: '转账记录' },
		notes: { type: Types.TextArray, label: '备注' }
	}
);

function generateID() {
	const date = Date.now().toString();
	return 'ORD' + date.slice(-6);
}

// Hooks

Order.schema.pre('save', function(next) {
	this.bookId = generateID();
	if (this.packagePrice) {
		this.totalPrice = this.packagePrice;
	} else {
		this.totalPrice = this.unitPrice * this.tutoringLength;
	}
	this.wasNew = this.isNew;
	next();
});

Order.schema.post('save', function() {
	const Quota = keystone.list('Quota');
	const serviceId = this.service;
	const workshopId = this.workshop;
	const totalLength = this.tutoringLength;
	const startedDate = this.startedDate;

	//if service existed, send a notification email to the user
	if (this.userComment || this.tutor || this.teacher || this.workshop) {
		//Please comment below line when development, it will send email
		this.sendNotificationEmailToCustomer();
		this.sendNotificationEmailToSales();
	}
	keystone
		.list('Student')
		.model.findById(this.student, function(err, student) {
			if (student) {
				const quota = new Quota.model({
					client: student.name,
					student: student.id,
					service: serviceId ? serviceId : workshopId,
					length: totalLength,
					startedDate: startedDate
				});
				quota.save(err => {
					if (err) {
						logger.error(err);
					}
				});
			}
		});
});

Order.schema.methods.sendNotificationEmailToCustomer = function(callback) {
	// Gmail Account: jracademybne@gmail.com
	// Gmail Password: jracademybne2018
	//Please go to Google OAuth 2.0 Playground for the new refreshToken and accessToken
	if (typeof callback !== 'function') {
		callback = function() {};
	}

	const mailOptions = {
		from: template.orderToCustomer.from,
		to: this.email,
		subject: template.orderToCustomer.subject,
		text:
			'亲爱的 ' +
			this.temporaryName +
			' 同学，\n\n您已经成功报名匠人圈课程，我们会及时与您取得联系。' +
			'您的订单号是:' +
			this.bookId +
			'\n\n如果您有任何问题，请与客服小花联系。微信号：uniapp001\n\n澳洲IT匠人圈\n\nhttps://jiangren.com.au/'
	};

	sendMail(mailOptions);
};

Order.schema.methods.sendNotificationEmailToSales = async function(callback) {
	if (typeof callback !== 'function') {
		callback = function() {};
	}

	let cityName = '';
	let content = '';

	await keystone
		.list('City')
		.model.findById(this.city, function(err, city) {
			cityName = city.name;
		});

	if (this.training) {
		await keystone
			.list('Training')
			.model.findById(this.training, function(err, training) {
				content =`\n培训课程：${training.name}`;
			});
	}
	else {
		await keystone
			.list('Service')
			.model.findById(this.service, function(err, service) {
				content =`\n服务内容：${service.name}`;
			});
	}

	if (this.course) {
		await keystone
			.list('University')
			.model.findById(this.university, function(err, university) {
				content = `${content} \n学校名称：${university.slug}`;
			});
		await keystone
			.list('Course')
			.model.findById(this.course, function(err, course) {
				content = `${content} \n课程名称：${course.name}`;
			});

	}

	const mailOptions = {
		from: template.orderToSales.from,
		to: salesMail,
		subject: template.orderToSales.subject,
		text:
			'姓名：' +
			this.temporaryName +
			'\n微信：' +
			this.wechat +
			'\n电话：' +
			this.phone +
			'\n邮箱：' +
			this.email +
			'\n城市：' +
			cityName +
			content
	};

	sendMail(mailOptions);
};

Order.defaultColumns =
	'bookId|10%, orderType|10%, temporaryName|10%, service|15%, workshop|15%,course|10%, leadStatus|10%, city|10%, createdAt|10%';

Order.register();
