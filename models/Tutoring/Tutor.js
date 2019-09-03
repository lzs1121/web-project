const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * Tutor Model
 * =============
 */

const Tutor = new keystone.List('Tutor', {
	autokey: {
		from: 'name', path: 'slug', unique: true, sortable: true
	}
});

//  Tutor.defaultColumns

Tutor.add({
	meta: {
		title: { type: String },
		description: { type: String },
		keywords: { type: String }
	},
	name: { type: String, required: true },
	avatar: { type: Types.CloudinaryImage, autoCleanup : true, select : true },
	weChat: { type: String },
	mobile: { type: String },
	title: { type: String },
	slogan: { type: String },
	university: { type: Types.Relationship, ref: 'University', many: true },
	course: { type: Types.Relationship, ref: 'Course', many: true },
	city: { type: Types.Relationship, ref: 'City' },
	service: { type: Types.Relationship, ref: 'Service', many: true },
	introduction: { type: Types.Textarea },
	priority: { type: Types.Number },
	highlights: { type: Types.TextArray, label:'亮点' }
}, 'Extended Infomation (Optional)', {
	techSkills: { type: Types.Relationship, ref: 'TechnologyStack', label: 'Technology Skills', many:true },
	score: { type: Number },
	attends: { type: Number },
	availableTime: { type: String },
	meetingTime: { type: String },
	noteForAdmin: { type: String },
	videoLink: { type: String },
});

Tutor.defaultColumns = 'name|10%, course|30%, techSkills|10%,university|20%, city|10%, service|20%';

Tutor.relationship({ ref:'Scheduling', refPath: 'tutor', path:'scheduling' });
// Tutor.relationship({ ref:'Order', refPath: 'tutor', path:'order' });
Tutor.relationship({ ref:'Reviews', refPath: 'tutor', path:'reviews' });

Tutor.register();