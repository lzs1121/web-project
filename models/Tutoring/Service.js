const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * Tutor Model
 * =============
 */

const Service = new keystone.List('Service', {
	autokey: {
		from: 'name', path: 'slug', unique: true, sortable: true
	}
});

//  Tutor.defaultColumns

Service.add({
	name: { type: String, required: true },
	meta: {
		title: { type: String },
		description: { type: String },
		keywords: { type: String }
	}
},	'Basic Infomation (Required)', {
	title: { type: String },
	chName: { type: String },
	slogan: { type: String },
	feature: { type: String },
	shortDescription: { type: Types.Html, wysiwyg:true, height: 100, note:'页面简短描述' },
	type: { type: Types.Select, options: 'Tutoring, Career, Training', default: 'Tutoring' },
	temparayRating: { type: String },
	packageIntroduction: { type: Types.Html, wysiwyg:true, height: 100 },
	city: { type: Types.Relationship, ref: 'City', many: true },
	university: { type: Types.Relationship, ref: 'University', many: true }
}, 'Background', {
	icon: { type: Types.CloudinaryImage }
}, 'Price', {
	price: { type: Number },
	promotionPrice: { type: Number }
}, 'For Career Coaching', {
	thumbnail: { type: Types.CloudinaryImage, note:'Career服务封面' },
	thumbNailAlt: { type: String },
	serviceFeature: { type: Types.Html, wysiwyg:true, height: 250 },
	serviceScopeTitle: { type:String, label:'适合人群标题' },
	serviceScope: { type: Types.Html, wysiwyg:true, height: 250, label:'适合人群' },
	serviceIntroductionTitle: { type: String, label:'服务介绍标题' },
	serviceIntroduction: { type: Types.Html, wysiwyg:true, height: 250, label:'服务介绍' },
	serviceProcessTitle: { type: String, label:'服务流程标题' },
	serviceProcess: { type: Types.Html, wysiwyg:true, height: 250, label:'服务流程' },
	servicePointTitle: { type: String, label:'服务特色标题' },
	servicePoint: { type: Types.Html, wysiwyg:true, height: 250, label:'服务特色' }
}, 'For Tutoring', {
	scheduling: { type: Types.Html, wysiwyg:true, height: 100, label:'课程安排' },
	cardBackground: { type: Types.CloudinaryImage, note:'Tutoring服务封面' }
}, 'Extended Infomation (Optional)', {
	cities: { type: String },
	longDescription: { type: Types.Html, wysiwyg:true, height: 400 },
	promotion:  { type: Types.Html, wysiwyg:true, height: 100 }
});

Service.defaultColumns = 'name, type, title';

Service.relationship({ ref:'Tutor', refPath: 'service', path:'tutor' });
Service.relationship({ ref:'Teacher', refPath: 'service', path:'teacher' });

Service.register();
