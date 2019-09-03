const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * Teacher Model
 * =============
 */

const Teacher = new keystone.List('Teacher', {
	autokey: { from: 'name', path: 'slug', unique: true, sortable: true }
});
Teacher.defaultColumns = 'name, priority';

Teacher.add({
	name: { type: String, required: true },
	priority: { type: Types.Number },
	avatar: { type: Types.CloudinaryImage, autoCleanup : true, select : true },
	title: { type: String },
	city: { type: Types.Relationship, ref: 'City', many: true },
	displayCompany: { type: Boolean, note:'是否显示企业logo' },
	preCompany: { type: Types.Relationship, ref: 'Company', many: true, dependsOn: { displayCompany: true } },
	displayUniversity: { type: Boolean, note:'是否显示University logo' },
	university: { type: Types.Relationship, ref: 'University', many: true, dependsOn: { displayUniversity: true } },
	linkedinUrl: { type: Types.Url },
	introduction: { type: Types.Textarea },
	isTutor: { type: Boolean }
}, 'For Training', {
	training: { type: Types.Relationship, ref: 'Training', many: true }
}, 'For Career Coaching', {
	isCareer: { type: Boolean },
	service: { type: Types.Relationship, ref: 'Service', many: true },
	careerPath: { type: Types.Relationship, ref: 'CareerPath', dependsOn: { isCareer: true } }
}, 'Optional', {
	highlights: { type: Types.TextArray, label:'亮点' },
	noteForAdmin: { type: String }
});

Teacher.defaultColumns = 'name, city|20%, training|20%, service|20%';

Teacher.register();
