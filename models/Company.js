const keystone = require('keystone');
const Types = keystone.Field.Types;
/**
 * Company Model
 * =============
 */

const Company = new keystone.List('Company', {
	autokey: {
		from: 'name', path: 'slug', unique: true, sortable: true
	}
});

//  Tutor.defaultColumns

Company.add({
	name: { type: String, required: true },
	country: { type: String },
	description: { type: String },
	logo: { type: Types.CloudinaryImage, autoCleanup : true, select : true },
	location: { type: Types.Relationship, ref: 'City' },
	jobs:{ type: Types.Relationship, ref: 'Job', many:true },
	city: { type: Types.Relationship, ref: 'City', many: true },
	officeAddress: { type: String }
});

Company.relationship({ ref:'Tutor', refPath: 'company', path:'tutor' });
Company.relationship({ ref:'Job', refPath: 'company', path:'job' });

Company.register();