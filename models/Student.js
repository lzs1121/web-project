const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * Student Model
 * =============
 */

const Student = new keystone.List('Student', {
	autokey: { from: 'name', path: 'slug', unique: true, sortable: true }
});

Student.add({
	user: { type: Types.Relationship, ref: 'User', noedit: true },
	name: { type: String, required: true },
	state: { type: Types.Select, options: 'graduated, study, worknig', default: 'study' },
	university: { type: Types.Relationship, ref: 'University', initial: true }
}, 'Extended Infomation (Optional)', {
	program: { type: Types.Relationship, ref: 'Program', many: true },
	workshop: { type: Types.Relationship, ref: 'Workshop', many: true },
	graduateDate: { type: Types.Date },
	isVerified: { type: Boolean },
	noteForAdmin: { type: Types.TextArray }
});

Student.relationship({ ref:'Scheduling', refPath: 'student', path:'scheduling' });
Student.relationship({ ref:'Quota', refPath: 'student', path:'quota' });
Student.relationship({ ref:'Order', refPath: 'student', path:'order' });

Student.defaultColumns = 'name, university|20%, program|20%, workshop|20%';

Student.register();
