import keystone from 'keystone';
const moment = require('moment');
const Types = keystone.Field.Types;
const _ = require('lodash');

const Workshop = new keystone.List('Workshop', {
	track: true,
	autokey: { path: 'key', from: 'name', unique: true }
});

Workshop.add(
	{
		name: {
			type: String,
			required: true,
			initial: true,
			label: '活动名称'
		},

		meta: {
			title: { type: String },
			keywords: { type: String },
			description: { type: String }
		},

		publishedDate: { type: Types.Date, index: true, label: '活动发布时间' },

		state: {
			type: Types.Select,
			options: 'draft, scheduled, active, past',
			noedit: true,
			label: '活动状态'
		},

		activityType: {
			type: Types.Select,
			options: '公开课, 辅导班',
			label: '活动类型'
		},

		activityForm: {
			type: Types.Select,
			options: '线上, 线下, 线上/线下',
			label: '活动形式'
		},

		startDate: {
			type: Types.Datetime,
			required: true,
			initial: true,
			index: true,
			width: 'short',
			note: 'e.g. 2014-07-15 / 6:00pm',
			label: '活动开始具体时间'
		},

		endDate: {
			type: Types.Datetime,
			required: true,
			initial: true,
			index: true,
			width: 'short',
			note: 'e.g. 2014-07-15 / 9:00pm',
			label: '活动结束具体时间'
		},

		city: { type: Types.Relationship, ref: 'City', label: '城市' }
	},
	'WorkShop Basic Infomation',
	{
		commenceDate: { type: String, label: '开始时间' },

		cardDescription: { type: String, label: '目标' }
	},
	'Others',
	{
		image: {
			type: Types.CloudinaryImage,
			note: 'Width:900px, height:500px',
			label: '活动图片',
			autoCleanup: true,
			select: true
		},
		hoster: { type: String, default: 'IT匠人', label: '创办人' },
		packagePrice: { type: Number },
		unitPrice: { type: Number, default: 0, label: '单位收费' },
		tutoringLength: { type: Number, label: 'Package hours', default: 1 },
		totalPrice: { type: Number, noedit: true },
		unit: { type: String, label: '单位' },
		place: {
			type: String,
			required: false,
			initial: true,
			width: 'medium',
			default: '36 Mein St, Spring Hill,Brisbane',
			note: '36 Mein St, Spring Hill,Brisbane',
			label: '上课地点'
		},
		map: {
			type: String,
			required: false,
			initial: true,
			width: 'medium',
			default: '36 Mein St, Spring Hill,Brisbane',
			note: '36 Mein St, Spring Hill,Brisbane',
			label: '具体位置'
		},
		description: { type: Types.Html, wysiwyg: true, label: '活动描述' },
		tutor: { type: Types.Relationship, ref: 'Tutor' },
		teacher:  { type: Types.Relationship, ref: 'Teacher' },
		university: { type: Types.Relationship, ref: 'University' },
		course: { type: Types.Relationship, ref: 'Course' },
		maxRSVPs: { type: Number, default: 100 },
		totalRSVPs: { type: Number, noedit: true }
	}
);

Workshop.schema.virtual('url').get(() => {
	return '/workshop/' + this.key;
});

// Pre Save

Workshop.schema.pre('save', function(next) {
	const workshop = this;
	// no published date, it's a draft workshop
	if (!workshop.publishedDate) {
		workshop.state = 'draft';
	}
	// workshop date plus one day is after today, it's a past workshop
	else if (moment().isAfter(moment(workshop.endDate).add(1, 'day'))) {
		workshop.state = 'past';
	}
	// publish date is after today, it's an active workshop
	else if (moment().isAfter(workshop.publishedDate)) {
		workshop.state = 'active';
	}
	// publish date is before today, it's a scheduled workshop
	else if (moment().isBefore(moment(workshop.publishedDate))) {
		workshop.state = 'scheduled';
	}
	if (this.packagePrice) {
		this.totalPrice = this.packagePrice;
	} else {
		this.totalPrice = this.unitPrice * this.tutoringLength;
	}
	this.wasNew = this.isNew;
	next();
});

Workshop.schema.set('toJSON', {
	transform: function(doc, rtn, options) {
		return _.pick(
			doc,
			'_id',
			'name',
			'startDate',
			'endDate',
			'place',
			'map',
			'description',
			'course',
			'tutor',
			'teacher',
			'city',
			'university',
			'unitPrice',
			'unit',
			'tutoringLength',
			'packagePrice',
			'totalPrice'
		);
	}
});

Workshop.defaultSort = '-startDate';
Workshop.defaultColumns = 'name, state|10%, startDate|15%, publishedDate|15%';
Workshop.register();
