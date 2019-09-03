const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * Tutor Model
 * =============
 */

const Faq = new keystone.List('Faq', {
	autokey: {
		from: 'name', path: 'slug', unique: true, sortable: true
	}
});

//  Tutor.defaultColumns

Faq.add({
	name: { type: String },
	answer: { type: String },
	training: { type: Types.Relationship, ref: 'Training', many: true },
	course: { type: Types.Relationship, ref: 'Course', many: true }
});

Faq.defaultColumns = 'question, training|20%, course|20%';

Faq.register();