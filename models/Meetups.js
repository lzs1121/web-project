import keystone from 'keystone';
const moment = require('moment');
const Types = keystone.Field.Types;
const _ = require('lodash');

const Meetup = new keystone.List('Meetup', {
	track: true,
	autokey: { path: 'key', from: 'name', unique: true }
});

Meetup.add({
	name: { type: String, required: true, initial: true, label:'活动名称' },

	meta: {
		title: { type: String },
		keywords: { type: String },
		description: { type: String }
	},

	publishedDate: { type: Types.Date, index: true, label:'活动发布时间' },

	state: { type: Types.Select, options: 'draft, scheduled, active, past', noedit: true, label:'活动状态' },

	startDate: { type: Types.Datetime, required: true, initial: true, index: true, width: 'short', note: 'e.g. 2014-07-15 / 6:00pm', label:'活动开始具体时间' },

	endDate: { type: Types.Datetime, required: true, initial: true, index: true, width: 'short', note: 'e.g. 2014-07-15 / 9:00pm', label:'活动结束具体时间' },

	city: { type: Types.Relationship, ref: 'City', many: true, label:'城市' }

}, 'WorkShop Basic Infomation', {
	commenceDate: { type: String, label:'开始时间' },

	cardDescription: { type: String, label:'目标' }

}, 'Others', {
	image:
	{
		type: Types.CloudinaryImage,
		note: 'Width:900px, height:500px',
		label:'活动图片',
		autoCleanup : true,
		select : true
	},
	hoster: { type: String, default: 'IT匠人', label:'创办人' },
	price: { type: String, default: 'Free', label:'收费标准' },
	place: { type: String, required: false, initial: true, width: 'medium', default: '36 Mein St, Spring Hill,Brisbane', note: '36 Mein St, Spring Hill,Brisbane', label:'上课地点' },
	map: { type: String, required: false, initial: true, width: 'medium', default: '36 Mein St, Spring Hill,Brisbane', note: '36 Mein St, Spring Hill,Brisbane', label:'具体位置' },
	description: { type: Types.Html, wysiwyg: true, label:'活动描述' },
	maxRSVPs: { type: Number, default: 100 },
	totalRSVPs: { type: Number, noedit: true }
});

Meetup.schema.virtual('url').get(() => {
	return '/meetups/' + this.key;
});

// Pre Save

Meetup.schema.pre('save', function(next) {
	const meetup = this;
	// no published date, it's a draft meetup
	if (!meetup.publishedDate) {
		meetup.state = 'draft';
	}
	// meetup date plus one day is after today, it's a past meetup
	else if (moment().isAfter(moment(meetup.endDate).add(1, 'day'))) {
		meetup.state = 'past';
	}
	// publish date is after today, it's an active meetup
	else if (moment().isAfter(meetup.publishedDate)) {
		meetup.state = 'active';
	}
	// publish date is before today, it's a scheduled meetup
	else if (moment().isBefore(moment(meetup.publishedDate))) {
		meetup.state = 'scheduled';
	}
	next();
});

Meetup.schema.set('toJSON', {
	transform: function (doc, rtn, options) {
		return _.pick(doc, '_id', 'name', 'startDate', 'endDate', 'place', 'map', 'description');
	}
});

Meetup.defaultSort = '-startDate';
Meetup.defaultColumns = 'name, state|10%, startDate|15%, publishedDate|15%';
Meetup.register();
