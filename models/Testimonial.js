const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * Testimonial Model
 * =============
 */

const Testimonial = new keystone.List('Testimonial', {
	autokey: { from: 'name', path: 'slug', unique: true }
});

Testimonial.add({
	name: { type: String, required: true },
	eduBackground: { type: String },
	training: { type: Types.Relationship, ref: 'Training' },
	service: { type: Types.Relationship, ref: 'Service' },
	company: { type: String, label:'Offer Recieved' },
	jobFunction: { type: String },
	location: { type: Types.Select, options: 'Sydney, Brisbane, Melbourne, Seatle, China', default: 'Sydney' },
	type: { type: Types.Select, options: 'Internship, Full-time', default: 'Full-time' },
	salary: { type: Types.Number },
	storyUrl: { type: Types.Url },
	description: { type: Types.Html, wysiwyg: true, height: 400 },
	screenshot: { type: Types.CloudinaryImage }
});

Testimonial.defaultColumns = 'name, location|20%, company|20%, eduBackground|20%';

Testimonial.register();
