const keystone = require('keystone');
const Types = keystone.Field.Types;
/**
 * TechnologyStack Model
 * ==================
 */

const TechnologyStack = new keystone.List('TechnologyStack', {
	autokey: { from: 'name', path: 'key', unique: true }
});

TechnologyStack.add({
	name: { type: String, required: true },
	icon: { type: Types.CloudinaryImage }
});


TechnologyStack.register();
