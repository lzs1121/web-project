const keystone = require('keystone');
const Types = keystone.Field.Types;

/**
 * City Model
 * =============
 */

const City = new keystone.List('City', {
	autokey: {
		from: 'name', path: 'slug', unique: true, sortable: true
	}
});

//  Tutor.defaultColumns

City.add({
	meta: {
		title: { type: String },
		description: { type: String },
		keywords: { type: String }
	},
	name: { type: String, required: true },
	chName: { type: String, label:'城市中文名' },
	slogan: { type: String },
	country: { type: String },
	isOffice: { type: Boolean },
	officeAddress: { type: String },
	officeImage: { type: Types.CloudinaryImage, autoCleanup : true, select : true },
	cityIcon: { type: Types.CloudinaryImage, autoCleanup : true, select : true },
	cityBackground: { type: Types.CloudinaryImage, autoCleanup : true, select : true },
	description: { type: Types.Html, wysiwyg: true, height: 400 }
});

City.relationship({ ref:'Tutor', refPath: 'city', path:'tutor' });
City.relationship({ ref:'University', refPath: 'location', path:'university' });
City.relationship({ ref:'Job', refPath: 'city', path:'job' });
City.relationship({ ref:'Order', refPath: 'city', path:'order' });
City.relationship({ ref:'Training', refPath: 'city', path:'order' });
City.relationship({ ref:'Meetup', refPath: 'city', path:'meetup' });

City.register();