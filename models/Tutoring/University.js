const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * University Model
 * =============
 */

const University = new keystone.List('University', {
	autokey: { from: 'name', path: 'slug', unique: true }
});

University.add({
	meta: {
		title: { type: String },
		description: { type: String },
		keywords: { type: String }
	},
	name: { type: String, required: true }
},	'Basic Infomation (Required)', {
	featured: { type: Boolean },
	chineseName: { type: String },
	officialWebsite: { type: String },
	address: { type: String },
	tuitionFeeRange: { type: String },
	logo: { type: Types.CloudinaryImage },
	cardBackground: { type: Types.CloudinaryImage },
	bannerBackground: { type: Types.CloudinaryImage },
	shortDescription: { type: Types.Textarea, label:'简短介绍' },
	schoolHistory: { type: Types.Textarea, label:'学校历史' },
	schoolFeatures: { type: Types.Textarea, label:'学校特色' },
	city: { type: Types.Relationship, ref: 'City' }
}, 'Extended Infomation (Optional)', {
	slogan: { type: String },
	temparayReview: { type: String },
	resource: { type: Types.Relationship, ref: 'Resource', many: true },
	ranking: { type: String },
	foundedYear: { type: String },
	famoursAlumni: { type: String, label:'知名校友' },
	tution: { type: String, label:'学费' },
	ielts: { type: String, label:'雅思要求' },
	description: { type: String }
});

University.relationship({ ref:'Course', refPath: 'university', path:'course' });
University.relationship({ ref:'Tutor', refPath: 'university', path:'tutor' });

University.register();
