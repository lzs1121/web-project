const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * Review Model
 * =============
 */

const Reviews = new keystone.List('Reviews', {
	autokey: { from: 'name', path: 'slug', unique: true, sortable: true }
});
Reviews.defaultColumns = 'name, priority';

Reviews.add({
	name: { type: String, required: true },
	priority: { type: Types.Number },
	score: { type: Types.Number },
	avatar: { type: Types.CloudinaryImage },
	student: { type: Types.Relationship, ref: 'Student' },
	training: { type: Types.Relationship, ref: 'Training' },
	service: { type: Types.Relationship, ref: 'Service' },
	tutor: { type: Types.Relationship, ref: 'Tutor' },
	content: { type: Types.Textarea }
});

Reviews.register();
